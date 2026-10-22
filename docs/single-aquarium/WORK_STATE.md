# Ein Aquarium: neuer Auftrag

Ausgangspunkt: `4e59de3beb4d4af8017472301c9d28cc8ade653c`, sauber wiederhergestellt. PR #9 ist offen; Fortsetzung auf `feature/coherent-learning-workspaces`. Main bleibt unberührt. Referenz-ZIP vollständig vorhanden unter `/workspace/exports/Simulation-Aquarium-4e59de3.zip` (SHA-256 `55ca0303d867a3e6e4cd9f75472c5a90c3347e90e666c75ae4f500ab0a85259f`).

Der [neue Auftrag](REQUEST.txt) ersetzt die früheren Zwei-Becken-/14-Missions-Vorgaben. [Bedienmatrix](CONTROL_MATRIX_SOURCE.md), [beigefügte Gegenprüfung](REVIEW.html). Deren Quellen-/Kernproben sind fremde Prüfbelege, keine eigenen neuen Browserläufe.

## Verbindliches neues Gate

Abschnitt 15: „Nur M1 als vollständigen vertikalen Prototyp bauen“ und „Vor Freigabe keine flächendeckende Oberflächenumstellung.“ Abschnitt 17: „Am vereinbarten Prototyp-Gate stoppen und Sichtfreigabe abwarten“. Die frühere Temperaturfreigabe gilt ausdrücklich nicht. Phase 1 (Inventur/Architektur/Migrationsentwurf) und Phase 2 (M1) sind jetzt beauftragt; M2–M6 und die komplette freie Oberfläche folgen nach neuer Sichtfreigabe.

## Architekturentscheidung

Ein aktives Becken ist der tatsächliche Zustand des vorhandenen Haupt-Renderers. Die normale M1-Route instanziiert weder Paarrenderer noch Paarrechnung noch zusätzliche Population. Alte Module bleiben für ausdrücklich aufgerufene historische Expertenwerkzeuge erhalten. Neue stabile Missionskennungen und getrennte Speicherplätze verhindern die Umdeutung/Überschreibung alter Produkte.

Ein Durchgang enthält vollständigen Start, getätigten Eingriff, eine tatsächliche Zeitreihe und unveränderliche Checkpoints. Nur das aktuelle Becken wird während der ausdrücklich gestarteten Beobachtung fortgeschaltet. Der zweite Durchgang setzt sichtbar den gesamten Anfang zurück; nur die Lichtdauer ändert sich. Alte Läufe werden als Daten betrachtet, nicht als zusätzlich gerenderte Becken. Anzeigen und Export tragen dieselbe Zustands-/Zeitkennung.

## Nächster Schritt

Missionszuordnung und aktuelle Bedieninventur erstellen, M1 auf vorhandenen Renderer aufsetzen, echte Chromium-/WebKit-Läufe und Screenshots einschließlich Tablet durchführen. Aktueller Anwendungscode und konkrete Testzahlen werden nach der Umsetzung getrennt von den historischen 173 Tests dokumentiert. Keine vorweggenommene Gesamtfreigabe.

## Erster Implementierungsstand

M1 ist auf der neuen Standardroute implementiert; fünf weitere Missionen sind nur als kommende Fragen sichtbar. `?expert=1` erhält die bisherigen detaillierten Werkzeuge. Neues Lernprofil Version 2 und eigener Speicherschlüssel schützen alte freie Becken/Produkte. Vollständiger Start wird um 06:00 Uhr vorbereitet, beide Beobachtungen dauern exakt drei Tage. Alle Originalraten und Modelle bleiben erhalten.

179 Modultests bestanden (173 bestehende Kern-/Archivprüfungen plus sechs neue gezielte Einbeckenprüfungen). Ein erster tatsächlicher Chromium-Weg besteht einschließlich Ergebnissicherung und Reload: Sauerstoff 7,80 → 8,24 mit Licht, 7,80 → 8,16 ohne Licht. Das sind eigene Modellwerte bei diesem Start; kein erzwungener Rückgang. Ein Konflikt mit einem alten Quiz-Handler (`data-answer`) wurde durch getrennte Ereignisse/Attribute behoben; der anschließende Weg hat keine Seitenfehler. Das ausgeblendete Dateifeld wird ausdrücklich verborgen. Diese Entwicklungsläufe sind noch keine abgeschlossene Desktop-/Tablet-Abnahme.

Nächster Schritt: vollständige neue Browserprüfungen mit plausiblem Fehlerweg, tatsächlicher Objektwahl, Speicherfehlern und Geometrie; aktuelle PR-Vorschau und Einzel-HTML. Danach am neuen Gate vorlegen, nicht alle sechs Missionen als fertig melden.
