# Prüfbericht zum physikalischen Maßstab

Stand: 20. Oktober 2026. Die Prüfungen verwenden echte lokale Spielseiten unter einem GitHub-Pages-kompatiblen Projektpfad. Python/Playwright und Chromium 154 rendern mit SwiftShader; Node 24 prüft die reinen Regeln. Browserläufe werden nacheinander ausgeführt. Keine Nutzer-Spielstände werden als Testprofil verwendet.

## Abgeschlossene Prüfungen

- **71 Node-Tests bestanden**, kein übersprungener oder abgebrochener Test. Enthalten sind bestehende Biologie-, Genetik-, Katalog-, Grafik- und Platzierungsregeln sowie 16 gezielte Maßstabsfälle.
- **2 GLB-Prüfungen bestanden**, einschließlich vorhandener Organismenpakete und neuer Anubias-Dateien.
- Die tatsächlichen GLB-Dateien und die Fotoreferenz stimmen mit den dokumentierten SHA-256-Hashes überein.
- Gespeichertes lokales Setup und Starthelfer erneut ausgeführt: Werkzeuge vorhanden, HTTP 200 und exakter Hash der aktuellen index.html. Vorhandene `install_script`-/`start_skill`-Konfiguration bleibt erhalten; keine neue Veröffentlichung ausgelöst.

## Abschließender Browserlauf

Alle ausgewählten Läufe sind abgeschlossen. Ergebnisse stammen aus den jeweiligen aktuellen Ergebnisverzeichnissen. Betroffene Prüfungen wurden nach Korrekturen erneut ausgeführt; reine Dokumentationsänderungen benötigen keinen erneuten Browserlauf.

| Bereich | Prüfinhalt | Status |
| --- | --- | --- |
| Maßstab | echte Vertices und Glasgrenzen aller sieben Becken; Fisch-/Pflanzenverhältnis und Profilgleichheit; biologische Regler; alte Skalen; Alter/Geschlecht/Biomasse; Maus/Touch und Reload | **8 Prüfschritte mit finaler Kronenprüfung bestanden**, keine JavaScript-Fehler |
| Technik | vier getrennte Innenaggregate in sieben Becken; erneute Platzprüfung nach Beckenwechsel; Außenfilter und Sumpf in 30/700 L | **12 Prüffälle bestanden**, keine JavaScript-Fehler |
| Katalog/UI | gemeinsame Artbilder, reale 3D-Auswahl, Pinzette aller Kategorien, Wasser-/Zeit-/Grafikbedienung, Tutorial und Touch | **13 Prüfschritte bestanden**, keine JavaScript-Fehler |
| Genetik | reale Käufe, F1/F2, Nachwuchsgröße, Platy, Eier/Schlupf, Speichererhalt, Touch | **9 Prüfschritte bestanden**, keine JavaScript-/Shader-/Ressourcenfehler |
| Ökosystem | Analyse, Szenarien, Mikroskop und alte Spielstände | **12 Prüfschritte bestanden**, keine JavaScript-/Ressourcenfehler |
| Aquascaping | Maus/Touch, echte Modellgrenzen, Kollisionen, Kamerasperre, Abbruch, Tastatur und Speicherung | **12 Prüfschritte bestanden**, keine JavaScript-/Shader-/Ressourcenfehler |
| Bereitschaft | Spielstart, alle acht Tutorialstufen per Touch, Hochformat, Pflege, Wasserwerte, Zeit und Import/Export | **13 Prüfschritte bestanden**, keine JavaScript-/Spielressourcen-/externen Laufzeitabrufe |
| HTML-Download | heruntergeladene Datei allein mit Modellen, Varianten, Genetik und Pinzette | **Bestanden ohne zusätzliche HTTP-Ressourcen**; direkter file:-Aufruf durch Browserrichtlinie blockiert |

## Wiederholung in der eingerichteten Cloud

Den Starthelfer ausführen, danach die folgenden Läufe **nacheinander**, damit mehrere Software-WebGL-Prozesse nicht konkurrieren:

```bash
python3 /workspace/aquarium-devtools/start.py
export AQUARIUM_CHROMIUM=/usr/bin/chromium
node --test tests/*.test.mjs
python3 tests/species_assets_test.py
python3 tests/physical_scale_browser.py
python3 tests/physical_hardware_browser.py
python3 tests/catalog_ui_browser.py
python3 tests/genetics_browser.py
python3 tests/ecosystem_browser.py
python3 tests/aquascaping_browser.py
python3 /workspace/aquarium-devtools/check.py
python3 tests/standalone_browser.py
```

Alle Repository-Befehle laufen aus `/workspace/Simulation-Aquarium`. Der Starthelfer prüft den Hash der aktuellen HTML-Datei; Browser verwenden isolierte Profile. Die originalen Ergebnisse jeder ausgeführten Suite werden übernommen, keine alten Ergebnisse als neuer Lauf ausgegeben.

## Visuelle Prüfung

Die [drei Vorher-/Nachher-Blickwinkel](comparison/capture.json) stammen aus der realen Artgalerie bei Maximum. Desktop-Aufnahmen und Maßstabsszenen liegen unter `comparison/` und `evidence/`. Kein erzeugtes Bild wird als Browseraufnahme ausgegeben. Frühere fehlerhafte Anubias-UVs mit hellem Fotohintergrund wurden verworfen und bleiben getrennt als abgelehnte Versuche dokumentiert.

Das finale Modell verbessert Blattbreite, Neigung und Fotostruktur; Rhizom und Wurzeln bleiben stilisiert. Diese Sichtprüfung bestätigt einen begrenzten Fortschritt, keinen vollständigen Fotorealismus.

## Während der Arbeit behobene Probleme

Die natürliche Verkleinerung machte den exakten Desktop-Klick auf dünne Pflanzenteile unzuverlässig. Eine begrenzte Bildschirmauswahlhilfe am sichtbaren Mittelpunkt behebt dies; der vollständige UI-Lauf bestand danach. Die erste Außenfilter-Testdatei verwendete eine nicht existierende Katalog-ID und wurde vom Loader korrekt abgewiesen. Der korrigierte vollständige Lauf mit der echten ID `external600` bestand; die Importprüfung wurde nicht gelockert.

Eine zusätzliche Randprüfung wies nach, dass die bisherige Pflanzenbasis-Freistellung Blätter über die Scheiben lassen konnte. Die neue Kronenvermessung und separate Glasfreistellung beheben dies; der neue Node-Test scheiterte [vorher](evidence/plant-bounds-before.log) und besteht [nachher](evidence/node-tests.log). Der Browserlauf ergänzt dafür eine tatsächliche Ziehgeste außerhalb des Canvas. Der Dekorationskauftest verwendet unabhängige leere Becken je Stück: zufällige Drehung kann selbst große Becken so aufteilen, dass eine weitere zusammenhängende Fläche fehlt. Automatisches Umräumen gehört nicht zur Platzsuche.

Der Einzeldatei-Test zeigte außerdem einen echten Neukauffehler: eine diagonal zu tiefe Dekoration wurde auch dann abgewiesen, wenn sie gerade ins Becken passte. Neue Stücke versuchen nun geeignete Ausrichtungen; alte gespeicherte Drehungen bleiben erhalten. Ein eigener Node-Test und die tatsächliche Kaufprüfung im heruntergeladenen Spiel decken den Fall ab.

## Aussagegrenzen

- Die eigenständige HTML-Datei enthält alle Modelle/LODs und ist 150.901.519 Bytes (ca. 144 MiB) groß. Der verwaltete Browser sperrt `file:`; der Funktionsnachweis erfolgte mit genau dieser Datei allein über einen temporären lokalen Server ohne weitere Ressourcen.
- Kein echtes Safari-iPad und keine Hardware-GPU verfügbar. Chromium mit Touch-Emulation ist ein Funktionsnachweis und keine Safari- oder Leistungsfreigabe.
- Keine neue vollständige externe Literaturvalidierung aller Größen. Vorhandene Katalogquellen und neue explizite Annahmen sind in SIZES.md dokumentiert.
- Zweidimensionale Grundflächen ersetzen keine vollständige Kontaktphysik für Blätter, Verzweigungen, Höhlen und schwimmende Tiere.
- Biologische Nennvolumina bleiben erhalten; Bruttoglasvolumen ist kein behaupteter Netto-Wasserinhalt.
- GitHub-Push ist geprüft. Ein erfolgreicher PR-/Pages-Deployment ist erst nach tatsächlicher GitHub-Bestätigung nachgewiesen.
