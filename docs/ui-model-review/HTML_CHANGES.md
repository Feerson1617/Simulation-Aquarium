# Kleine Änderungen in der großen HTML-Datei

`index.html` enthält eingebettete Bibliotheken und Bestandsmodelle in sehr langen Zeilen. Deshalb zeigt der normale Git-Diff erheblich mehr Daten als die tatsächlich geänderten UI-Stellen. Die folgenden Änderungen wurden anhand der ausgelesenen Originalstellen mit genau gezählten Ersetzungen angewandt; eingebettete Bibliotheks- und Modellbytes wurden nicht ersetzt.

| Stelle | Bisher | Jetzt |
| --- | --- | --- |
| Objektkarte `X1`, Bild | `xt(e.icon,70)` (generisches Symbol) | `catalogImage(e)` (artspezifische Katalogdatei) |
| Artkarte in `en`, Bild | `xt(e.icon,88)` | `catalogImage(e)` |
| Objektkarte, X/Z | `Ja("x",...)` und `Ja("z",...)` | Beide Aufrufe entfernt |
| Objektkarte, Abschnitt | Position & Größe | Drehung & Größe |
| Objektkarte, Hinweis | Schwimmen um die gewählte Position | Selbstständige Bewegung im Becken |
| Objektkarte, alternative Platzierung | `data-act="place-selected"` | Entfernt; Pinzettenknopf erscheint für alle vom Controller unterstützten Kategorien |
| Klickhandler | `beginPlacement(li)` über `place-selected` | Dieser Zweig entfernt |
| Wertehandler | Beliebiger Schlüssel aus `data-entity-setting` | Ausschließlich `rotation` und `scale` |

Die verbleibenden Regleraufrufe `Ti(...)`, Wasser-, Zeit- und Grafikeinstellungen sind von diesen Ersetzungen unberührt. Die Pflanzenpflege, Artkarten, Gesundheitsanzeige und Kaufaktionen bleiben in denselben Funktionen.

Die lesbaren Änderungen an `genetics-shop.mjs`, `catalog.css` und `aquascaping.mjs` stehen im normalen PR-Diff. Die Pinzette verändert weiterhin erst beim Loslassen die gespeicherten X/Z-Werte. Bei Tieren speichert sie einen Schwimmbereich und setzt keine dauerhafte Bodenposition.
