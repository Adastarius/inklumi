import express from 'express'
import prisma from '../config/db.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { text, placeId, badgeIds } = req.body

        if(!placeId) {
            return res.status(400).json({ error: "Ort ist erforderlich."})
        }

        if (!text.trim() && (!badgeIds || badgeIds.length === 0)) {
            return res.status(400).json({ error: "Bitte gib einen Text ein oder wähle mindestens ein Merkmal aus.."})
        }

        const newReview = await prisma.review.create({
            data: {
                text: text.trim() || "Kein Bewertungstext vorhanden.",
                placeId: Number(placeId),
                userId: req.userId,
                badges: {
                    connect: (badgeIds ?? []).map((id) => ({ id } ))
                }
            },
            include: {
                badges: true,
                user: { select: {id: true, username: true} },
            },
        })

        res.status(201).json(newReview)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Bewertung konnte nicht erstellt werden."})
    }
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id)
        const { text, badgeIds } = req.body
        const existingReview = await prisma.review.findUnique({ where: { id }})

        if (!existingReview) {
            return res.status(404).json({ error: "Bewertung nicht gefunden."})
        }

        if (existingReview.userId !== req.userId) {
            return res.status(403).json({ error: "Du darfst nur eigene Bewertungen bearbeiten."})
        }

        const updated = await prisma.review.update({
            where: { id },
            data: {
                text,
                badges: {
                    set: badgeIds.map((badgeId) => ({ id: badgeId }))
                },
            },
            include: { badges: true }
        })
        res.json(updated)
    }catch (error) {
        console.error(error)
        res.status(500).json({ error: "Bewertung konnte nicht aktualisiert werden." })
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id)

        const existingReview = await prisma.review.findUnique({ where: { id } })

        if (!existingReview) {
            return res.status(404).json({ error: "Bewertung wurde nicht gefunden."})
        }

        if (existingReview.userId !== req.userId) {
            return res.status(403).json({ error: "Du darfst nur eigene Bewertungen löschen." })
        }

        await prisma.review.delete({ where: { id } })
        res.status(204).send()
    }catch (error) {
        console.error(error)
        res.status(500).json({ error: "Bewertung konnte nicht gelöscht werden. "})
    }
})

export default router