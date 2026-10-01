import { Router } from 'express'
import rateLimit from 'express-rate-limit'

const router = Router()

//Begrenzung um Berlin
const BERLIN_BORDER = { west: 13.088, south: 52.338, east: 13.761, north: 52.675 }

//Cache für bereits angefragte Adressen
const geocodeCache = new Map()

//Bei Nominatim pro Sekunde nur 1 Anfrage erlaubt pro Anwendung, speichert Zeitpunkt der letzten Anfrage
let lastNominatimCall = 0
//berechnet die Wartezeit
async function callNominatimThrottled(url) {
    const now = Date.now()
    const waitTime = Math.max(0, 1000 - (now - lastNominatimCall))
    if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
    lastNominatimCall = Date.now()

    //sendet Anfrage
    return fetch(url, {
        headers: {'User-Agent': 'Inklumi/1.0' },
    })
}

//Limit pro Nutzer, damit eine Person nicht die Warteschlange blockiert
const perUserLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10, //max. 10 Adresssuchen pro Minute
    message: { error: "Zu viele Anfragen, bitte kurz warten." }
})

router.get("/geocode", perUserLimiter, async (req, res) => {
    //Adresse aus dem Query-Parameter address speichern
    const { address } = req.query

    if (!address || address.trim().length < 3) {
        return res.status(400).json({ error: "Adresse ist zu kurz."})
    }

    //Falls Adresse im Cache, wird sie von dort direkt zurückgegeben
    const cacheKey = address.trim().toLowerCase()
    if (geocodeCache.has(cacheKey)) {
        return res.json(geocodeCache.get(cacheKey))
    }

    try {
        //Parameter für Nominatim-Suche (q: gesuchte Adresse, limit: nur 1 Ergebnis, viewbox: Suchbereich in Berlin, bounded: Suche nur in diesem Bereich)
        //URLSearchParams kodiert die Parameter für die URL
        const params = new URLSearchParams({
            q: `${address}, Berlin`,
            format: 'json',
            limit: '1',
            addressdetails: '1',
            viewbox: `${BERLIN_BORDER.west},${BERLIN_BORDER.north},${BERLIN_BORDER.east},${BERLIN_BORDER.south}`,
            bounded: '1',
        })

        const nominatimRes = await callNominatimThrottled(
            `https://nominatim.openstreetmap.org/search?${params}`
        )

        if (!nominatimRes.ok) {
            throw new Error(`Nominatim-Fehler: ${nominatimRes.status}`)
        }
        const results = await nominatimRes.json()

        //Auch ein nicht vorhandenes Resultat wird im Cache gespeichert, damit Nominatim nicht nochmal angefragt wird
        if (results.length === 0) {
            const notFound = { found: false }
            geocodeCache.set(cacheKey, notFound)
            return res.json(notFound)
        }

        //Speichern der Koordinaten (Umwandlung von Text zu Float)
        const lat = parseFloat(results[0].lat)
        const lon = parseFloat(results[0].lon)

        //Prüft, ob Breiten- und Längengrad innerhalb der Grenze liegen
        const withinBerlin = 
        lat >= BERLIN_BORDER.south &&
        lat <= BERLIN_BORDER.north &&
        lon >= BERLIN_BORDER.west &&
        lon <= BERLIN_BORDER.east

        //Falls Adresse nicht in Berlin, wird es im Cache als nicht gefunden gespeichert
        if (!withinBerlin) {
        const notFound = { found: false }
        geocodeCache.set(cacheKey, notFound)
        return res.json(notFound)
        }

        const result = {
        found: true,
        latitude: lat,
        longitude: lon,
        displayName: results[0].display_name,
        district: results[0].address?.borough || null
        }
         geocodeCache.set(cacheKey, result)
         res.json(result)
    } catch (error) {
        console.error('Geocoding-Fehler: ', error)
        res.status(502).json({ error: "Geocoding-Dienst ist nicht erreichbar."})
    }
})

export default router