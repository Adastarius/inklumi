import OrtListe from '../components/OrtListe';

function Startseite() {
    return (
        <main>
            <h1>Entdecke barrierefreie Orte in Berlin</h1>
            <p>Mit der Filterfunktion kannst du dir Orte nach Bezirk, Beeinträchtigungsart 
                oder anderen Kategorien anzeigen lassen.
            </p>
            <OrtListe />
        </main>
    )
}

export default Startseite;