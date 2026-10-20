# Phase 1: technische Entscheidungen und Grenzen

`aquascaping.mjs` enthält den neuen Katalogteil, reine Platzierungsregeln, lokale Modell-/Texturerzeugung, den Pointer-Controller und die eigenständige HTML-Bündelung. `aquascaping.css` ergänzt die vorhandene Oberfläche. Die bestehenden Simulationen, Lerntexte, Arten, Steuerung und das Speicherformat bleiben in der bisherigen Anwendung. Das gebündelte Three.js wird über eine kleine Übergabe seiner bereits vorhandenen Klassen wiederverwendet; kein zweites Three.js und kein zusätzlicher Build sind erforderlich.

## Interaktion und Daten

- Pointer Events vereinheitlichen Maus und Touch. Pointer Capture hält die Geste auch außerhalb des Canvas fest. Weitere Finger werden während der aktiven Geste ignoriert, ohne OrbitControls auszulösen.
- Der Pinzettenmodus sperrt OrbitControls einschließlich verbleibender Kameradämpfung. Die Animation nutzt zwei bewegliche Backen, metallische Materialien und eine kurze Greif-/Hebe-/Absetzbewegung. Sie wird nur im aktiven Zustand gerendert.
- Während des Ziehens ist die Position eine Render-Vorschau. Erst beim Loslassen ändern sich die Simulationsdaten; dadurch speichern Autosave oder ein unterbrochener Tab keine halbfertige Geste.
- Abbruch, Pointer-Verlust, Fokusverlust und Spielstandwechsel räumen die Geste auf. Beim Öffnen eines anderen Werkzeugmenüs wird die Pinzette beendet.
- X/Z bleiben innerhalb der Grenzen, die auch der bisherige Version-1-Loader akzeptiert. Das optionale Entity-Feld `aquascapePlaced` wird von der vorhandenen Importlogik mitgeführt. Die spätere Zentimeterkalibrierung ergänzt eine versionierte `spatial`-Migration; siehe [Maßstab und Spielstände](physical-scale/README.md).
- Die Bodenhöhe entspricht der vorhandenen geneigten Sandoberfläche beziehungsweise der nackten Bodenscheibe. Die Unterkante des tatsächlich geladenen Modells wird daran ausgerichtet. Schwimmpflanzen bleiben an der Wasseroberfläche.

## Erweiterung: ausschließlich mit der Pinzette positionieren

Alle fünf Kategorien (Fische, Wirbellose, Pflanzen, Korallen und Dekoration) sind mit der Pinzette auswählbar. Tote Lebewesen werden weiterhin nicht gegriffen. X-/Z-Regler und die alternative Klickplatzierung sind entfernt. Drehung und Darstellungsgröße bleiben ausschließlich für Dekorationen erhalten. Organismen verwenden natürliche Ausrichtung und artspezifische Zentimetergrößen.

Bei Tieren verschieben X/Z den vorhandenen Schwimmbereich. Während der Geste bleibt die aktuelle Schwimmhöhe erhalten. Nach dem Loslassen übernimmt wieder die normale Tieranimation; `aquascapePlaced` friert Tiere nicht am Boden ein. Pflanzen, Korallen und Dekoration behalten die Boden-/Oberflächenverankerung und Kollisionsregeln. Tiere dürfen über bepflanzten Grundflächen schwimmen.

## Kollisionsmodell und Leistung

Die Platzierung verwendet Zentimetergrundflächen im jeweiligen Becken: reife Wurzel-/Rhizombasen bei Pflanzen, Kolonieflächen bei Korallen, Körpermaße bei Tieren sowie Drehung und manuelle Größe bei Dekorationen. Das verhindert deutliche Überschneidungen mit Pflanzenbasen, Dekoration, Korallen und fester Innentechnik. Es ist kein physikalischer Kontaktlöser: Überhängende Äste, Blätter und Hohlräume werden nicht einzeln auf Kollision geprüft. Das kann besonders in einer Höhle oder bei stark gedrehten Objekten vorsichtigere Abstände erzwingen, als geometrisch nötig wären. Schwimmpflanzen verwenden eine eigene Höhenebene.

Die sechs Modelle nutzen begrenzte Polygonzahlen, 128 × 128 Pixel große lokal erzeugte Texturen und die vorhandene Zusammenfassung nach Material. Geometrien werden vor dem Zusammenfassen auf dieselbe Indexierungsform gebracht. Beim Entfernen oder Zerstören werden Materialien/Geometrien über die vorhandene Lebensdauerverwaltung freigegeben. Unterkanten werden je Modell und aktuellem physischem Wachstumsmaß zwischengespeichert. Die Strahl-/Bodenberechnung berücksichtigt die vollständige Tanktransformation in allen Achsen. Es kommen weder eine Physikbibliothek noch externe Dienste hinzu.

Die neue Pinzette nutzt dieselben Schatten-/Pixeldichte-Einstellungen wie die vorhandene Szene. Cloud-Tests laufen über Chromium/SwiftShader und sind Funktionsnachweise, keine zuverlässigen Leistungswerte echter Schulgeräte. Ein echtes Safari-/iPad-Gerät stand für diese Änderung nicht zur Verfügung.

## Assetherkunft und biologischer Umfang

Die sechs neuen Dekorationen, ihre kleinen prozeduralen Oberflächentexturen, das Pinzettenmodell und sein Icon sind für diese Änderung direkt im Quellcode erstellt. Sie enthalten keine heruntergeladenen Fotos, Modelle oder fremden Texturen und benötigen keine zusätzlichen Quellenangaben. Vorhandene Asset-/Lizenzangaben des Spiels werden beibehalten. Eine allgemeine Lizenz des gesamten Repositorys wird durch diese Herkunftsangabe nicht neu festgelegt.

Die Modelle unterscheiden sich durch Geometrie, Material, Farbe und Hohlräume. Sie sind naturorientierte Darstellungen, kein erreichter Fotorealismus. Die Katalogtexte unterscheiden Süß- und Meerwasser und benennen Versteck-/Aufsitz-/Besiedlungsflächen. Eine aus diesen Flächen abgeleitete Änderung von Wasserwerten, Mikroorganismen oder Tierverhalten ist nicht Bestandteil dieser Phase; solche zusätzlichen Prozesse brauchen in Phase 5 ein fachlich geprüftes Modell.

## Prüfung und Belege

Die Node-Tests prüfen die tatsächlichen Platzierungsregeln und die Bündelung des HTML-Downloads. Der Playwright-Test bedient das Spiel unter dem Projektpfad `/Simulation-Aquarium/`, importiert eine dokumentierte alte Version-1-Testdatei, bewegt Objekte mit echten Pointer-/Touch-Ereignissen und kontrolliert die gespeicherten Ergebnisse. Die Fixture `tests/fixtures/legacy-v1.json` ist ein zuvor mit der alten Version erzeugter künstlicher Testspielstand, kein Schüler- oder Nutzerspielstand.

Weitere Belege liegen in `docs/screenshots`. Die vollständigen Resultate eines aktuellen Browserlaufs werden im vom Runner ausgegebenen Ergebnisverzeichnis gespeichert. Freies Spiel, Tutorial und grundlegende Speicherung sind zusätzlich mit dem vorhandenen Bereitschaftslauf zu prüfen. Der separate Standalone-Test startet die heruntergeladene HTML-Datei ohne HTTP-Ressourcenabrufe.

Die verwaltete Cloud-Browserversion blockiert das direkte Navigieren zu `file:` mit `ERR_BLOCKED_BY_ADMINISTRATOR`. Der Standalone-Test erhält diese Richtlinie und prüft in diesem Fall die heruntergeladene Datei allein über einen temporären lokalen HTTP-Server, ohne danebenliegende Modul- oder CSS-Dateien. Das bestätigt die eigenständige Bündelung, aber keinen tatsächlich ausgeführten direkten Dateiaufruf in dieser Cloud-Umgebung.
