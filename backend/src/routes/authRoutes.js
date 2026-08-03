import express from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/db.js'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { fehler: "Zu viele Login-Versuche. Bitte versuche es später erneut."}
})

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { fehler: "Zu viele Versuche, bitte versuche es später erneut."}
})

router.post("/registrieren", registerLimiter, async (req, res) => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.status(400).json({ error: "E-Mail, Nutzername und Passwort sind erforderlich."} )
        }

        if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
            return res.status(400).json({ error: "Nutzername muss 3-20 Zeichen lang sein (Buchstaben, Zahlen, _ und -)."})
        }

        if (!isPasswordSave(password)) {
            return res.status(400).json({ error: "Passwort muss mindestens 8 Zeichen, einen Groß-, einen Kleinbuchstaben und eine Zahl enthalten."})
        }

        const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, {username}] }, })
        if (existingUser) {
            return res.status(409).json({ error: existingUser.email === email ? "Diese E-Mail ist bereits registriert." : "Dieser Nutzername ist bereits vergeben." } )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                username,
            },
        })

        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(201).json({ token, email: newUser.email, username: newUser.username })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Registrierung fehlgeschlagen." })
    }
})

router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { identifier, password } = req.body
        if (!identifier || !password) {
            return res.status(400).json({ fehler: "E-Mail oder Passwort sind erforderlich." })
        }

        const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } })
        if (!user) {
            return res.status(401).json({ error: "Anmeldedaten sind falsch"})
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.status(401).json({ error: "Anmeldedaten sind falsch"})
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.json({ token, email: user.email, username: user.username })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Login fehlgeschlagen." })
    }
})

router.patch("/me", authMiddleware, async (req, res) => {
    try {
        const { email, username } = req.body

        if (!email || !username) {
            return res.status(400).json({ error: "E-Mail und Nutzername sind erforderlich."})
        }

        if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
            return res.status(400).json({ error: "Nutzername muss 3-20 Zeichen lang sein (Buchstaben, Zeichen, - und _)."})
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
                NOT: { id: req.userId },
            },
        })

        if (existingUser) {
            return res.status(409).json({ error: existingUser.email === email ? "Diese E-Mail ist bereits vergeben" : "Der Nutzername ist bereits vergeben"})
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { email, username },
            select: { id: true, email: true, username: true },
        })

        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Profil konnte nicht akutalisiert werden." })
    }
})

router.patch("/me/password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Aktuelles und neues Passwort sind erforderlich"})
        }

        if (!isPasswordSave(newPassword)) {
            return res.status(400).json({ error: "Neues Passwort muss mindestens 8 Zeichen, Groß- und Kleinbuchstaben sowie Zahlen enthalten."})
        }

        const user = await prisma.user.findUnique({ where: { id: req.userId } })

        const passwordMatches = await bcrypt.compare(currentPassword, user.password)
        if (!passwordMatches) {
            return res.status(401).json({ error: "Aktuelles Passwort ist falsch."})
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: req.userId },
            data: { password: newPasswordHash},
        })

        res.json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Passwort konnte nicht geändert werden."})
    }
})

function isPasswordSave(password) {
    const minLength = password.length >=8
    const hasUpperCaseLetter = /[A-Z]/.test(password)
    const hasLowerCaseLetter = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return minLength && hasUpperCaseLetter && hasLowerCaseLetter && hasNumber
}

export default router