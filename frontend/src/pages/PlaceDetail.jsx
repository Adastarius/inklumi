import { useParams } from'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { MapPin, Eye, Ear, Brain, HeartPulse, Accessibility } from 'lucide-react'
import './PlaceDetail.css'
import { apiFetch } from '../services/api.js'
import ReviewForm from '../components/ReviewForm.jsx'
import ReviewList from '../components/ReviewList.jsx'

const badgeIcons = { Sehbehinderung: Eye, Hörbehinderung: Ear, "Kognitive Beeinträchtigung": Brain, "Psychische Erkrankung": HeartPulse, Mobilitätsbeeinträchtigung: Accessibility};

//Detailseite eines Orts
function PlaceDetail() {
    //ID des Orts wird aus der URL gelesen
    const { id } = useParams()
    const [place, setPlace] = useState(null)
    const [loadStatus, setLoadStatus] = useState("laden")
    //Referenz auf das HTML-Element mit dem Ortsnamen
    const placeNameRef = useRef(null)

    useEffect(() => {
        apiFetch(`/orte/${id}`)
            .then((data) => {
                setPlace(data)
                setLoadStatus("fertig")
            })
            .catch(() => setLoadStatus("Fehler"))
    }, [id])

    //Wenn Ort geladen, Fokus auf HTML-Element des Ortsnamens
    useEffect(() => {
        if (loadStatus === "fertig") {
            placeNameRef.current?.focus()
        }
    }, [id])

    if (loadStatus === "Fehler") {
        return <main>Ort nicht gefunden.</main>
    }
    
    if (loadStatus === "laden") {
        return <main>Ort wird geladen...</main>
    }

    //Wenn neues Review, dann als erstes Element zu dem Array mit Ortsreviews hinzufügen
    function handleNewReview(newReview) {
        setPlace({
            ...place,
            reviews: [newReview, ...place.reviews]
        })
    }

    function handleDeleteReview(reviewId) {
        setPlace({
            ...place,
            reviews: place.reviews.filter((r) => r.id !== reviewId)
        })
    }

    return (
        <main>
            <div className="place-detail">
                <div className="place-detail-top">
                    <div className="place-detail-info">
                        <h1 tabIndex={-1} ref={placeNameRef}>
                            {place.name}
                        </h1>

                        <p className="place-detail-address">
                            <MapPin aria-hidden="true" size={18} />
                            {place.address}
                        </p>

                        <ul className="place-detail-badges">
                            {place.badges.map((badge) => {
                                const Icon = badgeIcons[badge.category] ?? MapPin
                                return (
                                    <li key={badge.id} className="badge-pill">
                                        <Icon aria-hidden="true" size={16} />
                                        {badge.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <img className="place-detail-image" src={place.picture} alt="" />
                </div>
                
                <p className="place-detail-description">{place.description}</p>

                <ReviewList reviews={place.reviews} onDeleteReview={handleDeleteReview} />

                <ReviewForm placeId={place.id} onNewReview={handleNewReview} />
            </div>
        </main>
    )
}

export default PlaceDetail