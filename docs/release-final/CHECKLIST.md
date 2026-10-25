# Einsatz und manuelle Veröffentlichung

Diese Checkliste dient der Veröffentlichung und Geräteabnahme. Sie ist kein
Nachweis, dass die unten genannten Handlungen auf echter iPad-Hardware bereits
ausgeführt wurden. Die durchgeführten Softwareprüfungen stehen im Release-Bericht.

## Veröffentlichung durch den Projektinhaber

- Den finalen Commit von PR #9 mit dem Release-Bericht vergleichen; Modultests
  und den Workflow „Aquarium – Website und PR-Vorschauen“ auf Erfolg prüfen.
- Die PR-Vorschau öffnen und bei M4 „Elternbeiträge“ mit Tab, Shift+Tab,
  Pfeiltasten und Escape bedienen. Die Auswahl muss erreichbar bleiben.
- PR #9 selbst nach `main` zusammenführen. Codex hat keinen Merge ausgeführt.
- Den anschließenden Pages-Workflow abwarten. Unter Repository → Settings →
  Pages bleibt „GitHub Actions“ die Quelle.
- Die [öffentliche Website](https://feerson1617.github.io/Simulation-Aquarium/)
  neu laden; sechs Missionen und die Expertenwerkzeuge müssen erreichbar sein.

## Desktop im Unterricht

- Die Webadresse im aktuellen Browser öffnen; bei Bedarf Grafikprofil „iPad“
  für schwächere Geräte verwenden.
- Eine Mission beginnen, pausieren und einen JSON-Stand herunterladen. Nach
  erneutem Öffnen muss derselbe Stand angehalten fortsetzbar sein.
- Vor dem Löschen von Browserdaten oder einem Gerätewechsel Stände als JSON
  sichern. Die HTML-Backup-Datei ersetzt keinen individuellen Spielstandexport.
- Für Offline-Nutzung die neue Einzeldatei herunterladen. Alte HTML-Dateien
  aktualisieren sich nicht selbst. Sie bleiben eine zusätzliche Backup-Variante;
  die Webversion ist der reguläre Unterrichtsweg.

## Physisches iPad / natives Safari – noch offen

- Gerätemodell, iPadOS-/Safari-Version und Grafikprofil festhalten.
- In Hoch- und Querformat eine Pflanze und einen Fisch direkt antippen; die
  Markierung und die Angaben müssen zum tatsächlich gewählten Individuum passen.
- In M1 im Hochformat alle drei Vermutungen sowie den Tipp ohne Kartenscroll
  erreichen; in M4 Versuch und Generation im Elterndialog auswählen.
- Eine Beobachtung pausieren, Safari verlassen und wieder öffnen. JSON in
  „Dateien“ sichern und über die Dateiauswahl wieder einlesen.
- Nur nach tatsächlicher Durchführung als Hardwaretest „bestanden“ vermerken.
  Die vorhandenen Linux-WebKit-/Touch-Tests ersetzen diese Geräteprüfung nicht.

Ein hier noch nicht ausgeführter Hardwaretest wird nicht als neuer Spieldefekt
ausgegeben. Die Release-Entscheidung und Grenzen von Web und Standalone werden
getrennt dokumentiert.
