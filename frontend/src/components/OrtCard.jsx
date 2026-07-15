import { useNavigate } from 'react-router-dom';
import { Eye, Ear, MapPin } from 'lucide-react';
import './OrtCard.css';

const badgeIcons = {
    Sehbehinderung: Eye,
    Hörbehinderung: Ear
};

function OrtCard({ ort }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`/ort/${ort.id}`);
    }

    return (
        <li className="place-card-wrapper">
            <button className="place-card" onClick={handleClick}>
                <img className="place-card-image" src={ort.bild} alt="" />

                <div className="place-card-content">
                    <h3>{ort.name}</h3>

                    <p className="place-card-address">
                        <MapPin aria-hidden="true" size={16} />
                        {ort.adresse}
                    </p>

                    <p className="place-card-description">{ort.beschreibung}</p>
                    <span className="read-more-link">Weiterlesen</span>
                </div>
                <ul className="place-card-badges">
                    {ort.badges.map((badge) => {
                        const Icon = badgeIcons[badge.name];
                        return (
                            <li key={badge.id} className="badge-pill">
                                <Icon aria-hidden="true" size={14} />
                                {badge.name}
                            </li>
                        );}
                    )}
                </ul>
                
            </button>
        </li>
    );
}

export default OrtCard;