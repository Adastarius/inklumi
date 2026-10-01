import express from 'express'
import prisma from '../config/db.js'
import authMiddleware from '../middleware/authMiddleware.js'

//erstellt den Router
const router = express.Router()

//Ändern von Profildaten
router.patch("/me", authMiddleware, async (req, res) => {
    try {
        //liest Nutzernamen aus dem JSON-Request
        const { username } = req.body

        if (!username) {
            return res.status(400).json({ error: "Nutzername ist erforderlich."})
        }

        if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username)) {
            return res.status(400).json({ error: "Nutzername muss 3-20 Zeichen lang sein (Buchstaben, Zeichen, - und _)."})
        }

        //Sucht einen anderen Nutzer mit demselben Namen (durch NOT wird der eigene Nutzer nicht berücksichtigt)
        const existingUser = await prisma.user.findFirst({
            where: { username,
                NOT: { id: req.userId },
            },
        })

        if (existingUser) {
            return res.status(409).json({ error: "Der Nutzername ist bereits vergeben"})
        }

        //Updated den Nutzer, gibt id und username zurück
        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { username },
            select: { id: true, username: true },
        })

        res.json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Profil konnte nicht aktualisiert werden." })
    }
})

//gibt den eigenen Nutzer zurück
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, username: true }
        })
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Profil konnte nicht geladen werden." })
    }
})

export default router