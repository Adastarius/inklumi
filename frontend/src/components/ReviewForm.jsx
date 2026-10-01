import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './Review.css'

function ReviewForm({ placeId, onNewReview }) {
    const { token } = useAuth()
    const [allBadges, setAllBadges] = useState([])
    const [text, setText] = useState("")
    const [selectedBadges, setSelectedBadges] = useState([])
    const [error, setError] = useState(null)
    const [isSent, setIsSent] = useState(false)

    //Badges laden
    useEffect(() => {
        apiFetch("/badges")
            .then(setAllBadges)
            .catch(() => setError("Badges konnten nicht geladen werden."))
    }, [])

    //Badge aus- oder abwählen
    function toggleBadge(badgeId) {
        if (selectedBadges.includes(badgeId)) {
            setSelectedBadges(selectedBadges.filter((id) => id !== badgeId))
        } else {
            setSelectedBadges([...selectedBadges, badgeId])
        }
    }

    //Bewertung an das Backend senden
    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setIsSent(true)

        try {
            const newReview = await apiFetch("/bewertungen", {
                method: "POST",
                body: JSON.stringify({
                    text,
                    placeId,
                    badgeIds: selectedBadges,
                })
            })

            onNewReview(newReview)
            setText("")
            setSelectedBadges([])
        }catch (error) {
            console.error(error)
            setError(error.message)
        } finally {
            setIsSent(false)
        }
    }

    if (!token) {
        return (
            <p className="review-login-hint">
                Bitte melde dich an, im diesen Ort zu bewerten.
            </p>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h2>Diesen Ort bewerten</h2>

            <label htmlFor="review-text">Deine Erfahrung</label>
            <textarea
                id="review-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
            />

            <fieldset>
                <legend>Zutreffende Merkmale</legend>
                <div className="badge-selections">
                    {allBadges.map((badge) => (
                        <label key={badge.id} className="badge-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedBadges.includes(badge.id)}
                                onChange={() => toggleBadge(badge.id)}
                            />
                            {badge.name}
                        </label>
                    ))}
                </div>
            </fieldset>

            {error && (
                <p role="alert" className="auth-error">
                    {error}
                </p>
            )}

            <button type="submit" disabled={isSent}>
                {isSent ? "Wird gesendet..." : "Bewertung abschicken"}
            </button>
        </form>
    )
}

export default ReviewForm