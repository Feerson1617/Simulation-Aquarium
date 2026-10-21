# Abschlussbericht: Biologische Lernumgebungen für Klassen 8–10

Arbeitsstand vom 21.10.2026: Der bestehende PR #8 ist nach der unabhängigen Prüfung R1–R8 überarbeitet. Der vollständige ursprüngliche Masterauftrag liegt vor und ist in der [Master- und 14-Missionen-Abnahmematrix](ACCEPTANCE.md) ausdrücklich zugeordnet. Die Endprüfung auf dem eingefrorenen Laufzeitstand `7e82046` ist abgeschlossen: **100 Modultests, 82 Browserprüfpunkte und der HTML-Einzeldatei-Export bestanden**. Einzelbelege und tatsächliche Grenzen stehen in [VALIDATION.md](VALIDATION.md). Physische Safari-iPads und empirische Unterrichtswirksamkeit bleiben offen.

## Korrekturen nach der unabhängigen Prüfung

| ID | Resultierende Änderung |
|---|---|
| R1 | Kontrolle und Versuch rechnen unabhängig bis zu ihrem jeweils tatsächlichen Ende. Status, Zeit und vom Kern zugeordnete Ursache bleiben erhalten, auch bei Ausfall im letzten Schritt. Tabellen und CSV stellen ungleiche Zeitachsen mit ausdrücklich fehlenden Folgemessungen gegenüber. |
| R2 | Begrenzter lesender Import erhält Eingriff/Wert, Dauer, Seeds/Umwelt, Planung, Annahmen, Status, eigene Messungen und Genetikarchive. Lehrkräfte können die tatsächliche Messgröße wählen und dieselben Belege lokal oder aus JSON lesen. Vorhandene echte Version-1-Exporte sind als Regression enthalten. |
| R3 | Jeder berechnete Lauf behält seine Konfiguration und Vorhersage. Ausgangslagen-/Einstellungsänderungen werden sofort als neuer Plan gekennzeichnet; JSON/CSV/SVG beziehen sich weiter auf den festgehaltenen Lauf. Auch ein unvollständiger neuer Entwurf macht alte Daten nicht unlesbar. |
| R4 | Eigene Kohlenstoff-Transferkarte: fossile Verbrennung, Landnutzung, Speicher/Flüsse, Hintergrundquellen, Sicherung und Modellkritik. Aquariumdaten und globale Aussagen bleiben getrennt. |
| R5 | Gleichen Seed reproduzieren, neuen Seed ziehen oder dokumentierten Seed wählen; Ausgangsgenetik bleibt gleich. Tatsächliche Mendelkeimzellen liefern F1/F2 ohne erzwungene Verhältnisse. |
| R6 | Je Wiederholung und Seite eigene Selektionsarchive. Lehrkräfte/Lernende können Phänotyp, Elternwahlgewicht, tatsächliche Eltern und Nachkommenzahl mit den Häufigkeiten verknüpfen. |
| R7 | Eigene Messpunkte haben Tabelle, Diagramm und CSV/JSON/SVG, auch ohne automatischen Vergleich; die Lehrkraft sieht dieselben Reihen. |
| R8 | [CSV-Schema 2](CSV_SCHEMA.md) benennt Messgröße, Einheit und Typ sowie Profil, Laufkonfiguration, Seed, Zeitschritt, geplantes/tatsächliches Ende und fehlende Werte. |

Der zusätzliche kostenlose PR-Workflow `module-tests.yml` führt die Node-Modultests aus; er veröffentlicht nichts. Bestehende Pages-Workflows, `AGENTS.md`, Modelle und Texturen wurden bei diesen Korrekturen nicht geändert. Der Workflow ist lokal geprüft; ein tatsächlicher GitHub-Checklauf wird erst nach Bestätigung als solcher benannt.

## Grundlage und curriculare Zuordnung

Das vom Auftraggeber bereitgestellte Original „Schulinternes Fachcurriculum Biologie – Sek. I und II“, gültig ab 2025/26, wurde gelesen. Die maßgeblichen Unterrichtseinheiten sind Ökologie (S. 9–10), Genetik I (S. 14), Evolution (S. 15) sowie Eingriffe des Menschen/Nachhaltige Entwicklung (S. 19–20). Die übergreifenden Modell-, Erkenntnis- und Kommunikationskompetenzen stehen auf S. 3–4. Die Simulation bearbeitet diese ausgewählten Themen; sie deckt nicht das gesamte Biologiecurriculum dieser Jahrgänge ab.

| Klasse / Mission | Curriculumbezug | Erkenntnisweg und Lernprodukt |
|---|---|---|
| 8 · Ein Aquarium ist ein Ökosystem | S. 9: strukturelle/funktionelle Organisation | Lebende/nicht lebende Bestandteile unterscheiden; Umweltbedingung variieren; Beziehungsbild |
| 8 · Woher kommt der Sauerstoff? | S. 9–10: Fotosynthese/Zellatmung, Wasserpestversuch | Licht/Dunkel-Vorhersage; gepaarter Versuch; O₂-Zeitreihe mit Atmung und Gasaustausch erklären |
| 8 · Wer ist mit wem verbunden? | S. 9: Nahrungsnetze, Trophiestufen, Stoffe/Energie | Tatsächliche Nahrungspfeile; Futter-/Pflanzenvergleich; getrenntes Stoff- und Energieflussschema |
| 8 · Den Fischen geht es nicht gut | S. 9–10: Veränderung, Hypothese, Kontrolle | Beobachtung vor Deutung; konkurrierende Hypothesen; eine Intervention und Messreihe |
| 8 · Vom Aquarium in den Wald | S. 9: Ökologie i. d. R. am Beispiel Wald | Rollen/Beziehungen übertragen; reale Waldmessung planen; Boden/Jahreszeiten als Grenzen benennen |
| 9 · Gleiche Art, verschiedene Individuen | S. 14: Genotyp/Phänotyp, Gene/Allele | Sichtbare Farbe gegen mögliche Modellgenotypen prüfen; Mehrdeutigkeit AA/Aa erklären |
| 9 · Eine Kreuzung vorhersagen | S. 14: Keimzellen, Mendel, Dominanz/Rezessivität | Vorhersage vor Kreuzung; AA×aa und F1×F1; Punnett-Wahrscheinlichkeiten gegen gezählte F1/F2 vergleichen |
| 9 · Eine Population verändert sich | S. 14–15: Variabilität, Selektion, Fortpflanzungserfolg | Gleiche Startpopulation; neutrale Drift gegen hypothetische Modellselektion; Allel-/Merkmalsfrequenzen über Generationen |
| 9 · Darwin und Lamarck prüfen | S. 15: Darwin/Lamarck, Fossilien, Übergangsformen, Stammbaum | Unterschiedliche Vorhersagen; vorhandene Allele verfolgen; Fossilien-/Verwandtschaftstransfer, Familienarchiv ≠ Artenstammbaum |
| 10 · Zu viele Nährstoffe | S. 19–20: Überdüngung, Stickstoffeinträge, Diagramme | Definierte Eintragsmischung; Algen/organische Reste/O₂ messen; Wirkungskette und Unsicherheiten |
| 10 · Kohlenstoff in Bewegung | S. 19–20: Kohlenstoffkreislauf **und anthropogene Beeinflussung verbindlich** | Lokale CO₂-/Biomasseprozesse; separate Transfermaterialien zu fossiler Verbrennung/Landnutzung; Speicher/Flüsse, Belegarten, Handlungsurteil |
| 10 · Ein gestörtes System stabilisieren | S. 19–20: Einfluss des Menschen, Handlungsfolgen | Sanierungsziel; Kontrollversuch; kurzfristige und längere Wirkung plus Nebenwirkungen bewerten |
| 10 · Vom Becken in die Nordsee | S. 19: Nordsee/Meeresschutz, Nährstoffeinträge | Modellversuch plus Quellenarbeit; Eintragswege und regionale Maßnahmen; Übertragungsgrenzen |
| 10 · Wattenmeer nutzen und schützen | S. 19–20: Meeresschutz/Meeresmüll Nordsee/Wattenmeer **verbindlich**, Bewertung | Müll ≠ Nährstoff; Interessengruppen; ökologische/wirtschaftliche/soziale Kriterien gewichten; Urteil mit Gegenargument |

Fossilien, Primaten/Menschwerdung und Stammbäume werden durch Transferaufträge angebunden, nicht als vollständig simulierte weitere Unterrichtseinheit behauptet. Regionale Quellenkarten verweisen auf Nationalpark Wattenmeer, Wadden Sea World Heritage, OSPAR, Umweltbundesamt und Bund/Länder-Meeresschutz. Institutionelle Quellen sind kenntlich gemacht; deren aktuelle Webinhalte wurden in der eingeschränkten Umgebung nicht live geprüft. Im Spiel sind keine externen Abrufe zum Starten dieser Materialien notwendig.

## Was Lernende sehen

Start: zuerst Klasse 8, 9 oder 10; danach Lernmissionen oder Freies Forschen. Die Grafikqualität wird davon getrennt gewählt. Ein kleines Werkzeugband und ein knapper Beckenüberblick lassen den zentralen Lebensraum frei. Längere Texte, Messungen, Notizen, Genetik und Quellen erscheinen erst im geöffneten Seitenwerkzeug. Das Becken passt sich an den verbleibenden Bildbereich an.

| Bereich | Klasse 8 | Klasse 9 | Klasse 10 |
|---|---|---|---|
| Primärer Blick | Lebewesen, Beziehungen, Lebensbedingungen | Individuen, Farben, Genotypen auf Wunsch, Generationen | Eingriffe, Stoffwege, Folgen und Bewertung |
| Wasser im Einstieg | Temperatur, O₂ qualitativ, Nährstoffversorgung, Belastung | Keine Chemietabelle; Tiere und Modellgenerationen | Reduzierte Zustände wie Klasse 8 |
| Vertiefung | Messwerte für passende Untersuchung, etwa O₂ bei Fotosynthese | Mendelwahrscheinlichkeiten, tatsächliche Allele, Drift/Selektion | Zielbezogen Nitrat/Nitrit/CO₂/O₂; Formeln in optionaler Begriffshilfe |
| Katalog | 7 ausgewählte Einträge | Zuchtwerkzeug konzentriert auf eine Modellart: monohybride Mollys | 7 ausgewählte Einträge |
| Sprache | Beobachtungsnah: „Reste“, „Lebensbedingungen“, „Vermutung“ | Genotyp, Phänotyp, Allel, Wahrscheinlichkeit, Generation | Wirkungskette, Kriterium, Interessengruppe, Unsicherheit |

Alle Klassen haben eigene freie Forschung mit Frage, Hypothese, Plan, Messung und Reflexion. Es handelt sich nicht um den früheren ungekürzten Freispielmodus. Lehrkräfte können zusätzliche Größen bewusst freischalten.

Die normalen Schüleransichten blenden die alte Werkzeugleiste, den Vollshop, alle Geräte-/Becken-/Substratregler, die vollständige Chemietabelle, Dosierdetails, Salz-/Härte-/Calciumregler, technische Darstellungsparameter und den alten Zeitraffer aus. Biologische Körpergröße und Drehung bleiben wie in PR #7 natürlich kalibriert. Die 144 Arten, 181 Produkte, alten Szenarien, Wasserlabor, Tutorial, Import/Export und Expertenanalyse bleiben im **Expertenmodus** verfügbar.

## Warum die Wasserchemie reduziert ist

Die gemeinsame Simulation rechnet weiterhin getrennte Stoffe und Prozesse. Lernende müssen diese nicht gleichzeitig bedienen. Nährstoffversorgung und Wasserbelastung sind zwei didaktische Blickrichtungen, keine chemisch getrennten Stoffklassen. Derselbe Stoff kann je nach Konzentration und Organismus versorgen oder indirekt belasten.

Die Belastungsanzeige ist ein benannter Zustandsindikator aus organischen Resten, problematischen Stickstoffverbindungen und O₂-Mangel. Getrennte Warnpfade verhindern, dass ein kritischer Einzelwert in einem Mittelwert verschwindet. Alle Schwellen, Einheiten, pH-/Temperaturannahmen und Grenzen sind im [Audit](AUDIT.md) dokumentiert. Es werden keine universell sicheren Haltungsgrenzen behauptet. „Geringe Belastung“ schließt andere Artansprüche oder Stressoren nicht aus.

Das ?-System und das gemeinsame Glossar bieten kurze jahrgangsbezogene Definitionen, biologische Bedeutung und Hinweise zur Untersuchung. Sie nennen keine fertige Versuchslösung. Touch, Maus und Tastatur verwenden dieselben Bedienelemente.

## Untersuchungen und Daten

Ökologische Vergleiche klonen eine gesicherte Ausgangslage. Je Wiederholung starten Kontroll- und Versuchsbecken mit identischen Beständen und gleichem Zufallsstart; nur das Versuchsbecken erhält einen ausgewählten Eingriff. Der bestehende `hd`-/`Qf`-Kern rechnet beide im Vierteltagesschritt weiter. Erfasst werden tatsächliche Zustände und Prozessumsätze. Noch nicht berechnete Anfangsumsätze bleiben unbekannt und erscheinen als „—“, statt als erfundene Nullmessung. Jede Seite erhält einen eigenen Status und Endzeitpunkt. Ein kritischer Modellabbruch stoppt nur diese Seite; die andere rechnet weiter. Der vom Kern zugeordnete Grund bleibt als Modelldiagnose erhalten. Fehlende Folgewerte werden nicht erfunden. Nach dem Ausfall einer Seite gibt es keinen vollständigen Paarvergleich mehr.

Eingriffe sind Lichtdauer, Futtermenge, einmaliger Wasserwechsel, Pflanzenzugabe, Zieltemperatur, CO₂-Modellzufuhr und eine definierte gekoppelte Nährstoffmischung. Die Auswahl hängt vom Lernziel ab. Ein Mischungsverhältnis wird als eine Eintragsvariable offengelegt. 1–14 Tage, 1–4 Wiederholungen; Diagramm der ersten Wiederholung, Datentabellen und CSV aller Wiederholungen einschließlich tatsächlichem Ende je Seite. Tabelle/CSV zeigen fehlende Folgemessungen ausdrücklich; die JSON-Arrays werden nicht künstlich gleich lang gemacht. Wiederholungen variieren den Modellzufallsstart, nicht künstliche Messfehler. Gleiche Kurven sind möglich und werden nicht künstlich auseinandergezogen.

Hypothese, Vorhersage und Plan stehen vor dem Vergleich; im freien Forschen ist zusätzlich eine eigene Frage erforderlich. Beobachtung und Erklärung werden getrennt geschrieben. Vorwissen und spätere Erklärung werden gegenübergestellt. JSON enthält Notizen, Messungen und Daten; CSV und eigenständig mit Einheiten und Legende beschriftete SVG-Diagramme erlauben Weiterarbeit. Eigene Beobachtungen können zusätzlich ohne automatischen Vergleich als Messreihe betrachtet und exportiert werden. Freigegebene Größen werden je neuem Messpunkt vermerkt. Alles bleibt ohne Konto lokal; ein Dateiexport schützt vor Browserdatenverlust.

Das Generationsmodell nutzt die vorhandenen Mendelfunktionen. Es archiviert echte gezogene Keimzellenkombinationen, Eltern, Nachkommen sowie Allel-/Phänotypfrequenzen. Kontroll- und Selektionspopulationen beginnen gleich und behalten ihre eigenen Eltern-/Nachkommenarchive je Wiederholung. Die angezeigten Häufigkeiten und der Fortpflanzungserfolg sind daraus rekonstruierbar. Gleiche Ausgangsgenetik lässt sich mit demselben Seed reproduzieren oder mit einem dokumentierten neuen Seed erneut ziehen. Fitnessgewichte hängen von einer offengelegten hypothetischen Umweltannahme ab, nicht von Dominanz. Generationen sind ausdrücklich keine natürlichen Tage. Das Wasserbecken und die abstrahierte endliche Zuchtpopulation sind klar bezeichnete unterschiedliche Untersuchungsperspektiven.

## Lehrkraft, Differenzierung und Lernstand

Der Lehrkraftmodus ist lokal ohne Konto erreichbar. Er bietet Klassen-/Missionsvorbereitung, stark/teilweise/selbstständig angeleitete Arbeitswege, abschaltbare Hilfen, gezielte Werkzeug-/Messfreigaben, vorbereitete Vergleiche, Konfigurationsexport/-import, lokale Lernprodukte und das Lesen exportierter Protokolle. Ein Neustart hält eine lokale Sicherung zurück, die im Lehrkraftmodus wiederhergestellt werden kann. Die lesende Produktansicht erhält Versuchsmetadaten, eingefrorene Planung, Status, eigene Messungen und Genetikbelege. Die untersuchten Messgrößen sind wählbar; ältere fehlende Angaben werden als fehlend bezeichnet, nicht erfunden. Importierte Enginezustände werden dafür nicht ausgeführt.

Die Unterstützung verändert Sprache, Satzanfänge und Schritthilfen. Der biologische Kern bleibt gleich. Lernstandsaufgaben erfassen Vorwissen, begründete Vorhersage, Kontrollplanung, Datenbezug, Erklärung, Transfer und Modellreflexion. Die Simulation erteilt keine automatische Note aus Pflegeerfolg. Namen oder Online-Profile sind nicht notwendig; der Modus ist kein Zugriffsschutz für Prüfungen.

## Wissenschaftliche Prüfung und verbleibende Grenzen

Die gesamte Prozesskette wurde entlang Fotosynthese/Atmung, Zersetzung/Mineralisierung, Nitrifikation, Ressourcenaufnahme, Wachstum, Nahrungsbeziehungen, Vererbung und Populationen geprüft. Gezielte Korrekturen begrenzen Pflanzenwachstum durch tatsächlich verfügbare Nährstoff-/CO₂-Pools und ergänzen ressourcenbegrenzte Algenaufnahme, lichtabhängige O₂-Bildung und abgestorbene Algen als organisches Material für bestehende Zersetzung.

Weiterhin gelten kalibrierte Größen und vereinfachte Raten. Es gibt keine geschlossene Kohlenstoff-, Energie- oder vollständige Stoffbilanz. Fitnesswerte sind hypothetisch, keine gemessenen Wildtierdaten. Mutationen, Artbildung, Gezeiten, Plastiktoxikologie und Fischereiökonomie sind nicht implementiert. Wald und Küstenregionen werden durch explizite Transfermaterialien und Modellkritik erschlossen. Die bisherigen hochwertigen Modelle wurden nicht ersetzt; vollständiger Fotorealismus bleibt ein separates offenes Entwicklungsziel.

Die fachliche und gestalterische Prüfung begründet die Umsetzung, ersetzt aber keine Unterrichtserprobung. Erforderlich bleiben Lehrkraftreview, Verständnisinterviews und eine reale Erprobung mit Klassen 8–10. Physische Schul-iPads/Safari und unterschiedliche Leistungsstufen müssen vor breitem Unterrichtseinsatz erprobt werden. Browserprüfungen verwenden hier Chromium mit Touch-Emulation und Softwaregrafik; daraus werden keine Hardware-FPS abgeleitet.

## Technische Struktur und Übergabe

Neue lokale Module: `learning-content.mjs` (Curriculum und Missionen), `learning-model.mjs` (Profile, Zustandsindikatoren, Vergleichsversuche), `learning-population.mjs` (Vererbung/Selektion), `learning-ui.mjs` und `learning.css` (Oberfläche). Die große HTML-Datei erhält begrenzte Integrationsstellen. Keine neue Laufzeitabhängigkeit, keine Konten, kein Backend, keine kostenpflichtige API. Relative Pfade, vorhandene Grafikprofile und HTML-Gesamtdownload bleiben erhalten.

Lernbecken und Notizbücher besitzen eigene versionierte lokale Speicherplätze. Der alte freie Spielstand und die Szenarioplätze werden nicht durch Lernbecken ersetzt. Alte Spielstände laufen weiterhin durch die vorhandene Validierung, Genetik- und Maßstabsmigration. Unterrichtskonfigurationen sind getrennt von Grafik und Biologie gespeichert.

Entwickelt wird auf `feature/biology-learning-environments`, basierend auf dem bereits gemergten PR #7. Zwischenstände und R1–R8 wurden auf dem bestehenden PR #8 früh und wiederholt auf GitHub gesichert. Kein Merge und keine Änderung an den bestehenden Vorschau-/Pages-Workflows. Der zusätzliche Modultestworkflow prüft PRs ohne Veröffentlichung. Die externe Preview-/Checkausführung wurde hier nicht über die gesperrte GitHub-API bestätigt; [GitHub-Übergabe](GITHUB.md).
