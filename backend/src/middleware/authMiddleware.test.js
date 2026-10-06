import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getUser } = vi.hoisted(() => ({
    getUser: vi.fn(),
}))

vi.mock('../config/supabaseAdmin.js', () => ({
    supabaseAdmin: { auth: { getUser } },
}))

const { default: authMiddleware } = await import('./authMiddleware.js')

function createResponse() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    }
}

describe('authMiddleware', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('rejects requests without a bearer token', async () => {
        const req = { headers: {} }
        const res = createResponse()
        const next = vi.fn()

        await authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Kein Token vorhanden. Bitte einloggen.',
        })
        expect(next).not.toHaveBeenCalled()
        expect(getUser).not.toHaveBeenCalled()
    })

    it('adds the user ID and continues for a valid token', async () => {
        getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
        const req = { headers: { authorization: 'Bearer valid-token' } }
        const res = createResponse()
        const next = vi.fn()

        await authMiddleware(req, res, next)

        expect(getUser).toHaveBeenCalledWith('valid-token')
        expect(req.userId).toBe('user-1')
        expect(next).toHaveBeenCalledOnce()
        expect(res.status).not.toHaveBeenCalled()
    })

    it('rejects requests when Supabase rejects the token', async () => {
        getUser.mockRejectedValue(new Error('Invalid token'))
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const req = { headers: { authorization: 'Bearer invalid-token' } }
        const res = createResponse()
        const next = vi.fn()

        await authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Token konnte nicht geprüft werden.',
        })
        expect(next).not.toHaveBeenCalled()
    })
})