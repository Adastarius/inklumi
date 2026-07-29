import { useParams } from'react-router-dom'
import { useRef, useEffect, useState } from 'react'
import { MapPin, Eye, Ear, Brain, Heart } from 'lucide-react'
import './PlaceDetail.css'
import { apiFetch } from '../services/api.js'
import ReviewForm from '../components/ReviewForm.jsx'
import ReviewList from '../components/ReviewList.jsx'

const badgeIcons = { Sehbehinderung: Eye, Hörbehinderung: Ear, "Kognitive Beeinträchtigung": Brain, "Psychische Erkrankung": Heart};

function PlaceDetail() {
    const { id } = useParams()
    const [place, setPlace] = useState(null)
    const [loadStatus, setLoadStatus] = useState("laden")
    const ueberschriftRef = useRef(null)

    useEffect(() => {
        apiFetch(`/orte/${id}`)
            .then((data) => {
                setPlace(data)
                setLoadStatus("fertig")
            })
            .catch(() => setLoadStatus("Fehler"))
    }, [id])

    useEffect(() => {
        if (loadStatus === "fertig") {
            ueberschriftRef.current?.focus()
        }
    }, [id])

    if (loadStatus === "Fehler") {
        return <main>Ort nicht gefunden.</main>
    }
    
    if (loadStatus === "laden") {
        return <main>Ort wird geladen...</main>
    }

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
        <main className="place-detail">
            <div className="place-detail-top">
                <div className="place-detail-info">
                    <h1 tabIndex={-1} ref={ueberschriftRef}>
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
                                    <Icon aria-hidden="true" size={14} />
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
        </main>
    )
}

export default PlaceDetail