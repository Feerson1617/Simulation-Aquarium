# Arbeitsstand: Maßstab und Naturtreue

Stand: 20. Oktober 2026, Branch `feature/physical-scale-realism` auf Basis von `main` 63e7bc9 (PR #6 bereits enthalten). Der erste Implementierungsstand e44faaa ist auf GitHub gesichert. Keine erhaltenen ungesicherten Änderungen des alten Vorgängerbranches wurden verworfen.

Implementiert: Zentimeterdaten für sieben Becken und alle 144 Katalogarten/-objekte; alters-, geschlechts- und wachstumsabhängige natürliche Größen; reale Modellvermessung unabhängig von Tank und Grafikprofil; biologische Größen-/Drehregler entfernt; Dekoration weiterhin einstellbar. Versionierte, idempotente Migration mit archivierten alten Darstellungswerten und nachvollziehbaren Umsetzungen; physische Boden-/Glasgrenzen, Pinzetten- und Technikabstände. Kleine Modelle erhalten eine begrenzte Bildschirmauswahlhilfe.

Ein gezieltes Anubias-Modellpaar wurde mit Blender und einer vorhandenen CC-BY-4.0-Fotoreferenz verbessert, im tatsächlichen Maximum-Browser aus drei Blickwinkeln verglichen und in den Katalog übernommen. Zwei frühere Texturvarianten wurden sichtbar verworfen. Gute übrige Modelle bleiben erhalten. Vollständiger Fotorealismus ist weiterhin nicht erreicht.

Prüfstand dieses Zwischencommits: acht neue Browserprüfungen zum Maßstab einschließlich Wachstum, Desktop-/Touch-Pinzette und Profilgleichheit bestanden; sieben Becken mit real vermessener Innenhardware bestanden. Die ergänzte Außenfilterprüfung und abschließenden UI-/Genetik-/Ökosystem-/Aquascaping-/Standalone-Regressionen laufen noch. Keine ausstehenden Prüfungen als bestanden behandeln. Abschlussprotokoll folgt in VALIDATION.md.

Kostenlose lokale Werkzeuge: Node, Python, Chromium/Playwright und Blender. Keine neuen Accounts, API-Schlüssel oder Fremdkosten. Keine Änderungen an main, AGENTS.md oder Veröffentlichung. Git-Push funktioniert; GitHub-API-Zugriff und PR-Erstellung werden zum Abschluss gesondert geprüft.
