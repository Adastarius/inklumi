import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { review } = vi.hoisted(() => ({
    review: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}))

vi.mock('../config/db.js', () => ({ default: { review } }))
vi.mock('../middleware/authMiddleware.js', () => ({
    default: vi.fn((req, res, next) => {
        req.userId = 'user-1'
        next()
    }),
}))

const { default: reviewRoutes } = await import('./reviewRoutes.js')

const app = express()
app.use(express.json())
app.use('/bewertungen', reviewRoutes)

describe('Review routes', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects a review without a place', async () => {
        const response = await request(app)
            .post('/bewertungen')
            .send({ text: 'Gut zugänglich' })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Ort ist erforderlich.' })
        expect(review.create).not.toHaveBeenCalled()
    })

    it('creates a review with its text, place, user, and badges', async () => {
        review.create.mockResolvedValue({
            id: 1,
            text: 'Gut zugänglich',
            placeId: 2,
            userId: 'user-1',
            badges: [],
        })

        const response = await request(app)
            .post('/bewertungen')
            .send({ text: '  Gut zugänglich  ', placeId: '2', badgeIds: [4] })

        expect(response.status).toBe(201)
        expect(response.body).toEqual({
            id: 1,
            text: 'Gut zugänglich',
            placeId: 2,
            userId: 'user-1',
            badges: [],
        })
        expect(review.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                text: 'Gut zugänglich',
                placeId: 2,
                userId: 'user-1',
                badges: { connect: [{ id: 4 }] },
            }),
        }))
    })

    it('forbids deleting another user’s review', async () => {
        review.findUnique.mockResolvedValue({ id: 1, userId: 'user-2' })

        const response = await request(app).delete('/bewertungen/1')

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
            error: 'Du darfst nur eigene Bewertungen löschen.',
        })
        expect(review.delete).not.toHaveBeenCalled()
    })

    it('deletes the authenticated user’s review', async () => {
        review.findUnique.mockResolvedValue({ id: 1, userId: 'user-1' })
        review.delete.mockResolvedValue({ id: 1 })

        const response = await request(app).delete('/bewertungen/1')

        expect(response.status).toBe(204)
        expect(review.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it('returns 404 when editing a review that does not exist', async () => {
        review.findUnique.mockResolvedValue(null)

        const response = await request(app)
            .put('/bewertungen/1')
            .send({ text: 'Aktualisiert', badgeIds: [] })

        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Bewertung nicht gefunden.' })
        expect(review.update).not.toHaveBeenCalled()
    })

    it('forbids editing another user’s review', async () => {
        review.findUnique.mockResolvedValue({ id: 1, userId: 'user-2' })

        const response = await request(app)
            .put('/bewertungen/1')
            .send({ text: 'Aktualisiert', badgeIds: [] })

        expect(response.status).toBe(403)
        expect(response.body).toEqual({
            error: 'Du darfst nur eigene Bewertungen bearbeiten.',
        })
        expect(review.update).not.toHaveBeenCalled()
    })

    it('updates the authenticated user’s review and badges', async () => {
        review.findUnique.mockResolvedValue({ id: 1, userId: 'user-1' })
        review.update.mockResolvedValue({
            id: 1,
            text: 'Aktualisiert',
            badges: [{ id: 2, name: 'Ruhebereich' }],
        })

        const response = await request(app)
            .put('/bewertungen/1')
            .send({ text: 'Aktualisiert', badgeIds: [2] })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            id: 1,
            text: 'Aktualisiert',
            badges: [{ id: 2, name: 'Ruhebereich' }],
        })
        expect(review.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                text: 'Aktualisiert',
                badges: { set: [{ id: 2 }] },
            },
            include: { badges: true },
        })
    })
})