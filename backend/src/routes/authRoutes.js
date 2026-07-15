import express from 'express'
import bcrypt from 'bcrypt'
import prisma from '../config/db.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post("/registrieren", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ fehler: "E-Mail und Passwort sind erforderlich."} )
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

        res.status(201).json({ id: newUser.id, email: newUser.email })
    } catch (error) {
        res.status(500).json({ fehler: "Registrierung fehlgeschlagen." })
    }
})

router.post("/login", async (req, res) => {
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

export default router;