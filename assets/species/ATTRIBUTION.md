# Eigene Artenmodelle und Texturquellen

Die neuen GLBs werden lokal mit Blender 4.3.2 und den Skripten in tools/species erzeugt. Es handelt sich um artspezifische prozedurale Rekonstruktionen, nicht um gescannte oder manuell abgenommene Exemplare. Desktop- und Mobile-Dateien teilen Anatomie und Artmerkmale; Details und Texturauflösung unterscheiden sich.

Geometrie und neue Verfahrensschritte: Simulation-Aquarium. Grundlage der Artparameter und ursprünglichen Pigmentmuster: vorhandene Eigenmodelle des Projekts, dokumentiert in source/inventory.json. Keine fremden GLBs wurden dafür übernommen. Es wird keine pauschale neue Lizenz über vorhandene Projektinhalte vergeben.

Für Guppy, roten Wagtail-Platy, Zebrabärbling und Metallpanzerwels wurde zusätzlich ein eigenes laterales Texturblatt mit dem in Codex verfügbaren ImageGen-Werkzeug erzeugt. Die Datei source/generated-fish-sheet.png ist **erzeugte Grafik, keine Fotografie und keine unabhängige biologische Referenz**. Sie wird mit dokumentierten UV-Landmarken auf tatsächliche räumliche Blender-Geometrie und getrennte Flossen projiziert. Prompt und Herkunft stehen in source/generated-source.json. Nutzung und Weitergabe erzeugter Inhalte richten sich nach den geltenden Bedingungen des vorhandenen OpenAI-Zugangs: https://openai.com/policies/terms-of-use/ . Keine neuen Konten, Provider-API-Schlüssel oder externen Assetdienste wurden verwendet.

Andere neue Körper-/Blatt-/Panzeroberflächen stammen aus lokalen Farb-, Relief- und Vertexfarbenverfahren. Normale Details werden teilweise im gemeinsamen Laufzeitmaterial erzeugt, statt identische Normal Maps in jedem GLB zu vervielfachen. Nachträgliche KHR_mesh_quantization reduziert die Geometriegröße mit maximal 1/32767 Quelleinheiten Positionsfehler und benötigt keinen zusätzlichen Browserdecoder.

Die bereits vorhandenen fototexturierten Modelle für Neon, Molly, Clownfisch, Nana und Vallisnerie sowie BlueMesh-Betta bleiben mit ihren ursprünglichen Lizenzen erhalten. Sie werden durch diese Datei nicht neu lizenziert. Quellen: assets/catalog/manifest.json und die vorhandenen Modellnachweise.

Ein erfolgreicher GLB-Export oder eine hochauflösende Textur belegt keinen Fotorealismus. Die visuelle und biologische Abnahme wird getrennt dokumentiert. Externe Referenzabrufe waren im Auftrag durch CONNECT-403 blockiert; vorhandene Quellenangaben sind keine Behauptung neuer Website-Prüfungen.
