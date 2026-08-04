import './Info.css'

function Info() {
    return (
        <div className="info-page bauhaus">
            <h1>Barrierefreiheit verstehen – Infoseite</h1>
            
            <p className="info-header-text">
                Diese Plattform hilft dir, barrierefreie Orte in Berlin zu finden – egal ob du selbst eine Beeinträchtigung 
                hast, Angehörige oder Freund:innen begleitest oder einfach mehr Komfort bei deinem nächsten Ausflug suchst. 
                Barrierefreiheit bedeutet für jeden Menschen etwas anderes: Was für eine Rollstuhlfahrerin wichtig ist, 
                unterscheidet sich stark von dem, was ein gehörloser Besucher oder eine Person mit Autismus braucht. Deshalb 
                arbeiten wir mit Badges – kleinen Kennzeichnungen, die genau zeigen, welche Art von Unterstützung ein Ort bietet.
            </p>
            
            <h2>So nutzt du die Seite</h2>
            <div className="card-container">
                <p>
                    <span>Orte finden</span><br/> Nutze die Kategorie-Filter (Freizeit, Kultur, Restaurant/Café, Gesundheit, Supermarkt, Sonstiges) 
                    und wähle zusätzlich die Badges aus, die für dich wichtig sind. Ein Ort erscheint nur, wenn er alle von dir ausgewählten Kriterien erfüllt.
                </p>
                <p>
                    <span>Details prüfen</span><br/> Auf jeder Ortsseite findest du die Beschreibung, alle vergebenen Badges sowie 
                    Nutzer:innen-Reviews. Reviews sind besonders wertvoll, da sie aktuelle Ersteinschätzungen und persönliche 
                    Erfahrungen widerspiegeln, die über offizielle Angaben hinausgehen.
                </p>
                <p>
                    <span>Vor dem Besuch</span><br/> Auch wenn ein Ort ein Badge trägt, empfehlen wir bei besonderen Bedürfnissen 
                    (z. B. sehr enge Zeitfenster, individuelle Unterstützung), vorher kurz anzurufen oder zu mailen. 
                    Öffnungszeiten für spezielle Angebote wie "ruhige Stunden" können sich ändern.
                </p>
                <p>
                    <span>Eigene Erfahrung teilen</span><br/> Warst du selbst an einem Ort und hast eine Einschätzung zur Barrierefreiheit? 
                    Schreib eine Review! Das hilft der ganzen Community, besonders bei Aspekten, die schwer offiziell zu erfassen sind 
                    (z. B. wie hilfsbereit das Personal wirklich ist).
                </p>
                <p className="hint">
                    <span>Wichtiger Hinweis</span><br/> Unsere Badges basieren auf den besten verfügbaren Informationen 
                    (offizielle Angaben, Recherche, Nutzer:innen-Feedback), erheben aber keinen Anspruch auf Vollständigkeit oder Aktualität 
                    in jedem Einzelfall. Bei Unsicherheit gilt: lieber einmal zu viel nachfragen.
                </p>
            </div>

            <div className="badges-container">
                <h1>Badges</h1>
                <h2>Mobilität und bauliche Barrierefreiheit</h2>
                <div className="mobility-badges">
                    <div>
                        <span>Stufenloser Eingang / Rampe:</span><br/> Der Ort ist ohne Treppen erreichbar – entweder ebenerdig oder über eine Rampe. 
                        Wichtig für Rollstuhlfahrer:innen, Menschen mit Rollator, Kinderwagen und alle mit Gehbeeinträchtigung. 
                        Achtet auf die Steigung: Eine sehr steile Rampe kann für manche Rollstuhlnutzer:innen trotzdem schwierig sein – falls bekannt, 
                        vermerken wir das in der Beschreibung.
                    </div>
                    <div>
                        <span>Aufzug vorhanden:</span><br/> Ein Aufzug bringt dich barrierefrei in obere Stockwerke oder tiefere Ebenen. Relevant für alle, die keine Treppen nutzen können.
                    </div>
                    <div>
                        <span>Barrierefreie Toilette:</span><br/> Eine Toilette mit ausreichend Bewegungsfläche, die seitlich mit dem Rollstuhl angefahren werden kann, 
                        mit Stützgriffen und unterfahrbarem Waschbecken ausgestattet ist.
                    </div>
                    <div>
                        <span>Behindertenparkplatz:</span><br/> Ein ausgewiesener, breiterer Parkplatz in der Nähe des Eingangs, meist mit Rollstuhlsymbol markiert. 
                        Wichtig für Menschen, die mit dem Auto anreisen und mehr Platz zum Ein-/Aussteigen benötigen.
                    </div>
                    <div>
                        <span>Ausreichend breite Türen (min. 80–90 cm):</span><br/> Türen, durch die ein Rollstuhl, Rollator oder Kinderwagen bequem passt. 
                        Der Richtwert orientiert sich an gängigen DIN-Normen für barrierefreies Bauen.
                    </div>
                </div>
                <h2>Sehen und Orientierung</h2>
                <div className="visual-badges">
                    <div>
                        <span>Blindenschrift (Braille):</span> Informationen (z. B. Speisekarten, Beschilderungen, Aufzugtasten) sind zusätzlich in ertastbarer Punktschrift verfügbar. Braille-Angebote 
                        sind in Deutschland noch selten – wenn ein Ort das anbietet, ist das ein besonderes Plus.
                    </div>
                    <div>
                        <span>Audioguides / Vorlesehilfen:</span> Der Ort bietet akustische Informationen an – etwa gesprochene Führungen, Hörstationen oder Personal, das Inhalte vorliest. 
                        Hilfreich für blinde und sehbehinderte Menschen sowie für Menschen mit Leseschwierigkeiten.
                    </div>
                    <div>
                        <span>Videoguides:</span> Videobasierte Erklärungen, oft mit zusätzlichen visuellen oder in Gebärdensprache übersetzten Inhalten – nützlich für unterschiedliche Zugangsbedürfnisse.
                    </div>
                    <div>
                        <span>Klare/einfache Orientierung:</span> Der Ort ist logisch aufgebaut, gut ausgeschildert und das Personal hilft aktiv bei der Orientierung. Wichtig für blinde und 
                        sehbehinderte Menschen, Menschen mit kognitiven Einschränkungen und alle, die sich in unübersichtlichen Gebäuden schwertun.
                    </div>
                    <div>
                        <span>Taktile Leitsysteme:</span> Ertastbare Bodenmarkierungen oder Handlaufsysteme, die blinden und sehbehinderten Menschen helfen, sich selbstständig 
                        zu orientieren – etwa Rillenplatten, die zum Ausgang oder zu wichtigen Punkten führen.
                    </div>
                    <div>
                        <span>Kontrastreiche Beschilderung:</span> Schilder mit starkem Hell-Dunkel-Kontrast und großer, gut lesbarer Schrift. Hilft Menschen mit Sehbehinderung, die noch Kontraste 
                        wahrnehmen können, aber keine feinen Details oder ähnliche Farbtöne unterscheiden.
                    </div>
                </div>

                <h2>Hören</h2>
                <div className="acoustic-badges">
                    <div>
                        <span>Induktionsschleife:</span> Eine technische Anlage, die Ton direkt und störungsfrei an Hörgeräte oder Cochlea-Implantate überträgt. Besonders wichtig an Kassen, Empfangstresen oder in Vortragsräumen.
                    </div>
                    <div>
                        <span>Gebärdensprache (Personal):</span> Mindestens eine Person vor Ort kann sich in Deutscher Gebärdensprache (DGS) verständigen, oder es werden Führungen/Termine mit Gebärdensprachdolmetscher:in angeboten.
                    </div>
                    <div>
                        <span>Untertitel bei Videoinhalten:</span> Alle gezeigten Videos (z. B. in Ausstellungen) sind mit Untertiteln versehen – wichtig für gehörlose und schwerhörige Menschen.
                    </div>
                    <div>
                        <span>Visuelle Alarme:</span> Optische Warnsysteme (z. B. Blitzlicht bei Feueralarm) ergänzen akustische Alarme, damit auch gehörlose Menschen im Notfall gewarnt werden.
                    </div>
                </div>

                <h2>Kognitive und sensorische Zugänglichkeit</h2>
                <div className="cognitive-badges">
                    <div>
                        <span>Leichte Sprache:</span> Informationen (Website, Broschüren, Beschilderung) sind zusätzlich in einfacher, verständlicher Sprache mit kurzen Sätzen verfügbar. Hilfreich für Menschen mit Lernschwierigkeiten, 
                        kognitiven Einschränkungen, Demenz oder auch für Menschen, die noch nicht so gut Deutsch sprechen.
                    </div>
                    <div>
                        <span>Sensorisch angepasste Öffnungszeiten (ruhige Stunden):</span> Zu festen Zeiten wird die Reizmenge bewusst reduziert: gedimmtes Licht, keine Musik/Durchsagen, weniger Besucher:innen. Oft auch "Stille Stunde" genannt. 
                        Diese Zeiten sind meist einmal wöchentlich oder monatlich und <span>variieren stark von Ort zu Ort</span> – prüft daher immer das genaue Datum/Uhrzeit auf der Ortsseite.
                    </div>
                    <div>
                        <span>Ruhige Zonen / reizarme Bereiche:</span> Der Ort verfügt dauerhaft (nicht nur zu bestimmten Zeiten) über Rückzugsorte mit weniger Reizen – etwa separate Räume oder ruhige Ecken.
                    </div>
                    <div>
                        <span>Geringe Menschenmengen/Lärmpegel:</span> Der Ort ist grundsätzlich eher ruhig und wenig besucht, unabhängig von speziellen Zeitfenstern. Hilfreich für Menschen, die sich in Menschenmengen oder bei viel Lärm schnell überfordert fühlen.
                    </div>
                </div>

                <h2>weitere wichtige Badges</h2>
                <div className="other-badges">
                    <div>
                        Assistenzhund erlaubt Assistenzhunde (z. B. Blindenführhunde, Signalhunde für Gehörlose) sind ausdrücklich willkommen, auch wenn sonst ein allgemeines Hundeverbot gilt. Das ist gesetzlich vorgeschrieben, 
                    aber leider nicht überall in der Praxis bekannt – deshalb heben wir es hier extra hervor.
                    </div>
                </div>
            </div>

            <h2>Was diese Badges nicht ersetzen können</h2>
            <p>
                Barrierefreiheit ist individuell. Ein Ort mit vielen Badges ist nicht automatisch für jede Person mit Behinderung geeignet, und ein Ort mit wenigen Badges kann trotzdem im Einzelfall gut funktionieren – zum Beispiel, wenn das Personal besonders hilfsbereit ist. Nutzt daher:
            </p>
            <ul>
                <li>die Beschreibung für Kontext,</li>
                <li>die Reviews für echte Erfahrungsberichte,</li>
                <li>und ruft im Zweifel an, besonders bei speziellen Bedürfnissen oder wenn ihr in einer Gruppe kommt.</li>
            </ul>
            <h2>Habt ihr Fragen oder Verbesserungsvorschläge?</h2>
            <p>
                Barrierefreiheit lebt vom Austausch. Wenn du einen Ort kennst, der ein Badge verdient hätte, ein Badge fehlerhaft vergeben wurde, oder du Vorschläge für weitere Badges hast – lass es uns wissen!
            </p>
        </div>
    )
}

export default Info