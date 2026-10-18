# Lokale Katalogvorschauen

181 Einträge besitzen eigene WebP-Bilder (384 × 256 Pixel), insgesamt 648746 Byte, rund 634 KiB. Die Bilder werden verzögert lokal geladen, unter dem GitHub-Pages-Projektpfad ausgeliefert und beim vollständigen HTML-Download eingebettet. Externe Bilddienste und neue Laufzeitpakete sind nicht nötig.

Die 144 Arten/Dekorationen verwenden ausschließlich das jeweils vorhandene Spielmodell. Bei einigen vorhandenen Modellen liegen echte Fotos als Texturen zugrunde; der neue Katalogexport ist trotzdem ein Renderbild. Die 37 Technik-/Bedarfsprodukte zeigen ausdrücklich schematische Produktmodelle, keine Herstellerfotografien. Unterschiede der Tankgrößen werden über den konkreten Produkttext dargestellt, nicht durch behauptete maßstabsgleiche Fotografie.

**Fotorealistische und biologisch vollständig geprüfte Vorschaubilder für alle Arten sind damit noch nicht erreicht.** Es werden keine ähnlich aussehenden fremden Arten als Ersatzfotos eingesetzt. Vorhandene anatomische Vereinfachungen der Spielmodelle bleiben auch in den Vorschaubildern sichtbar. Für den nächsten Qualitätsdurchgang müssen diese Arten gezielt referenzgestützt überprüft und Modelle verbessert werden.

## Herkunft und Lizenz

`assets/catalog/manifest.json` ordnet jeden Dateinamen dem konkreten Eintrag zu und enthält Autor, Lizenz, ursprüngliche Quellen-/Lizenzlinks und vorhandene biologische Modellnotizen. Die Quellenhinweise bleiben zusätzlich in den bisherigen Modellnachweisen des Spiels erhalten. Das Betta-Modell beruht auf BlueMesh (CC BY 4.0); die vorhandenen fototexturierten Arten behalten ihre jeweiligen Wikimedia-Fotonachweise, einschließlich Share-Alike-Bedingungen. Die Renderableitungen dieser Inhalte sind weiter unter der angegebenen Ursprungslizenz zu behandeln. Eigene Modelle sind als Eigenmodelle des Projekts bezeichnet; daraus wird keine pauschale Lizenz für fremde Assets abgeleitet. Three.js ist MIT-lizenziert.

Der Katalog verwendet ausschließlich bereits im Repository vorhandene Inhalte und eigene lokale Produktgeometrie. Es wurden keine neuen Drittanbieterbilder heruntergeladen. Die verlinkten Quellen sind Nachweise, keine für den Betrieb erforderlichen Bildabrufe.

## Reproduzieren

Bei laufendem lokalen Server der Cloud-Umgebung:

```bash
python3 tools/generate_catalog.py
```

Das Skript startet einen isolierten Chromium-Prozess mit SwiftShader, ruft die explizite Autorenfunktion des Spiels auf und schreibt WebP sowie Manifest. Fertige Bilder werden wiederverwendet. Für eine bewusste Neuberechnung nach Modelländerungen die entsprechenden Bilddateien entfernen; Manifest/`catalog-assets.mjs` anschließend gemeinsam aktualisieren. Erst nach tatsächlicher Modellverbesserung neu rendern.

Die Autorenfunktion reserviert ihren zusätzlichen WebGL-Renderer nur während eines Renderaufrufs und gibt ihn danach frei. Der normale Shop lädt bereits erzeugte WebP-Dateien; er rendert keine 181 Live-Vorschauen.
