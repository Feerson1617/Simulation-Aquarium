# Prüfbericht zum physikalischen Maßstab

Stand: 20. Oktober 2026. Die Prüfungen verwenden echte lokale Spielseiten unter einem GitHub-Pages-kompatiblen Projektpfad. Python/Playwright und Chromium 154 rendern mit SwiftShader; Node 24 prüft die reinen Regeln. Browserläufe werden nacheinander ausgeführt. Keine Nutzer-Spielstände werden als Testprofil verwendet.

## Abgeschlossene Prüfungen

- **68 Node-Tests bestanden**, kein übersprungener oder abgebrochener Test. Enthalten sind bestehende Biologie-, Genetik-, Katalog-, Grafik- und Platzierungsregeln sowie 13 gezielte Maßstabsfälle.
- **2 GLB-Prüfungen bestanden**, einschließlich vorhandener Organismenpakete und neuer Anubias-Dateien.
- Die tatsächlichen GLB-Dateien und die Fotoreferenz stimmen mit den dokumentierten SHA-256-Hashes überein.
- Gespeichertes lokales Setup und Starthelfer erneut ausgeführt: Werkzeuge vorhanden, HTTP 200 und exakter Hash der aktuellen index.html. Vorhandene `install_script`-/`start_skill`-Konfiguration bleibt erhalten; keine neue Veröffentlichung ausgelöst.

## Abschließender Browserlauf

Die endgültigen Ergebnisse werden nach Ende jedes Runners aus dessen aktuellem Ergebnisverzeichnis übernommen. Der laufende Abschluss umfasst:

| Bereich | Prüfinhalt | Status |
| --- | --- | --- |
| Maßstab | echte Vertices und Glasgrenzen aller sieben Becken; Fisch-/Pflanzenverhältnis und Profilgleichheit; biologische Regler; alte Skalen; Alter/Geschlecht/Biomasse; Maus/Touch und Reload | **8 Prüfschritte mit finalen Assets bestanden**, keine JavaScript-Fehler |
| Technik | vier getrennte Innenaggregate in sieben Becken; erneute Platzprüfung nach Beckenwechsel; Außenfilter und Sumpf in 30/700 L | **12 Prüffälle bestanden**, keine JavaScript-Fehler |
| Katalog/UI | gemeinsame Artbilder, reale 3D-Auswahl, Pinzette aller Kategorien, Wasser-/Zeit-/Grafikbedienung, Tutorial und Touch | **13 Prüfschritte bestanden**, keine JavaScript-Fehler |
| Genetik | reale Käufe, F1/F2, Nachwuchsgröße, Platy, Eier/Schlupf, Speichererhalt, Touch | ausstehend |
| Ökosystem | Analyse, Szenarien, Mikroskop und alte Spielstände | ausstehend |
| Aquascaping | Maus/Touch, Grenzen, Kollisionen, Kamerasperre, Abbruch und Speicherung | ausstehend |
| Bereitschaft | Spielstart, Tutorial, Pflege, Wasserwerte, Zeit und Import/Export | ausstehend |
| HTML-Download | heruntergeladene Datei allein mit Modellen, Varianten, Genetik und Pinzette | ausstehend |

## Visuelle Prüfung

Die [drei Vorher-/Nachher-Blickwinkel](comparison/capture.json) stammen aus der realen Artgalerie bei Maximum. Desktop-Aufnahmen und Maßstabsszenen liegen unter `comparison/` und `evidence/`. Kein erzeugtes Bild wird als Browseraufnahme ausgegeben. Frühere fehlerhafte Anubias-UVs mit hellem Fotohintergrund wurden verworfen und bleiben getrennt als abgelehnte Versuche dokumentiert.

Das finale Modell verbessert Blattbreite, Neigung und Fotostruktur; Rhizom und Wurzeln bleiben stilisiert. Diese Sichtprüfung bestätigt einen begrenzten Fortschritt, keinen vollständigen Fotorealismus.

## Während der Arbeit behobene Probleme

Die natürliche Verkleinerung machte den exakten Desktop-Klick auf dünne Pflanzenteile unzuverlässig. Eine begrenzte Bildschirmauswahlhilfe am sichtbaren Mittelpunkt behebt dies; der vollständige UI-Lauf bestand danach. Die erste Außenfilter-Testdatei verwendete eine nicht existierende Katalog-ID und wurde vom Loader korrekt abgewiesen. Der korrigierte vollständige Lauf mit der echten ID `external600` bestand; die Importprüfung wurde nicht gelockert.

## Aussagegrenzen

- Kein echtes Safari-iPad und keine Hardware-GPU verfügbar. Chromium mit Touch-Emulation ist ein Funktionsnachweis und keine Safari- oder Leistungsfreigabe.
- Keine neue vollständige externe Literaturvalidierung aller Größen. Vorhandene Katalogquellen und neue explizite Annahmen sind in SIZES.md dokumentiert.
- Zweidimensionale Grundflächen ersetzen keine vollständige Kontaktphysik für Blätter, Verzweigungen, Höhlen und schwimmende Tiere.
- Biologische Nennvolumina bleiben erhalten; Bruttoglasvolumen ist kein behaupteter Netto-Wasserinhalt.
- GitHub-Push ist geprüft. Ein erfolgreicher PR-/Pages-Deployment ist erst nach tatsächlicher GitHub-Bestätigung nachgewiesen.
