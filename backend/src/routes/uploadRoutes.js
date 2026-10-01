import express from 'express'
import multer from 'multer'
import { supabaseAdmin } from '../config/supabaseAdmin.js'
import authMiddleware from '../middleware/authMiddleware.js'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'

const router = express.Router()

//Speichern der Datei im Arbeitsspeicher
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
})

//Bild hochladen, upload.single() liest eine Datei aus dem in Klammern angegebenen Formularfeld
router.post("/upload", authMiddleware, upload.single('image'), async (req, res) => {
    try {
        //multer legt die Datei in req.file ab
        if (!req.file) {
            return res.status(400).json({ error: "Keine Datei hochgeladen." })
        }

        //ermitteln des Dateiformats
        const detectedType = await fileTypeFromBuffer(req.file.buffer)

        const allowedTypes = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}
        if (!detectedType || allowedTypes[detectedType.mime] === undefined) {
            return res.status(400).json({ error: "Nur JPEG, PNG oder WebP erlaubt."})
        }

        //erzeugen der Dateiendung anhand des erkannten Typs
        const fileExtension = allowedTypes[detectedType.mime]
        //es wird ein zufälliger Dateiname gewählt, um Namenskonflikte zu vermeiden
        const fileName = `${crypto.randomUUID()}.${fileExtension}`

        //Hochladen der Datei in den Bucket place-images, req.file.buffer ist die Datei aus dem Arebitsspeicher
        //mit contentType wird Supabase das Dateiformat mitgeteilt
        const { error } = await supabaseAdmin.storage
            .from('place-images')
            .upload(fileName, req.file.buffer, {
                contentType: detectedType.mime,
            })

        if (error) {
            console.error("Supabase-Upload-Fehler: ", error)
            return res.status(502).json({ error: "Bild konnte nicht gespeichert werden." })
        }

        //URL der Datei wird abgerufen
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