import express from 'express'
import multer from 'multer'
import { supabaseAdmin } from '../config/supabaseAdmin.js'
import authMiddleware from '../middleware/authMiddleware.js'
import crypto from 'crypto'

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
})

router.post("/upload", authMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Keine Datei hochgeladen." })
        }

        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedFileTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Nur JPEG, PNG oder WebP erlaubt."})
        }

        const fileExtension = req.file.originalname.split('.').pop()
        const fileName = `${crypto.randomUUID()}.${fileExtension}`

        const { error } = await supabaseAdmin.storage
            .from('place-images')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
            })

        if (error) {
            console.error("Supabase-Upload-Fehler: ", error)
            return res.status(502).json({ error: "Bild konnte nicht gespeichert werden." })
        }

        const { data } = supabaseAdmin.storage
            .from('place-images')
            .getPublicUrl(fileName)

        res.status(201).json({ url: data.publicUrl })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Upload fehlgeschlagen." })
    }
})

export default router