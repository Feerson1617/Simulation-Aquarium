# R01–R03: eigener Prüfbericht

**Zwischenstand: Die vollständige Endprüfung läuft noch. Keine Abschlussfreigabe aus diesem Zwischenbericht ableiten.**

Anwendungscode: `b806579b894de5d6a8ad23057eed7b6bfc46a0fe`. Branch `feature/coherent-learning-workspaces`, bestehender [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9), [öffentliche Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/). Kein Merge und keine direkte Änderung an `main`.

## Drei Restbefunde

| Befund | Stand | Eigener Nachweis |
|---|---|---|
| R01 – Historische CSV | bestanden | Beide unveränderten Originale, Chromium/WebKit, Desktop/Hochformat; insgesamt 32 wirkliche CSV-/SVG-Downloads. Sämtliche bekannten CSV-Messwerte gegen die Originaldaten verglichen, unbekannte Fischwerte leer und als unbekannt gekennzeichnet. Vergleichs-CSV, SVG und ungültige Datei geprüft. |
| R02 – Bedienposition | bestanden | Tastatur, Maus und Touch. Auswahl bleibt gesetzt; Fokus bleibt am Feld, Feldposition weicht höchstens drei Pixel ab. Keine globale Scrollsperre. |
| R03 – Interne Offline-Wechsel | noch in Endprüfung | Strikter Offlineschalter und zusätzliche vollständige HTTP-Sperre werden getrennt protokolliert. Endberichte folgen nach Abschluss aller Wege. |

[Unveränderte Vorher-/Nachher-Bilder](REVIEW.html), [Dateiindex mit Prüfsummen](reports/evidence-index.json), [technische Begründung](TECHNIK.md).

## Abgeschlossene Prüfungen

- **201 Modultests, 0 Fehler, 0 übersprungene Tests:** [vollständiges Protokoll](reports/module-tests.txt). Historische Null-/Unbekannt-Semantik und gemischte Datenreihen sind ausdrücklich abgedeckt.
- **Historischer Leser in beiden Engines:** [Chromium](reports/reader-chromium.json), [WebKit](reports/reader-webkit.json). Echte Dateiöffner und Downloads; SVG als XML geprüft; Originale bytegleich belassen. [Tatsächliche CSV Klasse 8](downloads/webkit-desktop-grade8-changed.csv), [Kontrolle Klasse 9](downloads/webkit-desktop-grade9-initial.csv).
- **Alle sechs regulären Missionen in WebKit:** [110 Aufnahmen und vollständige Handlungsfolge](reports/missions-webkit.json). Falsche Antworten, gestufte Hilfen, Pause, Vergleich ab echtem Reset, Wiederholung, gespeicherte Durchgänge und eigene Datei-Rückkehr; keine Seiten- oder Ressourcenfehler. Ein technischer Abschluss belegt keine Unterrichtswirksamkeit.
- **Frei forschen 8/9/10:** [Bericht](reports/research-webkit.json). Katalog, Pflege, Wasser/Licht/Zeit, Messung, echte Platzierung, Speichern/Laden, getrennte Speicherplätze und Datei-Rettung bei simuliertem Speicherfehler.
- **Tutorial und freier Expertenbetrieb in Chromium:** [Bericht](reports/readiness-chromium.json). Alle acht Tutorialschritte, Kauf/Katalog, Aquariumplatzierung, reale Modelle, Wasserwerte, Zeit, Export und Import in frischem Profil sowie Touch-Hochformat.
- **Fünf vorbereitete Szenarien und 14 unveränderte historische Aquariumdateien:** [19 Prüfpunkte](reports/operations-webkit.json). Tatsächliche Objekte/Positionen, eigener Szenariospeicher, unveränderte Biologie und Individuen beim Wiederöffnen; keine erfundenen neuen Missionsabschlüsse.
- **Zwölf frühere echte Missionsexporte:** [Bericht](reports/previous-products-webkit.json). Je sechs frühere Chromium-/WebKit-Ergebnisse über den Dateiöffner geladen und tatsächlich erneut heruntergeladen. Gesamte JSON-Produkte inhaltlich gleich; komprimierte Originaldownloads unter `downloads/previous-…`.
- **Freie Fortpflanzung:** [Bericht](reports/genetics-webkit.json). Reale Käufe, AA×aa/F1, tatsächliche gereifte F1-Eltern und zufällige F2, zwei Merkmale bei Platys, Eiablage und Schlupf. Vorbereitete reife Experten-Testumgebung, keine gefälschte Schülermission. Der optionale Wechsel zur höchsten Grafikstufe wurde ausdrücklich übersprungen; geprüft wurde die iPad-Grafikstufe, keine neue Grafikfreigabe.
- **Ökosystemanalyse und Geräte:** [Bericht](reports/expert-tools-webkit.json). Alle sechs Analysetabs verwenden denselben tatsächlichen Zustand. Filter, Licht und Temperatur über sichtbare Geräte geändert und wieder geladen; kein erfundener Zeitschritt oder vorgezogene biologische Reaktion. Fokus bleibt erreichbar.
- **Öffentliche PR-Vorschau:** [Bericht](reports/public-browser.json). Normale Links und Direktzugänge der sechs Missionen, tatsächliche CSV mit Inhaltsprüfung, stabile Messwertauswahl, keine zusätzliche Standalone-Rahmung auf der Website.

## Herkunft und Prüfumfang

Die regulären Sechs-Missionsläufe begannen bei `9503d1c`; spätere Anwendungsänderungen betreffen ausschließlich den dabei nicht verwendeten Standalone-Bündler beziehungsweise Host. Die geprüften Missionsberechnungen, Inhalte, Steuerungen und die normale Darstellung sind bytegleich geblieben. Die endgültigen Reader-Prüfungen liefen bei `e8b9850`; danach wurde der Reader nicht mehr verändert. Die fertige Einzeldatei und ihre neuen Endprüfungen beziehen sich auf `b806579`. Spätere Dokumentations-/Testcommits ändern diesen Anwendungscode nicht.

Der [Quellvergleich](reports/protected-sources.json) überprüft geschützte Modelle und Inhalte. `index.html` unterscheidet sich vom akzeptierten Ausgang ausschließlich durch die zwei Navigations-/Entsorgungshooks samt Kommentar; die biologische Berechnung darin wurde nicht umgeschrieben. Originaldateien, Artenmodelle und Spielstände wurden nicht für gewünschte Ergebnisse verändert.

Die Einzeldatei wurde über die echte Spiel-Schaltfläche heruntergeladen: [Downloadnachweis](reports/standalone-download.json). **151.602.143 Bytes**, SHA-256 `576980d23a6c9407fc8e7fd60a8d3231d71dfd1b03d7c0f3443c8091c1af618f`. Sie bleibt außerhalb Git.

## Offen ausgewiesene Grenzen

- **WebKit-Datei-API bei gesetztem Offline-Schalter:** Eine unabhängige Minimal-Seite ohne Aquariumcode reproduziert den Lesefehler für dieselbe unveränderte lokale Datei; [Probe](reports/webkit-file-api-limitation.json). Ein zusätzlicher Lauf blockiert sämtliche HTTP-/HTTPS-Zugriffe und prüft dort die tatsächliche Datei-Rückkehr. Diese beiden Prüfverfahren werden nicht miteinander gleichgesetzt.
- **Lokaler Chromium-Dateistart:** Die verwaltete Browserrichtlinie sperrt bereits `file:` mit `ERR_BLOCKED_BY_ADMINISTRATOR`. Kein erfolgreicher Chromium-Dateistart behauptet, keine Richtlinie umgangen. WebKit-Dateistart wird gesondert geprüft.
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
