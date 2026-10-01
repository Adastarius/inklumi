import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }))

vi.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'place-1' }),
}))
vi.mock('../services/api.js', () => ({ apiFetch }))
vi.mock('../components/ReviewList.jsx', () => ({
    default: ({ reviews }) => (
        <ul>
            {reviews.map((review) => <li key={review.id}>{review.text}</li>)}
        </ul>
    ),
}))
vi.mock('../components/ReviewForm.jsx', () => ({
    default: ({ onNewReview }) => (
        <button onClick={() => onNewReview({ id: 'review-2', text: 'Neu' })}>
            Neue Bewertung
        </button>
    ),
}))

const { default: PlaceDetail } = await import('./PlaceDetail.jsx')

describe('PlaceDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        apiFetch.mockResolvedValue({
            id: 'place-1',
            name: 'Museum',
            address: 'Museumstraße 1',
            description: 'Ein zugänglicher Ort',
            picture: '/museum.jpg',
            badges: [],
            reviews: [{ id: 'review-1', text: 'Alt' }],
        })
    })

    it('shows a loading message while the place is being fetched', () => {
        apiFetch.mockReturnValue(new Promise(() => {}))

        render(<PlaceDetail />)

        expect(screen.getByText('Ort wird geladen...')).toBeInTheDocument()
    })

    it('shows an error message when loading the place fails', async () => {
        apiFetch.mockRejectedValue(new Error('Not found'))

        render(<PlaceDetail />)

        expect(await screen.findByText('Ort nicht gefunden.')).toBeInTheDocument()
    })

    it('adds a new review to the beginning of the review list', async () => {
        const user = userEvent.setup()
        render(<PlaceDetail />)

        expect(await screen.findByText('Alt')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Neue Bewertung' }))

        const reviews = screen.getAllByRole('listitem')
        expect(reviews[0]).toHaveTextContent('Neu')
        expect(reviews[1]).toHaveTextContent('Alt')
        expect(apiFetch).toHaveBeenCalledWith('/orte/place-1')
    })
})