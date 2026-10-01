import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prisma } = vi.hoisted(() => ({
    prisma: {
        place: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            create: vi.fn(),
        },
    },
}))

vi.mock('../config/db.js', () => ({ default: prisma }))
vi.mock('../middleware/authMiddleware.js', () => ({
    default: vi.fn((req, res, next) => {
        req.userId = 'user-1'
        next()
    }),
}))

const { default: placesRoutes } = await import('./placesRoutes.js')

const app = express()
app.use(express.json())
app.use('/orte', placesRoutes)

describe('GET /orte', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns approved places with unique badges', async () => {
        prisma.place.findMany.mockResolvedValue([
            {
                id: 1,
                name: 'Museum',
                status: 'approved',
                reviews: [
                    { badges: [{ id: 1, name: 'Stufenlos' }] },
                    { badges: [{ id: 1, name: 'Stufenlos' }, { id: 2, name: 'Ruhebereich' }] },
                ],
            },
        ])

        const response = await request(app).get('/orte')

        expect(response.status).toBe(200)
        expect(response.body).toEqual([{
            id: 1,
            name: 'Museum',
            status: 'approved',
            badges: [
                { id: 1, name: 'Stufenlos' },
                { id: 2, name: 'Ruhebereich' },
            ],
        }])
        expect(prisma.place.findMany).toHaveBeenCalledWith({
            where: { status: 'approved' },
            include: { reviews: { include: { badges: true } } },
        })
    })

    it('returns 500 when loading places fails', async () => {
        prisma.place.findMany.mockRejectedValue(new Error('Database error'))
        vi.spyOn(console, 'error').mockImplementation(() => {})

        const response = await request(app).get('/orte')

        expect(response.status).toBe(500)
        expect(response.body).toEqual({ error: 'Orte konnten nicht geladen werden' })
    })
})

describe('GET /orte/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns a place with its reviews and unique badges', async () => {
        prisma.place.findUnique.mockResolvedValue({
            id: 1,
            name: 'Museum',
            reviews: [
                {
                    id: 10,
                    text: 'Gut zugänglich',
                    badges: [{ id: 1, name: 'Stufenlos' }],
                    user: { id: 'user-1', username: 'Ada' },
                },
                {
                    id: 11,
                    text: 'Sehr ruhig',
                    badges: [{ id: 1, name: 'Stufenlos' }],
                    user: { id: 'user-2', username: 'Ben' },
                },
            ],
        })

        const response = await request(app).get('/orte/1')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            id: 1,
            name: 'Museum',
            reviews: [
                {
                    id: 10,
                    text: 'Gut zugänglich',
                    badges: [{ id: 1, name: 'Stufenlos' }],
                    user: { id: 'user-1', username: 'Ada' },
                },
                {
                    id: 11,
                    text: 'Sehr ruhig',
                    badges: [{ id: 1, name: 'Stufenlos' }],
                    user: { id: 'user-2', username: 'Ben' },
                },
            ],
            badges: [{ id: 1, name: 'Stufenlos' }],
        })
        expect(prisma.place.findUnique).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 1 },
        }))
    })

    it('returns 404 when the place does not exist', async () => {
        prisma.place.findUnique.mockResolvedValue(null)

        const response = await request(app).get('/orte/999')

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Ort nicht gefunden.' })
    })
})

describe('POST /orte/neu', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects a request without a category', async () => {
        const response = await request(app)
            .post('/orte/neu')
            .send({ name: 'Museum', address: 'Museumstraße 1' })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: 'Name, Adresse und Kategorie sind Pflichtfelder.',
        })
        expect(prisma.place.findFirst).not.toHaveBeenCalled()
    })

    it('rejects an invalid category', async () => {
        const response = await request(app)
            .post('/orte/neu')
            .send({
                name: 'Museum',
                address: 'Museumstraße 1',
                category: 'Ungültig',
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Ungültige Kategorie' })
        expect(prisma.place.findFirst).not.toHaveBeenCalled()
    })

    it('rejects coordinates outside Berlin', async () => {
        const response = await request(app)
            .post('/orte/neu')
            .send({
                name: 'Museum',
                address: 'Museumstraße 1',
                category: 'Kultur',
                latitude: 48.137,
                longitude: 11.575,
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: 'Diese Plattform ist auf Orte in Berlin spezialisiert.',
        })
        expect(prisma.place.findFirst).not.toHaveBeenCalled()
    })

    it('creates a valid place', async () => {
        prisma.place.findFirst.mockResolvedValue(null)
        prisma.place.create.mockResolvedValue({ id: 1, name: 'Museum' })

        const response = await request(app)
            .post('/orte/neu')
            .send({
                name: '  Museum  ',
                address: '  Museumstraße 1  ',
                category: 'Kultur',
                description: '  Ein zugänglicher Ort  ',
                district: 'Mitte',
                latitude: 52.52,
                longitude: 13.405,
                picture: '  /museum.jpg  ',
            })

        expect(response.status).toBe(201)
        expect(response.body).toEqual({ id: 1, name: 'Museum' })
        expect(prisma.place.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                name: 'Museum',
                address: 'Museumstraße 1',
                description: 'Ein zugänglicher Ort',
                createdById: 'user-1',
                picture: '/museum.jpg',
            }),
        }))
    })
})