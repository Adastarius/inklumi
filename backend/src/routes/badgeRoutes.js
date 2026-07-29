import express from 'express'
import prisma from '../config/db.js'

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const badges = await prisma.badge.findMany({
            orderBy: { category: "asc" },
        })
        res.json(badges)
    }catch (error) {
        console.error(error)
        res.status(500).json({ error: "Badges konnten nicht geladen werden." })
    }
})

export default router