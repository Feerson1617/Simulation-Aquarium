# Gemeinsame Ökosystemanalyse und Szenarien

## Bedienung

Nach der Beckenplatzierung öffnet **Ökosystem** in der unteren Werkzeugleiste die Analyse. Die Spielzeit pausiert. Alle Ansichten lesen das tatsächlich aktive Aquarium; ein zweites Lern-Aquarium gibt es nicht. Zum Fortsetzen Ansicht schließen und die Zeit wie gewohnt starten.

- **Nahrungsnetz:** Organismen werden nach Art zusammengefasst. Mehrfachrollen und Mischkost bleiben sichtbar. Pfeile zeigen von der Nahrung zum Konsumenten. Gestrichelte Rest-/Abhängigkeitswege sind keine behaupteten Fraßvorgänge. Die Auswahl einer Art hebt ihre Verbindungen hervor; die Detailansicht führt zu den bestehenden Artkarten.
- **Fragezeichen:** erscheinen bei schwach gedeckter Ernährung, nicht bei jeder fehlenden Verbindung. Passendes externes Futter kann Lücken schließen. Fragezeichen auswählen, Hinweise einzeln anfordern und eigene Ergänzung prüfen. Der vollständige Artenkatalog bleibt zugänglich; die Prüfung setzt keine Organismen ein. Umweltbereiche, Beckenvolumen und Gruppenbedarf werden berücksichtigt. Die Entscheidung bleibt beim Lernenden.
- **Mikroskop:** schematische Sicht auf heterotrophe Zersetzer sowie getrennte Ammonium- und Nitritoxidierer. Angezeigt werden relative Modellindizes und tatsächlich berechnete Umsätze, keine realen Zellzahlen.
- **Stickstoff / Kohlenstoff / Energie:** Stoffumwandlungen und gerichteter Energiefluss sind getrennt. Letzte Schrittwerte werden aus dem Rechenkern aufgezeichnet. Ohne Simulationsschritt erscheinen keine erfundenen Messwerte.
- **Umweltfaktoren:** aktuelle Wasserwerte und Artbereiche helfen beim Hypothesenvergleich. Bereichsüberschreitungen beweisen keine alleinige Ursache.

## Szenarien

Die Startseite bietet **Szenarien** zusätzlich zu Freiem Spiel und Tutorial. Fünf datengesteuerte Ausgangssituationen:

| Titel | Art | Lernauftrag |
| --- | --- | --- |
| Ein Becken – viele Beziehungen | Untersuchung | Ernährungsweisen und Nahrungspfeile vergleichen |
| Spuren der Versorgung | Problem | Nachlassende Kondition untersuchen |
| Veränderungen im Becken | Problem | Belastung mit Beobachtung und Messungen eingrenzen |
| Blätter im Wandel | Problem | Schwaches Pflanzenwachstum untersuchen |
| Leben auf Oberflächen | Untersuchung | Zersetzung, Mineralisierung und Nitrifikation unterscheiden |

Bei Problemen verraten Titel und Einführung die Ursache nicht. Über den kleinen Auftragsknopf oberhalb des Beckens lassen sich Hinweise und eigene Untersuchungsnotizen öffnen. Es gibt keine automatische Bewertung einer einzigen Musterlösung; passende Fütterung und verschiedene geeignete Beutearten sind beispielsweise alternative Maßnahmen. Beobachtung und längerfristige Prüfung bleiben nötig.

Alle Szenarien verwenden `Qf`/`hd`, bestehende Käufe, Pflege, Messungen, Zeitsteuerung und dieselbe Analyse wie das freie Spiel. Neue Szenarien ergänzen die deklarativen Definitionen in `scenarios.mjs` statt eine zweite Simulation einzuführen.

## Speicherung

- Frei/Tutorial: bisheriger Schlüssel `aquarium-werkstatt-v1`.
- Szenario: `aquarium-scenario-v1:<id>`, für jede Definition ein eigener Platz.
- Neustart: vorherigen Versuch unter `aquarium-scenario-v1:<id>:previous` sichern, Versuchszähler erhöhen und Ausgangssituation neu aufbauen. Es bleibt jeweils die letzte Sicherung erhalten.
- Szenarionotizen und angeforderte Hinweise gehören zum optionalen Feld `scenario` im v1-Spielstand und werden mit JSON exportiert. Die normalen Journalnotizen im freien Spiel behalten ihren bisherigen Schlüssel.
- Unbekannte Szenario-IDs werden beim Import abgewiesen. Bekannte Szenariostände werden beim Speichern wieder ihrem eigenen Platz zugeordnet.
- Ein Browser-Neustart zeigt die Startseite. Unter Szenarien den jeweiligen Versuch fortsetzen; die normale Fortsetzen-Schaltfläche gehört weiterhin zum freien Aquarium.

Neustart über „Zeit & Runde“ startet innerhalb eines Szenarios einen neuen Versuch desselben Szenarios. Der freie Speicherplatz wird dabei nicht überschrieben. Spielstände zusätzlich exportieren: Browserspeicher ist geräte- und ursprungsabhängig und kann vom Browser gelöscht werden.

## Biologische Modellregeln

`bioprocesses.mjs` integriert separate Schritte in den bestehenden Rechenkern:

1. Organische Reste werden durch heterotrophe Aktivität abhängig von O₂ und Temperatur zerlegt. Die Mineralisierung setzt NH₄ und PO₄ frei; aerobe Atmung verbraucht O₂ und liefert CO₂. Relative Restgrößen werden mit expliziten Spielkalibrierungen in Konzentrationen umgerechnet.
2. NH₄-Oxidation erzeugt NO₂ mit Massenfaktor 46/18 und verbraucht O₂ mit 48/18. NO₂-Oxidation erzeugt NO₃ mit 62/46 und verbraucht O₂ mit 16/46. Die jeweils verfügbaren Verbindungen, der Sauerstoffvorrat und die berechnete Filterkapazität begrenzen den Umsatz. Elementarer Stickstoff bleibt in diesen beiden Schritten erhalten.
3. Die bisherige doppelte Multiplikation einzelner Umsätze mit der Schrittdauer entfällt. Atmung enthält keinen zweiten pauschalen Restabbau; bereits abgezogener Nitrifikationssauerstoff wird nicht erneut abgezogen.
4. Relative Kleinsttier-/Planktonpools entwickeln sich aus Ressourcen und werden durch tatsächliche Konsumenten vermindert. Spezialisten werden nicht automatisch durch beliebiges Flockenfutter versorgt. Nahrungsverfügbarkeit beeinflusst die echte Gesundheitsberechnung.
5. Bei sehr niedrigem Wasser-O₂ bildet ein vereinfachter Sediment-Proxy einen begrenzten NO₃→N₂-Austrag ab, abhängig von organischen Resten. Er ist keine räumlich aufgelöste Sediment- oder Filtermessung.
6. Das bestehende Pflanzenwachstum, Aufnahme von Nährstoffen/CO₂, Photosynthese, Tag-/Nachtwechsel und Tier-/Pflanzenatmung bleiben Teil des gemeinsamen Modells. Die Analyse zeichnet deren tatsächliche Schrittwerte auf.

## Grenzen

Die Schwellen und relativen Pools sind didaktische Spielregeln, keine Artfütterungsempfehlungen. Das Modell unterscheidet wichtige Ernährungsweisen, deckt aber nicht jede natürliche Nahrung, Partikelgröße, Populationsdichte oder artspezifische Wechselwirkung ab. Ressourcen werden teilweise als relative Pools statt individuen- und massengetreu erfasst. Räuber-Beute-Pfeile sind mögliche Beziehungen des vorhandenen Besatzes; das tägliche Fraßereignis bleibt stochastisch.

Biomasse und organische Reste sind keine vollständig gewogenen C-/N-Vorräte. Die gesamte Simulation bietet deshalb weder eine geschlossene Elementbilanz noch eine stöchiometrisch vollständige Photosynthese-/Atmungs- oder Wärmebilanz. Die Nitrifikations-Teilbilanz ist dagegen ausdrücklich geprüft. Der Energiefluss ist qualitativ mit tatsächlichen Prozessindikatoren; O₂-Mengen werden nicht als Joule ausgegeben. Ammonium/Ammoniak, Pufferung, Sedimentgradienten und Fraßraten bleiben vereinfacht.

Die Grafik ergänzt gemeinsame, individuell versetzte Schwarmbahnen und eine durch Algen/Restwerte modulierte Wasseroberfläche. Die Wassertrübung ist ein visueller Proxy, keine optische Messsimulation. Schwarmbahnen sind keine vollständigen Boids oder Kollisionsphysik. Tote Tiere behalten ihre vorhandene Darstellungslogik. Hohe und sparsame Grafik bleiben verfügbar. Eine realistische Anatomie sämtlicher Arten oder Fotorealismus wird hier nicht behauptet.
