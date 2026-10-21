# Gerätebedienung und Eingriffe

Diese Regeln gelten für neue Änderungen an allen 14 Quests, Freiem Forschen in den Klassen 8, 9 und 10 sowie dem Expertenmodus. Die Bedienung soll am sichtbaren Aquarium verständlich werden. Die fachlichen Freischaltungen und Lernziele bleiben erhalten.

## Dauerhafte Einstellungen

Heizstab, Lampe und vorhandener Filter werden direkt am hervorgehobenen 3D-Gerät beziehungsweise an dessen großer, räumlich mitgeführter Schaltfläche geöffnet. Verwende den gemeinsamen Regler aus `control-dial.mjs` und `equipment-ui.mjs`. Er unterstützt Pointer-Ereignisse, Ziehen, Pfeiltasten, Home/End, PageUp/PageDown, große Plus/Minus-Tasten und direkte Texteingabe. Touch-Ziele sollen mindestens 44 × 44 CSS-Pixel groß sein. Escape schließt den Regler, Fokus bleibt bedienbar, Kameragesten laufen während der Einstellung nicht weiter.

Solltemperatur, Durchfluss, Lichtdauer, Lichthelligkeit, tägliche Futtermenge und CO₂-Zufuhr gelten weiter, bis die Person sie ändert. Eine Einstellung besitzt kein Ablaufdatum und kein Feld „Tage“. Regler verändern weder Spielzeit noch Wasserwerte unmittelbar. Filterdurchfluss darf keine Filterbakterien zurücksetzen. Ein ausgeschalteter, eingebauter Heizstab bleibt als Gerät sichtbar. Nicht vorhandene Geräte müssen über den bestehenden Zooladen eingebaut werden.

Die Lernprofile verwenden fachlich begrenzte Wertebereiche. Der Expertenmodus darf größere Bereiche anbieten, muss aber dieselben Handler und dieselbe Bedienlogik verwenden. Die Halbgrad-Schritte der Lernheizung gelten von 20 bis 30 °C; der Expertenregler reicht von 15 bis 33 °C. Gemeinsame Verarbeitung und Prüfung stehen in `control-values.mjs`. Deutsche Dezimalkommas und Dezimalpunkte sind erlaubt. Leere, nicht endliche oder außerhalb des Rasters liegende Werte benötigen eine konkrete Meldung am Feld. Standardwerte müssen den eigenen Validator passieren.

Die Temperatur folgt einem vereinfachten zeitlichen Wärmeaustausch mit 22 °C Raumtemperatur. Der Heizstab erwärmt, er kühlt nicht aktiv unter die Raumtemperatur. Das ist ein Unterrichtsmodell ohne kalibrierte Heizleistung oder thermische Beckenmasse. Licht und Durchfluss wirken über den bestehenden biologischen Rechenkern auf spätere Wasserwerte.

## Einmalige Aktionen und nicht räumliche Eingriffe

Wasserwechsel, Nährstoffeintrag und Einsetzen von Pflanzen werden genau einmal ausgeführt. Dafür sind Mengenfelder mit verständlichen Einheiten geeigneter als ein erfundenes Gerät. Elternwahl, Genotypen, Selektionsumgebung und Generationenzahl behalten fachlich passende Auswahlmöglichkeiten. Natürliches Tageslicht ohne eingebaute Lampe bleibt eine Umgebungsbedingung. Erfinde dafür kein 3D-Gerät.

## Kontrollierte Vergleiche

Ein Geräteklick in einer Quest plant standardmäßig das Versuchsbecken. Im Freien Forschen verändert ein Geräteklick standardmäßig das aktuelle Becken; der Aufruf aus „Ausprobieren“ plant den Vergleich. Der Regler muss diesen Unterschied benennen. Die gemeinsame Ausgangslage wird nicht durch eine Änderung am Versuchsplan überschrieben.

Der Beobachtungszeitraum bestimmt ausschließlich die Länge der berechneten Datenreihe. Im normalen Lernmodus liegt diese Einstellung unter „Beobachtungszeitraum“. Nach dem letzten Messpunkt laufen die Geräteeinstellungen im übernommenen Becken weiter. Einmalige Maßnahmen werden beim Weiterrechnen nicht erneut ausgeführt. Generationen bleiben von Tagen getrennt.

Ergebnisse müssen ihre tatsächliche Konfiguration behalten. Änderungen am Plan kennzeichnen vorhandene Ergebnisse als veraltet. Eine ausstehende Ergebnisantwort oder Erklärung darf damit nicht abgeschlossen werden. Ein erneut berechneter Versuch ersetzt die ausstehende Auswertung und verlangt eine neue Antwort. Bereits abgeschlossene Quests behalten ihren historischen Beleg.

## Prüfpflicht für künftige Änderungen

Lies zusätzlich `AGENTS.md`. Prüfe alle betroffenen Lernprofile über den gemeinsamen Codepfad. Neue Controls brauchen gültige Standardwerte, verständliche Einheiten, Grenzen, Schritte, leere Eingaben, Dezimalkomma, Tastatur und Touch. Prüfe Speichern/Laden, zeitliche Reaktion, Einmaligkeit von Aktionen, unveränderte Vergleichsausgangslagen sowie Quest-Abschluss und veraltete Ergebnisse.

`node --test tests/*.test.mjs` enthält die Regressionen in `tests/device-controls.test.mjs`. `tests/device_controls_browser.py` ergänzt echte UI-Abläufe mit Maus und emuliertem Touch für alle drei Jahrgänge sowie Mission 1. Die vorhandene vollständige Quest-Suite steht in `tests/quest_browser.py`. Ein emulierter Touch-Test ersetzt keinen Test auf einem echten Schul-iPad mit Safari.

Die Prüfung vom 21. Oktober 2026 mit Prioritäten, Reproduktionen und Testmatrix steht in `docs/device-controls-audit.md`. Für selbstständige Folgearbeiten steht der vollständige Auftrag in `docs/device-controls-codex-instruction.md`.
