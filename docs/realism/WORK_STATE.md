# Gesicherter Arbeitsstand – grafische Transformation

Neuer Auftrag vom 18. Oktober 2026. Branch `feature/realistic-rendering-profiles` auf `81eabc4` (zusammengeführte Phasen 2–5). main bleibt unverändert.

181 Einträge inventarisiert. Blender 4.3.2, Three.js 0.180, Chromium/Playwright und Pillow verfügbar. Öffentliche Material-APIs von Poly Haven und ambientCG liefern Proxy-403; keine zusätzlichen Konten oder Bezahldienste verwenden.

In Arbeit: gemeinsame Grafikprofile/iPad-Auswahl; anschließend Geometrie-/Materialpass aller 133 Organismen, 11 Dekorationen und übrigen Technik-/Bedarfsgruppen. Die Matrix ist ausdrücklich keine Behauptung erreichten Fotorealismus. Nächste konkrete Schritte: Renderingprofile integrieren, Blender-Hardscape-Assets mit zwei LODs erzeugen, artspezifische vorhandene Anatomien verfeinern und neue Laufzeitbilder prüfen.

Regelmäßig auf Featurebranch committen und pushen. Alle biologischen Module und v1-Speicherplätze erhalten. Kein automatischer Neustart nach Kontingentreset möglich. API-basierte PR-Erstellung war zuletzt gesperrt; Git-Push funktioniert.

Zwischenstand: Plattformauswahl und profilabhängiger Neuaufbau ohne Speicheränderung implementiert. Maximum wurde in Chromium/SwiftShader mit 24 Organismen-/Dekorobjekten und ca. 1,5 Mio. Dreiecken gestartet; Wechsel zu iPad erhält gespeicherte Bytes. 11 Dekorationen × 2 GLB-LODs mit eigener CC0-Geometrie erzeugt; Bodenpivot nach Dezimierung korrigiert und automatisch geprüft. Alle 181 Vorschauen wurden aus dem neuen Renderpfad erneuert; der jüngste organische Konturpass wird gerade nachgerendert. Kontur-/UV-/Optikpass ist implementiert, aber die visuelle Abnahme der Tiere und Pflanzen ist noch offen. Photorealismus ist ausdrücklich nicht erreicht. Nächste Schritte: neue Browserprüfung (Maximum/iPad, alle 144 realen Modellpfade), Regression von Pinzette/Analyse/Tutorial/Ein-Datei-Export, vollständige ehrliche Bearbeitungsmatrix und Bildvergleiche.
