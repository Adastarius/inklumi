import PlaceCard from './PlaceCard.jsx'
import './PlacesList.css'

function PlacesList({ places }) {
    if (places.length === 0) {
        return <p>Keine Orte gefunden, die zu deiner Filterauswahl passen.</p>
    }    

    return (
        <ul className="places-list">
            {places.map((place) => (
                <PlaceCard key={place.id} place={place} />
            ))}
        </ul>
    )
}

export default PlacesList