# Abnahmematrix für Masterauftrag und PR-8-Korrekturen

Stand: 21.10.2026. Diese Matrix bezieht sich ausdrücklich auf den **vorliegenden vollständigen [Masterauftrag](review/MASTER_REQUEST.md)**, den [Korrekturauftrag](review/REQUEST.md) und den [unabhängigen Prüfbericht](review/REVIEW.md). Der frühere Hinweis, dem unabhängigen Reviewer habe der Masterauftrag gefehlt, bleibt als historische Grenze seines Berichts erhalten. Für diese Umsetzung liegt der Wortlaut vor.

Grundlage: Originalcurriculum der Eider-Treene-Schule ab 2025/26, 36 Seiten; SHA-256 `faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f`. S. 3–4, 9–10, 14–15 und 19–20 sind abgeglichen; S. 19 wurde bei der Korrektur erneut textuell und visuell gelesen. Der anthropogene Kohlenstoffteil ist verbindlich. Die Matrix gilt für die ausgewählten Einheiten, nicht für das gesamte Biologiecurriculum dieser Klassen.

**Lesart:** „umgesetzt“ bezeichnet vorhandenen Code/Material. „geprüft“ wird nur im tatsächlich dokumentierten Umfang verwendet. Modultests und Chromium mit Touch-Emulation beweisen weder empirische Lernwirksamkeit noch die Funktion auf einem physischen Safari-iPad. Endgültige Durchlaufnachweise werden in [VALIDATION.md](VALIDATION.md) zusammengeführt.

## Anforderungen des vollständigen Masterauftrags

| Masterteil | Konkrete Umsetzung / Abnahmekriterium | Nachweis und Grenze |
|---|---|---|
| §1, §3 · Gesamtstruktur | Jahrgang zuerst; drei unterschiedliche Lernprofile; je Missionen und gleichwertiges reduziertes freies Forschen; gemeinsamer bisheriger Kern | Jahrgangsrouten und echte Untersuchungen in `learning_browser.py`; keine drei getrennten Ökologiemodelle |
| §2 · Gesamte Oberfläche reduzieren | Alte Vollwerkzeuge, Wasserlabor, Shop, Zeitraffer und technische Regler im Lernmodus verborgen; kompakter Überblick, ein optionales Werkzeug | Jahrgangsscreenshots; sieben ausgewählte Arten/Einträge in 8/10, ein Mendelbeispiel in 9; Expertenbestand bleibt |
| §3, §16 · Grafik unabhängig | Bestehende Desktop-/iPad-Profile ändern Darstellung, keine biologische Regel | Bestehende Grafik- und Speicherprüfungen; keine neue Assetproduktion in diesem Korrekturschritt |
| §4.1–4.2 · Klasse 8 | Temperatur, qualitative O₂-/Nährstoff-/Belastungszustände; konkrete Messgrößen für das Lernziel | Reduzierte Beobachtungsansicht, passende Messkurven; Schwellen und Grenzen in AUDIT |
| §4.3 · Klasse 9 | Individuen, Genotyp/Phänotyp, Keimzellen und Populationen; Chemie im Hintergrund | Vererbungs-/Selektionsansichten, optional bewusste Freigabe durch Lehrkraft |
| §4.4 · Klasse 10 | Reduzierter Einstieg; Nitrat/Nitrit/CO₂/O₂ nur zielbezogen; keine komplette Chemieliste im HUD | Missionen und freier Modus; chemische Einzelgrößen bleiben unterscheidbar |
| §4.5 · Plausible Indikatoren | OR-Warnpfade, kein Warnmittelwert; Nährstoffmangel und -überschuss können gemeinsam vorkommen | Modultests; dokumentierte Modellschwellen, keine universellen Haltungsgrenzen |
| §5 · Hilfen | Jahrgangssprache, Kontext-?, gemeinsames Glossar, keine fertige Versuchslösung | Tastaturfokus, Maus/Touch, Esc und Becken-Eingabesperre; vollständiges Hilfstechnikaudit offen |
| §6 · Rekonstruktion | Alle 14 Profile enthalten Ziel, Klärung, Vorvorstellung, Untersuchungsweg, Sicherung und Grenze | Inhaltsprüfung und Modultest; Klärung/Material sind didaktisch begründet, nicht empirisch validiert |
| §7–9 · 14 Missionen | Siehe Einzelmatrix unten; Wald-/Evolution-/Küstentransfers; anthropogener Kohlenstoffteil ergänzt | Originalcurriculum plus fertige Ansicht; nicht alle Vorgänge werden simuliert |
| §10 · Offenes Forschen | Eigene Frage, Hypothese, Plan und passende offene Werkzeuge in jedem Jahrgang | Drei tatsächliche freie Forschungswege; keine vorgeschriebene Missionsreihenfolge |
| §11 · Erkenntnisweg | Beobachten → eigene Frage/Hypothese/Vorhersage/Plan → gezielter Eingriff → Daten → Beobachtung/Deutung/Reflexion | Gepaarte tatsächliche Kernläufe und eigene Messreihen; keine automatisch erfundenen Kurven |
| §11 · Kontrolle und Wiederholungen | Gleiche Ausgangslagen je Paar, dokumentierte Seeds; getrennte Enden; biologische Modellabbruchgrenzen sichtbar | R1/R3; nach Ausfall nur Einzelverlauf. R5 unterscheidet Reproduktion und neue Stichprobe |
| §11 · Daten auswerten | Tabellen, beschriftete SVG, eigenständig beschriftetes CSV und JSON; eingefrorene Planung | R2/R3/R7/R8 einschließlich realer Dateiübertragung; [CSV-Schema](CSV_SCHEMA.md) |
| §12 · Katalog | Kuratierte Auswahl in Lernprofilen, vollständige 144 Arten/181 Produkte technisch erhalten | Experten-/Katalogregression; keine Kataloginhalte entfernt |
| §13 · Lehrkraft | Vorbereitung, zusätzliche Werkzeuge/Messgrößen, Hilfenwahl, Reset/Sicherung/Wiederherstellung, Export und vollständige lesende Produktansicht | Lokale und importierte Produkte; keine Konten, keine Notenautomatik, kein Prüfungsschutz |
| §13 · Drei Niveaus | Stark, teilweise und selbstständig angeleitet; Regeln bleiben gleich | Vergleich gleicher Laufdaten unter verschiedenen Unterstützungsstufen |
| §14 · Biologie | Lichtabhängige Fotosynthese, nächtliche Atmung, Ressourcenlimit, organischer Rückfluss, zweistufige Nitrifikation, Ernährung, Fortpflanzung und Genetik erhalten | Bestehende Kern-/Fachtests und gezielte Browserproben; kalibrierte Raten, keine vollständige Massen-/Energiebilanz |
| §14 · Evolution | Zufällige Mendelkeimzellen, endliche Populationen, Drift gegen phänotypabhängige hypothetische Selektion | Archivrekonstruktion; AA/Aa gleich gewichtet, Umweltumkehr, kein bedarfsgerichtetes Wiedererscheinen verlorener Allele; keine Artbildung |
| §15 · Lernstand | Vorwissen gegen spätere Erklärung; Vorhersage, Kontrollplan, Datenbezug, Transfer und Modellkritik; offene Lernprodukte | Getrennte Notizfelder und eingefrorene Laufplanung; keine Note aus Tierpflege |
| §16 · Bestand und Kosten | Spielstände, Modelle, Grafikprofile, Pinzette, Tutorial, Fortpflanzung und Szenarien bleiben; lokale kostenlose Technik, statische relative Pfade | Experten-/Tutorial-/Speicher-/Unterpfad-/Exportregressionen; echte Safari-Geräte offen |
| §17 · Phasen und Sicherung | Bestehenden Stand übernommen, R1–R8 darauf korrigiert, regelmäßige Commits auf demselben PR-Branch | WORK_STATE, Git-Historie; keine doppelte Umsetzung früherer Modellarbeiten |
| §18 · Abnahme | Drei Klassen getrennt bedienen, alle Missionen öffnen, sinnvolle Screenshots und fachliche Grenzen lesen | Konkrete Testberichte in VALIDATION; kognitive Belastung visuell beurteilt, Unterrichtserprobung offen |
| §19 · GitHub und Übergabe | Bestehender PR #8 wird durch Branch-Push aktualisiert; Berichte und Abnahmematrix | Kein Merge oder Push auf main; bestehender separater Preview-Workflow unverändert |

## Einzelabnahme aller 14 Missionen

Alle Missionen bleiben mit eigenen Profilen, Leitfragen und Sicherungsaufträgen erhalten. Der gemeinsame Browserprüfer öffnet jede Mission und rechnet einen echten Tag; diese Einstiegsprüfung ist **keine vollständige Unterrichtserprobung jeder möglichen Untersuchung**. Die fachlichen Zuordnungen stehen zusätzlich ausführlich im [REPORT](REPORT.md).

| ID / Mission | Originalcurriculum | Fachlicher Untersuchungsweg / aktueller Korrekturbezug | Grenze |
|---|---|---|---|
| 8-ecosystem · Ein Aquarium ist ein Ökosystem | S. 9, S. 3–4 | Biotisch/abiotisch unterscheiden; gezielter Umweltvergleich; R3 schützt Zuordnung von Plan und Ergebnis | Beispiel Süßwassersystem |
| 8-oxygen · Woher kommt der Sauerstoff? | S. 9–10 | Licht/Dunkel vergleichen; tatsächliche Fotosynthese/Atmung, O₂ und Ressourcen; R7 eigene Messungen | Gasaustausch und weitere Prozesse wirken mit; keine reine O₂-Massenbilanz |
| 8-foodweb · Wer ist mit wem verbunden? | S. 9 | Reale Nahrungspfeile, Produzenten/Konsumenten/Zersetzer; Stoffwege gegen Energiefluss | Keine quantitative Energiehaushaltsmessung |
| 8-health · Den Fischen geht es nicht gut | S. 9–10 | Konkurrierende Erklärungen, ein Eingriff, Kontrolle und Daten; R1/R2 erhalten Ausfall und Verlauf | Modelldiagnose ist kein Beweis einer einzigen Naturursache |
| 8-forest · Vom Aquarium in den Wald | S. 9–10 | Rollen/Beziehungen übertragen und reale Waldmessung planen | Waldbeobachtung bleibt ergänzender realer Unterrichtsschritt |
| 9-traits · Gleiche Art, verschiedene Individuen | S. 14 | Sichtbarer Phänotyp gegen AA/Aa-Mehrdeutigkeit; Genotypen optional | Modellallele, keine gemessene Molly-DNA |
| 9-mendel · Eine Kreuzung vorhersagen | S. 14 | Vorhersage, AA×aa, echte F1/F2, Punnett und endliche Ziehungen; R5 reproduzierbare/neue Seeds, R2 lesbare Archive | Keine erzwungene 3:1-Stichprobe; Generation ≠ natürliche Zeit |
| 9-population · Eine Population verändert sich | S. 14–15 | Gleiche Anfangspopulation, Drift gegen hypothetische Selektion; R6 tatsächliche Eltern/Nachkommen/Frequenzen | Feste Modellgewichte, keine gemessene Wildfitness |
| 9-darwin · Darwin und Lamarck prüfen | S. 15 | Vorhandene Variation verfolgen; Vorhersagen und zusätzliche Fossilien-/Verwandtschaftsbelege | Modellregeln sind allein kein empirischer Beweis gegen eine Naturerklärung |
| 10-enrichment · Zu viele Nährstoffe | S. 19–20 | Definierte Mischung, Algen/Detritus/O₂ verfolgen; Nitrat/Nitrit trennen | Keine erzwungene Sauerstoffkrise, keine pauschale Nitratvergiftung |
| 10-carbon · Kohlenstoff in Bewegung | S. 19–20 **verbindlich einschließlich anthropogener Beeinflussung** | Lokale Prozesse und eigene Skizze; R4 Material zu fossiler Verbrennung/Landnutzung, Belegarten trennen, Handlungsoptionen sichern | Qualitativ; Dosierstufe ist keine globale Emissions-/Klimasimulation |
| 10-restore · Ein gestörtes System stabilisieren | S. 19–20 | R1 realer 50%-Wasserwechsel/14-Tage-Fall: Kontrolle fällt Tag 48 aus, Versuch wird bis 59 gerechnet; R2/R3 erhalten Interpretation | Nach Ausfall der Kontrolle kein vollständiger Paarvergleich |
| 10-northsea · Vom Becken in die Nordsee | S. 19–20 | Eintragswege, Nährstoffe und Quellenarbeit, regionale Maßnahmen | Keine Gezeiten, Strömungs- oder marine Gemeinschaftssimulation |
| 10-wadden · Wattenmeer nutzen und schützen | S. 19–20 **verbindlich** | Müll von Nährstoffen trennen; ökologische/wirtschaftliche/soziale Kriterien, Gegenargument und Datenlücke | Keine erfundene Plastikschadenskurve oder Fischereiökonomie |

## Noch offene Abnahme außerhalb der Cloud

Physische Schul-iPads/Safari, Unterrichtsversuche, Verständnisinterviews und belastbare Lernwirksamkeit sind offen. Externe IPCC-/Regionalwebseiten sind als Hintergrundquellen benannt, hier nicht live geprüft; der Originalcurriculum-Abgleich ist davon getrennt tatsächlich durchgeführt. Vollständiger Fotorealismus bleibt ein früheres eigenes Entwicklungsziel; vorhandene Modelle wurden bei R1–R8 erhalten.
