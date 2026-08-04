import express from 'express'
import prisma from '../config/db.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

const BERLIN_BORDER = { west: 13.088, south: 52.338, east: 13.761, north: 52.675 }
const CATEGORIES = ['Freizeit', 'Kultur', 'Restaurant/Café', 'Gesundheit', 'Sonstiges', 'Supermarkt']

router.get("/", async (req, res) => {
    try {
        const places = await prisma.place.findMany({
            where: { status: "approved" },
            include: {
                reviews: {
                    include: { badges: true },
                },
            },
        });
        
        const placesWithBadges = places.map((place) => {
            const allBadges = place.reviews.flatMap((review) => review.badges)
            const reviewBadges = Array.from(
                new Map(allBadges.map((badge) => [badge.id, badge])).values()
            )

            const { reviews, ...placeWithoutReviews } = place
            return { ...placeWithoutReviews, badges: reviewBadges }
        })

        res.json(placesWithBadges);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Orte konnten nicht geladen werden" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const place = await prisma.place.findUnique({
            where: { id },
            include: {
                reviews: {
                    include: {
                        badges: true,
                        user: { select: { id:true, username: true } },
                    },
                    orderBy: { createdAt: "desc"}
                },
            },
        })

        if (!place) {
            return res.status(404).json({ error: "Ort nicht gefunden."})
        }

        const allBadges = place.reviews.flatMap((review) => review.badges)
        const uniqueBadges = Array.from(
            new Map(allBadges.map((badge) => [badge.id, badge])).values()
        )

        res.json({...place, badges: uniqueBadges})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Ort konnte nicht geladen werden."})
    }
})

router.post('/neu', authMiddleware, async (req, res) => {
    try {
        const { name, address, category, description, latitude, longitude, badgeIds, reviewText, district, picture } = req.body

            if (!name.trim() || !address.trim() || !category) {
                return res.status(400).json({ error: "Name, Adresse und Kategorie sind Pflichtfelder."})
            }

            if (!CATEGORIES.includes(category)) {
                return res.status(400).json({ error: "Ungültige Kategorie"})
            }

            if (typeof latitude !== 'number' || typeof longitude !== 'number') {
                return res.status(400).json({ error: "Koordinaten fehlen, bitte Adresse zuerst prüfen."})
            }

            const withinBerlin = 
                latitude >= BERLIN_BORDER.south &&
                latitude <= BERLIN_BORDER.north &&
                longitude >= BERLIN_BORDER.west &&
                longitude <= BERLIN_BORDER.east

            if (!withinBerlin) {
                return res.status(400).json({ error: "Diese Plattform ist auf Orte in Berlin spezialisiert."})
            }

            const possibleDuplicate = await prisma.place.findFirst({
                where: {
                    name: { equals: name.trim(), mode: 'insensitive' },
                    longitude: { gte: longitude - 0.0005, lte: longitude + 0.0005 },
                    latitude: { gte: latitude - 0.0005, lte: latitude + 0.0005 },
                }
            })

            if (possibleDuplicate) {
                return res.status(409).json({
                    error: "Ein Ort mit ähnlichem Namen exisitiert bereits in der Nähe.",
                    existingPlace: possibleDuplicate.id,
                })
            }

            const place = await prisma.place.create({
                data: {
                    name: name.trim(),
                    address: address.trim(),
                    district,
                    category,
                    description: description?.trim() || "",
                    latitude,
                    longitude,
                    source: 'user',
                    status: 'approved',
                    createdById: req.userId,
                    reviews: badgeIds?.length > 0 || reviewText ? {
                        create: {
                            text: reviewText ? reviewText.trim() : "Kein Bewertungstext vorhanden.",
                            userId: req.userId,
                            badges: { connect: (badgeIds ?? []).map((id) => ({ id })) }
                        },
                    } : undefined,
                    picture: picture?.trim() || null,
                },
                include: {
                    reviews: { include: { badges: true } },
                },
            })

            res.status(201).json(place)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Ort konnte nicht gespeichert werden."})
    }
})

export default router