# Abgeschlossen: R01–R03, Anwendung 1ecd8d0

Alle abschließenden Anwendungsprüfungen sind ausgewertet. Maßgeblich sind [TESTS.md](TESTS.md), die unveränderten Originalberichte unter reports und [REVIEW.html](REVIEW.html). Sechs reguläre Missionen vollständig in Chromium/WebKit, 201 Modultests, drei Offline-Prüfverfahren, native WebKit-Datei, Lebenszyklus, historische Dateien und angrenzende Spielwege bestanden. Die dort benannten Testumgebungs-/Hardwaregrenzen gelten weiterhin. Kein weiterer Spielcode nach 1ecd8d0. Nur bestehender Branch/PR #9, kein Merge.

Die folgenden Notizen sind die chronologische Entwicklungshistorie; ihre damals laufenden oder fehlgeschlagenen Zwischenläufe sind keine offenen Abschlussaufträge. Fehlgeschlagene Kandidaten wurden nicht nachträglich zu erfolgreichen Läufen umetikettiert. Der finale Standalone-Hash ist ea1bd887f8f301d079fb7636c72fd6ec60a83695045b56f79badd43e8f1e1666, 151.594.853 Bytes, außerhalb Git.

---

# Aktuell: Endprüfung der tatsächlich neuen Datei auf 1ecd8d0 läuft

Anwendung gesichert und gepusht: `1ecd8d0909f8789a3394eb4a413156fd223aa843`. Kein weiterer Anwendungscode danach. Neue Datei wirklich über die normale Spieloberfläche heruntergeladen: `/tmp/final-html-download/Aquarium.html`, 151.594.853 Bytes, SHA `ea1bd887f8f301d079fb7636c72fd6ec60a83695045b56f79badd43e8f1e1666`; bytegleich zum neu bereitgestellten Testartefakt. 201 Modultests bestanden, log `/tmp/r-cached-download-unit.log`. Direkter frischer Chromium-Download ist jetzt ebenfalls bytegleich erfolgreich, ohne Browser-Speichergrenze zu verändern.

Nicht doppelt starten: `/tmp/r-final-cached-queue.py chromium` und `... webkit` laufen seit 08:55 UTC. Statusdateien `/tmp/r-final-cached-queue-{chromium,webkit}.json`, aktuelle Logs `/tmp/r-final-offline-{chromium,webkit}.log`. Chromium: erst vollständiges Offline-Szenario, dann Lebenszyklus, dann nativer Datei-Versuch. WebKit: erst vollständiges HTTP-gesperrtes Szenario, dann strikter Offlineschalter, Lebenszyklus, native Datei. Ausgabepfade wieder `/tmp/r-release-offline`, `/tmp/r-network-blocked-offline`, `/tmp/r-strict-offline`, `/tmp/r-lifecycle-docwrite`, `/tmp/r-native-docwrite`. Die vollständigen Vorgängerbelege/alte HTML wurden nach `/tmp/r-b806579-evidence` verschoben, nicht gelöscht.

Nach Abschluss beider Queues: `/tmp/r-check-offline-csv.py`; `/tmp/r-collect-final.py`; `/tmp/r-finalize-docs.py` (gated auf bestandene Reports und exakt neuen Artefakthash); `/tmp/r-make-gallery.py`; `/tmp/r-check-gallery.py`; Sammler noch einmal für Galeriebericht. Die Finalisierungsskripte wurden auf 1ecd8d0, neuen Hash und Bytezahl aktualisiert. Öffentliche Quellprüfung `/tmp/r-public-source-check.py` am Schluss erneut; Quellepochen `/tmp/r-test-source-epochs.json` und geschützte Modelle `/tmp/r-source-audit.json` sind schon gegen 1ecd8d0 geprüft. Neue Modultest-/Download-/Fehlerdiagnosebelege nimmt der Sammler auf.

Reguläre sechs Missionen beider Engines, beide Reader und angrenzende Website-Funktionen sind fertig und unverändert gültig. Nicht erneut beginnen. Nach finalen Belegen Commit/Push nur diesen Branch, PR #9 mit `/tmp/r-prepare-pr.py` und gh api aktualisieren. Finale SHA steht in PR und Antwort. Keine Änderung main/kein Merge. Abschließend echtes HTML nach `/workspace/exports/Aquarium-R01-R03.html` kopieren (dort liegt derzeit noch die alte Version!), neues Prüfsummenfile; optional `/tmp/r-package-evidence.py` nach sauberem finalem Commit. Vorbereitete Finalisierung ist noch NICHT ausgeführt; TESTS.md bleibt Zwischenstand.

---

# Eng begrenzte Downloadkorrektur: Kandidat im echten Chromium-Download bestanden

Der Browserlog identifiziert `V8 process OOM (Zone)` beim erneuten Serialisieren der großen Standalone-Datei, auch in einer frischen Expertenansicht. Kein System-OOM. Der Host bewahrt nun direkt beim Start die bereits geladene HTML-Datei als Blob auf und gibt diesen beim erneuten Download wieder aus. Die große entfernte JSON-Quelltext-Node wird geleert. Biologie, App-Ansichten und deren Navigation bleiben unverändert. Der echte Chromium-Klick lädt nun erfolgreich eine byteidentische Datei herunter (`/tmp/r-cached-download-diagnostic.log`, BYTE IDENTICAL). Alle 201 Modultests erneut bestanden (`/tmp/r-cached-download-unit.log`).

Neue Kandidatendatei: 151.594.853 Bytes, SHA ea1bd887f8f301d079fb7636c72fd6ec60a83695045b56f79badd43e8f1e1666. Die bisherigen b806579-Offlineberichte sind versionsbezogen und werden nicht zur Endprüfung dieses Kandidaten erklärt. Nächste Schritte: Commit/Push sichern, echte neue Downloadfunktion auf Normalwebsite, anschließend gesamte Offline-Endprüfung mit neuer Datei wiederholen. Reguläre Missionen/Reader/Modelle unverändert gültig und nicht neu beginnen.

---

# Neuer Pflichtbefund: Chromium stürzt beim erneuten Standalone-HTML-Download ab

Anwendung b806579 noch NICHT endgültig freigeben. Voller Chromium-Offlinelauf bestand M1/M3 mit Dateirückkehr, alle sechs Ansichten und Forschen 8/9/10, stürzte aber im Expertenmodus beim erneuten 151-MB-HTML-Download ab (`/tmp/r-release-offline/chromium/report.json`, status failed). Fokussierter frischer Chromium-Lauf reproduziert denselben Tababsturz (`/tmp/r-offline-tail-chromium/chromium/report.json`). Keine System-OOM-Ereignisse; gezieltes Browser-Stderr-Diagnoseskript `/tmp/r-download-crash-diagnostic.py`, Log daneben. Das ist ein echter neuer Anwendungs-/Browserbefund, kein weiterer Selektorfehler. Noch keine neue Anwendungskorrektur nach b806579.

Nicht erneut prüfen: beide regulären Sechs-Missionsläufe, Reader, Modelle und alle angrenzenden Website-Funktionen; sie sind unverändert gültig. Weitere Änderungen möglichst ausschließlich am Standalone-Downloadpfad. Nach einer Änderung neue echte HTML-Datei und genaue Hash-Nachweise, Standalone-Endtests wiederholen; b806579-Offlinereports nicht als Prüfung eines neueren Artefakts ausgeben. Vorbereitete Finalisierungsskripte unter /tmp enthalten noch b806579 und Hash 576… und müssen nach einer Korrektur aktualisiert werden. TESTS.md ist weiterhin ausdrücklich Zwischenstand.

---

# WebKit-Offlinenachweise vollständig bestanden

Beide finalen WebKit-Prüfverfahren sind erfolgreich abgeschlossen: strikter Browser-Offlineschalter (`/tmp/r-strict-offline/webkit/report.json`) und vollständiger ursprünglicher Prüfweg mit blockiertem HTTP/HTTPS (`/tmp/r-network-blocked-offline/webkit/report.json`). Letzterer umfasst Datei-Rückkehr, historische CSV, erneuten HTML-Download, wiederholte Ressourcenbestände und Speichernotfall. Die echte Einzeldatei hat weiterhin denselben finalen Hash. Zwei offline heruntergeladene historische CSV zusätzlich unabhängig gegen die unveränderten Originaldateien geprüft.

Einziger noch laufender Anwendungstest: vollständiger Chromium-Offlinelauf (`/tmp/r-release-offline-chromium.log`, `/tmp/r-release-offline/chromium/report.json`). Reguläre sechs Missionen beider Engines sind fertig. Nach erfolgreichem Abschluss: `/tmp/r-collect-final.py`, `/tmp/r-finalize-docs.py` (prüft Erfolgsstatus vor Schreiben), `/tmp/r-make-gallery.py`, `/tmp/r-check-gallery.py`; aktuelle öffentliche Quellen, Galerie und Schlussbelege sichern. Vorbereiteter PR-Text `/tmp/r-prepare-pr.py` erst am endgültigen Commit erzeugen. Kein Merge.

---

# Aktueller Prüfstand: Anwendung unverändert bei b806579

Der fokussierte WebKit-Offlinelauf für Expertenmodus, Tutorial, historische CSV, Zurück/Vorwärts, wiederholte Ressourcenbestände und Speichernotfall ist bestanden (`/tmp/r-offline-tail/webkit/report.json`, ausdrücklich Teilumfang tools).

Zwei reine Harness-Korrekturen: Der historische Einstieg besitzt zwei gleichwertige sichtbare Links; die Eingabe verwendet nun denselben sichtbaren ersten Treffer wie andere Testhandlungen. Die Quotenfehler-Injektion ist ein expliziter Funktionsblock, damit Playwright nicht versehentlich die zurückgegebene Fehlerfunktion sofort aufruft. Assertions und vollständiger Standardumfang bleiben erhalten. Frühere fehlgeschlagene Prüfläufe liegen in `*-selector-development` und gelten nicht als bestanden.

Aktuell laufen die abschließenden vollständigen Prüfungen in `/tmp/r-release-offline/chromium`, `/tmp/r-network-blocked-offline/webkit`, `/tmp/r-strict-offline/webkit`; reguläres Chromium steht bei M6 (`/tmp/r-release-missions/chromium`). Erst fertige Reports mit status=passed übernehmen. Nicht doppelt starten. Native WebKit-Dateiprüfung und Lebenszyklusprüfungen beider Engines sind bereits auf der endgültigen Datei bestanden (`/tmp/r-native-docwrite`, `/tmp/r-lifecycle-docwrite`). Nativer Chromium-Dateistart ist durch Browserrichtlinie blockiert. 73 öffentliche Anwendungsdateien erneut bytegleich geprüft.

---

# Wiederaufnahme: Anwendung b806579 ist eingefroren, Endprüfungen laufen

Kein neuer Spielcode nach b806579. Standalone-HTML ist tatsächlich heruntergeladen (151.602.143 Bytes, SHA 576980d23a6c9407fc8e7fd60a8d3231d71dfd1b03d7c0f3443c8091c1af618f). Alle 201 Modultests bestanden.

Ein Testharness-Fehler ist behoben: `GameView.ready()` wartete im Expertenmodus auf einen sichtbaren body; dessen absolut positionierte Oberfläche ist sichtbar, der body selbst hat absichtlich Höhe 0. Jetzt attached für den Container, weiterhin sichtbare konkrete Zielkontrollen sowie echte App-/WebGL-/Fehlerprüfungen. Kein Spielcode wurde dafür geändert. Fehlgeschlagene/abgebrochene Läufe bleiben in `*-body-readiness-development` erhalten.

Aktive Läufe nach dieser Testkorrektur (nicht doppelt starten): reguläre Chromium-Missionen `/tmp/r-release-missions-chromium.log` (M1–M4 bereits abgeschlossen oder im Abschluss); vollständiger Chromium-Offlinelauf `/tmp/r-release-offline-chromium.log`; strikter WebKit-Offlinelauf `/tmp/r-strict-offline-webkit.log`; vollständiger WebKit-Lauf mit HTTP-Sperre `/tmp/r-network-blocked-offline-webkit.log`. Die alte Datei `/tmp/r-final-offline-queue.json` enthält noch die erledigten ersten Harness-Fehler; maßgeblich sind die aktuellen report.json in den genannten Ausgabeverzeichnissen. Deren letzte Queue-Abschnitte prüfen noch Native-/Lebenszyklusfälle auf b806579; `/tmp/r-native-docwrite` und `/tmp/r-lifecycle-docwrite` sind die passenden Endstandpfade.

Pinzette in allen drei Formaten inzwischen beendet: `/tmp/r-release-tweezers/report.json` auf Status prüfen und Belege übernehmen. Expertengeräte/6 Analysetabs, freie Fortpflanzung, beide Reader, WebKit sechs Missionen, 8 Tutorials, 5 Szenarien/14 Aquariumoriginale und 12 ältere Ergebnisdateien bestanden; Belege weitgehend schon in release-corrections kopiert. Sie nicht erneut prüfen, wenn der Anwendungscode unverändert bleibt.

Zum Abschluss noch: aktuelle Browserläufe vollständig auswerten, tatsächliche Bild-/Downloadbelege kopieren, TESTS.md vom ausdrücklich markierten Zwischenstand zum ehrlichen Endbericht aktualisieren, REVIEW.html mit /tmp/r-make-gallery.py neu erzeugen, 73 veröffentlichte Anwendungsdateien mit lokalem Code vergleichen (/tmp/r-public-source-check.py), Galerie im Browser prüfen, PR #9-Beschreibung aktualisieren, Commit/Push nur auf bestehendem Branch, main unverändert bestätigen. Keine Gesamtfreigabe bei offenem Pflichtfehler.

---

# Neuester Stand: Standalone-Host nochmals gezielt korrigiert

Die große srcdoc-Übergabe ließ den Chromium-Testprozess abstürzen (kein System-OOM). Der Host schreibt jetzt direkt in ein frisches gleichursprüngliches Dokument. Linkwechsel laufen nach Ende des Kind-Klicks in einem Host-Task, weil Chromium Schreiben aus dem gerade entfernten Kind ignoriert. Kandidat: Chromium startet und erreicht M2; WebKit zeigt alle 19 Detailmodelle ohne Textur-/Konsolenfehler. Die vollständigen Standalone-Prüfungen müssen mit dieser neuen Datei erneut abgeschlossen werden. Normale Missionsmodelle und Website-Steuerung wurden dadurch nicht geändert.

WebKit 26.5 blockiert bei `set_offline(True)` außerdem lokale File/Blob-Lesevorgänge. Ein minimales unabhängiges HTML mit Dateiöffner reproduziert: online lesbar, Offline-Schalter I/O-Fehler, bei gesperrten HTTP-Anfragen wieder unverändert lesbar (`/tmp/r-file-api-probe.json`). Daher zwei ausdrücklich getrennte Nachweise: strikter Kontext-Offlinelauf mit vollständiger M1/M3, Downloads und allen Routen (`tests/release_offline_context_browser.py`); zusätzlich kompletter ursprünglicher Prüfweg einschließlich Datei-Rückkehr bei vollständig blockiertem HTTP (`AQUARIUM_OFFLINE_TRANSPORT=http-block`, `tests/release_standalone_browser.py`). Der fehlgeschlagene erste Importlauf wird nicht umetikettiert. Chromium nutzt den vollständigen Weg mit gesetztem Offline-Schalter.

Aktuell erledigt und unverändert gültig: beide endgültigen historischen Leserprüfungen, reguläre sechs WebKit-Missionen, 8 Tutorials/Experte Chromium, alle drei Forschungsjahrgänge WebKit, 5 Szenarien + 14 Originalaquarien, 12 echte frühere Missionsergebnisse mit gleichwertigem Re-Export. Regulierter Chromium-Sechsweg läuft in `/tmp/r-release-missions-chromium.log`, Pinzette in `/tmp/r-tweezers.log`, danach startet die vorhandene Shell automatisch den Chromium-Offlinelauf. Diese laufenden Aufgaben nicht doppelt starten.

---

# Restkorrekturen R01–R03, 24.10.2026

Maßgeblich: [aktueller Nutzerauftrag](REQUEST.md), Ausgang `5b661044cc85f640518572b5cd8fb4974d9d213b`, offener PR #9, ausschließlich `feature/coherent-learning-workspaces`. Kein Merge. F01–F12 sind in der unabhängigen Nutzerprüfung im angegebenen Umfang bestanden. Das neue kleine Korrekturpaket wurde vollständig gelesen und seine Prüfsummen kontrolliert.

## Zwischenstand – noch keine Abschlussfreigabe

R01: Anzeige und CSV verwenden denselben Nachweis historischer Messgrößen. Unbekannte Fischwerte bleiben unbekannt, echte Nullwerte bleiben 0. Beide unveränderten V1-Originale mit echten Downloads und unabhängiger Inhaltskontrolle in Chromium und WebKit geprüft.

R02: Fokus und sichtbare Position des bedienten Messwertfelds werden beim Neurendern erhalten, einschließlich Grenze unter dem fixierten Panelkopf. Desktop und Hochformat in beiden Engines bestanden. Berichte `/tmp/r-reader-centered/{chromium,webkit}/report.json`.

R03: Nur die erzeugte Einzeldatei enthält einen lokalen Dokumentrahmen. Sie lädt die bereits eingebettete Anwendung bei internen Wechseln aus dem Speicher, beendet die alte Ansicht und wahrt die bisherigen Speicherplätze. Normale Website und biologische Berechnung bleiben unverändert. Grundlauf und 201 Modultests geprüft; vollständige Offline-, Lebenszyklus- und Rückwärtskompatibilitätsprüfung noch ausstehend. Große Einzeldatei bleibt außerhalb Git.

Eigene Vorher-Nachweise: `/tmp/r-before-browser/report.json` mit reproduziertem CSV-Fehler, Scrollsprung und Offline-Dokumentfehler. Bereits gesicherter R01/R02-Commit `fcda321d7a4d17aeeaeeff5d65b90a57cf2632b9`. Unfertige Entwicklungsläufe nicht als bestanden ausweisen. Die vier Blob-Fehler waren nach gezielter Nachprüfung keine abgebrochenen alten Ansichten: WebKit lehnt im Offline-Kontext neue Blob-Bilder auch in einer minimalen unabhängigen Seite ab. Der Standalone-Bündler liest eingebettete GLTF-Bildpuffer jetzt als Daten-URLs. Der wiederholte Kurzlauf startet alle 19 Detailmodelle ohne fehlgeschlagene Anfrage; keine Textur wird ausgelassen. Unfertige erste Läufe bleiben als fehlgeschlagen dokumentiert.

Nächste Schritte: echte finale HTML-Datei herunterladen; Offline-Navigation aller Wege, M1 und weitere Mission vollständig, wiederholte Ressourcen-/Speicherprüfung; alle sechs Missionen Chromium/WebKit; angrenzende Funktionen; Belege, Vorschau, finaler Bericht. Keine früheren historischen Prüfberichte als neue Endstandprüfung ausgeben.

Textur-Nachprüfung: Der erste Daten-URL-Ansatz über FileReader blieb unzureichend, weil WebKit im Offline-Kontext auch Blob-Lesevorgänge blockiert. Endgültiger Adapter kodiert den bereits vorliegenden Bildpuffer direkt und verwendet den vorhandenen HTML-Bild-Ladepfad. Eigener Screenshot zeigt wieder die unveränderten dunklen Anubiasblätter und farbigen Fische. Kurzlauf `/tmp/r-texture-proof.log`: keine Konsolenfehler oder fehlgeschlagenen Anfragen. Der volle frühere Offline-Kandidatenlauf ist ausdrücklich fehlgeschlagen und wird nicht als Nachweis verwendet.

## Gesicherte Endprüfungen des Anwendungscodes e8b9850

201/201 Modultests bestanden; beide V1-Dateien in Desktop/Hochformat in Chromium und WebKit mit 32 tatsächlichen CSV-/SVG-Downloads, Zahlenabgleich und Fokusprüfung bestanden (`/tmp/r-final-reader`). WebKit: alle sechs regulären Missionen, 110 Aufnahmen, keine Seiten-/Anfragefehler (`/tmp/r-release-missions/webkit`). Freies Forschen 8/9/10 einschließlich Pflege, Platzieren, Speichern und Speicherfehler in WebKit bestanden (`/tmp/r-release-research`). Diese erledigten Prüfungen nicht ohne neue Änderungen erneut beginnen. Kopien unter `reports`, `images`, `downloads`.

Laufende Prüfungen: reguläre Chromium-Missionen `/tmp/r-release-missions-chromium.log`; Offline-WebKit `/tmp/r-release-offline-webkit.log` (vollständige M1/M3 und alle Routen); Chromium-Warteschlange erst Tutorial/Experte (`/tmp/r-readiness.log`), dann Pinzette (`/tmp/r-tweezers.log`), dann Offline (`/tmp/r-release-offline-chromium.log`). Angrenzende WebKit-Prüfungen `/tmp/r-adjacent-queue.json`: Szenarien/14 Originale, danach zwölf frühere Missionsergebnisse. Weitere Warteschlange `/tmp/r-final-extra-queue.json`: finaler nativer WebKit-Dateistart, laufende M2 über Browser-Zurück stoppen und mit Vorwärts exakt angehalten wiederherstellen, beide Engines. Berichte auf `status` prüfen; ein Zwischenbild oder ein gedrucktes PASS für eine Teilhandlung ist kein erfolgreicher Gesamtlauf.

Reguläre Sechs-Missionsläufe starteten bei `9503d1c`; danach änderte sich nur der noch nicht verwendete Standalone-Bündler in `aquascaping.mjs`. Alle darin geprüften Schülerberechnungen, Texte und Steuerungen sind gegenüber e8b9850 identisch. Offline-Läufe, endgültige Reader-Prüfungen, angrenzende Tests und heruntergeladene HTML-Datei beziehen sich auf e8b9850. Dies im Endbericht offen ausweisen.
