import PlacesList from '../components/PlacesList'
import './Startseite.css'
import { apiFetch } from '../services/api.js'
import { useState, useEffect } from 'react'
import MapView from '../components/MapView'
import PlaceFilters from '../components/PlaceFilters'
import NewPlaceButton from '../components/NewPlaceButton'
import { List, Map } from 'lucide-react'

function Startseite() {
    const [places, setPlaces] = useState([])
    const [loadStatus, setLoadStatus] = useState("laden")

    //Ändern der View (Liste oder Karte)
    const [view, setView] = useState("list")

    const [disabilityFilter, setDisabilityFilter] = useState([])
    const [districtFilter, setDistrictFilter] = useState([])
    const [categoryFilter, setCategoryFilter] = useState([])
    

    useEffect(() => {
        apiFetch("/orte")
            .then((data) => {
                setPlaces(data)
                setLoadStatus("fertig")
            })
            .catch(() => setLoadStatus("Fehler"))
    }, [])

    //Orte werden gefiltert
    const filteredPlaces = places.filter((place) => {
        //Filter enthält entweder kein Element oder mindestens ein Item des Filters passt auf den Ort
        const matchingDisability = disabilityFilter.length === 0 || disabilityFilter.some((checked) =>
            (place.badges ?? []).some((badge) => badge.category === checked));
        const matchingDistrict = districtFilter.length === 0 || districtFilter.includes(place.district);
        const matchingCategory = categoryFilter.length === 0 || categoryFilter.includes(place.category);
        return matchingDisability && matchingDistrict && matchingCategory;
    })

    function refetchPlaces() {
        apiFetch("/orte")
            .then(setPlaces)
            .catch(() => setLoadStatus("Fehler"))
    }

    return (
        <main>
            <section className="hero">
                <div className="hero-text">

                    <h1>Entdecke barrierefreie Orte in Berlin</h1>
                    <div className="info-card">
                        <p>Mit der Filterfunktion kannst du dir Orte nach Bezirk, Beeinträchtigung 
                        oder anderen Kategorien anzeigen lassen. Füge eigene Bewertungen hinzu und markiere barrierefreie Orte!
                        </p>
                        <a href="#places-area" className="create-review-button">
                            Orte entdecken
                        </a>
                    </div>
                </div>
            <img className="hero-image" src="/a-modern-cartoon-of-a-blind-person-with-a-dog--a-p(1)(5).jpg" alt="Drei Personen stehen mit einem Hund nebeneinander" />
 
            </section>

            <section id="places-area" className="places-section">
                <div className="places-section-header">
                    <PlaceFilters
                        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                        districtFilter={districtFilter} setDistrictFilter={setDistrictFilter}
                        disabilityFilter={disabilityFilter} setDisabilityFilter={setDisabilityFilter}
                    />

                    <NewPlaceButton />
                </div>

                <div role="tablist" aria-label="Ansicht wählen" className="view-toggle">
                    <button role="tab" id="tab-list" aria-selected={view === "list"} aria-controls="panel-list" onClick={() => setView("list")}>
                        <List size={18} strokeWidth={2} aria-hidden="true" />
                        Listenansicht
                    </button>
                    <button role="tab" id="tab-map" aria-selected={view === "map"} aria-controls="panel-map" onClick={() => setView("map")}>
                        <Map size={18} strokeWidth={2} aria-hidden="true" />
                        Kartenansicht
                    </button>
                </div>

            {loadStatus === "laden" && <p>Orte werden geladen...</p>}
            {loadStatus === "Fehler" && <p role="alert">Orte konnten nicht geladen werden.</p>}
            
            {loadStatus === "fertig" && (
                <>
                    <div role="tabpanel" id="panel-list" aria-labelledby="tab-list" hidden={view !== "list"}>
                        <PlacesList places={filteredPlaces} />
                    </div>

                    <div role="tabpanel" id="panel-map" aria-labelledby="tab-map" hidden={view !== "map"}>
                        <MapView places={filteredPlaces} />
                    </div>
                </>
            )}
            </section>
        </main>
    )
}

export default Startseite