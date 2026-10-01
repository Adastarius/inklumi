import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }))

vi.mock('../services/api.js', () => ({ apiFetch }))
vi.mock('../components/MapView', () => ({ default: () => <div>Map</div> }))
vi.mock('../components/NewPlaceButton', () => ({ default: () => <div>New place</div> }))
vi.mock('../components/PlaceFilters', () => ({
    default: ({ setCategoryFilter }) => (
        <button onClick={() => setCategoryFilter(['Kultur'])}>Kultur filtern</button>
    ),
}))
vi.mock('../components/PlacesList', () => ({
    default: ({ places }) => (
        <ul>
            {places.map((place) => <li key={place.id}>{place.name}</li>)}
        </ul>
    ),
}))

const { default: Startseite } = await import('./Startseite.jsx')

describe('Startseite', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        apiFetch.mockResolvedValue([
            { id: '1', name: 'Museum', category: 'Kultur', badges: [] },
            { id: '2', name: 'Schwimmbad', category: 'Freizeit', badges: [] },
        ])
    })

    it('loads and filters places by category', async () => {
        const user = userEvent.setup()
        render(<Startseite />)

        expect(await screen.findByText('Museum')).toBeInTheDocument()
        expect(screen.getByText('Schwimmbad')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Kultur filtern' }))

        expect(screen.getByText('Museum')).toBeInTheDocument()
        expect(screen.queryByText('Schwimmbad')).not.toBeInTheDocument()
    })
})