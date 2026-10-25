# Release-Kandidat 1.0 – W01/U01

Stand: 24.10.2026, 16:30 Uhr (Europe/Berlin). [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9) · [geprüfte Spielvorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/) · [Bilder und Speicherdiagramm](REVIEW.html).

| Bereich | Entscheidung | Begründung |
| --- | --- | --- |
| Webversion 1.0 | **FREIGABEFÄHIG** | Öffentliche Vorschau in WebKit über 24 und Chromium über 12 Runden stabil; echte Spielhandlung, Export und exakte Wiederherstellung danach bestanden. U01 und gezielte Funktionsnachtests bestanden. |
| Standalone-HTML | **EINGESCHRÄNKT** | Alle ausführbaren Funktions- und Belastungsprüfungen bestanden, einschließlich 24 Offline-Runden in WebKit. Die 151,6-MB-Datei benötigt in diesem Test dennoch bis zu 3,6 GiB Browserspeicher. Freigabe als Backup auf ausreichend ausgestatteten Desktop-Rechnern; keine pauschale Offline-Zusage für speicherarme Unterrichtsgeräte. |
| Physische iPad-/Safari-Abnahme | **NOCH NICHT GEPRÜFT** | Linux-WebKit und emulierte Touch-Eingaben sind keine Tests auf einem iPad oder in nativem Safari. Der ursprünglich betroffene 8-GiB-Mac wurde hier nicht erneut getestet. |

Die Webfreigabe setzt keinen weiteren Ausbau voraus. Es erfolgten **kein Merge, keine direkte Änderung an `main` und kein neuer PR**. Die reguläre Website ist der vorgesehene Unterrichtsweg; die Einzeldatei bleibt als zusätzliches Backup erhalten.

## Exakter Anwendungsstand und Datei

- Anwendungskorrektur: [`893492bb38480905bb9c6a455af5c176f7c23f66`](https://github.com/Feerson1617/Simulation-Aquarium/commit/893492bb38480905bb9c6a455af5c176f7c23f66). Spätere Branch-Commits sichern die Prüfungen und Dokumentation; die drei korrigierten Laufzeitdateien bleiben identisch zu diesem Commit.
- Unabhängig abgenommener Ausgangspunkt: `3e6394bf29d21fa8cc685855a84bcc2eb06f57a4`. R01–R03 und F01–F13 bleiben im bereits belegten Umfang akzeptiert. Die vollständigen sechs Lernpfade wurden für diesen Freeze nicht erneut als neue Unterrichtsabnahme ausgegeben.
- Neue HTML-Datei: **151.612.920 Bytes**, tatsächlich über den Download-Knopf beider Browser erzeugt und offline erneut heruntergeladen. Alle vier Dateien waren bytegleich.
- SHA-256: `13612b42a105290f805bebc545da12adef34d24f5288b239453955f848f1ef1b`.
- Das frühere HTML mit SHA-256 `ea1bd887f8f301d079fb7636c72fd6ec60a83695045b56f79badd43e8f1e1666` bleibt die unveränderte Ausgangsdatei der Vorher-Messung. Alte heruntergeladene HTML-Dateien aktualisieren sich nicht selbst. Die neue Datei herunterladen; vorhandene Stände lassen sich als JSON übernehmen.

## W01: Messung und begrenzte Korrektur

Die alte Einzeldatei schrieb pro Ansichtswechsel das vollständige, rund 151 MB große Anwendungsdokument in ein neues iframe. Die neue Datei hält Bild- und Modelldaten einmal zentral bereit. Neue Ansichten verwenden dieselben Zeichenketten. Das erneut eingelesene Dokument enthält jetzt **1.988.231 Bytes**. Die vorhandene Trennung der Ansichten sowie das Sichern, Anhalten und Aufräumen bleiben erhalten. Die normale Website verwendet diese Standalone-Verwaltung nicht.

Alle **476** eingebetteten Bild-/Modelldaten sind im automatischen Test bytegenau mit den Originalen verglichen worden. Kein Modell und keine Art wurde entfernt. Der [Quellvergleich](evidence/source-audit.json) bestätigt 593 unveränderte Anwendungs-/Assetdateien außerhalb der drei gezielten Laufzeitänderungen. Biologische Berechnungen, Genetik, Größenverhältnisse, Szenarien und Speicherformate wurden nicht geändert.

**Gemessene Spitzen der Browserprozesse zusammen, PSS in GiB.** Vorher jeweils zwölf Runden. Die Spitzen schließen die anschließende Spielhandlung und Sicherungsprüfung ein; Nachher-Rundenzahlen stehen separat. A = tatsächliche öffentliche PR-Website; B = Einzeldatei über HTTP, online; C = HTTP geladen, danach Netzwerk-Offlineschalter; D = direktes `file:`.

| Browser | Fall | Vorher GiB | Nachher GiB | Runden nachher | Ergebnis |
| --- | --- | ---: | ---: | ---: | --- |
| WebKit | A | 1,28 | 1,43 | 24 | bestanden |
| WebKit | B | 12,02 | 3,11 | 12 | bestanden |
| WebKit | C | 11,81 | 3,61 | 24 | bestanden |
| WebKit | D | 11,60 | 3,12 | 12 | bestanden |
| Chromium | A | 0,80 | 0,77 | 12 | bestanden |
| Chromium | B | 2,85 | 1,25 | 12 | bestanden |
| Chromium | C | 2,82 | 1,15 | 12 | bestanden |
| Chromium | D | – | – | 0 | Browserrichtlinie: nicht ausführbar |

Die vergleichbare WebKit-Prüfung B sank von rund 12,0 auf 3,1 GiB. In C blieb der Kandidat auch über 24 Runden funktionsfähig; die Werte nach Rückkehr zur Auswahl pendelten zuletzt etwa zwischen 3,0 und 3,4 GiB. Der starke frühere Anstieg wird in diesen Nachtests nicht fortgesetzt. [Diagramm](evidence/memory-comparison.svg), [berechnete Übersicht](evidence/memory-summary.json), [Vorher-Rohdaten](evidence/before), [Nachher-Rohdaten](evidence/after).

**Einordnung:** Auf der Cloud mit 32 GiB Speicherlimit und ohne Swap stürzte auch die alte Datei im gültigen Vergleich nicht ab. Ihr hoher und weiter steigender Prozessspeicher ist jedoch direkt gemessen. Der wiederholte Dokumentaufbau ist damit als wesentlicher Verstärker eingegrenzt. PSS allein unterscheidet WebKit-Zwischenspeicher und verzögerte Dokumentfreigabe nicht sicher von dauerhaft gehaltenen Objekten; ein Leck im biologischen Simulationskern ist damit nicht nachgewiesen. Der unabhängige Ausfall auf dem 8-GiB-Mac bleibt ein Befund der alten Datei, keine hier durchgeführte Hardwareprüfung des Kandidaten.

Methodik: WebKit 26.5 und Chromium 154.0.8037.57 auf Linux, Softwaregrafik, Profil „iPad“, 768 × 1024, jeweils ein Browser. OS-Messung alle zwei Sekunden; Automatisierungstreiber getrennt, beobachtete Spitze 0,17 GiB. Keine erzwungene Speicherbereinigung, keine tiefen Abfragen pro Animationsframe und keine vollständige DOM-Serialisierung je Runde. Kein Ressourcenabbruch, kein ENOSPC, kein Swap. Abtastwerte können kurze Spitzen übersehen. [Umgebung](evidence/environment.json), [reproduzierbare Handlungen und Befehle](REPRODUCE.md).

## U01: sichtbarer Tipp ohne verkleinertes Aquarium

Nach direkter Auswahl der Wasserpest war der Tipp bei 768 × 1024 vorher teilweise abgeschnitten: Unterkante **1037,36**, Aufgabenbereich bis **1008**. Die kurzen Antworten „Ja“ und „Nein“ stehen jetzt nebeneinander, „Ich bin unsicher“ darunter. Der Tipp liegt bei **y = 948 bis 992**, bleibt 44 Pixel hoch und wurde ohne Scrollen direkt angetippt.

WebKit und Chromium: Vorher-/Nachherbilder, alle drei Vermutungen lesbar, echte Pflanzenauswahl, Öffnen/Schließen der Hilfe und Auswahl einer Vermutung bei **768 × 1024, 1366 × 960 und 1366 × 1024** bestanden. Die projizierten Aquariumgrenzen stimmen vor/nach der Änderung bis auf weniger als 0,01 Pixel überein. Desktop und Querformat behalten ihre Anordnung. [Sechs Bildvergleiche](REVIEW.html), [Messungen und Handlungen](evidence/hint).

## Eigene Abschlussprüfungen

- **202 Modultests bestanden**, lokal und in GitHub Actions, einschließlich Syntax des erzeugten Spiels und vollständiger Asset-Bytevergleiche. [Testausgabe](evidence/module-tests.txt).
- **14 ausführbare Stabilitätsläufe bestanden**, insgesamt **192 Runden** in Vorher-/Nachher-Matrix. Zwei native Chromium-Dateifälle wurden durch die verwaltete Browserrichtlinie blockiert und zählen nicht als bestanden. Nach jedem ausführbaren Lauf: tatsächliches Füttern, JSON-Download, Rückkehr zum identischen Stand, zweiter identischer Export und weiterhin bedienbare Hilfe.
- Öffentliche Website und Offline-Backup jeweils in beiden Browsern: sechs reale Missionseinstiege mit Wahlhandlung, Hilfe und lokalem Stand; die zwei Speicherwege von M1/M2 mit Export, exakter Wiederherstellung und echter Dateiauswahl. Vorherige M2-Dateien aus `3e6394b` wurden in Chromium online und in beiden Offline-Browsern exakt übernommen. WebKit online prüfte zusätzlich den eigenen neuen M2-Dateirundlauf. Freies Forschen mit echtem Tagesschritt, Platzierung des 120-Liter-Beckens im freien Spiel, Tutorial und Nahrungsnetz-Szenario bestanden. [Vier Funktionsberichte](evidence/regression).
- Beide Browser: eine tatsächlich laufende M2-Beobachtung per Browser-Zurück verlassen, unveränderten alten Speicherstand abwarten, per Vorwärts exakt und angehalten wieder öffnen, exportieren und einmal fortsetzen. Ein aktiver Renderer/WebGL-Kontext; verlassene Timer, Listener und Animationsaufrufe beendet. [Zwei Navigationsberichte](evidence/lifecycle).
- In den ausführbaren Nachtests keine unbehandelten Anwendungsfehler oder Konsolenfehler. Die Offline-Spielwege erzeugten nach Netztrennung keine HTTP(S)-Nachfragen. Der echte HTML-Download und der erneute Offline-Download wurden per SHA-256 geprüft.

Der Backup-Importtest sperrt HTTP(S), damit lokale Datei-APIs verfügbar bleiben. W01-C benutzt separat ausdrücklich Playwrights Offlineschalter; dieser sperrt in der vorhandenen Linux-WebKit-Laufzeit auch bestimmte lokale File-API-Aufrufe. Die Verfahren sind in den Berichten getrennt. Frühere Probeläufe des neuen Messskripts enthielten korrigierte Warte-/Sollzustandsfehler und eine Proxy-Zertifikatskonfiguration; sie zählen nicht zur gültigen Matrix. Die bereits akzeptierten Vollprüfungen bleiben [versionsbezogene Referenz](../single-aquarium/release-corrections/TESTS.md).

## Manuelle Veröffentlichung

1. Diesen Release-Bericht und die [PR-Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/) prüfen; anschließend **PR #9 selbst nach `main` zusammenführen**.
2. Den dadurch gestarteten Workflow „Aquarium – Website und PR-Vorschauen“ erfolgreich abschließen lassen. Die Quelle für GitHub Pages bleibt „GitHub Actions“.
3. [Öffentliche Startseite](https://feerson1617.github.io/Simulation-Aquarium/) neu öffnen, die sechs Missionen und den M1-Tipp prüfen. Die neue Backup-Datei bei Bedarf über „Zeit & Runde → Komplettes HTML-Spiel herunterladen“ sichern; Spielstände separat als JSON aufbewahren.

Die Unterrichtsversion ist damit zur manuellen Veröffentlichung vorbereitet. Die Grenzen der zusätzlichen Offline-Datei und die fehlende physische Safari-Abnahme bleiben ausdrücklich benannt.
