# Fachliches und didaktisches Audit

> Historischer Prüf-/Entwicklungsstand vor dem Auftrag A01–A11. Die [aktuelle Korrekturmatrix](../biology-quality/MATRIX.md) und ihre neuen Lernhandlungen ersetzen frühere Abschlussanforderungen. Alte Testergebnisse bleiben als historische Belege erhalten.

Stand: 21.10.2026; ergänzt nach unabhängiger Prüfung von PR #8. Basis: PR #7 / `666df90`. Originalcurriculum als Nutzer-PDF vollständig textuell erschlossen; relevante Abschnitte S. 3–4, 9–10, 14–15, 19–20 im Zusammenhang gelesen. PDF: 36 Seiten, 6.203.103 Bytes, SHA-256 `faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f`.

## Befund und Umsetzung

| Bestand / Problem | Rekonstruktion |
|---|---|
| Start mit Grafik, dann allgemeines Freispiel | Jahrgang zuerst, dann Missionen oder Freies Forschen; Grafik unabhängig |
| 181 Produkte und alle Wasser-/Technikregler gleichzeitig | Kleine kuratierte Artenlisten bzw. ein Genetikbeispiel; lernzielbezogene Eingriffe; Vollkatalog im Expertenmodus |
| Wasserlabor mit vielen chemischen Größen | Klasse 8: Temperatur, qualitative O₂-/Nährstoff-/Belastungsanzeige; Chemie nur für passende Untersuchung oder Lehrkraftfreigabe |
| Vorhandene Szenarien, aber keine vollständigen Erkenntniswege | 14 Missionen mit Vorwissen, Leitfrage, Hypothese, Plan, Daten, Erklärung, Transfer, Modellkritik |
| Vorhandene Genetik und Paarungen ohne Populationsselektion | Gemeinsame Mendel-Funktionen plus endliche Generationen, zufällige Keimzellen, dokumentierte Elternwahlgewichte und tatsächliche Allelzähler |
| Ökologische Analyse ohne gepaarte Vergleichsversuche | Klonen einer Ausgangslage, ein definierter Eingriff, gemeinsame `hd`-Simulation, Wiederholungen und reale Zeitreihen |
| Pflanzenwachstum trotz erschöpfter Ressourcen durch feste Mindestfaktoren | Wachstum durch tatsächlich verfügbare Modellpools begrenzen; keine CO₂-Zugabe durch einen festen Aufnahmeboden |
| Algen nur mit Zuwachs/Grazing, keine explizite Rückführung abgestorbener Biomasse | Ressourcenbegrenzter Zuwachs, lichtabhängige O₂-Bildung, Algensterben → organischer Pool → bestehende Zersetzung |
| Betreuung / Diagnose nicht jahrgangsbezogen | Lokale Unterrichtskonfiguration, drei Unterstützungsstufen, offene Lernprodukte und Vorher-/Nachher-Erklärungen |

## Gemeinsamer Kern und fachliche Grenzen

- Fotosynthese hängt von Lichtzeit, Intensität, Biomasse und Ressourcen ab. Pflanzen und Algen betreiben Atmung; Sauerstoff entsteht nicht nachts ohne Licht. Gaswechsel läuft gleichzeitig. Die vereinfachte Sättigung hängt von Temperatur und Salzgehalt ab.
- Aerobe Zersetzung braucht O₂, mineralisiert organisches Material und erzeugt CO₂. Nitrifikation besteht aus zwei getrennten O₂-abhängigen Oxidationsschritten mit Stoffmassenumrechnung. Biologisches Filtern wandelt Stoffe um; Wasserwechsel trägt Stoffe aus.
- Algenaufnahme ist auf Ressourcen und freie relative Biomassekapazität beschränkt. Abgestorbene Algen gelangen in den organischen Pool. Diese kalibrierten Pools bilden keine vollständige Kohlenstoff-/Stickstoffbilanz eines echten Beckens ab; Grazing ist weiterhin vereinfacht.
- Pflanzennährstoffe und Wasserbelastung sind keine disjunkten Stoffgruppen. Nitrat kann versorgen, Überangebot indirekt belasten. Nitrit/Ammoniak besitzen eigene Warnpfade. Bedarf hängt von Art und Situation ab.
- Nahrungsnetzpfeile bedeuten Ressource → Nutzer. Destruenten und chemolithoautotrophe Nitrifizierer werden unterschieden. Stoffe können kreisen; Energie fließt unter Abgabe von Wärme. Kein quantitativer Energiehaushalt wird vorgetäuscht.
- Pflanzenwachstum wird durch Nitrat, Phosphat, Eisen und CO₂ begrenzt und kann bei fehlenden Ressourcen stoppen. Die vorhandenen relativen Wachstumskosten bleiben kalibrierte Annahmen; Vorratshaltung und direkte Ammoniumaufnahme der Pflanzen sind nicht modelliert.
- Wachstum, Tierkondition, Mikroben, Detritus und Biomasse enthalten relative Indizes. Reproduktionszyklen im Spiel sind beschleunigt. Generationsversuche kürzen komplette Entwicklungsphasen explizit ab und behaupten keine natürliche Dauer.
- Zuchtfarben: vereinfachte Modellallele; kein gemessener DNA-Befund. Genotyp und Phänotyp, Dominanz und Fitness bleiben getrennt. Die ursprüngliche Paarung/Genetik im Expertenbecken bleibt erhalten.
- Populationserweiterung verwendet `inheritGenotype` und `punnettSquare` des Bestands. Neutrale Elternwahl erzeugt Drift. Helle/dunkle Modellumwelt gewichtet Phänotypen hypothetisch 1 bzw. 0,5. Umkehr der Umwelt kehrt den Vorteil um; AA und Aa haben denselben Phänotyp und dasselbe Gewicht. Es gibt keine zielgerichtete Mutation und kein Wiedererscheinen verlorener Allele aus Bedarf. Tatsächliche Eltern und Nachkommen werden archiviert.
- Generationenmodell und Wasserbecken sind explizit getrennte Untersuchungsperspektiven desselben Produkts, keine drei Jahrgangskerne. Das Generationenmodell simuliert weder die vollständige Lebensgeschichte noch Dichteabhängigkeit, Mutationen, Artbildung oder gemessene Wildfitness.
- Kohlenstoff wird qualitativ über Prozesse verknüpft. Die relativen Biomassepools erlauben keine behauptete geschlossene Kohlenstoffbilanz.
- Nordsee/Wattenmeer sind begrenzte Transfers, keine digitalen Zwillinge. Gezeiten, marine Gemeinschaften, Strömung, Plastiktoxikologie und Nutzungserträge werden nicht simuliert. Meeresmüll wird nicht als Nährstoff behandelt.

## Belastungs- und Versorgungsindikatoren

`waterIndicators` ist ein didaktischer Zustandsindikator, **keine chemische Messgröße** und kein gemittelter Qualitätswert. Höchste ausgelöste Warnstufe aus:

| Pfad | Erhöht | Kritisch |
|---|---:|---:|
| Organischer Restepool (relative Einheiten) | ≥ 1,5 | ≥ 5 |
| Nitrit im Wasser (mg Verbindung/L) | ≥ 0,1 | ≥ 0,5 |
| Berechnetes freies Ammoniak (mg NH₃/L) | ≥ 0,02 | ≥ 0,1 |
| Sauerstoff (mg/L) | < 5 | < 2 |

Ammoniak wird aus dem NH₄-Modellpool, Temperatur und pH über die vorhandene Dissoziationsnäherung und das Massenverhältnis 17/18 geschätzt. Keine Aussage über amtliche Grenzwerte, Trinkwasser oder alle Tierarten. „Gering“ garantiert keine artgerechte Haltung. Andere Stressoren und Artenansprüche laufen im bestehenden Kern weiter.

Qualitativer O₂-Zustand: niedrig <5, ausreichend 5–9, hoch >9 mg/L, bezogen auf das ausgewählte Süßwasserbeispiel. Nährstoffmangel bei Nitrat <2, Phosphat <0,1 oder Eisen <0,02 mg/L; Überschuss bei Nitrat >35 oder Phosphat >2 mg/L. Gleichzeitiger Überschuss und Mangel anderer Stoffe wird ausdrücklich angezeigt. Diese Kommunikationsschwellen vereinfachen den Einstieg und ersetzen weder artspezifische Ressourcenansprüche noch reale Messinterpretation.

## Didaktische Prüfung

Je Mission: wissenschaftliche Klärung, typische Vorvorstellung, drei Untersuchungsschritte, Sicherungsaufgabe und Modellgrenze in `learning-content.mjs`. Klasse 8 nutzt beobachtungsnahe Sprache; Klasse 9 Genotyp/Phänotyp/Allele und Wahrscheinlichkeiten; Klasse 10 Wirkungsketten, Unsicherheiten und Bewertungskriterien. Kontext-? und Glossar zeigen Definition, biologische Bedeutung und Untersuchungsrelevanz ohne Ergebnisvorgabe.

Die drei Unterstützungsstufen variieren Satzanfänge, Schritte und Arbeitsauftrag, nicht die biologischen Regeln. Das ist eine fachlich begründete Gestaltung, **kein empirischer Nachweis didaktischer Wirksamkeit**. Unterrichtserprobung, Verständlichkeitsinterviews und Lehrkraftreview stehen aus.

## Korrekturprüfung R1–R8

- **R1:** Der gemeinsame biologische Kern wurde nicht ersetzt. Jede Seite erhält ihren eigenen Status mit Anfang, tatsächlichem Ende, angefordertem Ende und Grund. Ein vom Kern gemeldetes `failureCause` wird erhalten und als **Modelldiagnose** benannt, nicht als gesicherte alleinige Naturursache. Auch ein Ausfall im letzten Schritt wird ausgewiesen. Die überlebende Seite rechnet weiter; fehlende Folgemessungen werden nicht aufgefüllt. Nach einem Ausfall ist der vollständige Paarvergleich begrenzt.
- **R2/R3:** Daten, Planung und Herkunft gehören zusammen. Die Konfiguration eines berechneten Laufs wird kopiert und danach nicht durch Formularänderungen überschrieben. Ein geänderter Plan bleibt davon getrennt und erhält einen sichtbaren Neuberechnungshinweis. Lokale und importierte Lernprodukte durchlaufen denselben begrenzten lesenden Validator. Er erhält Eingriff/Wert, Umfang, Seeds/Umwelt, Modellannahmen, Status, Planung, eigene Messungen und Genetikbelege; importierte Enginezustände werden nicht gestartet. Ältere Version-1-Exporte bleiben lesbar, fehlende Belege werden als fehlend benannt.
- **R4:** S. 19 des Originals nennt den Kohlenstoffkreislauf **und seine anthropogene Beeinflussung** verbindlich. Die Mission enthält jetzt einen eigenen Transfer zu fossiler Verbrennung und Landnutzung. Hintergrundtexte sind als redaktionelle Zusammenfassungen mit IPCC-Quellen markiert. Aufgaben trennen Beckenmessung, Hintergrundbeleg und globale Schlussfolgerung; Sicherung und Modellkritik schließen globale Emissionsmengen/Klimaprognosen aus einer Dosierstufe ausdrücklich aus.
- **R5:** Eine neue dokumentierte Mendelstichprobe ändert den Seed, nicht die Ausgangsgenetik. Die Wiederholung desselben Seeds mit denselben Eltern reproduziert den Lauf. Zufällige Keimzellen erzeugen die tatsächlichen Nachkommen; weder 3:1 noch ein künstlich abweichendes Verhältnis wird erzwungen. Vorherige Versuchszusammenfassungen und eine Sicherung bleiben erhalten.
- **R6:** Jeder Kontroll-/Selektionslauf erhält sein eigenes begrenztes Archiv. Elternwahlgewicht, Phänotyp, tatsächliche Eltern, Nachkommenzahl und Frequenzen können daraus rekonstruiert werden. Das Ausgangs-Mendelarchiv ist separat bezeichnet. Der Import prüft unter anderem Genotyp/Phänotyp, Elternrollen/-generationen, Nachkommenzahlen, Gewichte und Häufigkeiten gegen die Archive. Dominanz ist kein Fitnessvorteil; AA/Aa desselben Phänotyps erhalten identische Gewichte.
- **R7/R8:** Eigene Messzeitpunkte sind eine zugängliche Reihe mit Tabelle, Diagramm und Dateiexport, auch ohne Kontrolllauf. Freigaben werden je neuem Messpunkt vermerkt. Unbekannte Prozessumsätze bleiben `null`/„—“/leeres CSV-Feld mit Status, echte Nullen bleiben 0. Konzentration, Anzahl, Anteil und relativer Index sind im [CSV-Schema 2](CSV_SCHEMA.md) unterschieden. Eigene zeitliche Beobachtungen werden nicht allein durch die Darstellung zu einem kontrollierten Experiment.

Diese Korrekturen verbessern Nachvollziehbarkeit und Auswertung, sie verwandeln kalibrierte Modellraten nicht in empirisch validierte Naturdaten. Die [Abnahmematrix](ACCEPTANCE.md) ordnet den vollständigen vorliegenden Masterauftrag und alle 14 Missionen zu; technische Belege und verbleibende Grenzen stehen in [VALIDATION.md](VALIDATION.md).
