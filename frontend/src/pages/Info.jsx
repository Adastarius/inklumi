import './Info.css'
import {
    ElevatorIcon, ParkingIcon, DoorIcon,
    BrailleIcon, AudioIcon, VideoIcon, SignpostIcon, TactileIcon, ContrastIcon,
    InductionLoopIcon, SignLanguageIcon, SubtitlesIcon, AlarmIcon,
    EasyLanguageIcon, QuietHoursIcon, LowCrowdIcon,
    SearchIcon, ChecklistIcon, PhoneIcon, EditIcon,
} from '../components/BadgeIcons'
import { TriangleRight, Dog, Toilet, AudioLines } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
    {
        icon: SearchIcon,
        title: "Orte finden",
        text: `Nutze die Kategorie-Filter (Freizeit, Kultur, Restaurant/Café, Gesundheit, Supermarkt, Sonstiges) 
            und wähle zusätzlich die Badges aus, die für dich wichtig sind. Ein Ort erscheint nur, wenn er alle von dir ausgewählten Kriterien erfüllt.`
    },
    {
        icon: ChecklistIcon,
        title: "Details prüfen",
        text: `Auf jeder Ortsseite findest du die Beschreibung, alle vergebenen Badges sowie 
            Nutzer:innen-Reviews. Reviews sind besonders wertvoll, da sie aktuelle Ersteinschätzungen und persönliche 
            Erfahrungen widerspiegeln, die über offizielle Angaben hinausgehen.`
    },
    {
        icon: PhoneIcon,
        title: "Vor dem Besuch anrufen",
        text: `Auch wenn ein Ort ein Badge trägt, empfehlen wir bei besonderen Bedürfnissen 
            (z. B. sehr enge Zeitfenster, individuelle Unterstützung), vorher kurz anzurufen oder zu mailen. 
            Öffnungszeiten für spezielle Angebote wie "ruhige Stunden" können sich ändern.`
    },
    {
        icon: EditIcon,
        title: "Eigene Erfahrung teilen",
        text: `Warst du selbst an einem Ort und hast eine Einschätzung zur Barrierefreiheit? 
            Schreib eine Review! Das hilft der ganzen Community, besonders bei Aspekten, die schwer offiziell zu erfassen sind 
            (z. B. wie hilfsbereit das Personal wirklich ist).`
    }
]

const badgeCategories = [
    {
        id: "mobilitaet",
        title: "Mobilitätsbeeinträchtigung",
        open: true,
        badges: [
            { icon: TriangleRight, title: "Stufenloser Eingang / Rampe", text: `Der Ort ist ohne Treppen erreichbar – entweder ebenerdig oder über eine Rampe. 
                Wichtig für Rollstuhlfahrer:innen, Menschen mit Rollator, Kinderwagen und alle mit Gehbeeinträchtigung. 
                Achtet auf die Steigung: Eine sehr steile Rampe kann für manche Rollstuhlnutzer:innen trotzdem schwierig sein – falls bekannt, 
                vermerken wir das in der Beschreibung.` },
            {
                icon: ElevatorIcon, title: "Aufzug vorhanden", text: `Ein Aufzug bringt dich barrierefrei in obere Stockwerke oder tiefere Ebenen. 
                Relevant für alle, die keine Treppen nutzen können.`
            },
            {
                icon: Toilet, title: "Barrierefreie Toilette", text: `Eine Toilette mit ausreichend Bewegungsfläche, die seitlich mit dem Rollstuhl angefahren werden kann, 
                        mit Stützgriffen und unterfahrbarem Waschbecken ausgestattet ist.`
            },
            {
                icon: ParkingIcon, title: "Behindertenparkplatz", text: `Ein ausgewiesener, breiterer Parkplatz in der Nähe des Eingangs, meist mit Rollstuhlsymbol markiert. 
                        Wichtig für Menschen, die mit dem Auto anreisen und mehr Platz zum Ein-/Aussteigen benötigen.`
            },
            {
                icon: DoorIcon, title: "Ausreichend breite Türen (min. 80–90 cm)", text: `Türen, durch die ein Rollstuhl, Rollator oder Kinderwagen bequem passt. 
                        Der Richtwert orientiert sich an gängigen DIN-Normen für barrierefreies Bauen.`
            }
        ],
    },
    { id: "sehen",
        title: "Sehbehinderung",
        badges: [
            {
                icon: BrailleIcon, title: "Blindenschrift (Braille)", text: `Informationen (z. B. Speisekarten, Beschilderungen, Aufzugtasten) 
                sind zusätzlich in ertastbarer Punktschrift verfügbar. Braille-Angebote 
                sind in Deutschland noch selten – wenn ein Ort das anbietet, ist das ein besonderes Plus.`
            },
            {
                icon: AudioIcon, title: "Audioguides / Vorlesehilfen", text: `Der Ort bietet akustische Informationen an – etwa gesprochene Führungen, 
                Hörstationen oder Personal, das Inhalte vorliest. 
                Hilfreich für blinde und sehbehinderte Menschen sowie für Menschen mit Leseschwierigkeiten.`
            },
            {
                icon: SignpostIcon, title: "Klare/einfache Orientierung", text: `Der Ort ist logisch aufgebaut, gut ausgeschildert und 
                das Personal hilft aktiv bei der Orientierung. Wichtig für blinde und 
                sehbehinderte Menschen, Menschen mit kognitiven Einschränkungen und alle, die sich in unübersichtlichen Gebäuden schwertun.`
            },
            {
                icon: TactileIcon, title: "Taktile Leitsysteme", text: `Ertastbare Bodenmarkierungen oder Handlaufsysteme, die blinden und sehbehinderten Menschen
                helfen, sich selbstständig 
                zu orientieren – etwa Rillenplatten, die zum Ausgang oder zu wichtigen Punkten führen.`
            },
            {
                icon: ContrastIcon, title: "Kontrastreiche Beschilderung", text: `Schilder mit starkem Hell-Dunkel-Kontrast und großer, gut lesbarer Schrift. 
                Hilft Menschen mit Sehbehinderung, die noch Kontraste 
                wahrnehmen können, aber keine feinen Details oder ähnliche Farbtöne unterscheiden.`
            }
        ]
    },
    {
        id: "hoeren",
        title: "Hörbehinderung",
        badges: [
            {
                icon:InductionLoopIcon, title: "Induktionsschleife", text: `Eine technische Anlage, die Ton direkt und störungsfrei an Hörgeräte 
                oder Cochlea-Implantate überträgt. Besonders wichtig an Kassen, Empfangstresen oder in Vortragsräumen.`
            },
            {
                icon: SignLanguageIcon, title: "Gebärdensprache (Personal)", text: `Mindestens eine Person vor Ort kann sich in Deutscher Gebärdensprache (DGS) 
                verständigen, oder es werden Führungen/Termine mit Gebärdensprachdolmetscher:in angeboten.`
            },
            {
                icon: SubtitlesIcon, title: "Untertitel bei Videoinhalten", text: `Alle gezeigten Videos (z. B. in Ausstellungen) 
                sind mit Untertiteln versehen – wichtig für gehörlose und schwerhörige Menschen.`
            },
            {
                icon: AlarmIcon, title: "Visuelle Alarme", text: `Optische Warnsysteme (z. B. Blitzlicht bei Feueralarm) ergänzen akustische Alarme, 
                damit auch gehörlose Menschen im Notfall gewarnt werden.`
            },
            {
                icon: VideoIcon, title:"Videoguides", text: `Videobasierte Erklärungen, oft mit zusätzlichen visuellen oder in Gebärdensprache 
                übersetzten Inhalten – nützlich für unterschiedliche Zugangsbedürfnisse.`
            },
        ]
    },
    {
        id: "kognitiv",
        title: "Kognitive Beeinträchtigung und psychische Erkrankung",
        badges: [
            {
                icon: EasyLanguageIcon, title: "Leichte Sprache", text: `Informationen (Website, Broschüren, Beschilderung) sind zusätzlich in einfacher, 
                verständlicher Sprache mit kurzen Sätzen verfügbar. Hilfreich für Menschen mit Lernschwierigkeiten, 
                kognitiven Einschränkungen, Demenz oder auch für Menschen, die noch nicht so gut Deutsch sprechen.`
            },
            {
                icon: QuietHoursIcon, title: "Sensorisch angepasste Öffnungszeiten (ruhige Stunden)", text: `Zu festen Zeiten wird 
                die Reizmenge bewusst reduziert: gedimmtes Licht, keine Musik/Durchsagen, weniger Besucher:innen. Oft auch "Stille Stunde" genannt. 
                Diese Zeiten sind meist einmal wöchentlich oder monatlich und variieren stark von Ort zu Ort – prüft daher immer das genaue Datum/Uhrzeit auf der Ortsseite.`
            },
            {
                icon: AudioLines, title: "Ruhige Zonen / reizarme Bereiche", text: `Der Ort verfügt dauerhaft (nicht nur zu bestimmten Zeiten) 
                über Rückzugsorte mit weniger Reizen – etwa separate Räume oder ruhige Ecken.`
            },
            {
                icon: LowCrowdIcon, title: "Geringe Menschenmengen/Lärmpegel", text: `Der Ort ist grundsätzlich eher ruhig und wenig besucht, 
                unabhängig von speziellen Zeitfenstern. Hilfreich für Menschen, die sich in Menschenmengen oder bei viel Lärm schnell überfordert fühlen.`
            }
        ]
    },
    {
        id: "weitere",
        title: "weitere wichtige Badges",
        badges: [
            {
                icon: Dog, title: "Assistenzhund erlaubt", text: `Assistenzhunde (z. B. Blindenführhunde, Signalhunde für Gehörlose) 
                sind ausdrücklich willkommen, auch wenn sonst ein allgemeines Hundeverbot gilt. Das ist gesetzlich vorgeschrieben, 
                aber leider nicht überall in der Praxis bekannt – deshalb heben wir es hier extra hervor.`
            }
        ]
    }
]

function BadgeCategory({ category }) {
    return (
        <details className="badge-category" open={category.open}>
            <summary>
                <span className="badge-category-title">{category.title}</span>
                <span className="badge-count">{category.badges.length}</span>
            </summary>
            <div className="badge-grid">
                {category.badges.map((b) => {
                    const BadgeIcon = b.icon
                    return (
                        <div className="badge-card" key={b.title}>
                            <div className="badge-card-header">
                                <div className="badge-icon"><BadgeIcon /></div>
                                <p className="badge-title">{b.title}</p>
                            </div>
                                <p className="badge-text">{b.text}</p>
                        </div>
                    )
                })}
            </div>
        </details>
    )
}

function Info() {
    return (
        <main>
            <div className="info-page">
                <h1>Barrierefreiheit – Infoseite</h1>
                
                <p className="info-header-text">
                    Diese Plattform hilft dir, barrierefreie Orte in Berlin zu finden – egal ob du selbst eine Beeinträchtigung 
                    hast, Angehörige oder Freund:innen begleitest oder einfach mehr Komfort bei deinem nächsten Ausflug suchst.
                    Barrierefreiheit bedeutet für jeden Menschen etwas anderes: Was für eine Rollstuhlfahrerin wichtig ist, 
                    unterscheidet sich stark von dem, was ein gehörloser Besucher oder eine Person mit Autismus braucht. Deshalb 
                    arbeiten wir mit Badges – kleinen Kennzeichnungen, die genau zeigen, welche Art von Unterstützung ein Ort bietet.
                </p>
                
                <h2>So nutzt du die Seite</h2>
                <ol className="steps">
                    {steps.map((step, i) => {
                        const StepIcon = step.icon
                        return (
                            <li className="step" key={step.title}>
                                <div className="step-icon"><StepIcon /></div>
                                <div>
                                    <p className="step-title"><span className="step-number">{i + 1}</span>{step.title}</p>

                                    <p className="step-text">{step.text}</p>
                                </div>
                            </li>
                        )
                    })}
                </ol>
                    
                
                <section className="badges-container" aria-labelledby="badges-heading">
                    <h2 id="badges-heading">Badges im Überblick</h2>
                    <p className="badges-intro">Klicke eine Kategorie an, um die zugehörigen Badges anzuzeigen.</p>

                    {badgeCategories.map((category) => (
                        <BadgeCategory category={category} key={category.id} />
                    ))}
                </section>

                <h2>Was diese Badges nicht ersetzen können</h2>
                <p className="bottom-text">
                    Barrierefreiheit ist individuell. Ein Ort mit vielen Badges ist nicht automatisch für jede Person mit Behinderung geeignet, und ein Ort mit wenigen Badges kann trotzdem im Einzelfall gut funktionieren – zum Beispiel, wenn das Personal besonders hilfsbereit ist. Nutzt daher:
                </p>
                <ul className="bottom-list">
                    <li>die Beschreibung für Kontext,</li>
                    <li>die Reviews für echte Erfahrungsberichte,</li>
                    <li>und ruft im Zweifel an, besonders bei speziellen Bedürfnissen oder wenn ihr in einer Gruppe kommt.</li>
                </ul>
                <p className="hint">
                    Wichtiger Hinweis: Unsere Badges basieren auf den besten verfügbaren Informationen 
                    (offizielle Angaben, Recherche, Nutzer:innen-Feedback), erheben aber keinen Anspruch auf Vollständigkeit oder Aktualität 
                    in jedem Einzelfall. Bei Unsicherheit gilt: lieber einmal zu viel nachfragen.
                </p>
                <h2>Habt ihr Fragen oder Verbesserungsvorschläge?</h2>
                <p>
                    Barrierefreiheit lebt vom Austausch. Wenn du einen Ort kennst, der ein Badge verdient hätte, ein Badge fehlerhaft vergeben wurde, oder du Vorschläge für weitere Badges hast – <Link to="/kontakt">lass es uns wissen</Link>!
                </p>
            </div>
        </main>
    )
}

export default Info