# Ökosystemanalyse, getrennte Szenarien und lokale Katalogvorschauen

Die bisherige Simulation bietet keine gemeinsame ökologische Analyse oder getrennten Untersuchungsbecken. Dieser Branch ergänzt einen pausierbaren Analysemodus auf dem tatsächlichen Beckenstand und fünf Szenarien, die denselben Rechenkern verwenden und das freie Aquarium nicht überschreiben.

Der Shop erhält 181 lokal gerenderte, eintragsspezifische WebP-Modellvorschauen mit Quellen-/Lizenzmanifest. Nahrungsnetz und begründete Fragezeichen berücksichtigen passende Fütterung, tatsächlichen Besatz und mehrere mögliche Maßnahmen. Hinweise werden schrittweise angefordert; Kandidaten werden gegen Umweltbedingungen geprüft. Weitere Ansichten zeigen Mikroben, Stickstoff, Kohlenstoff, Energiefluss und Umweltwerte anhand tatsächlicher Zustände und Schrittumsätze.

Heterotrophe Zersetzung/Mineralisierung, O₂-begrenzte Nitrifikation, Kleinstnahrung und ein begrenzter anoxischer Sediment-Proxy sind gekoppelt. Doppelte Zeitschrittfaktoren einzelner alter Umsätze entfallen. Die echte Tiergesundheit berücksichtigt verfügbare Nahrung. Neue Schwarmbahnen und die Wasseroberfläche verbessern die laufende Szene; verdecktes 3D-Rendering pausiert während der Analyse. Der HTML-Download bündelt weiterhin sämtliche benötigten Module, Stile und Bilder.

## Prüfung

- 33/33 Node-Tests.
- 12 Prüfgruppen der Szenario-/Analyse-Integration, einschließlich byteidentischem freien Speicherplatz bei Szenariowechsel/Neustart/Export/Import und nachgewiesener Nahrung-/Gesundheitswirkung.
- 12 Maus-/Touch-Pinzetten-Prüfgruppen.
- 13 Grundprüfungen einschließlich 3D, Freiem Spiel, Käufen, Wasser/Zeit, Speicherung und allen acht Tutorialschritten per Touch.
- Heruntergeladenes HTML allein ohne weitere Modul-/CSS-/Bildabrufe geprüft.
- Alle 181 WebP-Dateien decodiert, 384 × 256 Pixel, insgesamt 648746 Byte.

Nachweise und Screenshots: [VALIDATION.md](VALIDATION.md). Bedienung, Speicherformat und wissenschaftliche Grenzen: [ECOSYSTEM.md](ECOSYSTEM.md). Bildquellen: [CATALOG.md](CATALOG.md) und `assets/catalog/manifest.json`.

## Grenzen für die Freigabe

Modellvorschauen sind keine erreichte Fotorealistik; Technik ist schematisch. Relative Biomasse-/Nahrungspools und chemische Teilmodelle sind keine vollständige Element-/Energiebilanz. Die Nitrifikations-Teilbilanz wurde stöchiometrisch getestet. Kein echtes Safari/iPad, keine belastbaren Geräte-Leistungswerte und keine Langzeitkalibrierung aller Arten. Direkte `file:`-Navigation ist im verwalteten Browser gesperrt; die einzelne HTML-Datei wurde deshalb isoliert über HTTP geprüft. Spielstandformat v1 bleibt kompatibel, neue optionale Felder werden validiert.

`AGENTS.md`, `main` und die Pages-Workflows werden nicht geändert. Zusammenführen und öffentliche Veröffentlichung erfolgen durch den Projektinhaber.
