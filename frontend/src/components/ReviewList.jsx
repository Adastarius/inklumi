import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'
import './ReviewList.css'
import { Ear, Eye, Brain, Drama, Accessibility, MapPin, Trash } from 'lucide-react'

const badgeIcons = {
    Sehbehinderung: Eye,
    Hörbehinderung: Ear,
    "Kognitive Beeinträchtigung": Brain,
    "Psychische Erkrankung": Drama,
    Mobilitätsbeeinträchtigung: Accessibility
}

function ReviewList({ reviews, onDeleteReview }) {
    const { token } = useAuth()

    let ownUserId = null
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            ownUserId = payload.userId
        } catch {
            ownUserId = null
        }
    }

    async function handleDelete(reviewId) {
        const confirmed = window.confirm("Bewertung wirklich löschen?")
        if (!confirmed) return

        try {
        await apiFetch(`/bewertungen/${reviewId}`, { method: "DELETE" })
        onDeleteReview(reviewId)
        }catch (error) {
            console.error(error)
            alert("Löschen fehlgeschlagen: " + error.message)
        }
    }

    if (reviews.length === 0) {
        return <p>Noch keine Bewertungen für diesen Ort.</p>
    }

    return (
        <ul className="review-list">
            {reviews.map((review) => (
                <li key={review.id} className="review-item">
                    <div className="review-header">
                        <div className="review-header-info">
                            <span className="review-author">{review.user.username}</span>
                            <span className="date-info">{new Date(review.createdAt).toLocaleDateString('de-De')}</span>
                        </div>

                        {review.userId === ownUserId && (
                            <button
                                onClick={() => handleDelete(review.id)}
                                className="delete-review"
                                aria-label={`Bewertung vom ${new Date(review.createdAt).toLocaleDateString('de-De')} löschen`}
                            >
                                <Trash aria-hidden="true" size={14} />
                                Löschen
                            </button>
                        )}
                    </div>

                    <p className="review-text">{review.text}</p>

                    <ul className="review-badges">
                        {review.badges.map((badge) => {
                            const Icon = badgeIcons[badge.category] ?? MapPin
                            return (
                            <li key={badge.id} className="badge-pill-small">
                                <Icon aria-hidden="true" size={14} />
                                <span>{badge.name}</span>
                            </li>
                            )})}
                    </ul>
                    
                </li>
            ))}
        </ul>

    )
}

export default ReviewList