# Korrekturauftrag – Biologische Lernqualität und Unterrichtstauglichkeit

**Repository:** https://github.com/Feerson1617/Simulation-Aquarium

**Bestehender Pull Request:** #8  
**Branch:** `feature/biology-learning-environments`  
**Zuletzt unabhängig geprüfter Commit:** `6c86274bac47f96fe6309355f851713f2d42cbc0`

## 1. Ausgangslage und Arbeitsweise

Der unabhängige Gesamtprüfbericht hat fünf schwerwiegende Fehlergruppen (A01–A05), fünf weitere fachlich beziehungsweise didaktisch relevante Probleme (A06–A10) und einen Bereich zur Oberflächenvereinfachung (A11) festgestellt.

Setze die notwendigen Korrekturen auf Grundlage der tatsächlichen Implementierung um.

Lies zuerst `AGENTS.md`, den aktuellen PR-Stand, die vorhandenen Prüfberichte und das schulinterne Fachcurriculum.

**Arbeite ausschließlich im bestehenden PR #8. Kein Merge und keine Veränderung an main.**

Prüfe vor der Entwicklung, ob sich der Branch seit dem angegebenen Commit verändert hat.

Erhalte funktionierende bisherige Mechaniken, insbesondere R1–R8, Genetik, Populationssimulation, Questbuch, Gerätebedienung, Speicherstände, Freies Forschen und Expertenmodus.

## 2. Oberstes Entwicklungsprinzip

Die nächste Überarbeitung darf die Schüleroberfläche nicht wieder unnötig kompliziert machen.

**Weniger Text, aber mehr biologisch bedeutsame Handlungen.**

Die Schülerinnen und Schüler sollen möglichst viel durch Beobachten, Experimentieren, Vergleichen und einfache Zuordnungen lernen.

Verwende weiterhin:

- Sehr kurze, verständliche Sätze.
- Pro Bildschirm möglichst nur eine klare Aufgabe.
- Wenige sichtbare Werte.
- Konkrete Handlungen direkt in der Simulation.
- Kurze, gezielte Hilfen nach Fehlern.
- Altersgerechte biologische Erklärungen.

Vermeide verpflichtende Zeichenaufgaben, umfangreiche Schreibaufträge, abstrakte Diagrammkonstruktionen und lange Informationstexte.

Behalte die fünf Questphasen grundsätzlich bei, gestalte innerhalb dieser Phasen aber die tatsächlich notwendigen Lernhandlungen.

**Eine Quest darf nicht nur deshalb als fachlich erfolgreich gelten, weil fünf technische Schritte abgeschlossen wurden.**

Alle fachlichen, curricularen und pädagogischen Hintergründe gehören ausschließlich in den Lehrkraftmodus und die Entwicklungsdokumentation.

Weder curriculare Zuordnungen noch didaktische Fachbegriffe oder wissenschaftliche Validierungskommentare dürfen in der regulären Schüleroberfläche erscheinen.

## 3. Priorität P1 – Nachgewiesene Fehler beheben

### A01 – Natürliche Selektion und Zufall richtig unterscheiden

In der Populationensimulation wird momentan auch nach einer neutralen Untersuchung eine Selektionserklärung angezeigt.

Das ist falsch.

Wenn keine Merkmalsausprägung einen systematischen Fortpflanzungsvorteil besitzt, dürfen zufällige Veränderungen nicht als natürliche Selektion erklärt werden.

Passe deshalb Einleitungen, Questfragen und Rückmeldungen an die tatsächlich gewählte Umweltbedingung an.

Bei neutralen Bedingungen sollen die Schülerinnen und Schüler erfahren:

„Keine Farbe hat hier einen Vorteil. Trotzdem können sich die Anteile durch Zufall verändern.“

Bei gerichteter Selektion:

„Fische mit einer bestimmten Farbe haben in diesem Modell häufiger Nachkommen.“

Die Lernenden sollen mindestens zwei geeignete Verläufe vergleichen können.

Ermögliche den Vergleich von neutralen Wiederholungen und einer hypothetischen Selektionsumgebung.

Unterschiedliche Nachkommenzahlen dürfen nicht automatisch als Selektionsnachweis gelten.

Erhalte die fachlich korrekte Trennung zwischen Genotyp, Phänotyp, Dominanz und Fortpflanzungserfolg.

### A02 – Gesunde Ausgangsbecken sicherstellen

Die derzeitigen Ausgangsbecken verwenden teilweise Wasserwerte außerhalb der hinterlegten Ansprüche der eingesetzten Arten.

Insbesondere ist die Gesamthärte der vorbereiteten Süßwasserbecken für bestimmte verwendete Fischarten zu niedrig.

Prüfe sämtliche Startbecken für alle Jahrgänge und Missionen anhand der tatsächlich hinterlegten Artansprüche.

Berücksichtige Temperatur, Wasserhärte, Wasserart, Gruppenbedarf und weitere modellierte Haltungsbedingungen.

**Ein gesundes Ausgangsbecken muss im Modell tatsächlich gesunde Ausgangsbedingungen besitzen.**

Ausnahmen sind nur bei Lernmissionen sinnvoll, die ausdrücklich eine ökologische Störung untersuchen.

Bei diesen Missionen darf keine zusätzliche unbeabsichtigte Belastung die vorgesehene Ursache überlagern.

Prüfe auch das Frischwasser beim Wasserwechsel.

Ändere keine artspezifischen Anforderungen allein deshalb, damit ein Test bestanden wird.

### A03 – Den Zustand der Fische korrekt darstellen

Die bisherige Anzeige „Zustand der Fische“ berücksichtigt auch Wirbellose.

Dadurch können Schnecken in die Bewertung eingehen, obwohl bereits sämtliche Fische gestorben sind.

Das muss korrigiert werden.

Unterscheide eindeutig:

- Anzahl lebender Fische.
- Anzahl verstorbener Fische.
- Zustand der noch lebenden Fische.
- Andere Tiergruppen.

Der Zustand lebender Fische darf nicht mit Werten von Schnecken oder Garnelen vermischt werden.

Wenn keine lebenden Fische mehr vorhanden sind, darf kein scheinbar gültiger positiver Fischzustandswert angezeigt werden.

Vermeide außerdem eine irreführende Verbesserung des Durchschnitts, nur weil geschwächte Tiere verstorben sind.

In den regulären Schüleransichten sollen möglichst einfache Aussagen erscheinen, beispielsweise:

„Alle sechs Fische leben noch.“

„Nur noch drei Fische leben.“

„Keine Fische mehr im Becken.“

Die Auswertung einer Sanierungsmission muss sowohl Überleben als auch Zustand berücksichtigen.

Bestehende Exporte und ältere Lernprodukte müssen weiterhin lesbar bleiben. Veränderte Kennzahlbedeutungen sind gegebenenfalls zu versionieren.

### A04 – Eigene Schülerleistungen korrekt dokumentieren

Derzeit werden automatisch erzeugte Aussagen teilweise als eigene Hypothesen, Untersuchungspläne oder Erklärungen der Schülerinnen und Schüler ausgegeben.

Das ist unzulässig.

Unterscheide in sämtlichen Lernprodukten die Herkunft der Informationen:

**Eigene Eingabe:** Vom Schüler selbst formuliert.

**Auswahl:** Eine vom Schüler gewählte Antwort.

**Spielhandlung:** Tatsächlich durchgeführter Eingriff.

**Messwert:** Vom Simulationsmodell erzeugtes Untersuchungsergebnis.

**Spielerklärung:** Vom Spiel bereitgestellter Fachtext.

Die Lehrkraftansicht muss diese Unterschiede eindeutig zeigen.

Eine angeklickte Vermutung ist nicht automatisch eine eigenständig begründete Hypothese.

Ein vom Spiel eingeblendeter Abschlussabsatz ist keine selbst formulierte Schülererklärung.

Ermögliche bei geeigneten Aufgaben kurze freiwillige Begründungen beziehungsweise eine Auswahl mit anschließendem einfachen Begründungsschritt.

Insbesondere Klasse 8 darf dadurch nicht mit umfangreichen Schreibpflichten belastet werden.

Erhalte bestehende ältere Lernprodukte; bei fehlenden Herkunftsangaben muss dies kenntlich gemacht werden.

### A05 – Alle 14 Lernmissionen inhaltlich vervollständigen

Überarbeite die Questfolgen aller 14 Missionen.

Die Anzahl der Bildschirmtexte soll möglichst gering bleiben.

Entscheidend sind wenige, tatsächlich notwendige Handlungen zum Erreichen des jeweiligen biologischen Lernziels.

Die bisherigen Questabschlüsse dürfen nicht nur aus einer allgemeinen Wissensfrage, einer beliebigen Vermutung, einem Versuch und einer einfachen Multiple-Choice-Frage bestehen.

Entwickle die folgenden Lernhandlungen.

#### Klasse 8

**8.1 Ein Aquarium ist ein Ökosystem**

Die Lernenden unterscheiden Lebewesen und unbelebte Bestandteile und untersuchen eine passende Umweltbedingung.

Sie erkennen, dass die Bedingungen im Wasser Einfluss auf Lebewesen haben.

**8.2 Woher kommt der Sauerstoff?**

Licht und Dunkelheit vergleichen.

Vor der Untersuchung eine klare Vermutung über den Unterschied zwischen beiden Becken abgeben.

Nach dem Versuch tatsächliche Werte vergleichen und die Vermutung prüfen.

**8.3 Wer ist mit wem verbunden?**

Hier muss tatsächlich eine einfache Nahrungsbeziehung hergestellt werden.

Beispielsweise durch Anklicken oder Zuordnen von Futter, Organismen und Verbindungspfeilen innerhalb des Spiels.

Die Lernenden unterscheiden grundlegende Rollen von Pflanzen, Tieren und zersetzenden Organismen.

Ergänze eine sehr einfache Unterscheidung zwischen Stoffen und Energie.

Keine Zeichenaufgabe auf Papier.

**8.4 Den Fischen geht es nicht gut**

Fische beobachten, Überleben und Wasserbedingungen prüfen und eine geeignete Maßnahme durchführen.

Die Lernenden sollen erkennen, ob die Maßnahme tatsächlich hilft.

Ungeeignete Startwerte und falsche Fischzustandsanzeigen müssen ausgeschlossen sein.

**8.5 Vom Aquarium in den Wald**

Die Lernenden vergleichen anhand einfacher Bild- oder Zuordnungskarten eine Aquariumpflanze mit einem Baum.

Mindestens eine Gemeinsamkeit und ein Unterschied sollen tatsächlich bearbeitet werden.

#### Klasse 9

**9.1 Gleiche Art, verschiedene Individuen**

Unterschiedliche Merkmale untersuchen.

Zunächst sichtbare Merkmale betrachten, danach mögliche Erbanlagen aufdecken.

Genotyp und Phänotyp dürfen nicht gleichgesetzt werden.

**9.2 Eine Kreuzung vorhersagen**

Eine F1-Kreuzung und anschließend eine tatsächliche F2-Kreuzung durchführen.

Die Lernenden müssen erkennen, dass sich die Erbanlagen zufällig auf die Nachkommen verteilen.

Unterscheide theoretische Wahrscheinlichkeit und tatsächlich beobachtete Anzahl.

Eine einzige AA × aa-Kreuzung reicht für den vollständigen Missionsabschluss nicht aus.

**9.3 Eine Population verändert sich**

Zunächst neutrale Veränderungen durch Zufall untersuchen.

Anschließend mit einer Situation vergleichen, in der ein bestimmtes Merkmal im Modell einen Fortpflanzungsvorteil hat.

Die Erklärungen müssen zur tatsächlich gewählten Umwelt passen.

**9.4 Darwin und Lamarck prüfen**

Zwei unterschiedliche Erklärungen für eine beobachtete Veränderung gegenüberstellen.

Die Lernenden müssen die daraus folgenden Vorhersagen vergleichen.

Ergänze einen kurzen, geeigneten Transfer mit Evolutionsbelegen.

Behaupte nicht, ein programmiertes Modell allein könne eine historische Naturerklärung empirisch widerlegen.

#### Klasse 10

**10.1 Zu viele Nährstoffe**

Die Lernenden untersuchen zunächst die Wirkung zusätzlicher Nährstoffe auf Algen.

Anschließend prüfen sie eine weitere passende Größe, beispielsweise den Sauerstoff.

Eine Sauerstoffkrise darf nicht unabhängig von den tatsächlichen Berechnungen behauptet werden.

**10.2 Kohlenstoff in Bewegung**

Die Lernenden ordnen wenige zentrale Kohlenstoffspeicher und Stoffwege innerhalb des Spiels zu.

Anschließend bearbeiten sie einen kurzen Transfer zur menschlichen Beeinflussung des Kohlenstoffkreislaufs.

Die Verbrennung von Kohle, Erdöl oder Erdgas muss als zusätzlicher Eintrag von zuvor gespeichertem Kohlenstoff verständlich werden.

Trenne reale Hintergrundinformationen und die vereinfachte Aquariumsimulation.

**10.3 Ein gestörtes System stabilisieren**

Die Lernenden untersuchen eine geeignete Maßnahme und vergleichen ihre kurzfristigen und längerfristigen Folgen.

Nutze dafür tatsächliche Messwerte und berücksichtige die überlebenden Tiere.

**10.4 Vom Becken in die Nordsee**

Ergänze eine kurze regionale Fallinformation mit fachlich überprüfter Quelle.

Die Lernenden sollen erkennen, wie Nährstoffe über Flüsse ins Meer gelangen können.

Anschließend wählen sie eine begründete Möglichkeit zur Verringerung des Eintrags.

Ein einfacher Süßwasserversuch allein erfüllt die Mission nicht.

**10.5 Wattenmeer nutzen und schützen**

Das Thema Meeresmüll muss durch eine passende regionale Entscheidungssituation untersucht werden.

Ein Wasserwechsel im unbelasteten Süßwasseraquarium ist dafür kein hinreichendes Lernexperiment.

Nutze kurze, geeignete Bild- oder Informationskarten.

Die Lernenden wählen eine Schutzmaßnahme und berücksichtigen mindestens zwei unterschiedliche Interessen beziehungsweise Folgen.

Erfinde keine Plastik-Schadenskurven oder angeblichen Messwerte.

## 4. Priorität P2 – Weitere fachliche und didaktische Probleme

### A06 – Temperaturmission korrigieren

Die erste Mission soll nicht länger eine unerreichbare Solltemperatur von 20 °C als sinnvollen Heizeingriff vorgeben.

Wähle eine fachlich plausible Zieltemperatur oberhalb der Ausgangstemperatur, beispielsweise 27 °C bei zunächst 25 °C Wasser, sofern dies mit den verwendeten Arten vereinbar ist.

Die Lernenden sollen den Heizstab einstellen und anschließend beobachten, wie sich die Wassertemperatur verändert.

Der eingestellte Wert ist nicht mit der aktuellen Wassertemperatur gleichzusetzen.

Ein Heizstab darf weiterhin nicht aktiv kühlen.

### A07 – Vermutungen eindeutig formulieren

Die Aufgaben müssen klar unterscheiden:

- Veränderung gegenüber dem eigenen Anfangswert.
- Unterschied zwischen Kontroll- und Versuchsbecken.

Beispiel Klasse 8:

„In welchem Becken ist nach drei Spieltagen mehr Sauerstoff?“

Vermeide unklare Formulierungen wie „Es gibt weniger Sauerstoff“, wenn nicht eindeutig ist, womit verglichen wird.

Am Ende soll die eigene Vermutung kurz mit dem tatsächlichen Ergebnis verglichen werden.

Verwende für die Antwortprüfung fachlich sinnvolle Genauigkeiten statt pauschaler Rundung auf drei Dezimalstellen.

### A08 – Notwendige Messwerte gezielt freigeben

Die Reduktion der sichtbaren Werte bleibt erhalten.

Allerdings müssen die Lernenden diejenigen Größen sehen können, die sie für eine biologische Erklärung benötigen.

Pro Untersuchung sollen zunächst ein Hauptwert und bei Bedarf ein weiterer passender Wert verfügbar sein.

Beispiele:

Algenentwicklung und Sauerstoff.

Kohlenstoffdioxid und Pflanzenentwicklung.

Anzahl lebender Fische und Zustand der überlebenden Fische.

Ergänze eine einfache Möglichkeit, mehrere Versuchsreihen zu vergleichen, insbesondere bei zufallsabhängigen Genetik- und Evolutionsversuchen.

Zeige nicht sämtliche Wasserparameter gleichzeitig.

### A09 – Unterstützung und Rückmeldungen verbessern

Die vorhandenen Unterstützungsstufen müssen tatsächlich das reguläre Questbuch beeinflussen.

**Stark angeleitet:** Konkrete kleine Hinweise.

**Teilangeleitet:** Weniger Unterstützung, Hilfen bei Bedarf.

**Selbstständig:** Mehr eigene Entscheidungen, kurze Hilfen auf Anfrage.

Die biologischen Berechnungen bleiben gleich.

Verwende bei falschen Antworten konkrete Rückmeldungen zur jeweiligen Denkaufgabe.

Nicht überall denselben Satz „Schau noch einmal hin“.

Verhindere, dass die richtige Antwort immer an derselben Position steht.

Eine sinnvolle Reihenfolgevariation muss auch nach Speichern und Laden stabil bleiben.

### A10 – Modellregeln gezielt korrigieren

Prüfe die Nitrifiziererentwicklung ohne geeignete Stickstoffverbindungen.

Mikroorganismen dürfen im Modell nicht allein durch ablaufende Zeit ohne passende Energiequelle wachsen.

Prüfe ebenfalls, ob die Ammoniak-Warnanzeige und die tatsächliche Gesundheitswirkung konsistent auf der modellierten Konzentration und ihrer Abhängigkeit von Temperatur und pH-Wert beruhen.

Prüfe Wasserwechsel hinsichtlich Frischwasserhärte und realistischer Temperatur.

Erhalte bereits korrekte Teilbilanzen und die bisherigen Tests.

Dokumentiere weiterhin fachliche Vereinfachungen in der Lehrkraftansicht.

Zeitlich stark verkürzte Entwicklungsprozesse dürfen für die Lernenden keine realistischen Entwicklungsdauern vortäuschen.

## 5. Priorität P3 – Benutzeroberfläche weiter vereinfachen

### A11 – Weniger Elemente gleichzeitig anzeigen

Die Bedienoberfläche ist weiterhin in mehreren Ansichten zu voll.

Reduziere insbesondere gleichzeitig sichtbare:

- Werkzeugwahl.
- Drehregler.
- Zahlenfelder.
- Zusatztexte.
- Beobachtungszeiträume.
- Wiederholungsoptionen.
- Wiederholte Questhinweise.

Nutze progressive Offenlegung.

Eine Aufgabe soll möglichst einen offensichtlichen primären Bedienweg anbieten.

Beim Heizstab beispielsweise:

„Heizstab einstellen“

Danach erscheint das Rädchen am hervorgehobenen Gerät.

Das Zahlenfeld kann als Alternative verfügbar bleiben, muss aber nicht gleichzeitig dominant sein.

Unterscheide Hinweise für Touch und Tastatur.

Korrigiere außerdem falsche Diagrammbeschriftungen, beispielsweise „Becken“ statt „Gruppe“ bei Populationsvergleichen.

Komplexere Umgestaltungen sollen zunächst anhand einer repräsentativen Beispielmission überprüft werden, bevor sie überall umgesetzt werden.

## 6. Qualitätsanforderungen

Führe gezielte automatisierte und tatsächliche Browserprüfungen durch.

Prüfe insbesondere die folgenden Fälle:

**Neutrale Population:** Zufällige Allelhäufigkeitsänderung ohne falsche Selektionserklärung.

**Startbecken:** Alle normalen Ausgangsorganismen haben geeignete modellierte Lebensbedingungen.

**Fischzustand:** Keine Einbeziehung von Schnecken; keine positive Fischzustandszahl, wenn alle Fische verstorben sind.

**Lernprodukte:** Spieltexte und ausgewählte Antworten werden nicht als selbst formulierte Schülertexte ausgegeben.

**Missionen:** Jede Mission verlangt die zur zentralen biologischen Erkenntnis erforderlichen Handlungen.

**Mendel:** F1 und F2 sind tatsächlich untersucht und anhand der Ergebnisse ausgewertet.

**Sauerstoff:** Aussage und Vorhersage unterscheiden Ausgangswert und Kontrollvergleich korrekt.

**Genetik/Evolution:** Zufällige und gerichtete Veränderungen werden korrekt unterschieden.

**Meeresschutz:** Regionale Fallaufgaben werden tatsächlich bearbeitet und sind nicht nur als Hintergrundtext vorhanden.

**Unterstützungsstufen:** Die Unterschiede sind in der regulären Schüleroberfläche nachvollziehbar.

**Geräte:** Heizstab, Filter und Beleuchtung funktionieren mit der bestehenden direkten Bedienung weiter.

**Regression:** R1–R8, Spielstände, Tutorial, Freies Forschen, Expertenmodus und die bestehenden biologischen Funktionen bleiben erhalten.

Führe alle vorhandenen Node-Modultests erneut aus.

Prüfe die wichtigsten Schülerhandlungen vollständig in Chromium und WebKit mit geeigneten Desktop- und iPad-Bildschirmgrößen.

Kennzeichne echte Safari-Hardwaretests ausdrücklich als offen, sofern sie nicht durchgeführt wurden.

## 7. Dokumentation

Erstelle eine nachvollziehbare Korrekturmatrix für A01–A11.

Dokumentiere für jede Änderung:

- Ursprünglicher Fehler.
- Tatsächlich geänderte Funktion.
- Biologische beziehungsweise unterrichtliche Begründung.
- Neuer Test.
- Tatsächliches Testergebnis.
- Verbleibende Einschränkungen.

Ordne außerdem alle 14 Missionen den tatsächlichen Lernzielen und ihren im Spiel überprüfbaren Lernhandlungen zu.

Eine Mission gilt nicht allein deshalb als überprüft, weil sie gestartet oder technisch bis Schritt fünf geklickt werden konnte.

## 8. GitHub und Abschluss

Arbeite ausschließlich auf dem bestehenden Branch `feature/biology-learning-environments`.

Erhalte die aktuelle GitHub-Pages-Lösung.

Keine zusätzlichen Konten, kostenpflichtigen APIs oder sonstigen Gebühren.

Sichere den Arbeitsstand regelmäßig.

Erstelle keinen neuen Pull Request.

Führe keinen Merge durch.

Falls die Umsetzung durch Kontingent- oder Laufzeitgrenzen unterbrochen wird, sichere den letzten abgeschlossenen Stand und dokumentiere exakt, was noch offen ist.

**Beginne mit A01–A05. Setze anschließend A06–A10 um. Überarbeite die Oberflächen erst danach vorsichtig und auf Grundlage der tatsächlich erreichten Lernhandlungen.**

**Das Ziel ist nicht, den Schülerinnen und Schülern mehr Aufgaben zu geben, sondern dass die wenigen Aufgaben wirklich zu biologischem Verständnis führen.**