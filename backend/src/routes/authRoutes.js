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
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ fehler: "E-Mail und Passwort sind erforderlich."} )
        }

        if (!isPasswordSave(password)) {
            return res.status(400).json({ fehler: "Passwort muss mindestens 8 Zeichen, einen Groß-, einen Kleinbuchstaben und eine Zahl enthalten."})
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(409).json({ fehler: "Diese E-Mail ist bereits registriert."} )
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
            },
        })

        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(201).json({ token, email: newUser.email })
    } catch (error) {
        res.status(500).json({ fehler: "Registrierung fehlgeschlagen." })
    }
})

router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ fehler: "E-Mail oder Passwort sind erforderlich." })
        }

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ fehler: "E-Mail oder Passwort ist falsch"})
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.status(401).json({ fehler: "E-Mail oder Passwort ist falsch"})
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.json({ token, email: user.email })
    } catch (error) {
        console.error(error)
        res.status(500).json({ fehler: "Login fehlgeschlagen." })
    }
})

router.get("/me", authMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { id: true, email: true },
    })
    res.json(user)
})

function isPasswordSave(password) {
    const minLength = password.length >=8
    const hasUpperCaseLetter = /[A-Z]/.test(password)
    const hasLowerCaseLetter = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return minLength && hasUpperCaseLetter && hasLowerCaseLetter && hasNumber
}

export default router;