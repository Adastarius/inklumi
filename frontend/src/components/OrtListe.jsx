import testOrte from '../data/testOrte';
import OrtCard from './OrtCard';
import { useState } from 'react';

function OrtListe() {
    const [filter, setFilter] = useState("alle")
    const [bezirkFilter, setBezirkFilter] = useState("alle")

    const gefilterteOrte = testOrte.filter((ort) => {
        const passtBadge = filter === "alle" || ort.badges.includes(filter);
        const passtBezirk = bezirkFilter === "alle" || ort.bezirk === bezirkFilter;
        return passtBadge && passtBezirk;
    });

    return (
        <div>
            <div role="group" aria-label="Nach Beeinträchtigungsart filtern">
                <button onClick={() => setFilter("alle")} aria-pressed={filter === "alle"}>
                    Alle
                    </button>
                <button onClick={() => setFilter("Sehbehinderung")} aria-pressed={filter === "Sehbehinderung"}>
                    Sehbehinderung
                    </button>
                <button onClick={() => setFilter("Hörbehinderung")} aria-pressed={filter === "Hörbehinderung"}>
                    Hörbehinderung
                    </button>
            </div>

            <div>
                <label htmlFor="bezirk-select">Nach Bezirk filtern</label>
                <select
                    id="bezirk-select"
                    value={bezirkFilter}
                    onChange={(e) => setBezirkFilter(e.target.value)}
                >
                    <option value="alle">Alle Bezirke</option>
                    <option value="Mitte">Mitte</option>
                    <option value="Charlottenburg-Wilmersdorf">Charlottenburg-Wilmersdorf</option>
                    <option value="Steglitz-Zehlendorf">Steglitz-Zehlendorf</option>
                </select>
            </div>
            <ul>
            {gefilterteOrte.map((ort) => (
                <OrtCard key={ort.id} ort={ort} />
            ))}
        </ul>
        </div>
    );
}

export default OrtListe;