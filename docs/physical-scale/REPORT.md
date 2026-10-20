# Ergebnis: maßstabsgetreue Aquariumsimulation

Stand: 20. Oktober 2026. Eigener Branch `feature/physical-scale-realism` auf Basis von `main` 63e7bc9. PR #6 war bereits gemergt; dessen funktionierende Katalogkarten, Farbwahl und verworfene Rekonstruktionsversuche wurden übernommen. Keine erneute Massenproduktion, kein Merge und keine Änderung an AGENTS.md.

## Bedienung und Größen

Bei allen 133 biologischen Arten entfallen „Drehung & Größe“, manuelle Drehung und Darstellungsgröße. Die elf Dekorationen behalten diese Aquascaping-Regler. Tiere schwimmen weiterhin selbstständig; Pflanzen besitzen eine stabile natürliche Orientierung. Kleine Modelle werden durch eine begrenzte Auswahlhilfe anklickbar, ohne ihre reale Körpergröße zu verändern.

Ein Weltmaß von 20 cm pro Three.js-Einheit kalibriert die sieben Becken in Länge, Tiefe und Höhe. Geladene GLB-Vertices werden vermessen und an artspezifische Zentimeterwerte angepasst; das hebt willkürliche Ausgangseinheiten und die frühere Verzerrung durch Tankachsen auf. Die gleiche Art und dasselbe Individuum behalten beim Becken- oder Profilwechsel ihre Körperlänge. Kamera und Umgebung passen sich den Beckenmaßen an. Glasstärken, vier Zentimeter Bodengrund und Technik besitzen nachvollziehbare Modellmaße. Außenfilter stehen außerhalb des Glases und ihre Schläuche verwenden Weltmaße.

Die [Größentabelle](SIZES.md) enthält alle 144 IDs und kennzeichnet Annahmen. Beispiele adulter Referenzen vor Individualvariation: Neon 4 cm; Guppy männlich 4/weiblich 6 cm; Molly 8/10 cm; Anubias barteri 30 cm Höhe und 22 cm Breite; Nana 12 × 16 cm; Vallisneria 45 × 18 cm. Größen sind Orientierungswerte, keine behauptete vollständige neue Literaturvalidierung. Die Fotoquelle der Anubias ist keine Größenvermessung.

Geschlecht und gespeichertes Alter beziehungsweise Entwicklungsstadium bestimmen Tiergrößen. Genetische Jungfische wachsen im bestehenden beschleunigten Modell bis zur Reife nach sieben Spieltagen. Pflanzenhöhen folgen begrenzt ihrer gespeicherten Biomasse. Eine stabile Variation von ±6 Prozent ändert weder Zufallszahlen noch biologische Simulationsergebnisse. Zusätzliche Pflanzenbiomasse über der gewählten Referenz wird noch nicht als neue Verzweigung gezeichnet.

## Erhaltene Spielstände

Das bisherige Speicherformat und sein localStorage-Schlüssel bleiben erhalten. X/Z bleiben relative Beckenkoordinaten, explizit als `tank-normalized-v1` gekennzeichnet. Die räumliche Migration archiviert alte biologische Größen-/Drehwerte und protokolliert notwendige Verschiebungen. Genetik, Individuen, Gesundheits- und Wasserwerte bleiben erhalten. Wiederholtes Laden desselben kalibrierten Standes verschiebt keine Objekte erneut.

Feste Gegenstände berücksichtigen reale Grundflächen, Glas und Technik. Reife Pflanzenbasen werden reserviert, Blattüberlagerungen sind natürlich möglich. Pinzettenstrahl, Bodenhöhe, Unterkante und Wasseroberfläche verwenden die vollständige Transformation. Ein späterer Becken-/Technikwechsel prüft Platz erneut. Physisch überfüllte Altbestände bleiben vollständig gespeichert und werden ausdrücklich als vorübergehend nicht darstellbar gemeldet; sie werden weder gelöscht noch geschrumpft. Ungeeignete Beckengröße erscheint als Hinweis. Diese Regeln sind kein vollständiger dreidimensionaler Kontaktlöser für jedes Blatt, jeden Hohlraum und jedes schwimmende Tier.

## Sichtbarer Grafikfortschritt

Genau ein Modellpaar wurde gezielt verbessert: **Anubias barteri**. In Blender bewusst modellierte breite, geneigte und gekrümmte Blätter, Blattstiele, Rhizom und Haftwurzeln ersetzen die vorherigen künstlichen Blattformen. Die Blattoberfläche nutzt eine vorhandene Fotografie unter CC BY 4.0. Katalogbild, Lizenznachweis und Quellenmetadaten sind aktualisiert. Alle anderen Modelle bleiben erhalten.

Die [echten Maximum-Vergleiche](README.md#gezielte-fotobasierte-verbesserung) zeigen Vorder-, Schräg- und Rückansicht aus der Spielgalerie. Zwei Texturversuche mit sichtbaren Hintergrundanteilen wurden verworfen. Das angenommene Modell ist botanisch plausibler, aber **weiterhin nicht vollständig fotorealistisch**. Rhizom/Wurzeln, wiederholte Blatttextur, begrenzte Fotoauflösung und vorhandene Animationen bleiben vereinfacht.

Viele bestehende Guppy-/Panzerwelsformen, native Pflanzen, Wirbellose und Korallen brauchen weiterhin gezielte anatomische und künstlerische Arbeit. Gute Bestandsmodelle wie Neon, Molly und Betta wurden nicht durch schlechtere Ersatzmodelle ausgetauscht. Licht und allgemeine Effekte wurden nicht pauschal verstärkt; bei fotografischen Blättern unterbleibt die künstliche generische Oberflächennormalmap.

## Prüfung und Übergabe

Der [Prüfbericht](VALIDATION.md) trennt ausgeführte Tests und technische Grenzen. Reale Safari-iPads oder eine Hardware-GPU standen nicht zur Verfügung; Chromium-Touch-Emulation ersetzt diese Prüfung nicht. Biologische Nennvolumina bleiben erhalten: Eine vollständig neu berechnete Netto-Wasservolumenchemie wurde nicht eingeführt.

Verwendet wurden kostenlose lokale Werkzeuge: Node.js, Python, Chromium/Playwright, Blender und die bestehenden GLB-Werkzeuge. Keine zusätzlichen Konten, API-Schlüssel oder Bezahldienste. Spielbetrieb bleibt statisch und bündelbar. [Branch, PR-Erstellung und Vorschau](GITHUB.md) verwenden den vorhandenen Workflow. Die aktive Cloud blockiert derzeit die GitHub-API; eine Freigabe steht bereits im Umgebungsentwurf. Ein tatsächlicher Deployment-Erfolg darf erst nach erfolgreichem GitHub-Lauf behauptet werden.
