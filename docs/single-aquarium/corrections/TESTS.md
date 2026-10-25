# Eigene Prüfungen für die Sichtabnahme F01–F03

Aktuelle Anwendung: **`4b79d08a48be6126fc7cd8c2df3b785a44c234f8`**. Vollständiger fachlicher Chromium-Lauf auf `0cf199cee4fc4d3e73af08e26dbc62020cb7cdeb`; anschließend wurden nur Kurven-/Antwortanordnung in M1, M3-Einstieg/Kartenhöhe und M5-Balkenbeschriftungen geändert. Diese drei Missionen wurden auf dem neuen Stand nochmals vollständig in WebKit bedient. Anschließend wurde auf `4b79d08` ausschließlich die Weitergabe von `pointerup` an die Kamerasteuerung korrigiert und in beiden Engines gezielt geprüft. Keine Behauptung, jeder Lauf jeder Mission in jedem Format habe auf demselben Commit stattgefunden.

Alle Browser liefen unter Linux mit Softwaregrafik. Chromium **154.0.8037.57**, WebKit/WPE **26.5**. Das Spielprofil „iPad“ und echte Browser-Touchereignisse sind **keine physische iPad-/Safari-Prüfung**.

## Tatsächlich bestanden

| Eigene Prüfung | Quellstand und Beleg | Umfang |
|---|---|---|
| Alle sechs Missionen vollständig | `0cf199c`, [Chromium-Bericht](evidence/reports/chromium-six-missions.json) | Frischer Anfang, reale Handlungen, Fehlantwort/Hilfe/Korrektur, Pause bzw. schrittweise Generationen, Reload, eigener Ergebnisdownload, neuer Versuch und Import. Keine gesetzten Questvariablen. |
| Abschließende Layoutprüfung M1/M3/M5 | `b2f2cd1`, [WebKit-Bericht](evidence/reports/webkit-final-layout.json) | Drei vollständige Wege einschließlich Datei-Rückkehr. M1/M3 zusätzlich Ausgangskamera in 1366×960, 768×1024 und 1366×1024. Beide M1-Antworten und M3-Einstieg tatsächlich angesehen. |
| Kameraauswahl nach dem ersten Fehler | `0cf199c`, [WebKit M1/M3](evidence/reports/webkit-m1-m3-camera.json) | Direkte Touchauswahl von Anubias, Wasserpest und dunklem Molly; Mausauswahl nach Kameradrehung/Rückstellung; sichtbare Art/ID und tatsächliche Objektzuordnung. Auf `b2f2cd1` wiederholt. |
| Ergänzende Stoff-/Genetikwege | `658eb16`, [WebKit M2/M3/M5](evidence/reports/webkit-m2-m3-m5.json) | Tatsächliche Mengen, Generationen, Fehlerwege und eigene Dateien; vor dem anschließenden Kameraauswahlfix. Nicht als aktuelle Vollmatrix ausgegeben. |
| Freies Forschen 8/9/10 | `0cf199c`, [Bericht](evidence/reports/free-research.json) | Acht Prüfpunkte: Katalog/Einsetzen, Pflege/Wasser/Licht/Zeit, Datei-Rückkehr; direkte Auswahl; tatsächlich erfolgreicher Tastaturversatz; Mausgriff/Abbruch; Lehrkraftoptionen; Quotenfehler mit Dateirettung. Kein behaupteter erfolgreicher Touch-Versatz. |
| Erhaltenes Expertenspiel und Tutorial | `0cf199c`, [Bericht](evidence/reports/expert-tutorial.json) | 13 Prüfpunkte einschließlich 120-Liter-Beckenplatzierung, Pflanzen-/Tierkatalog, Wasserwerte, Dateisicherung in frischem Profil, aller acht Tutorials mit Touchereignissen und Hochformatmenü. Keine JavaScriptfehler oder fehlgeschlagenen Spielanfragen. |
| Einzel-HTML nach dem Laden offline | `0cf199c`, [Bericht](evidence/reports/single-html-m1.json) | Vollständige M1 mit Reset und Ergebnisexport; nur eine HTTP-Anfrage zum initialen Dokument. Kein natives `file:`-Öffnen. Neuester Build `4b79d08` enthält dieselben Module plus Layout-/Gestenkorrekturen, [Build-Hash](evidence/reports/standalone-build.json); dieser letzte Build wurde nicht nochmals als vollständiger Offline-Hardwaretest ausgegeben. |
| Tatsächliche öffentliche PR-Vorschau | `0cf199c`, [Bericht](evidence/reports/public-m3.json) | M3 vollständig über HTTPS, drei Kameraproben, direkte dunkle-Fisch-Auswahl, echte F1/F2, Fehler/Hilfe und Datei-Rückkehr. Zusätzlich sind [66 von 66 veröffentlichten Laufzeitdateien](evidence/reports/public-runtime.json) bytegleich mit 4b79d08 geprüft. |
| Loslassen nach Auswahl | `4b79d08`, [Chromium](evidence/reports/pointer-release-chromium.json), [WebKit](evidence/reports/pointer-release-webkit.json) | Reale Maus-/Touchauswahl, anschließend Mausbewegung ohne gedrückte Taste: Kamera bleibt stabil, korrektes Individuum bleibt gewählt, keine JavaScriptfehler. |
| Biologie-/Modultests | [191 bestandene Tests](evidence/reports/node-191.log) | Tatsächliche lokale Node-Ausführung; zusätzliche GitHub-Prüfung am jeweiligen Commit. Keine neuen biologischen Raten. |
| Schutz des bisherigen Projekts | [Quellvergleich](evidence/reports/source-audit.json) | 578 geschützte Dateien unverändert gegenüber `7d6f815`: ursprüngliche Module außer Lern-UI/-Inhalt, `index.html`, Assets, Größenkalibrierung, AGENTS und Workflows. |

Die vollständigen Missionswege wurden im Hochformat bedient. Die drei Formate sind zusätzliche Kamera- und Auswahlproben für M1/M3; daraus wird kein vollständiger Durchlauf aller sechs Missionen in allen drei Formaten behauptet. Werte in den Mengenbalken wurden gegen ihre tatsächlichen Quellen und die gemeinsame Referenz geprüft. Die gespeicherten ersten Durchgänge blieben bei Resets unverändert.

## Sichtprüfung und Rohbelege

- [Vorher-/Nachher-Bildübersicht](REVIEW.html), [reproduzierbare Schülerhandlungen und Audit aller sechs Aufgaben](REVIEW.md).
- [Gemessene Glasecken](evidence/glass-geometry.json): M1 im Hochformat etwa 728×344 Pixel, rund 32 % des Viewports als umschreibendes Rechteck. Vorherige Sichtabschätzung etwa 391×230, rund 11 %. Die 700-Liter-Genetikbecken behalten ihr anderes natürliches Seitenverhältnis. Kein Ersatz durch eine Kennzahl für freie HUD-Fläche.
- `evidence/before/`: 18 eigene Ausgangsbilder, Anwendung unverändert wie bei `7d6f815`, Aufnahmehead `5c0b2f5` mit ausschließlich neuer Auftragsdokumentation.
- `evidence/after/chromium/`: vollständiger Lauf `0cf199c`; `evidence/after/webkit-final/`: abschließende betroffene Missionen `b2f2cd1`. Bilder unverändert, nicht synthetisch oder nachbearbeitet. Berichte nennen Zeitpunkt, URL, Eingabeart, Texte und Quellhashes.
- Ergebnisdateien sind platzsparend verlustlos als `.json.gz` beigefügt. [Originalgröße und Originalhash](evidence/result-receipts.json). Vor erneutem Import entpacken; die automatischen Rückimporte verwendeten die eigenen unkomprimierten Downloads.
- [Dateimanifest](evidence/manifest.json) mit SHA-256. Zusätzliche lokale Originalordner bleiben unter `/tmp/f01-*` erhalten; frühere Abschlussbelege unter `evidence/approved/` werden nicht als aktuelle Prüfergebnisse umetikettiert.

## Während der Entwicklung gefundene Fehler

Die ersten Prüfungen waren nicht durchgängig erfolgreich. Unter [development](evidence/development/) bleiben die Berichte erhalten: zunächst las das Testskript nach einem Formatwechsel noch nicht aktualisierte Bildkoordinaten; außerdem war eine pauschale 20-%-Grenze für das lange 700-Liter-Becken ungeeignet. Das Skript wartet jetzt auf die tatsächlich neue Projektion und dokumentiert die reale Glasgeometrie.

Danach trat eine echte Fehlwahl nach Kameradrehung/Rückstellung auf: statt Anubias 1 wurde Wasserpest 4 ausgewählt. Der Fehler wurde reproduziert und auf `0cf199c` durch stabile Rückstellung, aktuelle Matrizen und Zuordnung zum tatsächlichen Objektbesitzer korrigiert. Vor-/Nachbilder liegen im Entwicklungsordner. Schließlich zeigte die Bildprüfung eine abgeschnittene M1-Antwort; auf `b2f2cd1` stehen beide Kurven in der Beobachtungsanzeige und alle Antworten in der kurzen Aufgabenkarte. Diese letzte Änderung wurde erneut sichtbar bedient.

Ein letzter gezielter Gestentest auf b2f2cd1 zeigte zusätzlich, dass das Abfangen von `pointerup` die Kamerasteuerung nach Auswahl im Ziehmodus belassen konnte. Der [Fehlerbericht](evidence/development/pointer-release-before.json) enthält tatsächliche Positionsänderung und JavaScriptfehler. Auf 4b79d08 verhindert `preventDefault` die doppelte alte Objektauswahl, lässt das Loslassen aber zur Kamerasteuerung durch. Beide Engines haben den neuen Test mit stabiler Kamera und ohne Fehler bestanden.

## Noch keine fachliche oder Gerätefreigabe

F04–F11 bleiben teilweise offen, insbesondere spezifische Fehlvorstellungshilfen, M3-Elternfehler, verständliche Elternbeiträge/Archive und Pinzettenhinweise. Das Auftreten einer Fehlermeldung belegt noch keine gute Hilfe. Langlisten können Scrollen erfordern; der Außenfilter liegt in enger Beobachtung teilweise am Bildrand. Vollständiger neuer Altdateiimport, native Dateiöffnung, physisches iPad/Safari und Verständnis mit Lernenden sind nicht nachgewiesen. Die neuen Mengenanzeigen und Auswahlzeichen beweisen keinen vollständigen Fotorealismus.

**Ein abgeschlossener Klickweg ist kein Beleg einer gelungenen Lernmission. Die verlangte menschliche Sichtabnahme steht aus.**
