import { useNavigate } from 'react-router-dom'

function OrtCard({ ort }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`/ort/${ort.id}`);
    }

    return (
        <li>
            <button  onClick={handleClick}>
                <h3>{ort.name}</h3>
                <p>{ort.adresse}</p>
                <p>{ort.beschreibung}</p>
                <ul>
                    {ort.badges.map((badge) => (
                        <li key={badge}>{badge}</li>
                    ))}
                </ul>
            </button>
        </li>
    );
}

export default OrtCard;