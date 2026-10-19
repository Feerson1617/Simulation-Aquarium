# Arbeitsstand: Artenmodelle, Farbformen und Vererbung

Basis: main `87491db`, Arbeitsbranch `feature/species-variants-genetics`. Kein Merge und keine Veröffentlichung. AGENTS.md bleibt unverändert.

## Integriert

- 54 neue Fischmodelle als echte GLB-Dateien, je Desktop-/Mobilgeometrie. Dazu fünf erste Pflanzen-/Wirbellosen-/Korallenmodelle. Die sechs hochwertigen Bestandsmodelle bleiben erhalten.
- Blender-/Python-Quellen, exportierte artspezifische Pigmentkarten und reproduzierbare Oberflächen. Vier Fischtexturen nutzen eine mit vorhandener Codex-Bildfunktion erzeugte Vorlage; Herkunft, Prompt und Grenzen sind dokumentiert. Keine neue Fotografie oder unabhängige Referenzprüfung behauptet.
- 16 Arten mit gezielt begrenzten realen Farbformen; individueller Shop-Kauf mit Vorschau und dauerhafter Speicherung.
- Stochastische monohybride Vererbung (Molly), ausdrücklich unabhängige zwei Unterrichtsmerkmale (Platy), Eiablage (Zebrabärbling). Weitere Lebendgebärende erhalten Abstammung ohne erfundene einfache Farbgesetze.
- In die tatsächlichen Biologieschritte integrierter Wochenzyklus, Jungtierwachstum, Bedingungen und Kapazitätsgrenzen; Analysefenster mit echten Eltern, Nachkommen, Stammbaum, optionaler Genotypanzeige und Punnett-Quadrat.
- iPad begrenzt bei großen Populationen nur die gleichzeitig gezeichneten Fische. Individuen und Simulation bleiben erhalten.

## Bereits nachgewiesen

12 Genetik-/Populations-Unit-Tests bestanden. Ein echter Browserlauf kaufte zwei schwarze Molly-Weibchen AA und zwei goldene Männchen aa im Shop. Aus dem ausgewählten Elternpaar entstanden nach sieben normal berechneten Tagen fünf schwarze F1-Jungtiere Aa mit echten Eltern-IDs; keine JavaScriptfehler. Die bisherigen 50 Unit-Tests bestanden vor den letzten Modelloptimierungen; Abschlussregression folgt.

118 GLB-Dateien wurden ohne zusätzlichen Decoder mit KHR_mesh_quantization von 61,0 auf 41,5 MB verkleinert. Die tatsächliche GPU-Darstellung nach dieser Optimierung wird gesondert geprüft.

## Noch in Arbeit

Visuelle Abnahme und weitere Organismenmodelle; F2-, Platy- und Eiablage-Browserprüfung; Persistenz-/Profil-/Touch- und Bestandsregression; aktualisierte vollständige Qualitätsmatrix und Abschlussbericht. Neue GLB-Dateien gelten ausdrücklich noch nicht pauschal als fotorealistisch. Wikimedia-Abruf ist in dieser Umgebung blockiert; keine vollständige unabhängige Fotoreferenzprüfung möglich. Vereinfachte Modelle werden als solche benannt.

Kostenfreie lokale Werkzeuge: Blender 4.3, Python, Three.js, Node und Playwright/Chromium. Zusätzliche Accounts, Schlüssel und Laufzeitdienste wurden nicht eingeführt. Änderungen regelmäßig auf dem Arbeitsbranch sichern. main nicht ändern.
