# Restkorrekturen R01–R03, 24.10.2026

Maßgeblich: [aktueller Nutzerauftrag](REQUEST.md), Ausgang `5b661044cc85f640518572b5cd8fb4974d9d213b`, offener PR #9, ausschließlich `feature/coherent-learning-workspaces`. Kein Merge. F01–F12 sind in der unabhängigen Nutzerprüfung im angegebenen Umfang bestanden. Das neue kleine Korrekturpaket wurde vollständig gelesen und seine Prüfsummen kontrolliert.

## Zwischenstand – noch keine Abschlussfreigabe

R01: Anzeige und CSV verwenden denselben Nachweis historischer Messgrößen. Unbekannte Fischwerte bleiben unbekannt, echte Nullwerte bleiben 0. Beide unveränderten V1-Originale mit echten Downloads und unabhängiger Inhaltskontrolle in Chromium und WebKit geprüft.

R02: Fokus und sichtbare Position des bedienten Messwertfelds werden beim Neurendern erhalten, einschließlich Grenze unter dem fixierten Panelkopf. Desktop und Hochformat in beiden Engines bestanden. Berichte `/tmp/r-reader-centered/{chromium,webkit}/report.json`.

R03: Nur die erzeugte Einzeldatei enthält einen lokalen Dokumentrahmen. Sie lädt die bereits eingebettete Anwendung bei internen Wechseln aus dem Speicher, beendet die alte Ansicht und wahrt die bisherigen Speicherplätze. Normale Website und biologische Berechnung bleiben unverändert. Grundlauf und 201 Modultests geprüft; vollständige Offline-, Lebenszyklus- und Rückwärtskompatibilitätsprüfung noch ausstehend. Große Einzeldatei bleibt außerhalb Git.

Eigene Vorher-Nachweise: `/tmp/r-before-browser/report.json` mit reproduziertem CSV-Fehler, Scrollsprung und Offline-Dokumentfehler. Bereits gesicherter R01/R02-Commit `fcda321d7a4d17aeeaeeff5d65b90a57cf2632b9`. Unfertige Entwicklungsläufe nicht als bestanden ausweisen. Insbesondere der erste Offline-Kurzlauf verließ eine Ansicht vor Abschluss ihrer Texturladung (abgebrochene Blob-Anfragen); reguläre Abnahme muss vollständig gestartete Ansichten prüfen.

Nächste Schritte: echte finale HTML-Datei herunterladen; Offline-Navigation aller Wege, M1 und weitere Mission vollständig, wiederholte Ressourcen-/Speicherprüfung; alle sechs Missionen Chromium/WebKit; angrenzende Funktionen; Belege, Vorschau, finaler Bericht. Keine früheren historischen Prüfberichte als neue Endstandprüfung ausgeben.
