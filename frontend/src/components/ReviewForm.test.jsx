import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ReviewForm from './ReviewForm.jsx'

const { apiFetch, useAuth } = vi.hoisted(() => ({
    apiFetch: vi.fn(),
    useAuth: vi.fn(),
}))

vi.mock('../services/api.js', () => ({ apiFetch }))
vi.mock('../context/AuthContext.jsx', () => ({
    useAuth,
}))

describe('ReviewForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useAuth.mockReturnValue({ token: null })
        apiFetch.mockResolvedValue([])
    })

    it('shows a login hint when the user is logged out', () => {
        render(<ReviewForm placeId="place-1" onNewReview={vi.fn()} />)

        expect(
            screen.getByText('Bitte melde dich an, im diesen Ort zu bewerten.'),
        ).toBeInTheDocument()
        expect(screen.queryByRole('form')).not.toBeInTheDocument()
    })

    it('submits the review text and selected badge', async () => {
        const user = userEvent.setup()
        const onNewReview = vi.fn()
        const newReview = { id: 'review-1', text: 'Sehr gut zugänglich' }
        useAuth.mockReturnValue({ token: 'test-token' })
        apiFetch
            .mockResolvedValueOnce([{ id: 'badge-1', name: 'Stufenlos', category: 'Mobilität' }])
            .mockResolvedValueOnce(newReview)

        render(<ReviewForm placeId="place-1" onNewReview={onNewReview} />)

        await user.type(screen.getByLabelText('Deine Erfahrung'), 'Sehr gut zugänglich')
        await user.click(await screen.findByRole('checkbox', { name: 'Stufenlos' }))
        await user.click(screen.getByRole('button', { name: 'Bewertung abschicken' }))

        await waitFor(() => expect(onNewReview).toHaveBeenCalledWith(newReview))
        expect(apiFetch).toHaveBeenNthCalledWith(1, '/badges')
        expect(apiFetch).toHaveBeenNthCalledWith(2, '/bewertungen', {
            method: 'POST',
            body: JSON.stringify({
                text: 'Sehr gut zugänglich',
                placeId: 'place-1',
                badgeIds: ['badge-1'],
            }),
        })
    })

    it('shows an error when submitting the review fails', async () => {
        const user = userEvent.setup()
        const onNewReview = vi.fn()
        useAuth.mockReturnValue({ token: 'test-token' })
        apiFetch
            .mockResolvedValueOnce([])
            .mockRejectedValueOnce(new Error('Bewertung konnte nicht gespeichert werden.'))
        vi.spyOn(console, 'error').mockImplementation(() => {})

        render(<ReviewForm placeId="place-1" onNewReview={onNewReview} />)
        await user.click(screen.getByRole('button', { name: 'Bewertung abschicken' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Bewertung konnte nicht gespeichert werden.',
        )
        expect(onNewReview).not.toHaveBeenCalled()
        expect(screen.getByRole('button', { name: 'Bewertung abschicken' })).toBeEnabled()
    })
})