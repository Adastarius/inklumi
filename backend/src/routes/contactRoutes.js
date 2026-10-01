import express from 'express'
import prisma from '../config/db.js'
import rateLimit from 'express-rate-limit'

//Rate-Limiter, der die Anzahl an Nachrichten begrenzt
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Zu viele Nachrichten. Bitte versuche es später erneut."}
})

const router = express.Router()

//Nachricht, welche mit dem Kontaktformular gesendet wurde, wird in der Datenbank gespeichert
router.post("/contact", contactLimiter, async (req, res) => {
    try {
        const { email, topic, message } = req.body

        if (!email || !topic || !message) {
            return res.status(400).json({ error: "E-Mail, Thema und Nachricht sind erforderlich."})
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Bitte gib eine gültige E-Mail-Adresse ein."})
        }

        await prisma.ContactMessage.create({
            data: { email, topic, message }
        })

        res.status(201).json({ success: true })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Nachricht konnte nicht gesendet werden." })
    }
})

export default router