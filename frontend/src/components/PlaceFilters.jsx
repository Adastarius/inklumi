import './PlacesList.css'
import { useState, useEffect } from 'react'
import { LayoutGrid, MapPin, Accessibility, Trash } from 'lucide-react'

const disabilities = ["Sehbehinderung", "Hörbehinderung", "Kognitive Beeinträchtigung", "Psychische Erkrankung", "Mobilitätsbeeinträchtigung"]
const districts = ["Charlottenburg-Wilmersdorf", "Friedrichshain-Kreuzberg", "Lichtenberg", "Marzahn-Hellersdorf", "Mitte", "Neukölln", "Pankow", "Reinickendorf", "Spandau", "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Treptow-Köpenick"]
const categories = ["Kultur", "Freizeit", "Gesundheit", "Essen", "Sonstiges"]

function PlaceFilters({ categoryFilter, setCategoryFilter, districtFilter, setDistrictFilter, disabilityFilter, setDisabilityFilter}) {
    const [openedFilter, setOpenedFilter] = useState(null)

    //Wenn Wert schon ausgewählt, wird es beim abwählen aus dem Array entfernt, ansonsten wird es hinzugefügt
    function handleFilterOptionChange(filterOption, currentFilterOptions, setFilter) {
        if (currentFilterOptions.includes(filterOption)) {
            setFilter(currentFilterOptions.filter((option) => option !== filterOption))
        } else {
            setFilter([...currentFilterOptions, filterOption])
        }
    }

    function toggleFilter(name) {
        if (openedFilter === name) {
            setOpenedFilter(null)
        } else {
            setOpenedFilter(name)
        }
    }

    function deleteFilterSelection() {
        setDisabilityFilter([])
        setDistrictFilter([])
        setCategoryFilter([])
        setOpenedFilter(null)
    }

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setOpenedFilter(null)
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <div className="filter-grid">
            <div className="filter-item">
                <button className="filter-box" onClick={() => toggleFilter("kategorie")} aria-expanded={openedFilter === "kategorie"}>
                    <LayoutGrid aria-hidden="true" size={20} />
                    <span className="filter-label">Kategorie</span>
                </button>

                {openedFilter === "kategorie" && (
                    <div className="filter-options">
                        <div role="group" aria-label="Kategorie" className="checkbox-liste">
                            {categories.map((category) => (
                                <label key={category}>
                                <input
                                    type="checkbox"
                                    checked={categoryFilter.includes(category)}
                                    onChange={() => handleFilterOptionChange(category, categoryFilter, setCategoryFilter)}
                                />
                                {category}
                            </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="filter-item">
                <button className="filter-box" onClick={() => toggleFilter("bezirk")} aria-expanded={openedFilter === "bezirk"}>
                    <MapPin aria-hidden="true" size={20} />
                    <span className="filter-label">Bezirk</span>
                </button>

                {openedFilter === "bezirk" && (
                    <div className="filter-options">
                        <div role="group" aria-label="Bezirk" className="checkbox-liste">
                            {districts.map((district) => (
                                <label key={district}>
                                    <input
                                        type="checkbox"
                                        checked={districtFilter.includes(district)}
                                        onChange={() => handleFilterOptionChange(district, districtFilter, setDistrictFilter)}
                                    />
                                    {district}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="filter-item">
                <button className="filter-box" onClick={() => toggleFilter("beeintraechtigung")} aria-expanded={openedFilter === "beeintraechtigung"}>
                    <Accessibility aria-hidden="true" size={20} />
                    <span className="filter-label">Beeinträchtigung</span>
                </button>

                {openedFilter === "beeintraechtigung" && (
                <div className="filter-options">
                    <div role="group" aria-label="Beeinträchtigung" className="checkbox-liste">
                        {disabilities.map((badge) => (
                            <label key={badge}>
                                <input
                                    type="checkbox"
                                    checked={disabilityFilter.includes(badge)}
                                    onChange={() => handleFilterOptionChange(badge, disabilityFilter, setDisabilityFilter)}
                                />
                                {badge}
                            </label>
                        ))}
                    </div>
                </div>
                )}
            </div>
            
            <div>
                <button className="filter-box" onClick={deleteFilterSelection}>
                    <Trash aria-hidden="true" size={18} />
                    <span>Auswahl löschen</span>
                </button>
            </div>
        </div>
    )
}

export default PlaceFilters