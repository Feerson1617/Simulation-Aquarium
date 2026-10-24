# R01–R03: eigener Prüfbericht

**Abschlussprüfung am 24.10.2026: R01, R02 und die internen Offline-Wechsel aus R03 sind im unten beschriebenen Umfang bestanden. Technische Empfehlung zur Abnahme des geprüften Web-Stands; keine pauschale Hardware- oder Unterrichtsfreigabe.**

Anwendungscode: `1ecd8d0909f8789a3394eb4a413156fd223aa843`. Branch `feature/coherent-learning-workspaces`, bestehender [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9), [öffentliche Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/). Kein Merge und keine direkte Änderung an `main`.

## Drei Restbefunde

| Befund | Stand | Eigener Nachweis |
|---|---|---|
| R01 – Historische CSV | bestanden | Beide unveränderten Originale, Chromium/WebKit, Desktop/Hochformat; insgesamt 32 wirkliche CSV-/SVG-Downloads. Sämtliche bekannten CSV-Messwerte gegen die Originaldaten verglichen, unbekannte Fischwerte leer und als unbekannt gekennzeichnet. Vergleichs-CSV, SVG und ungültige Datei geprüft. |
| R02 – Bedienposition | bestanden | Tastatur, Maus und Touch. Auswahl bleibt gesetzt; Fokus bleibt am Feld, Feldposition weicht höchstens drei Pixel ab. Keine globale Scrollsperre. |
| R03 – Interne Offline-Wechsel | bestanden | Tatsächlich heruntergeladene HTML-Datei nach HTTP-Start offline: alle sechs Missionen und übrigen Ansichten erreichbar, M1/M3 vollständig, wiederholte Wechsel und History in beiden Engines. Keine HTTP-Anforderung nach dem Offlineschalter. Datei- und Hardwaregrenzen unten separat. |

[Unveränderte Vorher-/Nachher-Bilder](REVIEW.html), [Dateiindex mit Prüfsummen](reports/evidence-index.json), [technische Begründung](TECHNIK.md).

## Abgeschlossene Prüfungen

- **201 Modultests, 0 Fehler, 0 übersprungene Tests:** [vollständiges Protokoll](reports/module-tests.txt). Historische Null-/Unbekannt-Semantik und gemischte Datenreihen sind ausdrücklich abgedeckt.
- **Historischer Leser in beiden Engines:** [Chromium](reports/reader-chromium.json), [WebKit](reports/reader-webkit.json). Echte Dateiöffner und Downloads; SVG als XML geprüft; Originale bytegleich belassen. [Tatsächliche CSV Klasse 8](downloads/webkit-desktop-grade8-changed.csv), [Kontrolle Klasse 9](downloads/webkit-desktop-grade9-initial.csv).
- **Alle sechs regulären Missionen in Chromium und WebKit:** jeweils 19 zusammenfassende Prüfpunkte und 110 Aufnahmen, [Chromium](reports/missions-chromium.json), [WebKit](reports/missions-webkit.json). Falsche Antworten, gestufte Hilfen, Pause, Vergleich ab echtem Reset, Wiederholung, gespeicherte Durchgänge und eigene Datei-Rückkehr; keine Seiten- oder Ressourcenfehler. Ein technischer Abschluss belegt keine Unterrichtswirksamkeit.
- **Frei forschen 8/9/10:** [Bericht](reports/research-webkit.json). Katalog, Pflege, Wasser/Licht/Zeit, Messung, echte Platzierung, Speichern/Laden, getrennte Speicherplätze und Datei-Rettung bei simuliertem Speicherfehler.
- **Tutorial und freier Expertenbetrieb in Chromium:** [Bericht](reports/readiness-chromium.json). Alle acht Tutorialschritte, Kauf/Katalog, Aquariumplatzierung, reale Modelle, Wasserwerte, Zeit, Export und Import in frischem Profil sowie Touch-Hochformat.
- **Fünf vorbereitete Szenarien und 14 unveränderte historische Aquariumdateien:** [19 Prüfpunkte](reports/operations-webkit.json). Tatsächliche Objekte/Positionen, eigener Szenariospeicher, unveränderte Biologie und Individuen beim Wiederöffnen; keine erfundenen neuen Missionsabschlüsse.
- **Zwölf frühere echte Missionsexporte:** [Bericht](reports/previous-products-webkit.json). Je sechs frühere Chromium-/WebKit-Ergebnisse über den Dateiöffner geladen und tatsächlich erneut heruntergeladen. Gesamte JSON-Produkte inhaltlich gleich; komprimierte Originaldownloads unter `downloads/previous-…`.
- **Freie Fortpflanzung:** [Bericht](reports/genetics-webkit.json). Reale Käufe, AA×aa/F1, tatsächliche gereifte F1-Eltern und zufällige F2, zwei Merkmale bei Platys, Eiablage und Schlupf. Vorbereitete reife Experten-Testumgebung, keine gefälschte Schülermission. Der optionale Wechsel zur höchsten Grafikstufe wurde ausdrücklich übersprungen; geprüft wurde die iPad-Grafikstufe, keine neue Grafikfreigabe.
- **Ökosystemanalyse und Geräte:** [Bericht](reports/expert-tools-webkit.json). Alle sechs Analysetabs verwenden denselben tatsächlichen Zustand. Filter, Licht und Temperatur über sichtbare Geräte geändert und wieder geladen; kein erfundener Zeitschritt oder vorgezogene biologische Reaktion. Fokus bleibt erreichbar.
- **Pinzette und reale Szenentreffer:** [15 bestandene Prüfungen](reports/tweezers-chromium.json) in Chromium, 1366×960, 768×1024 und 1366×1024. Je Format echte freie Platzierung und absichtliche Kollision mit Maus und Touch sowie Speichern, Laden, Export und Reimport der tatsächlichen Positionen.
- **Ansichtslebenszyklus:** [Chromium](reports/lifecycle-chromium.json), [WebKit](reports/lifecycle-webkit.json). Während laufender M2 über Browser-Zurück verlassen: gespeicherte Bytes bleiben beim Warten unverändert. Vorwärts stellt denselben Versuch und Modelltag angehalten wieder her. Einmalige Fortsetzung erhöht die Timerzahl um genau eins; Rückkehr entsorgt die alte Ansicht.
- **Direkter lokaler Dateistart:** [WebKit bestanden](reports/native-file-webkit.json), M1 → M6 → Auswahl → Browser-Zurück mit tatsächlichem JSON-Export; keine HTTP-Zugriffe. [Chromium durch verwaltete Richtlinie blockiert](reports/native-file-chromium.json), daher dort nicht erfolgreich geprüft.
- **Öffentliche PR-Vorschau:** [Bericht](reports/public-browser.json). Normale Links und Direktzugänge der sechs Missionen, tatsächliche CSV mit Inhaltsprüfung, stabile Messwertauswahl, keine zusätzliche Standalone-Rahmung auf der Website.

## R03: tatsächliche Einzeldatei und Netzsperre

| Prüfung | Status | Nachweis |
|---|---|---|
| Chromium, Browserkontext offline | bestanden | [Vollständiger Bericht](reports/offline-chromium.json): M1/M3 einschließlich Fehlantworten, Hilfen, Wiederholung, echten Datei-Exporten und Reimporten; M2/M4/M5/M6 über sichtbare Menüs; Forschermodi 8/9/10 mit tatsächlichem Tagesfortschritt und JSON; Experte, Tutorial, beide historischen CSV, erneuter bytegleicher HTML-Download. |
| WebKit, Browserkontext offline | bestanden | [Strikter Bericht](reports/offline-webkit-strict.json): alle genannten Ansichten, M1/M3 vollständig mit Fehlantworten, Hilfe und tatsächlichen Downloads, Browser-Zurück/Vorwärts und wiederholte Wechsel. 0 HTTP-Anfragen nach dem Schalter; 0 Seiten-, Konsolen- oder Anfragefehler. |
| WebKit, HTTP/HTTPS vollständig gesperrt | bestanden | [Zusätzlicher vollständiger Bericht](reports/offline-webkit.json): voller M1/M3-Weg einschließlich tatsächlicher Datei-Rückkehr und historischer Importe; alle Modi, JSON/CSV und erneuter bytegleicher HTML-Download. Kein versuchter HTTP-/HTTPS-Zugriff. Dieser Lauf ist ausdrücklich nicht der Browser-Offlineschalter. |
| Wiederholte Wechsel / Speicherfehler | bestanden | Chromium und WebKit: genau ein aktueller Spielrahmen und höchstens ein WebGL-Kontext, identische Ressourcenbestände nach wiederholtem gleichem Einstieg, entsorgte alte Ansichten. Bei künstlich ausgelöstem Quotenfehler bleibt die Ansicht mit unveränderten gespeicherten Daten erhalten; echte Notfalldatei und erfolgreicher erneuter Wechsel nach Aufheben des Fehlers. Keine künstlichen Schülerergebnisse. |
| Lokale Datei, WebKit | bestanden | [Nativer Datei-Test](reports/native-file-webkit.json), vollständiger Dateipfad statt HTTP, reale Auswahl und JSON-Download, interne Rückkehr und History. |
| Lokale Datei, Chromium | nicht geprüft | Der Versuch wird schon beim ersten file:-Dokument durch die verwaltete Browserrichtlinie blockiert; [Originalfehler](reports/native-file-chromium.json). Keine Anwendungsaussage daraus ableiten. |
| Dateiöffner bei WebKit-Offlineschalter | fehlgeschlagen – Testumgebung | Der Linux-WebKit-Schalter blockiert lokale File/Blob-Lesevorgänge auch ohne Aquariumcode. Unabhängig reproduziert; getrennte HTTP-Sperre und nativer Datei-Test decken die Anwendungswege zusätzlich ab. |

Der zunächst geprüfte Vorgänger b806579 stürzte beim erneuten HTML-Download in Chromium mit einem V8-Speicherfehler ab. Der [fehlgeschlagene Originalbericht](reports/development-b806579-offline-chromium.json) bleibt erhalten. Die endgültige Datei bewahrt stattdessen ihre bereits geladenen Bytes als Blob auf; ihr wiederholter Download ist in beiden vollständigen Endläufen bytegleich geprüft. Die früheren erfolgreichen Teilprüfungen dieses Vorgängers werden nicht als Endprüfung der neuen Datei ausgegeben.

Die vier in den abschließenden Offline-Läufen tatsächlich heruntergeladenen historischen CSV-Dateien wurden zusätzlich unabhängig gegen die beiden Originaldateien ausgewertet: [Zahlen-, Einheiten- und Herkunftsabgleich](reports/offline-csv-independent.json).

Die Rohberichte nennen Browser-Version, Handlungen, Einzeldatei-Hash, Zeitpunkt, Netzanforderungen und Ressourcen-Snapshots. Screenshots in der Galerie bleiben unveränderte Browseraufnahmen. Die Messzahlen sind Ressourcenregistrierungen der aktuellen Ansicht, kein Beweis einer bestimmten nativen RAM-/GPU-Belegung.

## Kurze Handlungen zur eigenen Nachprüfung

1. **R01/R02:** Missionsauswahl → Lehrkraftbereich → historische Werkzeuge. `tests/fixtures/learning-v1-grade-8.json` über den Dateiöffner laden. Zur eigenen Messreihe scrollen, Sauerstoff wählen und CSV sowie SVG speichern. Danach mit Tastatur oder Touch „Lebende Fische · historisch unbekannt“ wählen: Feld/Fokus bleiben sichtbar; Tabelle und CSV enthalten keine erfundene Fischzahl. CSV erneut speichern. Klasse 9 ebenso prüfen; anschließend ungültige JSON öffnen: Die vorherige Produktansicht muss verschwinden.
2. **R03:** Im Expertenbereich über „Zeit & Runde → HTML herunterladen“ eine Einzeldatei erzeugen, über einen lokalen HTTP-Server laden und M1 vollständig starten lassen. Erst dann den Browserkontext offline setzen. M1 mit Lichtlauf, Rücksetzung auf denselben Anfang und Dunkellauf auswerten; eine Fehlantwort und Hilfe ausprobieren, Ergebnisdatei speichern. Über Missionsauswahl M3 öffnen, ein dunkles und ein helles Tier als Eltern auswählen, F1 beobachten, echte F1-Eltern für F2 wählen und das Ergebnis auswerten/sichern. Alle anderen Missionen, drei Forschungsjahrgänge, Experte, Tutorial und historische Werkzeuge über die sichtbaren Menüs aufrufen. Zurück/Vorwärts und mehrfache Wiederholung ausprobieren. Netzwerkprotokoll muss nach dem Abschalten ohne HTTP-Anforderung bleiben.
3. **Datensicherheit:** Einen laufenden Beobachtungsversuch verlassen und später zurückkehren. Er muss am gesicherten Zeitpunkt angehalten bleiben. Wiederaufnahme darf nur einen Simulationsprozess starten. Die automatisierte Speicherfehler-Probe löst ausschließlich einen Schreibfehler aus; sie verändert keine Messdaten oder Abschlusszustände.

## Herkunft und Prüfumfang

Der [automatische Vergleich der aufgezeichneten Quellhashes](reports/test-source-epochs.json) bestätigt die folgenden Prüfstände. Die regulären Sechs-Missionsläufe begannen bei `9503d1c`; spätere Anwendungsänderungen betreffen ausschließlich den dabei nicht verwendeten Standalone-Bündler beziehungsweise Host. Die geprüften Missionsberechnungen, Inhalte, Steuerungen und die normale Darstellung sind bytegleich geblieben. Die endgültigen Reader-Prüfungen liefen bei `e8b9850`; danach wurde der Reader nicht mehr verändert. Die fertige Einzeldatei und ihre neuen Endprüfungen beziehen sich auf `1ecd8d0`. Spätere Dokumentations-/Testcommits ändern diesen Anwendungscode nicht.

Der [Quellvergleich](reports/protected-sources.json) überprüft geschützte Modelle und Inhalte. `index.html` unterscheidet sich vom akzeptierten Ausgang ausschließlich durch die zwei Navigations-/Entsorgungshooks samt Kommentar; die biologische Berechnung darin wurde nicht umgeschrieben. Originaldateien, Artenmodelle und Spielstände wurden nicht für gewünschte Ergebnisse verändert.

Die Einzeldatei wurde über die echte Spiel-Schaltfläche heruntergeladen: [Downloadnachweis](reports/standalone-download.json). **151.594.853 Bytes**, SHA-256 `ea1bd887f8f301d079fb7636c72fd6ec60a83695045b56f79badd43e8f1e1666`. Sie bleibt außerhalb Git.

## Offene Probleme und Grenzen nach Auswirkung

**Keine offene, in der abschließenden Prüfung reproduzierte Anwendungsregression zu R01–R03.** Die folgenden Grenzen bleiben ausdrücklich bestehen:

- **Hohe Bedeutung für eine schulweite Gerätefreigabe, nicht geprüft:** physische Schul-iPads und reale Lerngruppen. Die Softwareprüfung kann weder die Stabilität auf älteren Geräten noch den tatsächlichen Lernerfolg belegen. Vor flächigem Einsatz den geprüften Stand auf den vorhandenen Geräten und in einer Unterrichtsstunde abnehmen.
- **Mittlere Bedeutung für den Einzeldatei-Einsatz:** rund 151,6 MB HTML und zusätzlicher Lade-/Wechselspeicher. Keine Leistungsfreigabe für alte Tablets oder die höchste Grafikstufe. Die normale Website benötigt den neuen Standalone-Host nicht.
- **Begrenzte Testumgebungsprobleme:** nativer Chromium-Dateistart durch Verwaltung gesperrt; WebKit-Dateiöffner beim synthetischen Offlineschalter nicht lesbar. Beide sind oben mit eigenen Berichten und ergänzenden tatsächlichen Anwendungsprüfungen ausgewiesen.

## Technische Empfehlung

Ich empfehle den geprüften Stand zur technischen Abnahme von R01–R03 und zur anschließenden Sichtprüfung auf den vorhandenen Schulgeräten. Die sechs Lernwege, historischen Daten und angrenzenden Spielwege sind im dokumentierten Browserumfang funktionsfähig. Eine uneingeschränkte Freigabe für alle iPads oder eine empirisch bestätigte Unterrichtswirkung wird nicht behauptet. PR #9 bleibt offen; `main` wurde nicht verändert und kein Merge ausgeführt.

## Weitere genaue Prüfgrenzen

- **WebKit-Datei-API bei gesetztem Offline-Schalter:** Eine unabhängige Minimal-Seite ohne Aquariumcode reproduziert den Lesefehler für dieselbe unveränderte lokale Datei; [Probe](reports/webkit-file-api-limitation.json). Ein zusätzlicher Lauf blockiert sämtliche HTTP-/HTTPS-Zugriffe und prüft dort die tatsächliche Datei-Rückkehr. Diese beiden Prüfverfahren werden nicht miteinander gleichgesetzt.
- **Lokaler Chromium-Dateistart:** Die verwaltete Browserrichtlinie sperrt bereits `file:` mit `ERR_BLOCKED_BY_ADMINISTRATOR`. Kein erfolgreicher Chromium-Dateistart behauptet, keine Richtlinie umgangen. Der direkte WebKit-Dateistart ist dagegen bestanden.
- **Physische iPads, reale Lerngruppe und höchste Grafikstufe:** nicht geprüft. Touch-Ereignisse stammen aus Browserautomatisierung unter Linux mit Softwaregrafik. Die große Einzeldatei benötigt merklich Speicher; eine Eignung für ältere Schul-iPads ist damit nicht belegt.
- **Offline-Grenze:** Interne Wechsel in einer vollständig geladenen Datei sind Gegenstand von R03. Ein vollständiges HTTP-Neuladen ohne Netz und das Offline-Öffnen externer Unterrichtsquellen werden nicht zugesagt.

## Reproduzieren

Bei laufendem statischem Projektserver:

```sh
node --test tests/*.test.mjs
python3 tests/release_reader_browser.py
python3 tests/final_missions_browser.py
python3 tests/single_research_browser.py
python3 tests/readiness_browser.py
python3 tests/final_tweezers_browser.py
python3 tests/final_operations_browser.py
python3 tests/release_previous_products_browser.py
```

`AQUARIUM_URL` wählt die normale Website. `AQUARIUM_BROWSER=webkit` und `AQUARIUM_WEBKIT` wählen eine vorhandene WebKit-Installation. Die große HTML-Datei zuerst tatsächlich im Expertenbereich über **Zeit & Runde → HTML herunterladen** erzeugen und unverändert lokal bereitstellen.

```sh
AQUARIUM_OFFLINE_HTML=/pfad/Aquarium.html AQUARIUM_OFFLINE_URL=http://127.0.0.1:8000/einzeldatei/ python3 tests/release_standalone_browser.py
AQUARIUM_OFFLINE_HTML=/pfad/Aquarium.html python3 tests/release_native_file_browser.py
python3 tests/release_navigation_lifecycle_browser.py
```

Für Linux-WebKit zusätzlich `tests/release_offline_context_browser.py` mit gesetztem Offlineschalter und `AQUARIUM_OFFLINE_TRANSPORT=http-block` beim vollständigen `release_standalone_browser.py`. Tests schreiben ausschließlich in isolierte Browserprofile. Snapshots lesen reale Zustände; Schülerfortschritt wird durch tatsächliche Oberflächenhandlungen erzeugt.
