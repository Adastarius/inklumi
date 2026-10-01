import express from 'express'
import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prisma, authMiddleware } = vi.hoisted(() => ({
    prisma: {
        user: {
            findFirst: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
    },
    authMiddleware: vi.fn((req, res, next) => {
        req.userId = 'user-1'
        next()
    }),
}))

vi.mock('../config/db.js', () => ({ default: prisma }))
vi.mock('../middleware/authMiddleware.js', () => ({ default: authMiddleware }))

const { default: authRoutes } = await import('./authRoutes.js')

const app = express()
app.use(express.json())
app.use('/auth', authRoutes)

describe('PATCH /auth/me', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects a missing username', async () => {
        const response = await request(app)
            .patch('/auth/me')
            .send({})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({ error: 'Nutzername ist erforderlich.' })
        expect(prisma.user.findFirst).not.toHaveBeenCalled()
    })

    it('rejects an invalid username', async () => {
        const response = await request(app)
            .patch('/auth/me')
            .send({ username: 'ab!' })

        expect(response.status).toBe(400)
        expect(response.body.error).toContain('3-20 Zeichen')
        expect(prisma.user.findFirst).not.toHaveBeenCalled()
    })

    it('updates a valid username', async () => {
        prisma.user.findFirst.mockResolvedValue(null)
        prisma.user.update.mockResolvedValue({ id: 'user-1', username: 'Ada_1' })

        const response = await request(app)
            .patch('/auth/me')
            .send({ username: 'Ada_1' })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ id: 'user-1', username: 'Ada_1' })
        expect(prisma.user.update).toHaveBeenCalledWith({
            where: { id: 'user-1' },
            data: { username: 'Ada_1' },
            select: { id: true, username: true },
        })
    })
})

describe('GET /auth/me', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns the authenticated user profile', async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 'user-1', username: 'Ada' })

        const response = await request(app).get('/auth/me')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ id: 'user-1', username: 'Ada' })
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 'user-1' },
            select: { id: true, username: true },
        })
    })

    it('returns 500 when loading the profile fails', async () => {
        prisma.user.findUnique.mockRejectedValue(new Error('Database error'))
        vi.spyOn(console, 'error').mockImplementation(() => {})

        const response = await request(app).get('/auth/me')

        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            error: 'Profil konnte nicht geladen werden.',
        })
    })
})