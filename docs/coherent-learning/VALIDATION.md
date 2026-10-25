# Prüfung des Temperaturprototyps

Datum: 22.10.2026. **Anwendungsstand: `d0c4b17096289c18efa63a8b93aa49205c4cb1bd`.** Ausgangs-main: `8e41962132fe3778fe73f8e14c650f42e18d848d`.

Die umfangreichen Basisläufe beziehen sich auf `a7ee966` (in den Berichten durch ihre damaligen Test-/Dokumentationsheads `cc20354`, `24065fd` beziehungsweise `fa03d59` bezeichnet). Danach wurden ausschließlich die beiden Funktionen `results()` und `runTables()` der technischen Ansicht korrigiert. Ein [Syntaxbaum-/Bytevergleich](evidence/expert-source-audit.json) weist nach, dass der übrige Anwendungscode exakt gleich blieb. Diese Ergänzung wurde gezielt in beiden Engines, im neu gebündelten Einzel-HTML und mit neun zusätzlichen WebKit-Schutzprüfungen getestet. Die [biologischen Kernfunktionen](evidence/source-audit.json) sind gegenüber main unverändert.

**Der PR steht am verbindlichen Sichtgate. Er ist keine vollständige Abnahme des Masterauftrags.** [Tatsächliche Bilder und kurzer Prüfweg](PROTOTYPE.md) · [PR-Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/)

## Tatsächlich ausgeführte Prüfungen

| Prüfung | Ergebnis | Beleg |
|---|---|---|
| Bestehende und neue Node-Module | 154/154 bestanden | [Protokoll](evidence/node.log) |
| Neuer Temperatur-/Kontextweg, Chromium | 15/15 bestanden | [Bericht](evidence/prototype/chromium/report.json) |
| Neuer Temperatur-/Kontextweg, WebKit | 15/15 bestanden | [Bericht](evidence/prototype/webkit/report.json) |
| Altprodukte, Quotenfehler, Archivierung, Chromium | 5/5 bestanden | [Bericht](evidence/compat/chromium/report.json) |
| Altprodukte, Quotenfehler, Archivierung, WebKit | 4/4 bestanden | [Bericht](evidence/compat/webkit/report.json) |
| Nebenansichten und ungestartete Pläne | Je 2/2 in Chromium und WebKit bestanden | [Chromium](evidence/tools/chromium/report.json), [WebKit](evidence/tools/webkit/report.json) |
| Einzel-HTML über HTTP | Basis: frischer Temperaturablauf und Export in beiden Engines; finale Ergänzung: historische technische Auswahl/CSV/SVG in beiden Engines | [Basis Chromium](evidence/standalone/chromium/report.json), [Basis WebKit](evidence/standalone/webkit/report.json), [Ergänzung](evidence/standalone/expert) |
| Übrige 13 Missionen, Freies Forschen, Lehrkraft, Hilfen, Migration | Je 22/22 bestanden, darunter je 13 Missionsabschlüsse mit Reload | [Chromium, Dichte 0,5](evidence/quests/chromium/report.json), [WebKit, Dichte 1](evidence/quests/webkit/report.json) |
| Ausgewählte historische Reihe auch in der technischen Ansicht | Beide Engines einschließlich CSV/SVG bestanden; 9 weitere WebKit-Schutzprüfungen bestanden | [Chromium](evidence/expert/chromium/report.json), [WebKit](evidence/expert/webkit/report.json), [Schutzprüfungen](evidence/expert-review/report.json) |
| Freies Spiel, Expertenstart, Platzierung, Katalog, Wasser/Zeit, Speichern/Laden und komplettes Touch-Tutorial | 13/13 Chromium-Prüfpunkte bestanden | [Bericht](evidence/regression/report.json) |
| Tatsächliche PR-Vorschau | WebKit: beide Modellsätze, Heizerhandlung und Reload; finale technische Auswahl mit CSV/SVG bestanden | [Start/Assets](evidence/preview-webkit/report.json), [finale technische Ansicht](evidence/preview-expert-webkit/report.json) |
| Ausgelieferte Dateien / Hauptversion | Alle 8 geprüften Hauptdateien identisch; öffentliche Root-HTML entspricht unverändert main | [SHA-256-Nachweis](evidence/preview.json) |

Keine dieser Zeilen ist eine empirische Prüfung des Lernens von Kindern. Eine Tabelle grüner Prüfungen ersetzt die Sichtfreigabe nicht.

## Verhalten statt eingespritzter Abschlüsse

Der Temperaturtest bedient das Spiel in frischen, isolierten Browserprofilen mit 1366 × 960 Desktop, 768 × 1024 Hochformat mit Touch und 1366 × 1024 Querformat mit Touch. Er wählt tatsächliche sichtbare Tiere und Wasser, prüft Fehlantworten und neutral gespeicherte Vermutungen, bedient Heizer/Tastatur/Dezimalkomma/ungültige Eingabe, spielt den tatsächlichen Verlauf ab, lädt neu und schließt die Mission ab. Beide Szenen haben dieselben Zustandskennungen und Zeiten wie Messkarten, Tabellenzeile und Diagrammzeiger. Es gibt nur einen WebGL-Kontext und je 19 tatsächliche Objekte einschließlich sechs lebender Fische.

Zwei verschieden eingestellte Reihen mit zwei Wiederholungen werden real berechnet. Die ältere Reihe, Wiederholung 2 und Tag 45,25 werden ausgewählt; beide Seitenschalter, JSON und CSV müssen genau diese Auswahl erhalten. Das eigene gespeicherte Becken bleibt unverändert. Der Kern-Gegenversuch mit Sanierung zeigt Tag 45,25, den tatsächlichen Kontrollausfall 48,25 und die noch vorhandene Versuchsseite an Tag 59. Es entstehen keine Folgemessungen oder alten Fischbilder für fehlende Zustände.

Wasserwechsel 0 % erfüllt in den tatsächlichen Gesundheits-/Sanierungswegen keinen Eingriff. Node-Gegenproben prüfen auch unveränderte Lampen, Null-Nährstoffe und eine tatsächliche Handlung mit gleichen Endwerten. Der neue Durchgang muss F1/F2-Ereignisse, Population, Quest und Untersuchungskennung neu beginnen; das vorherige Produkt bleibt archiviert lesbar.

Die 13 bisherigen Missionen werden durch echte sichtbare Bedienung mit Fehlerkorrektur, erforderlichen Lernhandlungen, Export und anschließendem Reload in ihren eigenen neuen Missionsspeicherplätzen bearbeitet. Der WebKit-Missionslauf verwendet Pixeldichte 1; der abschließende Chromium-Missionslauf verwendet Pixeldichte 0,5 bei unveränderter CSS-Viewportgröße, unveränderten Modellen und allen bisherigen Bedien-/Datenassertionen. Er ist eine technische Regression, keine neue visuelle Qualitätsabnahme. Ein vorheriger Chromium-Lauf bei Dichte 1 wurde nach zwei abgeschlossenen Wegen wegen des langsamen Software-Renderings beendet; er wird nicht als vollständiger Lauf gezählt. Die kritischen Temperaturbilder und drei Vergleichs-Viewports wurden in beiden Engines bei Dichte 1 geprüft.

Der Chromium-Missionslauf begann vor dem Einspielen der technischen Ergänzung und lief dabei weiter; die betroffenen beiden Darstellungsfunktionen und die übrigen unveränderten Bytes sind durch den gesonderten Quellvergleich abgegrenzt. Der technische Zusatztest hat den finalen UI-Dateihash. Das Browserprofil bleibt innerhalb einer Engine absichtlich gemeinsam gefüllt, um das zuvor gefundene Speicherproblem aufzudecken. **Das ist kein separater frischer Browser für jede Mission.** Der neue Temperaturweg ersetzt die alte Temperaturroute im bisherigen Questskript und wird gesondert vollständig geprüft. Alte Hilfs-/Populations-/Hafenansichten werden dadurch technisch erhalten, aber nicht als neu gestaltete sachgerechte Lernansichten ausgegeben.

Nur bei ausdrücklich benannten Kompatibilitätstests werden echte historische Produkte als alte Speicherstände eingesetzt. Es werden keine neuen Questabschlüsse durch Zustandsinjektion erzeugt. Der Quotenfehler wird gezielt injiziert, um nachzuweisen, dass der zuvor gespeicherte Versuch erhalten bleibt.

## Abnahmeumfang des Masterauftrags

| Anforderungen | Befund am Sichtgate |
|---|---|
| AT02–AT06 | Temperaturvergleich, historische Identität, tatsächliche Ausfallzeiten, Null-Eingriffe und neuer Durchgang technisch geprüft |
| AT01 / AT14 | Temperatur in beiden Engines und drei Viewports; übrige Missionswege in beiden Engines geprüft. Separate neue sachgerechte Ansichten und deren vollständige Touchabnahme folgen nach dem Gate |
| AT07 | Echte bestehende F1/F2, Archiv und Neustart erhalten; Verbindung jeder Bildfigur mit der Lernkohorte bleibt Phase 3 |
| AT08 / AT09 | Neue Hafen-/Prozess-/Waldansichten und beide maßnahmenspezifischen Hafenabschlüsse offen |
| AT10 / AT12 | Prototyp mit Tastatur, Touch-Tap, echtem Chromium-Touchziehen, Fokus, Fehl-/Neutralrückmeldung und konsistenter Temperaturauflösung geprüft. Übrige Sprach-/Hilfsüberarbeitung offen |
| AT11 | 154 Modultests und unveränderte biologische Kernfunktionen; vollständiger Ammonium-/Ammoniak-Stoffvertrag ausdrücklich offen |
| AT13 | Freies Forschen aller Jahrgänge, Lehrkraft/Altimporte, Experten-/Tutorial-/Speicherfunktionen erhalten; keine vollständige menschliche Abnahme aller früheren Funktionen behauptet |
| AT15 | Tatsächliche öffentliche Vorschau und Hashvergleich geprüft; kein Merge und keine Änderung der main-Version |

## Einzel-HTML, Leistung und Browsergrenzen

Das finale Einzel-HTML enthält Codec-Lizenz, Archivlogik und beide Ansichten. Es ist byteidentisch zum isoliert in beiden Engines geprüften Ergänzungs-Bundle. Die frischen Temperatur-Gesamtabläufe beziehen sich auf die davor gemessene Basisdatei; die Ergänzung prüft genau die geänderte technische Ansicht und beide Downloads in der neu gebündelten Datei. Die unveränderten Temperatur-/Renderfunktionen wurden nicht unbegründet als komplett neu getesteter Lauf ausgegeben. Größe und Hash: [Artefaktnachweis](evidence/standalone-artifact.json). Die Browser fordern dabei nur das Hauptdokument über HTTP an; der bereits geladene Ablauf und der Export funktionieren auch nach Abschalten des Netzes im Testprofil. **Das beweist weder einen nativen `file:`-Start noch einen Offline-Reload auf iPadOS.** Das etwa 151 MB große Artefakt wird nicht in Git abgelegt.

Die Cloud verwendet Software-Rendering. Die gemessene Bildrate ist niedrig; Ressourcenanzahlen sind keine GPU-Bytes. [Messungen und konkrete weitere Gerätebudgets](PERFORMANCE.md) benennen diese Grenze ausdrücklich. Physische iPads/Mobile Safari, das Maximalprofil und Unterrichtswirksamkeit sind offen.

Der erste öffentliche Chromium-Aufruf scheiterte mit `ERR_CERT_AUTHORITY_INVALID`, bevor Spielcode geladen wurde. Der [getrennte Fehlerbeleg](evidence/development/preview-chromium-ca/run.log) bleibt erhalten. WebKit verwendete die bereits konfigurierte System-CA und bestand den tatsächlichen HTTPS-Aufruf. `ignore_https_errors`, neue Vertrauensanker oder abgeschaltete Zertifikatsprüfung wurden nicht eingesetzt.

## Entwicklungsfehlschläge getrennt von abschließenden Ergebnissen

- Der echte [Speicherfehler vor der Archivkompression](evidence/development/storage-before-codec/report.json) war ein Anwendungsfehler: Die abgeschlossene Kohlenstoffmission kehrte nach Reload zu Aufgabe 2 zurück. Verlustfreie Kompression und Schutz vor Übernahme eines nicht speicherbaren Vergleichs korrigieren dies. Der Mehrmissionslauf prüft genau diesen Fall erneut.
- Ein zusätzlicher Prüfablauf suchte den Neustartknopf bereits vor Missionsabschluss. Dieser [Testfehler](evidence/development/premature-restart-test/run.log) wurde korrigiert. Der tatsächliche Neustart nach Abschluss bleibt im vollständigen Missionslauf geprüft.
- Ein zusätzlicher historischer Prüfvertrag verlangte früher, alle alten Beckenstände beim Lehrkraftimport zu verwerfen. Der Masterauftrag verlangt nun, bekannte Endstände als begrenzte, reine Lesedaten zu erhalten. Die Assertion wurde durch strengere Prüfungen auf exakt erhaltene Endstände, weiterhin fehlende frühe Zustände, unveränderte Quelldatei und unverändertes eigenes Spielbecken ersetzt. Alle übrigen Assertions bleiben erhalten. [Alter Vertragsfehler](evidence/development/legacy-review-old-contract/run.log).
- Der technische Diagrammfehler ist separat [vor der Korrektur reproduziert](evidence/development/expert-context-before/report.json). Die nachfolgenden Zieltests prüfen genau die gewählte ältere Reihe/Wiederholung/Zeit in Tabelle, Diagramm und Downloads.
- Frühe Zwischenläufe zu Offenhalten von Klappbereichen, Ablaufsteuerung und Testselektoren sind Entwicklungsdiagnosen. Sie werden nicht mit bestandenen abschließenden Läufen addiert.

Die erwähnten ursprünglichen ZIP-Prüfpakete fehlen; deren Hashes wurden nicht selbst nachgerechnet. ETS-Original-PDF und der exakte Git-Ausgangsstand sind dokumentiert. IQSH-Geltung und regionale institutionelle Belege werden für die nächsten Phasen genauer geprüft; keine neue Quellenprüfung oder Unterrichtswirksamkeit wird vorgetäuscht.
