import { useNavigate } from 'react-router-dom';
import { Eye, Ear, MapPin, Brain, HeartPulse, Plus, Accessibility } from 'lucide-react';
import './PlaceCard.css';

const badgeIcons = {
    Sehbehinderung: Eye,
    Hörbehinderung: Ear,
    "Kognitive Beeinträchtigung": Brain,
    "Psychische Erkrankung": HeartPulse,
    Mobilitätsbeeinträchtigung: Accessibility
}

//Wird von PlacesList aufgerufen
function PlaceCard({ place }) {
    const navigate = useNavigate()

    //Weiterleitung zur Detailseite
    function handleClick() {
        navigate(`/orte/${place.id}`)
    }

    //Begrenzen der sichtbaren Badges auf der Card
    const visibleBadges = place.badges.slice(0, 2)
    const hiddenBadgesCount = place.badges.length - visibleBadges.length

    return (
        <li className="place-card-wrapper">
            <button className="place-card" onClick={handleClick}>
                <img className="place-card-image" src={place.picture} alt="" />

                <div className="place-card-content">
                    <h2>{place.name}</h2>

                    <p className="place-card-address">
                        <MapPin aria-hidden="true" size={16} />
                        {place.address}
                    </p>

                    <p className="place-card-description">{place.description}</p>
                    {/*<span className="read-more-link">Weiterlesen</span>*/}
                </div>
                <ul className="place-card-badges">
                    {visibleBadges.map((badge) => {
                        const Icon = badgeIcons[badge.category] ?? MapPin
                        return (
                            <li key={badge.id} className="badge-pill">
                                <Icon aria-hidden="true" size={14} />
                                <span>{badge.name}</span>
                            </li>
                        )}
                    )}
                    {hiddenBadgesCount > 0 && (
                        <li className="badge-pill badge-pill-more" aria-label={`${hiddenBadgesCount} weitere Merkmale`}>
                            <Plus aria-hidden="true" size={14} />
                            {hiddenBadgesCount}
                        </li>
                    )}
                </ul>
                
            </button>
        </li>
    )
}

export default PlaceCard