import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const orte = await prisma.ort.findMany({
            include: {
                badges: true,
            },
        });
        res.json(orte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ fehler: "Orte konnten nicht geladen werden" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const ort = await prisma.ort.findUnique({
            where: { id },
            include: {
                badges: true,
            },
        });

        if (!ort) {
            return res.status(404).json({ fehler: "Ort nicht gefunden."});
        }

        res.json(ort);
    } catch (error) {
        console.error(error);
        res.status(500).json({ fehler: "Ort konnte nicht geladen werden."});
    }
});

export default router;