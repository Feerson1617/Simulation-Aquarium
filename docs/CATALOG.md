# Lokale Katalogvorschauen

181 Einträge besitzen eigene WebP-Bilder (384 × 256 Pixel), insgesamt 630660 Byte, rund 616 KiB. Sie wurden im Grafikdurchgang erneut unter dem Profil **Hoch** aus den tatsächlichen Modellen erzeugt. Die Bilder werden verzögert lokal geladen, unter dem GitHub-Pages-Projektpfad ausgeliefert und beim vollständigen HTML-Download eingebettet. Externe Bilddienste und neue Laufzeitpakete sind nicht nötig.

Die 144 Arten/Dekorationen verwenden denselben Modellpfad wie das laufende Aquarium, einschließlich der 11 neuen Blender-Dekorationen. Fünf vorhandene Modelle verwenden echte Fotos als Texturen auf räumlicher Geometrie; das Betta-Modell bleibt als Künstlermodell erhalten. Der Katalogexport ist ein Renderbild. Die 37 Technik-/Bedarfsprodukte zeigen Produktmodelle, keine Herstellerfotografien. Filter, Leuchten und weitere Technik teilen ihre Geometriefabrik mit der Szene. Aquarienvorschauen berücksichtigen die einzelnen Produktabmessungen; das laufende Becken verwendet weiterhin die historisch normalisierte Welt. Verbrauchsmittel bleiben schematische Verpackungen und erscheinen nicht als dauerhaftes Beckenobjekt.

**Fotorealistische und biologisch vollständig geprüfte Vorschaubilder für alle Arten sind damit noch nicht erreicht.** Es werden keine ähnlich aussehenden fremden Arten als Ersatzfotos eingesetzt. Vorhandene anatomische Vereinfachungen der Spielmodelle bleiben auch in den Vorschaubildern sichtbar. Für den nächsten Qualitätsdurchgang müssen diese Arten gezielt referenzgestützt überprüft und Modelle verbessert werden.

## Herkunft und Lizenz

`assets/catalog/manifest.json` ordnet jeden Dateinamen dem konkreten Eintrag zu und enthält Autor, Lizenz, ursprüngliche Quellen-/Lizenzlinks und vorhandene biologische Modellnotizen. Die Quellenhinweise bleiben zusätzlich in den bisherigen Modellnachweisen des Spiels erhalten. Das Betta-Modell beruht auf BlueMesh (CC BY 4.0); die vorhandenen fototexturierten Arten behalten ihre jeweiligen Wikimedia-Fotonachweise, einschließlich Share-Alike-Bedingungen. Die Renderableitungen dieser Inhalte sind weiter unter der angegebenen Ursprungslizenz zu behandeln. Eigene Modelle sind als Eigenmodelle des Projekts bezeichnet; daraus wird keine pauschale Lizenz für fremde Assets abgeleitet. Three.js ist MIT-lizenziert.

Der Katalog verwendet vorhandene Inhalte sowie eigene lokale Modell-/Materialgeometrie. Die 22 neuen Dekorations-GLBs sind ausdrücklich CC0 gewidmet; siehe [deren Lizenzhinweis](../assets/realism/ATTRIBUTION.md). Es wurden keine neuen Drittanbieterbilder heruntergeladen. Die verlinkten Quellen sind Nachweise, keine für den Betrieb erforderlichen Bildabrufe. [Vollständige Statusmatrix](realism/CATALOG_STATUS.md) und [gesichtete Kontaktbögen](realism/VALIDATION.md) dokumentieren die noch vorhandenen Vereinfachungen.

## Reproduzieren

Bei laufendem lokalen Server der Cloud-Umgebung:

```bash
python3 tools/generate_catalog.py
```

Das Skript startet einen isolierten Chromium-Prozess mit SwiftShader, ruft die explizite Autorenfunktion des Spiels auf und schreibt WebP sowie Manifest. Fertige Bilder derselben Renderrevision werden wiederverwendet. Nach tatsächlicher Modellverbesserung die entsprechende Revisionskennung im Skript erhöhen oder die betroffenen Bilddateien entfernen; Manifest und `catalog-assets.mjs` anschließend gemeinsam aktualisieren.

Die Autorenfunktion reserviert ihren zusätzlichen WebGL-Renderer nur während eines Renderaufrufs und gibt ihn danach frei. Der normale Shop lädt bereits erzeugte WebP-Dateien; er rendert keine 181 Live-Vorschauen.
