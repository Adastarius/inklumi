import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import PlaceFilters from './PlaceFilters.jsx'

function renderFilters(props = {}) {
    return render(
        <PlaceFilters
            categoryFilter={[]}
            setCategoryFilter={vi.fn()}
            districtFilter={[]}
            setDistrictFilter={vi.fn()}
            disabilityFilter={[]}
            setDisabilityFilter={vi.fn()}
            {...props}
        />,
    )
}

describe('PlaceFilters', () => {
    it('opens the category filter when clicked', async () => {
        const user = userEvent.setup()
        renderFilters()

        await user.click(screen.getByRole('button', { name: /Kategorie/ }))

        expect(screen.getByRole('dialog', { name: 'Kategorie Filter' })).toBeVisible()
    })

    it('adds a selected category through the provided setter', async () => {
        const user = userEvent.setup()
        const setCategoryFilter = vi.fn()
        renderFilters({ setCategoryFilter })

        await user.click(screen.getByRole('button', { name: /Kategorie/ }))
        await user.click(screen.getByRole('checkbox', { name: 'Kultur' }))

        expect(setCategoryFilter).toHaveBeenCalledWith(['Kultur'])
    })

    it('clears all selected filters', async () => {
        const user = userEvent.setup()
        const setCategoryFilter = vi.fn()
        const setDistrictFilter = vi.fn()
        const setDisabilityFilter = vi.fn()
        renderFilters({
            categoryFilter: ['Kultur'],
            districtFilter: ['Mitte'],
            disabilityFilter: ['Sehbehinderung'],
            setCategoryFilter,
            setDistrictFilter,
            setDisabilityFilter,
        })

        await user.click(screen.getByRole('button', { name: /Auswahl löschen/ }))

        expect(setCategoryFilter).toHaveBeenCalledWith([])
        expect(setDistrictFilter).toHaveBeenCalledWith([])
        expect(setDisabilityFilter).toHaveBeenCalledWith([])
    })
})