import './Review.css'
import { useNavigate } from 'react-router-dom'
import { Ear, Eye, Brain, Drama, Accessibility, MapPin, CircleX, Plus } from 'lucide-react'

const badgeIcons = {
    Sehbehinderung: Eye,
    Hörbehinderung: Ear,
    "Kognitive Beeinträchtigung": Brain,
    "Psychische Erkrankung": Drama,
    Mobilitätsbeeinträchtigung: Accessibility
}

function PlaceInfo( { place, onClose }) {
    const navigate = useNavigate()
    
    function handleClick() {
        navigate(`/orte/${place.id}`)
    }

    const visibleBadges = place.badges.slice(0, 3)
    const hiddenBadgesCount = place.badges.length - visibleBadges.length

    return (
        <div className="place-info">
            <div className="info-header">
                <div>
                    <h2>{place.name}</h2>
                    <p className="place-quick-address">{place.address}</p>
                </div>
                <button onClick={onClose} className="close-button" aria-label="Schließen">
                    <CircleX aria-hidden="true" size={20} />
                </button>
            </div>
                
            <img className="place-image" src={place.picture} alt="" />
            <div className="place-description">
                {place.description}
            </div>
            <ul className="place-badges">
                {visibleBadges.map((badge) => {
                    const Icon = badgeIcons[badge.category] ?? MapPin
                    return (
                        <li key={badge.id} className="badge-pill">
                            <Icon aria-hidden="true" size={14} />
                            {badge.name}
                        </li>
                )})}
                {hiddenBadgesCount > 0 && (
                    <li className="badge-pill">
                        <Plus aria-hidden="true" size={14} />
                        {hiddenBadgesCount}
                    </li>
                )}
            </ul>
            

            <button onClick={handleClick} className="detail-button">
                Zur Detailseite
            </button>
        </div>
    )
}

export default PlaceInfo