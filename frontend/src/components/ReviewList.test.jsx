import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ReviewList from './ReviewList.jsx'

const { apiFetch, useAuth } = vi.hoisted(() => ({
    apiFetch: vi.fn(),
    useAuth: vi.fn(),
}))

vi.mock('../services/api.js', () => ({ apiFetch }))
vi.mock('../context/AuthContext.jsx', () => ({ useAuth }))

const reviews = [
    {
        id: 'review-1',
        userId: 'user-1',
        user: { username: 'Ada' },
        createdAt: '2026-08-25T10:00:00.000Z',
        text: 'Eigene Bewertung',
        badges: [],
    },
    {
        id: 'review-2',
        userId: 'user-2',
        user: { username: 'Ben' },
        createdAt: '2026-08-25T11:00:00.000Z',
        text: 'Fremde Bewertung',
        badges: [],
    },
]

describe('ReviewList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useAuth.mockReturnValue({ session: { user: { id: 'user-1' } } })
    })

    it('shows deletion only for the current user’s review', () => {
        useAuth.mockReturnValue({ session: { user: { id: 'user-1' } } })

        render(<ReviewList reviews={reviews} onDeleteReview={vi.fn()} />)

        expect(screen.getByText('Eigene Bewertung')).toBeInTheDocument()
        expect(screen.getByText('Fremde Bewertung')).toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /löschen/i })).toHaveLength(1)
    })

    it('deletes the review after confirmation', async () => {
        const onDeleteReview = vi.fn()
        const user = userEvent.setup()
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        apiFetch.mockResolvedValue(null)

        render(<ReviewList reviews={reviews} onDeleteReview={onDeleteReview} />)
        await user.click(screen.getByRole('button', { name: /löschen/i }))

        expect(apiFetch).toHaveBeenCalledWith('/bewertungen/review-1', { method: 'DELETE' })
        expect(onDeleteReview).toHaveBeenCalledWith('review-1')
    })

    it('does not delete the review when confirmation is cancelled', async () => {
        const user = userEvent.setup()
        const onDeleteReview = vi.fn()
        vi.spyOn(window, 'confirm').mockReturnValue(false)

        render(<ReviewList reviews={reviews} onDeleteReview={onDeleteReview} />)
        await user.click(screen.getByRole('button', { name: /löschen/i }))

        expect(apiFetch).not.toHaveBeenCalled()
        expect(onDeleteReview).not.toHaveBeenCalled()
    })

    it('shows an alert when deletion fails', async () => {
        const user = userEvent.setup()
        const onDeleteReview = vi.fn()
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        vi.spyOn(window, 'alert').mockImplementation(() => {})
        apiFetch.mockRejectedValue(new Error('Serverfehler'))

        render(<ReviewList reviews={reviews} onDeleteReview={onDeleteReview} />)
        await user.click(screen.getByRole('button', { name: /löschen/i }))

        expect(window.alert).toHaveBeenCalledWith('Löschen fehlgeschlagen: Serverfehler')
        expect(onDeleteReview).not.toHaveBeenCalled()
    })
})