# Finaler Korrekturauftrag, 23.10.2026

Nur `feature/coherent-learning-workspaces`, bestehender offener PR #9. Kein neuer PR, kein Merge, keine Änderung an `main`. Der Nutzer hat die Basis F01/F02/F03-Kern/F05/F08 akzeptiert und die frühere Zwischenfreigabe ausdrücklich aufgehoben.

## Gesicherte Umsetzung

Ausgang `ffc061279f01f0030fe35503def0d1b329e5f73b`. Letzter Anwendungscode `03798ff6337e5b2b91c84d3fd836bd4c2979db63` (zuletzt ausschließlich getrennte Archivlinks per CSS); spätere Commits betreffen Tests, Dokumentation und Belege. F13, F04, F06, F07, F09, F10, F12, F03-R und F11 sind umgesetzt. [Änderungsliste](REVIEW.md), [eigene Bildgalerie](REVIEW.html) und [Prüfprotokoll](TESTS.md) sind maßgeblich.

57 vorhandene Root-Laufzeitdateien unverändert; insbesondere Lernmodelle, Ökologie, Genetik, Populationsberechnung, Kameramodul, physikalische Regeln und Artgrößen. `index.html` unterscheidet sich ausschließlich im Aufruf für die räumliche Anordnung frisch vorbereiteter Expertenszenarien. Alte Saves und Lernstarts werden nicht umgeräumt. Die Pinzettensteuerung erhielt nur eine neue Rückmeldungsformulierung, keinen geänderten Kollisionsablauf.

## Prüfung

198 Modultests bestanden. Historischer V1-Leser, fünf Szenarien samt Reload, 14 unveränderte alte Aquarium-Dateien, Pinzette mit Maus/Touch in drei Formaten samt Sicherung, Freies Forschen 8/9/10, acht Tutorialschritte, Expertenfunktionen und freie Fortpflanzung geprüft. Öffentliche M3 komplett bestanden; 71 öffentliche Laufzeitdateien bytegleich. HTTP-geladene Einzel-HTML mit M1 anschließend offline bestanden.

Alle sechs Missionen in beiden Engines vollständig durchlaufen, jeweils mit tatsächlichen Fehlantworten, Hilfen, Pause, Abschluss, Reload, Wiederholung und eigener Datei-Rückkehr. Die öffentliche Galerie ist in drei Formaten geprüft. Der direkte Chromium-Dateistart bleibt durch Browserrichtlinie mit `ERR_BLOCKED_BY_ADMINISTRATOR` blockiert und ist ausdrücklich nicht bestanden. Keine uneingeschränkte Gesamtfreigabe; der Stand ist mit dokumentierten Grenzen zur unabhängigen Endabnahme bereit. [Abschlussstatus](reports/completion.json).

## Fortsetzungspfade

Lokale Ergebnisse: `/tmp/final-missions-current/chromium` (kompletter Chromium-Weg bestanden), `/tmp/final-missions-current/webkit` (M1–M3 vollständig, danach Testannahme zur verdeckten M4-Markierung fehlgeschlagen), `/tmp/final-missions-rest/webkit` (M4–M6, unveränderte Anwendung), `/tmp/final-legacy-visible/webkit`, `/tmp/final-operations-final/webkit`, `/tmp/final-tweezers-current` (Desktop/Hochformat vollständig, Querformat-Reload Timeout), `/tmp/final-tweezers-landscape` (gezielt komplett bestanden), `/tmp/final-research/webkit`, `/tmp/final-expert/results`, `/tmp/final-genetics-webkit`, `/tmp/final-offline-latest/webkit`, `/tmp/final-native-attempt/chromium`, `/tmp/final-public/webkit`. Alle genannten Prüfungen sind beendet; keine Warteschlangen erneut starten.

Belegsammler `/tmp/build-final-evidence.py` hat alle vorgesehenen Bilder und Berichte kopiert, fehlende Bilder: null. Galerie und Bilder öffentlich geprüft. Die API aktualisiert nur die Beschreibung von PR #9; Titel/Status bleiben erhalten.

Standalone `/workspace/aquarium-devtools/www/standalone-m1/index.html`: 151480839 Bytes, SHA-256 `1529d9db818a2872898fb5d73ed6332255dec43088203a833bd0da4ced5f0b93`. Tatsächlicher Download bytegleich. Kein erneuter Build nötig, solange nur Tests/Dokumentation geändert werden.

## Grenzen

Linux Chromium 154 / WebKit 26.5 mit Softwaregrafik und Browser-Touch, kein physisches iPad und keine Unterrichtserprobung. Der Maximum-Grafikwechsel im ergänzenden alten Genetiktest verursachte einen Timeout; der vollständige Zuchtweg wurde deshalb gezielt im vorhandenen iPad-Profil geprüft. Keine Leistungsfreigabe für Maximum auf Softwaregrafik.

Das neu hochgeladene ZIP übersteigt die 32-MiB-Transfergrenze und wurde nicht gelesen. Beide Aufträge und HTML-Bericht waren verfügbar; die 14 alten Originaldateien kamen unverändert aus dem früheren Paket. Die Baselinebilder stammen aus der unveränderten Laufzeitkopie ffc0612. Ihr ursprünglicher Missionsbericht hat einen falsch zugeordneten Arbeitskopie-Commit; tatsächliche Baseline-Hashes sind separat belegt. Nicht historische Daten als neue Schülerleistung ausgeben.
