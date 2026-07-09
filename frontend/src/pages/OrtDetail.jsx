import { useParams } from'react-router-dom';
import testOrte from '../data/testOrte';
import { useRef, useEffect } from 'react';

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
        <main>
            <h1 tabIndex={-1} ref={ueberschriftRef}>
                {ort.name}
            </h1>
            <p>{ort.adresse}</p>
            <p>{ort.beschreibung}</p>
            <ul>
                {ort.badges.map((badge) => (
                    <li key={badge}>{badge}</li>
                ))}
            </ul>
        </main>
    );
}

export default OrtDetail;