# Eigene Artenmodelle und Texturquellen

Die neuen GLBs werden lokal mit Blender 4.3.2 und den Skripten in tools/species erzeugt. Es handelt sich um artspezifische prozedurale Rekonstruktionen, nicht um gescannte oder manuell abgenommene Exemplare. Desktop- und Mobile-Dateien teilen Anatomie und Artmerkmale; Details und Texturauflösung unterscheiden sich.

Geometrie und neue Verfahrensschritte: Simulation-Aquarium. Grundlage der Artparameter und ursprünglichen Pigmentmuster: vorhandene Eigenmodelle des Projekts, dokumentiert in source/inventory.json. Keine fremden GLBs wurden dafür übernommen. Es wird keine pauschale neue Lizenz über vorhandene Projektinhalte vergeben.

Für Guppy, roten Wagtail-Platy, Zebrabärbling und Metallpanzerwels wurde zusätzlich ein eigenes laterales Texturblatt mit dem in Codex verfügbaren ImageGen-Werkzeug erzeugt. Die Datei source/generated-fish-sheet.png ist **erzeugte Grafik, keine Fotografie und keine unabhängige biologische Referenz**. Sie wird mit dokumentierten UV-Landmarken auf tatsächliche räumliche Blender-Geometrie und getrennte Flossen projiziert. Prompt und Herkunft stehen in source/generated-source.json. Nutzung und Weitergabe erzeugter Inhalte richten sich nach den geltenden Bedingungen des vorhandenen OpenAI-Zugangs: https://openai.com/policies/terms-of-use/ . Keine neuen Konten, Provider-API-Schlüssel oder externen Assetdienste wurden verwendet.

Andere neue Körper-/Blatt-/Panzeroberflächen stammen aus lokalen Farb-, Relief- und Vertexfarbenverfahren. Normale Details werden teilweise im gemeinsamen Laufzeitmaterial erzeugt, statt identische Normal Maps in jedem GLB zu vervielfachen. Nachträgliche KHR_mesh_quantization reduziert die Geometriegröße mit maximal 1/32767 Quelleinheiten Positionsfehler und benötigt keinen zusätzlichen Browserdecoder.

Die bereits vorhandenen fototexturierten Modelle für Neon, Molly, Clownfisch, Nana und Vallisnerie sowie BlueMesh-Betta bleiben mit ihren ursprünglichen Lizenzen erhalten. Sie werden durch diese Datei nicht neu lizenziert. Quellen: assets/catalog/manifest.json und die vorhandenen Modellnachweise.

Ein erfolgreicher GLB-Export oder eine hochauflösende Textur belegt keinen Fotorealismus. Die visuelle und biologische Abnahme wird getrennt dokumentiert. Externe Referenzabrufe waren im Auftrag durch CONNECT-403 blockiert; vorhandene Quellenangaben sind keine Behauptung neuer Website-Prüfungen.

Die vollständig prozeduralen Originalmodelle und Pigmentkarten (alle außer Guppy, Platy, Zebrabärbling, Bronze-Panzerwels und der neuen fototexturierten Anubias) werden als Projektbeitrag unter CC0-1.0 bereitgestellt. Die vier Modelle mit erzeugter Bildvorlage sind ausdrücklich aus dieser Widmung ausgenommen; das erzeugte Ausgangsbild ist keine lizenzierte Fotografie und unterliegt den dokumentierten OpenAI-Nutzungsbedingungen. Die bestehenden Fotomodelle und der Betta behalten ihre bisherigen individuellen Lizenzen.

## Fotobasierte Anubias, 20. Oktober 2026

Anubias barteri besitzt jetzt eine gezielt modellierte Geometrie mit geneigten breiten Blättern, dünner Lamina, gebogenen Blattstielen, kriechendem Rhizom und Haftwurzeln. Die unverändert eingebettete fotografische Vorlage stammt von Abhik.Mazumdar.73, [Anubias barteri var. nana](https://commons.wikimedia.org/wiki/File:Anubias_barteri_var._nana.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Verwendet wird die im Vorgängerauftrag archivierte 800×513-Pixel-Fassung. UV-Auswahl und Geometrie sind bearbeitet; das Foto ist keine neue Mehransicht-Vermessung. Die Variante nana dient als Blattoberflächenreferenz derselben Art, nicht als Behauptung einer vermessenen großen barteri-Pflanze. Beide neuen Anubias-GLBs sind fotografische Bearbeitungen unter CC BY 4.0 und ausdrücklich von der obigen CC0-Widmung ausgenommen. Die ursprünglichen Anubias-Modelle bleiben in der Git-Historie erhalten.

Reproduzierbarer Quellcode: tools/physical/build_anubias.py; Ausgangsbild: docs/ui-model-review/comparison/reference-anubias-isolated.jpg. Aktuelle Herkunft, Hashes, Größen und Sichtabnahme: docs/physical-scale/evidence/anubias-production.json. Kein KI-Modell wurde dafür ausgeführt.
