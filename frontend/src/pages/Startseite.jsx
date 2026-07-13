import OrtListe from '../components/OrtListe';
import './Startseite.css'

function Startseite() {
    return (
        <main>
            <section className="hero">
                <div className="hero-text">
                    <h1>Entdecke barrierefreie Orte in Berlin</h1>
                    <div className="info-card">
                        <p>Mit der Filterfunktion kannst du dir Orte nach Bezirk, Beeinträchtigung 
                        oder anderen Kategorien anzeigen lassen. Füge eigene Bewertungen hinzu und markiere barrierefreie Orte!
                        </p>
                        <button className="create-review-button">Ort bewerten</button>
                    </div>
                </div>

                <img className="hero-image" src="/31751909_7840255.jpg" alt="Eine blinde Frau und ein Mann mit einer Armprothese stehen lächelnd nebeneinander" />
            </section>
            <OrtListe />
        </main>
    )
}

export default Startseite;