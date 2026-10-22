# Abschluss der freigegebenen Ein-Aquarium-Fortsetzung

Die ausdrückliche neue M1-Sichtfreigabe („jup, ist besser als vorher“) erlaubt Phase 3/4. Die gleichzeitig verlangte einfache Sprache ist umgesetzt: Klasse 8 verwendet in Aufgaben, Messkarten, Antworten, Standardhilfe und Ergebnissen keine chemischen Formeln oder Konzentrationseinheiten. „Mehr“, „weniger“ und „gleich viel“ stammen aus denselben wirklichen Daten und derselben Rundungsgrenze wie die Auswertung. Genaue Originaldaten bleiben für Lehrkräfte und Dateien erhalten.

Anwendungscode ist `6d08bec90200c538385489a461779d2a6e3754e0`; spätere Dokumentations- und Teständerungen ändern diese Anwendungsdateien nicht. [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9), [Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/), [Sprachregeln](LANGUAGE.md), [sechs Lernhandlungen und alle 14 Altzuordnungen](MISSIONS.md), [64 Bediengruppen](CONTROL_FINAL.md), [Lehrkraftmaterial](TEACHER.md).

## Umfang und Nachweise

Dieser Bericht wird nach den laufenden letzten Prüfungen vervollständigt. Bis dahin ist diese Datei kein pauschales Abnahmesiegel. Konkrete beendete Läufe und ihr Stand stehen in den verlinkten Rohbelegen; ein fehlgeschlagener Gesamtlauf wird nicht als bestanden gezählt.

| Prüfung | Tatsächlicher Umfang und Beleg |
|---|---|
| Modultests | **191/191 bestanden**, keine ausgelassenen Tests: bestehende biologische Regeln, Ressourcen, Fisch-/Wirbellosentrennung, Nitrifizierung, Genetik und alte Daten plus neue vollständige Resets, Flüsse, Eltern-/Allelbezug, zufällige F2-Streuung, Durchgangskennungen, Importprüfung und ehrlicher Abbruch. [Log](evidence/approved/node-191.log). |
| Neue M2–M6, WebKit-Grundlauf | **15 vollständige Wege**, fünf Fragen × Desktop/Hoch-/Querformat. Frischer Einstieg, echte Handlungen, plausible Fehlantwort, Hilfe/Korrektur, Reload, Wiederholung, Dateiimport/-export. [Bericht](evidence/approved/webkit-five-missions-three-profiles.json). Start `e86b4e7`, Eingangshashes im Bericht; begrenzte Änderungen während/nach diesem langen Grundlauf sind unten getrennt nachgeprüft. |
| Aktuelle WebKit-Deltas | **M3/M4/M5 im Hochformat bestanden** auf dem eingefrorenen Anwendungsstand: einfachere F1-Frage, neue Durchgangskennungen, strengere Archivprüfung, gekürzte M4-Karte. [Bericht](evidence/approved/webkit-current-m3-m4-m5-portrait.json). |
| Chromium-Desktop-Grundlauf | Fünf Missionen vollständig bestanden. Der anschließende Hochformatteil fand die zu große M4-Karte: 68,81 % frei. Deshalb bleibt der **Gesamtbericht fehlgeschlagen**; nur seine fünf abgeschlossenen Desktopfälle werden als solche genannt. [Ungekürzte Prüfinventare, ohne großes Fehlersnapshot](evidence/approved/chromium-partial-and-portrait-failure.json). Start `331a926`; spätere begrenzte Import-/Textänderungen sind durch Modultests und neue Browserläufe abgedeckt. |
| Aktuelle Chromium-Hoch-/Querformate | ABSCHLUSSLÄUFE |
| M1 in einfacher Sprache | ABSCHLUSSLÄUFE |
| Freies Forschen / Lehrkraft / Speicher | Chromium: **acht Prüfungen bestanden**, alle drei Jahrgänge, echter Katalogzugang, Einsetzen, Pflege, Wasser/Licht/Zeit, Messung, Dateien, unveränderte Altdateien, wirkliche Auswahl/Platzierung und sofortige Sicherung, Abbrechen, lokale Lehrkraftschalter und Quotenfehler. [Bericht](evidence/approved/chromium-free-teacher-storage.json). WebKit: ABSCHLUSSLÄUFE. |
| Erhaltener Experte / Tutorial | ABSCHLUSSLÄUFE |
| Öffentliche Vorschau | **65/65 Anwendungsdateien** per HTTPS mit Systemvertrauen ausgeliefert und bytegleich geprüft. [Hashes](evidence/approved/preview-runtime-hashes.json). Öffentlicher Browserweg: ABSCHLUSSLÄUFE. |
| Tatsächliches Einzel-HTML | **151.441.753 Bytes**, SHA-256 `9e54439e76ebd5e07653fbf329d2f47b8e30429a82870f9b1bca736f39cf730d`. [Baubeleg](evidence/approved/single-html-build.json). Browserprüfungen: ABSCHLUSSLÄUFE. |

Alle neuen Lernfortschritte werden durch sichtbare Browseraktionen erworben. Nur lesende Snapshots prüfen danach Zustand, UID, Farbe, Datenherkunft und vollständigen Reset. Die separate Quotenprüfung wirft gezielt einen Speicherfehler; sie schreibt keinen erfolgreichen Lernfortschritt. Altes Ergebnis und freiwillige eigene Formulierung sind von Auswahl und bereitgestelltem Text getrennt.

## Eine tatsächliche Aquariumwelt

Das sichtbare Hauptaquarium, Individuen, Zeit und Messungen verwenden dieselbe Zustandsreferenz. Die Standardroute kehrt vor dem historischen Paarcontroller zurück. M3/M4 verwenden die tatsächlichen Molly-Entitäten, keine zusätzliche aktive Population. Browserprüfungen vergleichen alle Szene-UIDs und die wirklich gerenderten individuellen Farbvarianten mit den aktuell ausgewerteten Fischen. Frühere Generationen sind archiviert, nicht heimlich gestorben. Aufwachsen und Generationen sind ausdrücklich Zeitraffer; zwölf Nachkommen und ausgeglichene Geschlechter sind eine vorbereitete Lerngruppe.

Das [Quellaudit](evidence/approved/source-audit.json) vergleicht mit `4e59de3`: geschützte biologische Kernfunktionen, Assets, Genetik, `AGENTS.md` und Workflows unverändert. Neue Controller und kleine Übergaben am bisherigen Haupt-Renderer ergänzen den Bestand. Kein Backend, Tracker, neues Konto oder kostenpflichtiger Dienst.

## Echte Befunde statt gewünschter Schulbuchkurven

- **M1:** Mit Licht 7,8 → 8,238664367529305, ohne Licht 7,8 → 8,163889709536656 in drei Tagen. Beide Werte steigen. Die Auswertung verbindet das mit Lichtabhängigkeit, weiterlaufendem Verbrauch und Luftaustausch; sie fordert keinen fallenden Dunkelwert. Diese Zahlen stehen hier für die technische Prüfung, nicht in der normalen Klasse-8-Ansicht.
- **M2:** Eine wirkliche Futtergabe, reale Abbauflüsse und Netto-Restmenge. Auch bei nachgewiesenem Abbau können neue Reste entstehen. Der Filter macht Stoffe nicht zu nichts; die Erklärung winziger Lebewesen ist ausdrücklich vergrößert.
- **M3:** F1 aus AA×aa tatsächlich Aa. F2 zufällig aus den gewählten dunklen Aa-Eltern, keine feste Quote. Modultests verwenden 20 verschiedene Zufallsstarts und beide gleichwertigen Elternrichtungen. Das ausgewählte Kind hat genau die dargestellten Eltern und geerbten Allele. [Tatsächlich heruntergeladenes Produkt, verlustfrei komprimiert](evidence/approved/m3-actual-product.json.gz).
- **M4:** Zwei unabhängige neutrale Zufallsfolgen ab dem gleichen vollständigen Start, anschließend explizit gewichtete Elternwahl. Wirkliche Elternbeiträge statt bloßer Farbgeschichte; dominant garantiert weder Häufigkeit noch mehr Junge. Die Vergleichsfrage zu gleichen Chancen zeigt nur die beiden neutralen Gruppen, nicht vorzeitig den dritten Versuch.
- **M5:** Fortlaufender Eintrag, einmaliger Wasserwechsel beziehungsweise weniger tägliches Futter ab genau demselben Anfang. Unmittelbare und späte Werte sind getrennt. Nach zehn Tagen: relative Reste etwa 22,7253 beziehungsweise 1,1227; Sauerstoff etwa 6,73335 beziehungsweise 8,16994. Keine vorgeschriebene Sauerstoffkatastrophe. [Tatsächliches Produkt](evidence/approved/m5-actual-product.json.gz), [Größen und Integrität](evidence/approved/product-files.json).
- **M6:** Dieselbe ausgewählte Pflanze wird tatsächlich fortgeschrieben. Kohlenstoffdioxid als Kohlenstoffquelle, Atmung und Abbau werden erklärt. Wachstum beweist keine atomare Herkunft; keine erfundene Gramm- oder globale Klimabilanz.

## Bedienung und Sprache

INVENTARABSCHLUSS

Die 70-%-Metrik ist die Viewportfläche abzüglich der geometrischen Vereinigung sichtbarer permanenter Karten/Kopfzeile/Geräteanker. Sie misst Platz für das Aquarium, nicht tatsächlich gezeichnete Glas- oder Tierpixel. Bewusst geöffnete Hilfe-/Dateiansichten sind temporär und halten an. Im [historischen Ausgangsinventar](CONTROL_AUDIT.md) waren 17/19/24 sichtbare Controls vorhanden; zwei getrennte 3D-Fenster beanspruchten zusammen nur 20,51 %. Diese alte Fensterfläche ist nicht direkt dieselbe Metrik wie die neue freie HUD-Fläche.

Keine permanenten Tages-/Seed-/Messgrößenfelder, kein zweiter Bedienpfad, kein Heizer-Einstiegszwang. Aktuelle Aufgaben, Hilfen und Ergebnisse verwenden kurze Aufträge; Klasse 9/10 bringt anspruchsvollere biologische Fragen, keine unnötig schwierige Bedienprosa. Große temporäre Auswahlen sind bewusst geöffnet. Die tatsächlichen Bilder wurden zusätzlich visuell geprüft; reine Geometrieprüfung ersetzt das nicht.

## Regression, Quellen und Grenzen

Die neuen Browserprüfungen ersetzen die alten 14-Missions-/Zwei-Becken-Erwartungen für die Standardroute. Die historischen Testdateien und Berichte bleiben als solche erhalten; keine alten Klickabschlüsse werden als neue Leistung gezählt. Bestehende wissenschaftliche Modultests bleiben vollständig enthalten. Tutorial/Experte werden ausdrücklich in ihrem erhaltenen Modus geprüft.

Die ETS-PDF 2025/26 wurde erneut gelesen; Seiten 9–10, 14–15 und 19–20 sind in der [Lehrkraftübersicht](TEACHER.md) abgeglichen. Wald, Fossilien, anthropogener Kohlenstoff und Meeresschutz/Meeresmüll bleiben zusätzlich zu bearbeiten; sechs Aquariumfragen decken nicht das gesamte Curriculum. Der offizielle Landesportalzugriff scheiterte am konfigurierten Proxy mit HTTP 403; OSPAR ebenfalls 403, ein Nationalpark-Unterpfad 404. [Abrufbeleg](evidence/approved/source-access.json). Keine behauptete neue unabhängige Originalprüfung der Landesfassungen.

Getestet wird Linux-Chromium und portables WPE-WebKit 26.5 mit Softwaregrafik. Tabletformate und echte Touchereignisse sind kein Nachweis für physisches iPad/Safari, native Dateistarts oder Leistung auf Schulhardware. Einzel-HTML-Prüfungen schalten das Netzwerk **nach dem HTTP-Laden** aus; kein Versprechen, dass native `file:`-Starts oder ein erneuter Seitenwechsel ohne Netz funktionieren. Das große Einzel-HTML benötigt entsprechend Ressourcen.

Kein automatisierter Test beweist Lernerfolg oder selbstständiges Verständnis. Keine vollständige Fotorealismus-Abnahme. Der Ausgangsbranch und die frühere ZIP bleiben gesichert; `main` wurde weder geändert noch gemergt.
