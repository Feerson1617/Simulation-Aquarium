# Vertrag des Ammoniumpools

Modellrevision `learning-biology-6-coherent`. Der Schlüssel `params.nh4` bleibt aus Speicherkompatibilität bestehen. **Neue Zustände deklarieren TAN = Gesamtammonium/-ammoniak (NH₄⁺ + NH₃), ausgedrückt in mg NH₄-Äquivalent/L.** Ein mmol enthaltenen Stickstoffs entspricht dabei 18 mg NH₄-Äquivalent. Dies ist weder mg N/L noch allein ionisches Ammonium.

Die vorhandenen Rechenfaktoren passen zu diesem Vertrag; biologische Raten wurden nicht neu kalibriert. `ammonia-pool.mjs` hält Definition, Kennzeichnung und Verteilung zusammen. Neue Zustände: `chemistry.version=1`, `ammoniaPool=tan-nh4-equivalent-v1`. Alte Zustände ohne diese Information bekommen Version 0 und `legacy-undocumented`. Ihre Zahlen, alten Archive und Messwerte werden nicht umgerechnet. Labor, Testdialog und Ökosystemansicht kennzeichnen die unbekannte alte Grundlage. Die laufende Berechnung bleibt bei ihnen die bisherige Modellannahme, kein nachträglich belegter physikalischer Messwert.

## Verteilung und Einheiten

`pKa = 0,09018 + 2729,92 / (T + 273,15)`; `f = 1 / (1 + 10^(pKa − pH))`.

| Größe | Berechnung | Einheit |
|---|---|---|
| TAN-Gesamtpool | gespeicherter nichtnegativer Wert | mg NH₄-Äquivalent/L |
| Ionisches NH₄⁺ | TAN × (1 − f) | mg NH₄⁺/L |
| Freies NH₃ | TAN × f × 17/18 | mg NH₃/L |
| Enthaltener Stickstoff | TAN × 14/18 | mg N/L |

Die pH-/Temperaturbeziehung folgt der bekannten Süßwasser-Näherung nach Emerson et al. (1975), *Aqueous ammonia equilibrium calculations: effect of pH and temperature*, DOI [10.1139/f75-274](https://doi.org/10.1139/f75-274). Die Originalveröffentlichung wurde hier nicht neu heruntergeladen. Salzgehalt/Ionenstärke werden in dieser Näherung nicht berücksichtigt; Meerwasserwerte sind keine präzise aquaristische Gefährdungsprognose.

## Produzenten und Verbraucher

| Pfad | Behandlung |
|---|---|
| Ausscheidung/Futterreste im tatsächlichen `Qf` | Zugabe zum Gesamtpool; Umrechnung aus relativen Spielportionen ist eine Modellkalibrierung, keine gemessene Futteranalyse. |
| Zersetzung in `decomposeOrganic` | `amount × 20 / liters` mg NH₄-Äquivalent/L. Organische Ausgangsbestände sind relative Spielgrößen. O₂/CO₂ werden separat geführt. |
| Erste Nitrifikationsstufe | Pro mg NH₄-Äquivalent: 46/18 mg NO₂ entstehen, 48/18 mg O₂ werden verbraucht; begrenzt durch Bestand, Kapazität und O₂. |
| Zweite Stufe | Pro mg NO₂: 62/46 mg NO₃ entstehen, 16/46 mg O₂ werden verbraucht; ebenfalls begrenzt. |
| Wasserwechsel | Verdünnung/Austausch derselben Konzentrationsgrundlage; vorbereitetes Frischwasser enthält hier kein TAN. |
| Warnung und Fischschaden | Beide verwenden `ammoniaRisk(params)`: freie NH₃-Konzentration; Modellschwellen 0,02 und 0,1 mg NH₃/L. Die Schadensfunktion bleibt unverändert. |
| Fortpflanzungsvoraussetzung | Die zusätzliche bisherige Schranke 0,25 bezieht sich auf mg NH₄-Äquivalent/L des Gesamtpools, als vereinfachte Vorsorgebedingung. Sie ist keine zweite Definition der NH₃-Toxizität. |
| Labor/Ökosystem/Import | Gesamtpool und freie Konzentration werden benannt; alte Einheiten bleiben ausdrücklich undokumentiert. Alte Archivbilder werden nicht nachträglich umgeschrieben. |

Die Stickstoffteilbilanz für gelöste Pools lautet `TAN×14/18 + NO₂×14/46 + NO₃×14/62`. Nitrifikation erhält diese Größe. Wegen offener Fütterung, Pflanzenaufnahme, Wasserwechsel und relativer organischer Quellen ist das gesamte Aquarium keine geschlossene, vollständig kalibrierte N-/C-Massenbilanz.

## Prüfung

`tests/coherent_phase4.test.mjs` prüft absolute Verteilung bei 15/25/30 °C und pH = pKa ± 1 bzw. pKa; zusätzlich die gleichen absoluten NH₃-Grenzen bei neun pH-/Temperaturkombinationen. Nitrifikation wird mit 0/0,1/2/8 mg O₂/L auf N-Erhaltung, tatsächlichen O₂-Verbrauch und Nichtnegativität geprüft. Die bisherige Schadens-/Warnungsfunktion wird dabei quantitativ einbezogen. Reale Kernfunktionen `Qf`, `qs`, `hd` und `tp` bleiben unverändert; die Änderung von `cd`/`ud` dient allein dem neuen Vertrag und der Kennzeichnung von Altständen. Konkrete Browser-/Quellbelege stehen im Abschlussbericht. Dies ersetzt keine artspezifische Kalibrierung oder Unterrichtserprobung.
