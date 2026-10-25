# Eigene Abschlussprüfungen

## Zuordnung der Versionen

Ausgang und Vorher-Bilder verwenden `ffc061279f01f0030fe35503def0d1b329e5f73b`. Die unveränderte Kopie wurde unter `/final-before/` ausgeliefert. Die ursprüngliche Sechs-Missionen-Prüfung liest im Bericht irrtümlich den Commit und die Hashes der Arbeitskopie, obwohl die Browser-URL die Baselinekopie verwendet. Der Originalbericht bleibt erhalten; [Quellprüfung](reports/source-audit.json) dokumentiert die tatsächlich geprüften Bytes der Baseline. Dieser Bericht wird ausdrücklich nicht als Prüfung des damals aktuellen Arbeitsbranches umgedeutet.

Der umfassende Laufzeitstand ist `766aa4768e7f77b14d487b5557d32053e8247b6d`. Der letzte kleine Anwendungsschritt `03798ff6337e5b2b91c84d3fd836bd4c2979db63` ergänzt ausschließlich `display:block` für Dialoglinks: Die beiden Archivwege laufen dadurch innerhalb aufgeklappter Details nicht mehr ineinander. Dies wurde in drei Formaten separat geprüft; Download und Offline-M1 verwenden den anschließend neu gebauten Stand. Danach ändern Commits ausschließlich Dokumentation und Belege. Die WebKit-Missionen verwenden diesen Laufzeitstand und protokollieren sämtliche Root-Laufzeitdateien als SHA-256. M1–M3 und M4–M6 liegen in zwei Berichten mit identischen Anwendungsdateien vor; der erste Lauf scheiterte erst danach an einer unzutreffenden Testannahme zur Markierung hinter einem Dialog (unten erklärt). Der Chromium-Missionslauf beginnt auf `d46e029`; währenddessen wurden einzelne Hilfetexte, Archivhinweise, die Höhe der M1-Fehlerkarte und das automatische Scrollen des historischen Lesers verbessert. Er ist daher kein Nachweis aller sechs Missionen auf einem einzigen eingefrorenen Commit. Die finalen WebKit-Läufe und die gezielten aktuellen Prüfungen decken diese Änderungen ab. Der versuchte lokale Chromium-Dateistart wird von der verwalteten Browserrichtlinie blockiert (unten dokumentiert).

## Durchgeführte Wege

| Prüfung | Tatsächlicher Umfang | Bericht |
|---|---|---|
| Modultests | 198 bestanden, keine übersprungen; einschließlich unbekannter historischer Daten, unveränderter Kerne, Elternauswahl, Archivzuordnung, Gleichheit und gültiger Szenariogeometrie | [Node-Ausgabe](reports/node-tests.txt) |
| Alle sechs Missionen, Chromium | Eigene Eingaben, Fehlerantworten, Hilfen, Abschluss, Pause, Reload, Wiederholung, Export/Import; M1/M3 zusätzlich drei Ansichtsformate | [Originalbericht](reports/missions-chromium.json) |
| Alle sechs Missionen, WebKit | Dieselben Lernwege am finalen Laufzeitstand; zusätzlich fehlende Mutter, zwei Weibchen ohne Vater, reziproke Gründerkreuzung, aktuelle M4-Fischauswahl und zeilenweiser Abgleich früherer Elternbeiträge | [M1–M3 und erster M4-Versuch](reports/missions-webkit.json), [M4–M6](reports/missions-webkit-rest.json) |
| Archivlinks, WebKit | Getrennte Links mit mindestens 44 Pixel Höhe in allen drei Formaten; tatsächlich importierter eigener M1-Abschluss und lesbare Archive | [Originalbericht](reports/archive-final.json) |
| Historischer Produktleser, WebKit | Unveränderte V1-Dateien 8 → 9 → 8 → 9; unbekanntes `fishAlive`, ungültiges JSON, falscher Dateityp, vollständig sichtbare Quelle/Fehlermeldung | [Originalbericht](reports/legacy.json) |
| Expertenszenarien und alte Aquarien, WebKit | Alle fünf Starts, tatsächliche räumliche Platzierung, Speichern/Reload; danach alle 14 unveränderten Original-Aquarien über die Dateiauswahl. Biologie/IDs/Positionen erhalten; kein neuer Missionsabschluss | [19 Prüfpunkte](reports/operations.json) |
| Pinzette, Chromium | Echte Maus- und CDP-Touch-Züge, freie Ziele, tatsächliche Kollision, Abbruch, sichtbare Anleitung; Desktop 1366 × 960, Hochformat 768 × 1024, Querformat 1366 × 1024. Reload/Export/Import | [erster Lauf](reports/tweezers.json), [gezielter Querformatlauf](reports/tweezers-landscape.json) |
| Frei forschen, WebKit | Klassen 8/9/10: vorhandene Arten wählen, Geräte ändern, Pflegen/Messen, echte Zeit, Sicherung/Import; Einstellungen und gesperrte Browserspeicherung | [Originalbericht](reports/research.json) |
| Experte/Tutorial, Chromium | Freies Aquarium aufstellen, Pflanzen/Tiere einsetzen, Wasserwerte, Zeit, Export/Reload/Import in frischem Profil; alle acht Tutorialschritte mit Touch, Hochformatmenü | [Originalbericht](reports/expert-tutorial.json) |
| Freie Fortpflanzung, WebKit | Im Shop erworbene Mollys mit realer Ökologie bis F1/F2; tatsächliche Größe/Farbe/Elternschaft; Import/Reload; Platy mit zwei Erbmerkmalen; Zebrabärbling-Eier und Schlupf; Touch-Analyse | [9 Prüfpunkte](reports/genetics.json) |
| Einzel-HTML-Download | Tatsächlichen Downloadknopf betätigt. Ergebnis stimmt byteweise mit dem gebauten Stand überein | [Download](reports/html-download.json), [Build/Hash](reports/standalone-build.json) |
| Einzel-HTML offline, WebKit | Dokument über HTTP geladen, danach Netz getrennt; vollständige serielle M1 mit Wiederherstellung und eigener Ergebnissicherung | [Originalbericht](reports/offline.json) |
| Lokaler Dateistart, Chromium: **blockiert** | Echte `file:`-Navigation versucht. Der verwaltete Browser verweigert bereits das Öffnen mit `ERR_BLOCKED_BY_ADMINISTRATOR`. Keine Umgehung und kein bestandener Dateistart behauptet | [Originalbericht](reports/native-file.json) |
| Öffentliche Vorschau | 71 Root-Dateien per HTTP byteweise mit der korrigierten Laufzeit verglichen; vollständige öffentliche M3 mit Sicherung und erneuter Verwendung eigener Dateien | [Dateivergleich](reports/public-runtime.json), [M3](reports/public-m3.json); [öffentliche Galerieprüfung](reports/public-gallery.json) |

Maßgeblich ist jeweils der Status im verlinkten Originalbericht. Prüfpunkte sind technische Nachweise, keine Bewertung des Lernerfolgs.

## Entwicklungsfehler und Wiederholungen

- Die erste Szenarioprüfung verglich beim Reload auch alte implizite Standardfelder und den erwarteten neuen Journal-Eintrag. Diese Unterschiede sind keine veränderten Tiere, Wasserwerte oder Positionen. Der Test wurde auf die tatsächlich zugesicherte Identität präzisiert. Ein weiterer Versuch wartete noch nicht auf geladene 3D-Objekte, ein anderer öffnete versehentlich ein bereits geöffnetes Menü erneut. Der abschließende Lauf prüft alle fünf Szenarien und alle 14 Originaldateien erfolgreich.
- Die eigene Sichtprüfung fand eine unter der Aufgabenkarte versteckte Fehlerrückmeldung. Sie wurde unter die Frage gesetzt; M1 erhielt genügend Höhe für alle drei Antworten. Die finale Prüfung kontrolliert zusätzlich die tatsächliche Lage der Rückmeldung im sichtbaren Bereich.
- Die eigene Sichtprüfung fand den importierten Dateinamen unter der festen Leserüberschrift. Zentriertes Scrollen und eine Prüfung der vollständig freien Fläche beheben das Problem. Die finale V1-Prüfung wurde daraufhin wiederholt.
- Die neue M4-Prüfung erwartete eine sichtbare Szenenmarkierung, während bereits der Infodialog des korrekt ausgewählten Fisches geöffnet war. Die bestehende Oberfläche blendet diese Markierung hinter einem Dialog bewusst aus. Der Test prüft jetzt zuerst die tatsächliche Fisch-ID im Dialog und nach dessen Schließen die sichtbare Markierung. M1–M3 waren bereits vollständig durchlaufen; M4–M6 wurden danach mit unveränderter Anwendung ausgeführt. Die Funktion wurde für diese Testkorrektur nicht verändert.
- Der erste Pinzettenlauf bestand Desktop und Hochformat einschließlich Datei-Rückweg. Im Querformat waren Maus/Touch, Kollision und Abbruch bereits durchgeführt; beim anschließenden Reload überschritt die Browserprüfung ihr 30-Sekunden-Limit. Der gezielte Querformatlauf mit 90 Sekunden Browserlimit wiederholt diese Handlungen und die Sicherung. Der ursprüngliche fehlgeschlagene Bericht bleibt erhalten.
- Die ergänzende alte Chromium-Genetikprüfung schaffte Shop, F1/F2 und sichtbare Jungtiere; nach dem Wechsel auf „Maximum“ überschritt das Schließen des Menüs unter Softwaregrafik 90 Sekunden. Die gezielte vollständige Genetikregression in WebKit verwendet das vorhandene iPad-Grafikprofil. Der Maximum-Wechsel ist darin ausdrücklich ausgelassen, nicht als bestanden gezählt. Grafikcode und Profile sind gegenüber der Baseline unverändert. Die Leistungsfähigkeit des Maximum-Profils unter Softwaregrafik bleibt begrenzt.
- Der tatsächliche Chromium-Dateistart wird vor dem Laden von einer verwalteten Browserrichtlinie gesperrt (`ERR_BLOCKED_BY_ADMINISTRATOR`). Die Richtlinie wurde nicht umgangen. Der geprüfte HTML-Download und die vollständige Offline-M1 nach HTTP-Laden ersetzen diesen offenen Nachweis nicht. Ein unabhängiger lokaler Dateistart auf einem erlaubten Gerät bleibt nötig.
- Der lange Vorher-Pinzettenlauf wurde nach ausreichenden Desktop-Belegen beendet; die drei Vorher-Formate wurden separat erfasst. Ein früher Entwicklungs-Missionslauf wurde nach der gefundenen Rückmeldungsüberlagerung beendet. Diese Teilaufnahmen sind keine abgeschlossenen Testläufe.

## Selbst nachprüfen

Voraussetzungen: lokaler statischer Server, kostenloses Python/Playwright, Chromium beziehungsweise vorhandenes WebKit mit seinen Systembibliotheken. Es gibt keinen Serverteil der Simulation. Die untenstehenden Tests importieren ausschließlich eigene oder ausdrücklich als historisch ausgewiesene Dateien. Die 14 historischen Originaldateien müssen aus dem Nutzerpaket vorliegen; ihr Index und die geprüften SHA-256-Werte sind im Operationsbericht festgehalten.

```sh
node --test tests/*.test.mjs
python3 tests/final_missions_browser.py
python3 tests/final_legacy_browser.py
python3 tests/final_operations_browser.py
python3 tests/final_tweezers_browser.py
python3 tests/single_research_browser.py
python3 tests/readiness_browser.py
```

`AQUARIUM_URL` ändert das Standardziel `http://127.0.0.1:8000/aquarium-simulation/`. Für WebKit: `AQUARIUM_BROWSER=webkit` und `AQUARIUM_WEBKIT` auf die vorhandene ausführbare Datei setzen; erforderliche freie Systembibliotheken müssen verfügbar sein. `AQUARIUM_CORRECTION_IDS=m3` beschränkt den Missionslauf. `AQUARIUM_TWEEZERS_FORMATS=landscape` wiederholt nur Querformat. Die Genetikprüfung verwendet `AQUARIUM_TEST_URL`; `AQUARIUM_GENETICS_SKIP_MAXIMUM=1` kennzeichnet die beschriebene Einschränkung ausdrücklich im Bericht. Der lokale Einzeldateitest verwendet `AQUARIUM_SINGLE_HTML=file:///absoluter/Pfad/Aquarium.html`.

## Nachweisgrenzen

Chromium 154 und WebKit 26.5 auf Linux; Softwaregrafik, Browser-Touch und echte CDP-Touch-Ereignisse. Kein physisches iPad, keine Safari-Hardwarefreigabe, keine Erprobung mit Lernenden, keine allgemeine Leistungsfreigabe für alte Geräte. Der Standalone-Test belegt M1 nach HTTP-Laden und anschließendem Abschalten des Netzes; er wird nicht als sechs vollständige Offline-Missionen oder als bestandener nativer Dateistart ausgegeben. Das neu hochgeladene ZIP war wegen der Transfergrenze nicht lesbar. Diese Grenzen sind in [REVIEW.md](REVIEW.md) erklärt.

Originalbilder bleiben unverändert. [Bildmanifest](image-manifest.json) enthält SHA-256, Aufnahmepfad, vorhandene Uhrzeit, URL und Viewport. Bei den frühen F13-Vorher-Bildern und den Gleichheitsansichten ohne ursprünglichen Ereigniseintrag wurde die Uhrzeit nachträglich aus dem unveränderten Dateizeitstempel rekonstruiert und ausdrücklich so gekennzeichnet. Eigene exportierte Ergebnisse werden verlustfrei als `.json.gz` bewahrt; ihr ursprünglicher Hash steht im Manifest. Historische Produkte werden nicht als eigene neue Leistungen ausgegeben.

Abschluss: [maschinenlesbare Zuordnung](reports/completion.json). Alle sechs Lernwege sind in Chromium und WebKit vollständig bestanden; die beschriebenen Teil- und Wiederholungsläufe bleiben als Originalberichte erhalten. Der native Dateistart bleibt blockiert.
