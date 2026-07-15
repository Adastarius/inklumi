import { useParams } from'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { MapPin, Eye, Ear } from 'lucide-react';
import './OrtDetail.css';

const badgeIcons = { Sehbehinderung: Eye, Hörbehinderung: Ear};

function OrtDetail() {
    const { id } = useParams();
    const [ort, setOrt] = useState(null);
    const [loadStatus, setLoadStatus] = useState("laden");
    const ueberschriftRef = useRef(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/orte/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Ort nicht gefunden");
                }
                return res.json();
            })
            .then((data) => {
                setOrt(data);
                setLoadStatus("fertig");
            })
            .catch(() => setLoadStatus("Fehler"));
    }, [id]);

    useEffect(() => {
        if (loadStatus === "fertig") {
            ueberschriftRef.current?.focus();
        }
    }, [id]);

    if (loadStatus === "Fehler") {
        return <main>Ort nicht gefunden.</main>;
    }
    
    if (loadStatus === "laden") {
        return <main>Ort wird geladen...</main>;
    }

    return (
        <main className="place-detail">
            <div className="place-detail-top">
                <div className="place-detail-info">
                    <h1 tabIndex={-1} ref={ueberschriftRef}>
                        {ort.name}
                    </h1>

                    <p className="place-detail-address">
                        <MapPin aria-hidden="true" size={18} />
                        {ort.adresse}
                    </p>

                    <ul className="place-detail-badges">
                        {ort.badges.map((badge) => {
                            const Icon = badgeIcons[badge.name];
                            return (
                                <li key={badge.id} className="badge-pill">
                                    <Icon aria-hidden="true" size={14} />
                                    {badge.name}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <img className="place-detail-image" src={ort.bild} alt="" />
            </div>
            
            <p className="place-detail-description">{ort.beschreibung}</p>
        </main>
    );
}

export default OrtDetail;