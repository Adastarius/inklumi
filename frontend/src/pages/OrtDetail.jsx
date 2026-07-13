import { useParams } from'react-router-dom';
import testOrte from '../data/testOrte';
import { useRef, useEffect } from 'react';
import { MapPin, Eye, Ear } from 'lucide-react';
import './OrtDetail.css';

const badgeIcons = { Sehbehinderung: Eye, Hörbehinderung: Ear};

function OrtDetail() {
    const { id } = useParams();
    const ort = testOrte.find((o) => o.id === Number(id)); //o steht für jeden Ort in den Testorten, id der orte wird mit der id aus der URL verglichen
    const ueberschriftRef = useRef(null);

    useEffect(() => {
        ueberschriftRef.current?.focus();
    }, []);

    if (!ort) {
        return <main>Ort nicht gefunden.</main>
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
                            const Icon = badgeIcons[badge];
                            return (
                                <li key={badge} className="badge-pill">
                                    <Icon aria-hidden="true" size={14} />
                                    {badge}
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