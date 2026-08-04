import { useState, useEffect } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'
import './NewPlace.css'
import { useNavigate } from 'react-router-dom'

const BERLIN_BORDER = { west: 13.088, south: 52.338, east: 13.761, north: 52.675 }

function NewPlaceForm({ onClose, onPlaceCreated }) {
    const { token } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [coords, setCoords] = useState(null)
    const [geocodeStatus, setGeocodeStatus] = useState("idle") // idle | suche | gefunden | nicht_gefunden
    const [error, setError] = useState(null)
    const [isSent, setIsSent] = useState(false)
    const [selectedBadges, setSelectedBadges] = useState([])
    const [allBadges, setAllBadges] = useState([])
    const [reviewText, setReviewText] = useState("")
    const [district, setDistrict] = useState("")
    const [pictureFile, setPictureFile] = useState(null)
    const [uploadStatus, setUploadStatus] = useState("idle") //idle | hochladen | fertig | fehler

    useEffect(() => {
        apiFetch("/badges")
            .then(setAllBadges)
            .catch(() => setError("Merkmale konnten nicht geladen werden."))
    }, [])

    async function handleGeocode() {
        if (!address.trim()) return
        setGeocodeStatus("suche")
        setCoords(null)

        try {
            const result = await apiFetch(`/geocode?address=${encodeURIComponent(address)}`)
            
            if (!result.found) {
                setGeocodeStatus("nicht_gefunden")
                return
            }

            setCoords({ lat: result.latitude, lon: result.longitude })
            if (result.district) {
                setDistrict(result.district)
            }
            setGeocodeStatus("gefunden")
        } catch (error){
            console.error(error)
            setGeocodeStatus("nicht_gefunden")
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        if (!coords) {
            setError("Bitte zuerst die Adresse über den Button prüfen.")
            return
        }

        setIsSent(true)
        try {
            const pictureUrl = pictureFile ? await handleUploadImage(pictureFile) : null

            const newPlace = await apiFetch("/orte/neu", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    address,
                    category,
                    description,
                    latitude: coords.lat, 
                    longitude: coords.lon,
                    badgeIds: selectedBadges,
                    reviewText,
                    district,
                    picture: pictureUrl,
                }),
            })
            navigate("/")
        } catch (error) {
            setError(error.message)
        } finally {
            setIsSent(false)
        }
    }

    function toggleBadge(badgeId) {
        if (selectedBadges.includes(badgeId)) {
            setSelectedBadges(selectedBadges.filter((id) => id !== badgeId))
        } else {
            setSelectedBadges([...selectedBadges, badgeId])
        }
    }

    async function handleUploadImage(file) {
        if (!file) return null

        setUploadStatus("hochladen")

        const formData = new FormData()
        formData.append('image', file)

        try {
            const res = await fetch("http://localhost:3000/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error)

            setUploadStatus("fertig")
            return data.url
        } catch (error) {
            console.error(error)
            setUploadStatus("fehler")
            return null
        }
    }

    if (!token) {
        return (
            <div role="dialog" aria-modal="true" aria-label="Anmeldung erforderlich" className="new-place-overlay">
                <div className="new-place-dialog">
                    <p className="login-info">Bitte melde dich an, um einen Ort einzutragen.</p>
                    <button onClick={() => navigate("/")}>Zurück zur Startseite</button>
                </div>
            </div>
        )
    }

    return (
        <main className="new-place-page">
            <div className="new-place-card">
                <h1 id="new-place-title">Füge einen neuen Ort hinzu</h1>

                <form onSubmit={handleSubmit} className="new-place-form">
                    <label htmlFor="place-name">Name des Orts</label>
                    <input
                        id="place-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="place-address">Straße und Hausnummer</label>
                    <div className="address">
                        <input
                            id="place-address"
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value)
                                setCoords(null)
                                setGeocodeStatus("idle")
                            }}
                            aria-describedby="geocode-status"
                            required
                        />
                        <button type="button" onClick={handleGeocode}>
                            Adresse prüfen
                        </button>
                    </div>
                    

                    <p id="geocode-status" aria-live="polite">
                        {geocodeStatus === "suche" && "Adresse wird gesucht..."}
                        {geocodeStatus === "gefunden" && "Adresse gefunden."}
                        {geocodeStatus === "nicht_gefunden" && "Adresse in Berlin nicht gefunden. Bitte prüfen."}
                    </p>

                    <label htmlFor="district">Bezirk</label>
                    <input
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
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

                    <label htmlFor="place-category">Kategorie</label>
                    <select
                        id="place-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                            <option value="">Bitte wählen</option>
                            <option value="Freizeit">Freizeit</option>
                            <option value="Kultur">Kultur</option>
                            <option value="Gesundheit">Gesundheit</option>
                            <option value="Essen">Restaurant/Café</option>
                            <option value="Supermarkt">Supermarkt</option>
                            <option value="Sonstiges">Sonstiges</option>
                    </select>

                    <label htmlFor="place-picture">Bild (optional)</label>
                    <input
                        id="place-picture"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={(e) => setPictureFile(e.target.files[0])}
                    />
                    {uploadStatus === "hochladen" && <p aria-live="polite">Bild wird hochgeladen...</p>}

                    <label htmlFor="place-description">Beschreibung</label>
                    <textarea
                        id="place-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        required
                    />

                    <label htmlFor="place-review">Review - deine Erfahrung (optional)</label>
                    <textarea
                        id="place-review"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={3}
                    />

                    {error && (
                        <p role="alert" className="auth-error">
                            {error}
                        </p>
                    )}

                    <div className="new-place-actions">
                        <button type="button" onClick={() => navigate("/")}>
                            Abbrechen
                        </button>
                        <button type="submit" disabled={isSent}>
                            {isSent ? "Wird gesendet..." : "Ort speichern"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default NewPlaceForm