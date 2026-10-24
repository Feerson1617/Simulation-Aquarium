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
