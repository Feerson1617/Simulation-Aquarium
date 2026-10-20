# MASTER-ENTWICKLUNGSAUFTRAG
## Biologisch und biologiedidaktisch rekonstruierte Aquariumsimulation für die Klassen 8, 9 und 10

**Repository:** https://github.com/Feerson1617/Simulation-Aquarium

## 1. Ziel des Gesamtprojekts

Entwickle die bestehende Aquariumsimulation zu einem fachlich korrekten, didaktisch rekonstruierten und konsequent altersangemessenen Lernmedium für den Biologieunterricht der Jahrgangsstufen 8, 9 und 10.

Die Grundlage bildet das schulinterne Fachcurriculum Biologie der Eider-Treene-Schule, gültig ab 2025/26.

Das Spiel soll nicht nur biologische Vorgänge darstellen, sondern Lernende dabei unterstützen, biologische Zusammenhänge selbstständig zu entdecken, zu untersuchen, zu erklären und kritisch zu reflektieren.

**Dies ist ein Gesamtentwicklungsauftrag. Er betrifft die gesamte Simulation und nicht nur einzelne Szenarien.**

Er umfasst:

- Curriculare Neustrukturierung für die Jahrgangsstufen 8, 9 und 10.
- Vollständige didaktische Reduktion der Benutzeroberfläche.
- Altersangemessene Fachsprache.
- Kontextbezogene Hilfefunktionen.
- Lernmissionen und Freies Forschen.
- Experimentelles Arbeiten.
- Biologisch korrekte Simulationsmechanismen.
- Didaktische Rekonstruktion.
- Lehrkraftfunktionen und Differenzierung.
- Fachliche und technische Qualitätssicherung.

Setze die Anforderungen tatsächlich um. Ein Entwicklungsplan allein erfüllt diesen Auftrag nicht.

Beachte `AGENTS.md` und den aktuellen Repository-Stand. Prüfe insbesondere den Stand von PR #7, ohne einen offenen PR eigenmächtig zu mergen oder dessen Änderungen zu überschreiben.

## 2. Oberster didaktischer Grundsatz: Weniger sichtbare Komplexität

Die vorhandene Simulation ist biologisch und technisch umfangreich, für Schülerinnen und Schüler aber in vielen Bereichen zu komplex.

**Reduziere die für Lernende sichtbare Komplexität radikal und konsequent auf das für den jeweiligen Lerngegenstand Wesentliche.**

Dabei gilt:

Die biologische Simulation darf im Hintergrund differenziert bleiben. Die Schülerinnen und Schüler müssen jedoch nicht sämtliche Parameter, chemischen Verbindungen und technischen Einstellungen sehen oder verstehen.

Unterscheide zwischen:

1. Biologischen Hintergrundprozessen.
2. Didaktisch relevanten Beobachtungsgrößen.
3. Lernzielbezogenen Eingriffsmöglichkeiten.
4. Optionalen vertiefenden Informationen.
5. Für den aktuellen Lernprozess unnötigen Details.

Prüfe jede vorhandene Einstellung und Anzeige auf ihren konkreten Lernwert.

**Mehr sichtbare Informationen bedeuten nicht automatisch mehr Lernen.**

Entferne überflüssige Elemente aus den regulären Schüleransichten. Erhalte sinnvolle Funktionen im Experten- beziehungsweise Lehrkraftmodus.

Reduziere nicht nur Texte, sondern auch die Zahl der gleichzeitig verfügbaren Entscheidungen.

Verhindere dennoch, dass die Vereinfachung fachlich falsche biologische Zusammenhänge vermittelt.

## 3. Grundlegende neue Jahrgangsstruktur

Der Startbildschirm bietet zunächst die Auswahl:

**Klasse 8 – Ökologie**

**Klasse 9 – Vererbung und Evolution**

**Klasse 10 – Mensch und Ökosysteme**

Anschließend wählen die Lernenden zwischen:

### A. Lernmissionen

Didaktisch strukturierte Untersuchungen mit:

- Biologischem Ausgangsphänomen.
- Leitfrage.
- Eigener Hypothese.
- Untersuchung.
- Datenauswertung.
- Fachlicher Erklärung.
- Reflexion der Modellgrenzen.

### B. Freies Forschen

Ein offener Untersuchungsmodus mit denselben didaktisch reduzierten Werkzeugen wie in der jeweiligen Jahrgangsstufe.

Die Lernenden bestimmen eigene Fragestellungen und Untersuchungswege.

**Freies Forschen muss in allen drei Jahrgangsstufen gleichwertig zu den Lernmissionen sein.**

Es darf nicht einfach das bisherige freie Spiel mit allen komplizierten Einstellungen sein.

Zusätzlich bleiben ein Expertenmodus und ein Lehrkraftmodus verfügbar.

Die Grafikprofile Desktop und iPad bleiben unabhängig von der didaktischen Jahrgangsauswahl.

Alle Versionen verwenden dieselbe gemeinsame biologische Simulationsengine.

## 4. Verbindliche Vereinfachung der Wasserchemie

### 4.1 Grundregel

**In der regulären Schüleransicht sollen möglichst keine chemischen Formeln und komplizierten Einzelkonzentrationen angezeigt werden, sofern sie nicht unmittelbar für das Lernziel erforderlich sind.**

Die bisherige Oberfläche enthält zu viele Einzelwerte und chemische Abkürzungen.

Ersetze diese durch fachlich vertretbare, leicht verständliche Beobachtungsgrößen.

Insbesondere:

- Temperatur.
- Sauerstoff.
- Pflanzennährstoffe.
- Wasserbelastung.
- Gegebenenfalls Kohlenstoffdioxid.
- Weitere Werte nur bei konkreter curricularer Notwendigkeit.

Bezeichnungen wie Ammonium, Nitrit, Nitrat und Phosphat sollen nicht automatisch gemeinsam auf jeder Wasseranalyse erscheinen.

Verwende chemische Formeln grundsätzlich erst dann, wenn sie zum konkreten Lernziel gehören.

### 4.2 Klasse 8

Für Klasse 8 sind im regulären Ökologiemodus zunächst nur folgende Wasserwerte beziehungsweise Beobachtungsgrößen vorgesehen:

**Temperatur**

Anzeige in °C.

**Sauerstoff**

Vorrangig in verständlichen Zuständen wie „zu wenig“, „ausreichend“ oder „hoch“.

Bei Untersuchungen zur Fotosynthese darf die Sauerstoffkonzentration als Zahlenwert ergänzt werden, damit Messwertverläufe und Diagramme möglich sind.

**Pflanzennährstoffe**

Fasse die für das grundlegende Pflanzenwachstum relevante Nährstoffversorgung als verständlichen Bereich zusammen.

Anzeige beispielsweise: „zu wenig“, „ausreichend“, „Überschuss“.

**Wasserbelastung**

Stelle belastende Einflüsse auf die Wasserqualität in einer verständlichen Übersicht dar.

Anzeige beispielsweise: „gering“, „erhöht“, „kritisch“.

Wichtig: Die Wasserbelastung darf nicht als angeblich exakt gemessener einzelner chemischer Stoff ausgegeben werden.

**Pflanzennährstoffe und Wasserbelastung sind unterschiedliche didaktische Anzeigen, aber keine vollständig voneinander unabhängigen Stoffgruppen.**

Ein Stoff kann abhängig von Art, Konzentration und Organismus unterschiedliche Wirkungen haben.

Vermeide daher die pauschale Behauptung, alle Nährstoffe seien harmlos und alle sogenannten Schadstoffe seien grundsätzlich unnütz.

Komplexe chemische Prozesse laufen im Hintergrund weiter.

Die Schüleroberfläche zeigt jedoch nur die daraus didaktisch sinnvoll abgeleiteten Informationen.

### 4.3 Klasse 9

Die Schwerpunkte von Klasse 9 liegen auf Genetik und Evolution.

**Erhöhe deshalb nicht automatisch die Komplexität der Wasserchemie, nur weil die Klasse älter ist.**

In den regulären Genetik- und Evolutionsmissionen werden chemische Wasserwerte weitgehend ausgeblendet, sofern sie für die untersuchten Prozesse nicht notwendig sind.

Biologisch relevante Umweltbedingungen können beispielsweise als Temperatur, Sauerstoffversorgung oder andere konkret benannte Umweltfaktoren dargestellt werden.

Bei passenden ökologischen Vertiefungen dürfen Nitrit und Nitrat zusätzlich eingeführt werden.

Dies muss jedoch optional und lernzielbezogen erfolgen.

Eine allgemeine Pflicht, beide Stoffe in Klasse 9 zu behandeln, besteht für diese Simulation nicht.

### 4.4 Klasse 10

In Klasse 10 darf die Darstellung fachlich differenzierter sein, wenn sie für das Verständnis menschlicher Eingriffe in Ökosysteme benötigt wird.

Insbesondere bei Nährstoffeinträgen, Überdüngung und ökologischen Belastungen können einzelne Stoffe gezielt sichtbar werden.

Beispiele:

- Nitrat.
- Nitrit bei geeigneten Fragestellungen.
- Kohlenstoffdioxid.
- Sauerstoff.

Beginne auch hier mit verständlichen Beobachtungsgrößen.

Schalte differenzierte Konzentrationen und chemische Hintergrundinformationen erst dann frei, wenn dies für eine Untersuchung sinnvoll ist.

Chemische Formeln wie NO₃⁻ und NO₂⁻ gehören grundsätzlich in eine optionale Vertiefung beziehungsweise ein Fragezeichen-Hilfefenster, nicht automatisch in die Hauptanzeige.

Vermeide die vollständige Darstellung der chemischen Wasseranalyse in allen Klasse-10-Szenarien.

**Die fachliche Tiefe muss sich aus dem Lernziel ergeben, nicht allein aus der Jahrgangsstufe.**

### 4.5 Wissenschaftlich korrekte Berechnung

Die didaktisch vereinfachten Anzeigen müssen auf nachvollziehbaren tatsächlichen Simulationsgrößen beruhen.

Entwickle geeignete, dokumentierte Zuordnungen zwischen den berechneten Prozessen und den angezeigten Zuständen.

Stelle beispielsweise nicht einfach einen beliebigen Durchschnitt aller chemischen Werte als „Wasserbelastung“ dar.

Unterscheide nach Möglichkeit verschiedene Ursachen, beispielsweise organische Belastung, problematische Stickstoffverbindungen und Sauerstoffmangel.

Diese Ursachen dürfen für die Untersuchung differenziert zugänglich werden.

Eine vereinfachte Anzeige muss bei einer Veränderung der zugrunde liegenden Werte biologisch plausibel reagieren.

Erfinde keine Messgenauigkeit und keine allgemeingültigen Grenzwerte.

Kennzeichne modellabhängige Zustandsbewertungen als didaktische Einschätzungen.

## 5. Hilfesystem mit Fragezeichen-Schaltflächen

Implementiere ein gemeinsames, kontextsensitives Hilfesystem.

Neben wichtigen biologischen Begriffen, Einstellungen und Anzeigen erscheint eine kleine Fragezeichen-Schaltfläche.

Beim Anklicken öffnet sich eine kurze Erklärung.

Die Erklärung soll beantworten:

- Was bedeutet der Begriff?
- Welche biologische Bedeutung besitzt er?
- Warum kann er für die aktuelle Untersuchung relevant sein?

Die Erklärungen unterscheiden sich zwischen Klasse 8, 9 und 10.

### Beispiel Klasse 8: Pflanzennährstoffe

„Wasserpflanzen brauchen bestimmte Mineralstoffe, damit sie wachsen können. Wenn zu wenige vorhanden sind, kann das Wachstum langsamer werden.“

### Beispiel Klasse 9: Allel

„Ein Allel ist eine Variante eines Gens. Unterschiedliche Allele können dazu beitragen, dass sich Individuen in einem Merkmal unterscheiden.“

### Beispiel Klasse 10: Nitrat

„Nitrat ist eine stickstoffhaltige Verbindung, die Pflanzen als Nährstoff aufnehmen können. Hohe Nährstoffeinträge können jedoch ökologische Veränderungen und Algenwachstum begünstigen.“

Fachbegriffe sollen nicht durch ungenaue Alltagssprache ersetzt werden, sondern schrittweise verständlich werden.

Die Hilfen dürfen keine fertigen Lösungen einer laufenden Untersuchung vorwegnehmen.

Vermeide eine Überladung durch zu viele Fragezeichen. Verwende ein gemeinsames Glossar, das bei Bedarf aufgerufen werden kann.

Alle Hilfen müssen mit Touch, Maus und Tastatur funktionieren.

## 6. Didaktische Rekonstruktion als Entwicklungsprinzip

Orientiere sämtliche Jahrgangsstufen und Lernmissionen an drei Perspektiven:

**Fachliche Klärung**

Welche wissenschaftlichen Aussagen sind richtig? Welche Zusammenhänge werden vom Modell tatsächlich abgebildet?

**Lernendenperspektiven**

Welche Alltagserfahrungen und möglichen Fehlvorstellungen bringen Schülerinnen und Schüler mit?

**Didaktische Strukturierung**

Wie kann durch Beobachtung, Untersuchung und Reflexion ein fachlich angemesseneres Verständnis entstehen?

Berücksichtige insbesondere typische Vorstellungen wie:

- Pflanzen erzeugen immer Sauerstoff.
- Ein Filter lässt belastende Stoffe einfach verschwinden.
- Energie zirkuliert wie Stoffe.
- Dominante Allele sind immer häufiger.
- Evolution ist eine zielgerichtete Anpassung einzelner Tiere.
- Ein stabiles Ökosystem verändert sich nicht.

Erstelle für jede Lernmission ein didaktisches Profil mit curricularer Zuordnung, Lernziel, fachlicher Klärung, erwartbaren Lernhindernissen, Untersuchungsweg, Ergebnissicherung und Modellgrenzen.

Die Lernenden sollen biologische Zusammenhänge nicht nur erklärt bekommen, sondern möglichst selbst erschließen.

## 7. Klasse 8 – Ökologie

**Leitfrage: Warum können Organismen in einem Aquarium nur unter bestimmten Bedingungen dauerhaft zusammenleben?**

Implementiere folgende fünf Lernmissionen:

### 8.1 Ein Aquarium ist ein Ökosystem

Unterscheidung zwischen Lebewesen, unbelebter Umwelt sowie biotischen und abiotischen Faktoren.

### 8.2 Woher kommt der Sauerstoff?

Untersuchung der Beleuchtung und des Sauerstoffverlaufs.

Aufbau eines Kontroll- und Versuchsbeckens.

Fachlich korrekte Unterscheidung zwischen Fotosynthese und Zellatmung.

### 8.3 Wer frisst wen?

Erarbeitung von Nahrungsbeziehungen, Trophiestufen sowie Produzenten, Konsumenten und Destruenten.

Unterscheidung zwischen Stoffkreislauf und Energiefluss.

### 8.4 Warum geht es den Fischen schlecht?

Problemorientierte Untersuchung einer ökologischen Störung.

Die Lernenden wählen geeignete Beobachtungen und Messwerte, formulieren Hypothesen und überprüfen mögliche Ursachen.

Verwende die didaktisch vereinfachten Anzeigen für Sauerstoff, Pflanzennährstoffe und Wasserbelastung.

### 8.5 Vom Aquarium zum Wald

Übertragung ökologischer Zusammenhänge auf ein Waldökosystem.

Reflexion der Unterschiede zwischen Aquarium und Wald.

Diese Mission ist wichtig, weil das schulinterne Curriculum die Ökologie in Klasse 8 in der Regel am Beispiel Wald vorsieht.

Die reguläre Oberfläche für Klasse 8 muss deutlich übersichtlicher sein als die bisherige Simulation.

Komplexe Wasserchemie, Genetik und umfangreiche technische Einstellungen werden ausgeblendet.

## 8. Klasse 9 – Vererbung und Evolution

**Leitfrage: Wie entstehen erbliche Unterschiede und wie können sie sich über Generationen in Populationen verändern?**

Implementiere:

### 9.1 Warum sehen nicht alle Fische gleich aus?

Vergleich unterschiedlicher Individuen, Farbvarianten und Phänotypen.

Unterscheidung zwischen Genotyp und Phänotyp.

### 9.2 Wie werden Merkmale vererbt?

Mendelsche Regeln, Kreuzungen, F1-/F2-Generationen, Punnett-Quadrate und zufällige Allelverteilung.

Die genetischen Ergebnisse sollen zunächst vorhergesagt und anschließend untersucht werden.

### 9.3 Warum verändern sich Populationen?

Implementiere einen wissenschaftlich sinnvollen, didaktisch vereinfachten Evolutionsmechanismus.

Erbliche Variation und unterschiedliche Fortpflanzungserfolge müssen die Häufigkeiten vererbbarer Merkmale verändern können.

Zeige Populations- und Allelhäufigkeiten über Generationen.

Unterscheide natürliche Selektion und genetische Drift.

Dominanz darf nicht automatisch einen Selektionsvorteil bewirken.

### 9.4 Darwin oder Lamarck?

Die Lernenden vergleichen unterschiedliche Erklärungen für die beobachteten Veränderungen.

Sie sollen begründet darlegen, warum sich Populationen verändern und warum Individuen nicht zielgerichtet benötigte Allele entwickeln.

Ergänze geeignete Materialien zum Transfer auf Evolutionsbelege, Fossilien und stammesgeschichtliche Verwandtschaft.

Vermittle keine falsche Gleichsetzung zwischen familiärem Abstammungsbaum und phylogenetischem Stammbaum.

**Die Oberfläche konzentriert sich auf Individuen, Merkmale, Fortpflanzung, Generationen und Populationen.**

Komplexe Wasserchemie bleibt im Hintergrund.

## 9. Klasse 10 – Mensch und Ökosysteme

**Leitfrage: Welche Folgen haben menschliche Eingriffe in Ökosysteme und wie lassen sich geeignete Maßnahmen begründen?**

Implementiere:

### 10.1 Wenn zu viele Nährstoffe ins Wasser gelangen

Untersuchung erhöhter Nährstoffeinträge und ihrer ökologischen Folgen.

Berücksichtige Pflanzen, Algen, Mikroorganismen und Sauerstoffhaushalt.

Führe bei Bedarf einzelne chemische Stoffe ein, aber nicht automatisch alle chemischen Parameter.

### 10.2 Wohin gelangt der Kohlenstoff?

Untersuchung von Fotosynthese, Zellatmung, Biomasse, Zersetzung und Gasaustausch.

Zunächst qualitative Darstellung des Kohlenstoffkreislaufs.

Quantitative Angaben nur dort, wo das Rechenmodell hinreichend belastbare Ergebnisse liefert.

### 10.3 Kann ein gestörtes Ökosystem wiederhergestellt werden?

Vergleich unterschiedlicher Eingriffe und Maßnahmen.

Bewertung kurz- und langfristiger Folgen.

### 10.4 Vom Aquarium zur Nordsee

Transfer auf natürliche marine Ökosysteme.

Berücksichtige regionale Nährstoffeinträge, ökologische Wechselwirkungen und die Grenzen des Aquariummodells.

### 10.5 Nutzung und Schutz des Wattenmeeres

Entwickle eine problemorientierte Bewertungsaufgabe zu Meeresschutz, Meeresmüll und menschlichen Nutzungsinteressen.

Die Lernenden sollen ökologische, ökonomische und soziale Kriterien berücksichtigen.

Nutze fachlich überprüfte regionale Informationen.

Der Kohlenstoffkreislauf sowie Meeresschutz und Meeresmüll am Beispiel Nordsee und Wattenmeer müssen curricular berücksichtigt werden.

**Die Oberfläche für Klasse 10 darf anspruchsvoller sein, soll aber weiterhin lernzielorientiert reduziert bleiben.**

## 10. Freies Forschen

Entwickle für jede Jahrgangsstufe einen voll funktionsfähigen offenen Forschungsmodus.

Er darf keine festgelegte Aufgabenreihenfolge voraussetzen.

Die Lernenden sollen eigene Hypothesen formulieren und untersuchen können.

Stelle dafür passende Werkzeuge bereit.

Beispiele:

**Klasse 8:** Beleuchtung verändern, Pflanzen vergleichen, Sauerstoffentwicklung beobachten und Nahrungsbeziehungen untersuchen.

**Klasse 9:** Kreuzungen durchführen, Populationen über Generationen vergleichen und natürliche Selektion untersuchen.

**Klasse 10:** Nährstoffeinträge verändern, ökologische Störungen untersuchen und Gegenmaßnahmen vergleichen.

Die offenen Untersuchungsmöglichkeiten sollen umfangreich sein, ohne durch irrelevante Einstellungen zu überfordern.

Funktionen können bei Bedarf freigeschaltet werden.

## 11. Gemeinsamer naturwissenschaftlicher Untersuchungsmodus

Implementiere ein durchgängiges Untersuchungswerkzeug mit:

1. Beobachtung.
2. Fragestellung.
3. Hypothese.
4. Versuchsplanung.
5. Veränderung einer unabhängigen Variablen.
6. Messung und Datenerhebung.
7. Diagrammerstellung.
8. Datenauswertung.
9. Fachlicher Erklärung.
10. Reflexion der Untersuchung und des Modells.

Ermögliche Kontroll- und Versuchsbecken mit gleichen Ausgangsbedingungen.

Ermögliche Wiederholungen.

Erstelle Diagramme aus tatsächlichen Simulationsdaten.

Bei Klasse 8 sollen einfache Diagramme genügen.

Bei Klasse 9 sollen unter anderem Merkmals- und Allelhäufigkeiten untersucht werden.

Bei Klasse 10 können komplexere Zeitverläufe und Ursache-Wirkungs-Zusammenhänge analysiert werden.

Berücksichtige den Unterschied zwischen Beobachtung und Deutung.

## 12. Didaktisch reduzierter Artenkatalog

Erhalte den vollständigen Artenkatalog technisch.

Reduziere die sichtbare Auswahl in den regulären Jahrgangsversionen jedoch deutlich.

Wähle Organismen anhand ihrer Bedeutung für die Lernziele aus.

Klasse 8 benötigt vor allem Arten mit geeigneten unterschiedlichen ökologischen Funktionen.

Klasse 9 benötigt Arten, deren Erb- und Populationsmerkmale für die Untersuchung von Genetik und Evolution geeignet sind.

Klasse 10 benötigt geeignete Organismen, mit denen ökologische Störungen und Eingriffe untersucht werden können.

Ein Expertenmodus erhält Zugriff auf den vollständigen Katalog.

Das Freie Forschen bleibt offen, aber mit curricular sinnvoller Vorauswahl.

## 13. Lehrkraftmodus und Differenzierung

Implementiere einen Lehrkraftmodus ohne zusätzliche Benutzerkonten oder kostenpflichtige Dienste.

Ermögliche:

- Auswahl der Jahrgangsstufe.
- Vorbereitung von Lernmissionen.
- Auswahl eines Unterstützungsniveaus.
- Freigabe zusätzlicher Parameter.
- Ein- und Ausblenden von Hilfen.
- Vorbereitung von Kontroll- und Versuchsbecken.
- Zurücksetzen von Untersuchungen.
- Export von Untersuchungsprotokollen.
- Einsicht in Lernprodukte.

Verwende drei Unterstützungsniveaus:

**Stark angeleitet:** Kurze Arbeitsaufträge, begrenzte Optionen, konkrete Hilfen.

**Teilangeleitet:** Eigenständige Hypothesen und Untersuchungsentscheidungen mit optionalen Hilfen.

**Eigenständig:** Offene Fragestellungen, weitgehend selbstständige Untersuchungsplanung und vertiefte Auswertung.

Die biologischen Gesetzmäßigkeiten bleiben in allen Unterstützungsniveaus identisch.

## 14. Biologische Fachprüfung der gesamten Simulation

Prüfe die zugrunde liegenden Modelle und Berechnungen hinsichtlich wissenschaftlicher Korrektheit.

Berücksichtige insbesondere:

- Fotosynthese und Zellatmung.
- Sauerstoffhaushalt.
- Pflanzennährstoffversorgung.
- Organische Belastung.
- Zersetzung und Mineralisierung.
- Stickstoffumwandlungen.
- Stoffkreisläufe und Energiefluss.
- Nahrungsbeziehungen.
- Wachstum und Fortpflanzung.
- Genetische Vererbung.
- Natürliche Selektion.
- Populationsveränderungen.
- Einfluss von Umweltfaktoren.

Unterscheide explizit:

**Wissenschaftlich fachlich begründete Mechanismen**

und

**Didaktisch vereinfachte Modellannahmen.**

Die didaktische Reduktion darf nicht zu fachlich falschen Aussagen führen.

Mögliche Gefahren:

- Alle Nährstoffe pauschal als ungefährlich darzustellen.
- Alle Wasserbelastungen auf einen einzigen Stoff zurückzuführen.
- Fotosynthese und Zellatmung als Gegensätze darzustellen.
- Energie wie einen Stoffkreislauf zu behandeln.
- Dominanz mit Fitness zu verwechseln.
- Evolution als zielgerichtete Anpassung einzelner Organismen zu modellieren.
- Die beschleunigte Fortpflanzung als natürliche Entwicklungsdauer auszugeben.
- Das Aquarium als vollständig repräsentatives Modell von Nordsee oder Wattenmeer darzustellen.

Berücksichtige insbesondere die Unterscheidung zwischen einem didaktisch vereinfachten Zustandsindikator und einer tatsächlichen wissenschaftlichen Messgröße.

## 15. Lernstandsüberprüfung

Ergänze Möglichkeiten zur Überprüfung des fachlichen Verständnisses.

Berücksichtige sowohl Vorwissen als auch Lernfortschritt.

Verwende beispielsweise:

- Kurze Diagnosefragen vor einer Untersuchung.
- Vorhersagen.
- Hypothesen.
- Diagrammauswertungen.
- Fachliche Erklärungen.
- Reflexionsaufgaben.
- Vergleiche früherer und späterer Vorstellungen.

Bewerte nicht ausschließlich den Erfolg der Aquarienpflege.

Die Lernenden sollen nachweisen können, welche biologischen Zusammenhänge sie verstanden haben.

Verwende möglichst offene und fachlich begründbare Aufgaben.

Dokumentiere Ergebnisse ohne verpflichtende Benutzerkonten.

## 16. Technische Umsetzung

Erhalte die bestehende GitHub-Pages-Veröffentlichung.

Verwende weiterhin ausschließlich kostenlose Technologien.

Keine zusätzlichen Drittanbieter-Konten, Abonnements oder kostenpflichtigen APIs.

Erhalte:

- Die hochwertigen vorhandenen 3D-Modelle.
- Desktop- und iPad-Grafikprofile.
- Pinzettenfunktion.
- Bestehende biologische Prozesse.
- Genetik und Fortpflanzung.
- Speicherfunktionen.
- Bestehende Szenarien, soweit sie didaktisch sinnvoll überarbeitet werden.
- Kompatibilität mit früheren Spielständen.

Entwickle keine drei getrennten biologischen Simulationskerne.

Verwende einen gemeinsamen, fachlich konsistenten Rechenkern mit unterschiedlichen pädagogischen Profilen.

Berücksichtige Schul-iPads und Touch-Bedienung.

## 17. Entwicklungsstrategie

Führe den Gesamtauftrag in nachvollziehbaren Entwicklungsphasen aus.

**Phase 1: Didaktisches Audit und fachliche Korrekturen**

Analysiere die gesamte bestehende Simulation.

Identifiziere überflüssige Einstellungen, fachliche Probleme und notwendige Reduktionen.

**Phase 2: Gemeinsame pädagogische Architektur**

Implementiere Jahrgangsprofile, Startbildschirm, Lernmissionen, Freies Forschen, Glossar und einheitliche Hilfen.

**Phase 3: Didaktisch reduzierte Oberflächen**

Gestalte Shop, Wasserwerte, Analyse, Pflegefunktionen und Einstellungen für alle Jahrgangsstufen neu.

**Phase 4: Lernmissionen und Untersuchungssystem**

Implementiere die beschriebenen jahrgangsspezifischen Lernmissionen und naturwissenschaftlichen Untersuchungswerkzeuge.

**Phase 5: Erweiterte biologische Mechaniken**

Ergänze insbesondere natürliche Selektion, Populationsveränderungen und erforderliche ökologische Vertiefungen.

**Phase 6: Lehrkraftmodus, Lernstandsüberprüfung und Differenzierung**

Implementiere die entsprechenden Werkzeuge.

**Phase 7: Fachliche, didaktische und technische Gesamtprüfung**

Überprüfe alle Jahrgangsversionen.

Dieser Auftrag ist nicht nach Phase 1 abgeschlossen.

Arbeite nach Möglichkeit alle Phasen innerhalb desselben Entwicklungsauftrags ab.

Falls die Ausführungs- oder Kontingentgrenzen erreicht werden, sichere sämtliche abgeschlossenen Arbeiten und dokumentiere die noch ausstehenden Phasen.

## 18. Qualitätskontrolle und Abnahme

Die Gesamtüberarbeitung gilt nur dann als vollständig umgesetzt, wenn:

1. Die Klassen 8, 9 und 10 unterschiedliche Lernumgebungen besitzen.
2. Jede Jahrgangsstufe Lernmissionen und Freies Forschen bietet.
3. Die sichtbaren Informationen und Einstellungen deutlich reduziert wurden.
4. Die Jahrgangsstufen unterschiedliche fachliche Schwerpunkte besitzen.
5. Die Wasserchemie in Klasse 8 verständlich reduziert ist.
6. Nitrit, Nitrat und andere chemische Details nur bei fachlicher Notwendigkeit erscheinen.
7. Das Fragezeichen-Hilfesystem funktioniert.
8. Die Lernmissionen echte biologische Erkenntnisprozesse ermöglichen.
9. Vergleichsbecken und Datenauswertung funktionieren.
10. Genetik und natürliche Selektion fachlich korrekt unterschieden werden.
11. Klasse 10 die verbindlichen regionalen Themen berücksichtigt.
12. Freies Forschen eine tatsächlich offene, aber altersangemessene Untersuchung ermöglicht.
13. Der Lehrkraftmodus verfügbar ist.
14. Alle bisherigen wesentlichen Spielfunktionen erhalten sind.

Prüfe die tatsächliche Benutzeroberfläche mit Browsertests.

Teste die drei Jahrgangsstufen getrennt.

Erstelle aussagekräftige Screenshots.

Bewerte auch die Verständlichkeit und kognitive Belastung der Oberflächen.

Eine erfolgreiche technische Ausführung ist noch kein Nachweis für die didaktische Qualität.

## 19. GitHub und Abschluss

Arbeite auf einem neuen Entwicklungsbranch beziehungsweise einer geeigneten Fortsetzung des aktuellen Entwicklungsstands.

Verändere `main` nicht direkt.

Sichere regelmäßig Zwischenstände.

Erstelle nach Fertigstellung einen Pull Request mit unserer vorhandenen automatischen Spielvorschau.

Führe keinen Merge durch.

Erstelle einen vollständigen Abschlussbericht auf Deutsch.

Dieser muss enthalten:

- Curriculare Zuordnung sämtlicher Lernmissionen.
- Übersicht der didaktisch reduzierten Funktionen.
- Übersicht der ausgeblendeten Einstellungen.
- Fachliche Begründung der Wasserchemie-Reduktion.
- Darstellung der unterschiedlichen Fachsprachen.
- Dokumentation der neuen Untersuchungswerkzeuge.
- Biologische Fachprüfung und verbleibende Modellgrenzen.
- Testergebnisse.
- Offene Entwicklungsaufgaben.

**Übergeordnetes Ziel: Eine wissenschaftlich verantwortbare, didaktisch rekonstruierte und altersangemessene biologische Simulation, in der Schülerinnen und Schüler möglichst selbstständig fachliche Erkenntnisse gewinnen können, ohne von unnötigen Informationen und Einstellungen überfordert zu werden.**