import './PlacesList.css'
import { useState, useEffect, useRef } from 'react'
import { LayoutGrid, MapPin, Accessibility, Trash } from 'lucide-react'

//Filteroptionen
const disabilities = ["Sehbehinderung", "Hörbehinderung", "Kognitive Beeinträchtigung", "Psychische Erkrankung", "Mobilitätsbeeinträchtigung"]
const districts = ["Charlottenburg-Wilmersdorf", "Friedrichshain-Kreuzberg", "Lichtenberg", "Marzahn-Hellersdorf", "Mitte", "Neukölln", "Pankow", "Reinickendorf", "Spandau", "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Treptow-Köpenick"]
const categories = ["Kultur", "Freizeit", "Gesundheit", "Restaurant/Café", "Supermarkt", "Sonstiges"]

//Props aus Startseits.jsx, dort werden die Filterwerte genutzt, um die Orte zu filtern
function PlaceFilters({ categoryFilter, setCategoryFilter, districtFilter, setDistrictFilter, disabilityFilter, setDisabilityFilter}) {
    //speichert, welcher Filter geöffnet ist
    const [openedFilter, setOpenedFilter] = useState(null)

    //speichert HTML-ELemente aller Filterboxen (mit Button) -> für Überprüfung ob Klick außerhalb
    const filterRefs = useRef({})
    //speichert die HTML-Elemente aller Filterboxen (ohne Button) -> für Tastaturnavigation und Fokus
    const optionsRefs = useRef({})
    //speichert den Button, der das aktuelle Filtermenü geöffnet hat
    const triggerButtonRef = useRef(null)

    //Wenn Wert schon ausgewählt, wird es beim abwählen aus dem Array entfernt, ansonsten wird es hinzugefügt
    function handleFilterOptionChange(filterOption, currentFilterOptions, setFilter) {
        if (currentFilterOptions.includes(filterOption)) {
            setFilter(currentFilterOptions.filter((option) => option !== filterOption))
        } else {
            setFilter([...currentFilterOptions, filterOption])
        }
    }

    //Filter ein- bzw. ausklappen
    function toggleFilter(name, e) {
        if (openedFilter === name) {
            setOpenedFilter(null)
            //Fokus zurück zum Button, der das Panel geöffnet hat
            triggerButtonRef.current?.focus()
        } else {
            setOpenedFilter(name)
            //speichern des angeklickten Buttons, um Fokus zurückzugeben später
            triggerButtonRef.current = e.currentTarget
        }
    }

    //alle Filter zurücksetzen
    function deleteFilterSelection() {
        setDisabilityFilter([])
        setDistrictFilter([])
        setCategoryFilter([])
        setOpenedFilter(null)
    }

    //bei esc wird Filter geschlossen
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") {
                setOpenedFilter(null)
                //Fokus zurück zum Button, der das Panel geöffnet hat
                triggerButtonRef.current?.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        //verhindert, dass sich Event Listener anhäufen durch entfernen beim Verlassen der Startseite bzw. PlaceFilters
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    //Überprüft Klicken außerhalb der Filter -> contains(e.target)
    useEffect(() => {
        function handleClickOutside(e) {
            if (!openedFilter) return
            
            const currentRef = filterRefs.current[openedFilter]
            if (currentRef && !currentRef.contains(e.target)) {
                setOpenedFilter(null)
                //Fokus zurück zum Button, der das Panel geöffnet hat
                triggerButtonRef.current?.focus()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [openedFilter])

    //Tab-Navigation im Filter
    useEffect(() => {
        if (!openedFilter) return

        const panel = optionsRefs.current[openedFilter]
        if (!panel) return

        //Suchen aller fokussierbaren Elemente in der Filteranzeige
        const focusableSelector = 'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
        const focusableElements = panel.querySelectorAll(focusableSelector)

        //erstes und letztes Element speichern
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        //erstes Element hat Fokus
        firstElement?.focus()

        function handleTabKey(e) {
            if (e.key !== "Tab") return

            //Shift+Tab auf erstem Element = springe zum letzten Element
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement.focus()
                }
            } else {
                //Wenn Fokus auf letztem Element und Tab gedrückt soll erstes Element fokussiert werden
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement?.focus()
                }
            }
        }

        panel.addEventListener("keydown", handleTabKey)
        return () => panel.removeEventListener("keydown", handleTabKey)
    }, [openedFilter])

    return (
        <div className="filter-grid">
            {/*in ref wird das div-Element (el) filterRefs.current["kategorie"] zugewiesen*/}
            <div className="filter-item" ref={(el) => (filterRefs.current["kategorie"] = el)}>
                <button className="filter-box" onClick={(e) => toggleFilter("kategorie", e)} aria-expanded={openedFilter === "kategorie"}>
                    <LayoutGrid aria-hidden="true" size={20} />
                    <span className="filter-label">Kategorie</span>
                </button>

                {openedFilter === "kategorie" && (
                    <div className="filter-options" ref={(el) => (optionsRefs.current["kategorie"] = el)} role="dialog" aria-modal="true" aria-label="Kategorie Filter">
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
            
            <div className="filter-item" ref={(el) => (filterRefs.current["bezirk"] = el)}>
                <button className="filter-box" onClick={(e) => toggleFilter("bezirk", e)} aria-expanded={openedFilter === "bezirk"}>
                    <MapPin aria-hidden="true" size={20} />
                    <span className="filter-label">Bezirk</span>
                </button>

                {openedFilter === "bezirk" && (
                    <div className="filter-options" ref={(el) => (optionsRefs.current["bezirk"] = el)} role="dialog" aria-modal="true" aria-label="Bezirk Filter">
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
            
            <div className="filter-item" ref={(el) => (filterRefs.current["beeintraechtigung"] = el)}>
                <button className="filter-box" onClick={(e) => toggleFilter("beeintraechtigung", e)} aria-expanded={openedFilter === "beeintraechtigung"}>
                    <Accessibility aria-hidden="true" size={20} />
                    <span className="filter-label">Beeinträchtigung</span>
                </button>

                {openedFilter === "beeintraechtigung" && (
                <div className="filter-options" ref={(el) => (optionsRefs.current["beeintraechtigung"] = el)} role="dialog" aria-modal="true" aria-label="Beeinträchtigung Filter">
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

            {/*für mobile Geräte Hintergrund verändern*/}
            {openedFilter && (
                <div
                    className="filter-backdrop"
                    onClick={() => {
                        setOpenedFilter(null)
                        //Fokus zurück zum Button, der das Panel geöffnet hat
                        triggerButtonRef.current?.focus()
                    }}
                    aria-hidden="true"
                />
            )}
        </div>
    )
}

export default PlaceFilters