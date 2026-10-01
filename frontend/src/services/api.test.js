import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSession = vi.fn()

vi.mock('./supabase.js', () => ({
    supabase: { auth: { getSession } },
}))

const { apiFetch } = await import('./api.js')

describe('apiFetch', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
        getSession.mockResolvedValue({ data: { session: null } })
    })

    it('adds the JSON header and current access token', async () => {
        getSession.mockResolvedValue({
            data: { session: { access_token: 'test-token' } },
        })
        const response = {
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue({ id: 1 }),
        }
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(response)

        await expect(apiFetch('/orte')).resolves.toEqual({ id: 1 })

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/orte', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer test-token',
            },
        })
    })

    it('returns null for a successful 204 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 204 })

        await expect(apiFetch('/orte/1')).resolves.toBeNull()
    })

    it('throws the API error message for a failed response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 400,
            json: vi.fn().mockResolvedValue({ error: 'Ungültige Anfrage' }),
        })

        await expect(apiFetch('/orte')).rejects.toThrow('Ungültige Anfrage')
    })
})