# FORTSETZUNGSAUFTRAG – Simulation-Aquarium
## Radikale didaktische Reduktion und interaktives Questbuch

**Repository:** https://github.com/Feerson1617/Simulation-Aquarium

**Bestehender Pull Request:** #8  
https://github.com/Feerson1617/Simulation-Aquarium/pull/8

**Entwicklungsbranch:** `feature/biology-learning-environments`

**Letzter auf GitHub bestätigter Commit:** `677e6ce7d5bdf9739f78e8add49b7f0cc7cdd05a`

Die bisherige Entwicklung wurde durch ein ausgeschöpftes Nutzungskontingent unterbrochen.

**Setze die bereits begonnene didaktische Überarbeitung fort. Beginne nicht erneut bei null.**

## 1. Zuerst den Arbeitsstand wiederherstellen

Prüfe selbstständig:

- `AGENTS.md` und den aktuellen Repository-Stand.
- Den aktiven Branch und `git status`.
- Bereits vorhandene lokale Änderungen aus der unterbrochenen Sitzung.
- Bereits veröffentlichte Commits.
- Den bestehenden PR #8.
- Die bisherige didaktische Abnahmematrix und Dokumentation unter `docs/learning/`.
- Bereits durchgeführte und noch offene Tests.
- Eventuell vorhandene Arbeitspläne oder Fortschrittsdateien.

Übernimm erhaltene Änderungen und führe die Arbeit darauf aufbauend fort.

Falls die vorherige Ausführung ihre Änderungen nicht gespeichert hat, beginne mit den unten beschriebenen noch offenen Aufgaben.

Die zuvor abgeschlossenen Korrekturen R1–R8 müssen erhalten bleiben.

**Arbeite ausschließlich im bestehenden PR #8. Kein Merge, kein direkter Push auf main.**

Sichere nach jeder größeren abgeschlossenen Aufgabe einen Commit und pushe ihn auf den Entwicklungsbranch.

## 2. Wichtigste neue Erkenntnis

Die bisherige Entwicklung ist technisch umfangreich, aber für die tatsächlichen Schülerinnen und Schüler weiterhin deutlich zu kompliziert.

Die didaktische Reduktion ist bislang nicht konsequent genug umgesetzt worden.

Das betrifft:

- Die gesamte Sprache der Schüleroberfläche.
- Die Menge der sichtbaren Informationen.
- Fachbegriffe und chemische Bezeichnungen.
- Die Hilfefenster.
- Die Benutzerführung.
- Die Untersuchungswerkzeuge.
- Die Lernmissionen.
- Das bisherige Notizbuch.
- Die Datenauswertung und Exportfunktionen.
- Die Trennung von Schüler- und Lehrkraftinformationen.

**Es reicht ausdrücklich nicht, einzelne komplizierte Wörter durch einfachere Wörter zu ersetzen.**

Ziel ist eine umfassende didaktische Neustrukturierung.

Die Schülerinnen und Schüler sollen mit sehr wenigen, verständlichen Informationen selbstständig biologische Zusammenhänge entdecken können.

**Oberster Grundsatz: So wenig lesen wie möglich, so viel durch eigene Handlungen lernen wie nötig.**

Die biologische Fachrichtigkeit darf dabei nicht verloren gehen.

## 3. Extrem einfache Sprache in allen Jahrgangsstufen

Prüfe sämtliche sichtbaren Schülertexte in allen Jahrgangsstufen.

Vereinfache insbesondere:

- Menüs und Schaltflächen.
- Überschriften.
- Beobachtungsanzeigen.
- Hilfetexte.
- Arbeitsaufträge.
- Questbeschreibungen.
- Messwertdarstellungen.
- Ergebnisrückmeldungen.
- Beschriftungen von Diagrammen.
- Meldungen und Warnungen.
- Texte im Shop und zu Organismen.
- Start- und Abschlussbildschirme.

Verwende:

- Kurze Sätze.
- Möglichst vertraute Wörter.
- Konkrete Handlungsanweisungen.
- Nur einen Gedanken pro Satz.
- Wenig Text pro Bildschirm.
- Fachbegriffe nur dort, wo sie tatsächlich gelernt werden sollen.
- Erklärungen unmittelbar beim erstmaligen benötigten Begriff.

**Besonders Klasse 8 muss sprachlich wesentlich einfacher werden als bisher.**

Auch Klasse 9 und Klasse 10 sollen sehr verständliche Sprache erhalten. Die fachliche Anspruchshöhe soll durch das biologische Denken entstehen, nicht durch komplizierte Formulierungen.

Vermeide infantilisierende Sprache.

### Konkrete bisherige Probleme

Bisher: „Tierkondition unauffällig“

Künftig: **„Den Fischen geht es gut.“**

Bisher: „Versorgungsindikator“

Künftig: **„Versorgung“**, sofern diese Anzeige überhaupt benötigt wird.

Bisher: „Modellierte Belastungswarnungen“

Künftig: **„Probleme im Wasser“**.

Bisherige Sauerstoffhilfe für Klasse 8:

„Gelöster Sauerstoff wird bei der Zellatmung verbraucht. Bei Licht können Pflanzen ihn durch Fotosynthese bilden. Beobachte den Verlauf statt nur einen Wert.“

Das ist für die Zielgruppe zu kompliziert.

Besser:

**„Fische brauchen Sauerstoff zum Leben. Pflanzen geben bei Licht Sauerstoff ins Wasser ab.“**

Das komplexere Konzept der Zellatmung soll erst dann eingeführt werden, wenn es tatsächlich Gegenstand des Lernprozesses wird.

Wichtig: Verkürze die Erklärung nicht so, dass fachlich falsche Aussagen entstehen. Pflanzen verbrauchen beispielsweise ebenfalls Sauerstoff.

### Sprachliche Qualitätskontrolle

Prüfe bei jedem Satz:

1. Müssen die Lernenden diese Information jetzt kennen?
2. Ist jeder verwendete Begriff bereits verständlich?
3. Lässt sich der Satz kürzen?
4. Kann stattdessen eine Handlung im Spiel die Information vermitteln?
5. Kann die Information vollständig ausgeblendet werden?

Wenn eine Information für das aktuelle Lernziel unnötig ist, **streiche sie aus der Schüleransicht, statt sie lediglich umzuformulieren**.

## 4. Fachliche und fachdidaktische Metaebene ausblenden

Entferne aus sämtlichen regulären Schüleransichten:

- Hinweise auf Fachanforderungen.
- Curriculare Kompetenzzuordnungen.
- Hinweise zur Didaktischen Rekonstruktion.
- Lange wissenschaftliche Modellbeschränkungen.
- Technische Beschreibungen der Berechnung.
- Interne Entwicklungsinformationen.
- Fachliche Validierungshinweise.
- Metadidaktische Kommentare.

Ein besonders schlechtes Beispiel ist:

„Didaktische Schwellen für diese Modellsituation, keine universellen Grenzwerte. Auch bei geringer Belastung können andere Artansprüche verletzt sein.“

**Solche Texte gehören nicht in die Schüleroberfläche.**

Verschiebe notwendige ausführliche Informationen in den Lehrkraftmodus beziehungsweise die Lehrkraftdokumentation.

Wenn Schülerinnen und Schüler eine fachliche Einschränkung für ihre Untersuchung verstehen müssen, erkläre sie möglichst kurz und konkret.

Beispiel:

„Das Aquarium zeigt nur einen Teil der Natur.“

Auch solche Hinweise sollen nur dann erscheinen, wenn sie für die aktuelle Lernaufgabe tatsächlich wichtig sind.

## 5. Fragezeichen-Hilfen vollständig überprüfen

Das vorhandene Hilfesystem weist mindestens eine gravierende Fehlzuordnung auf.

Beim Klick auf das Fragezeichen neben **„Beobachten“** erscheint derzeit eine Erklärung zur Wasserbelastung.

Das ist falsch.

Dort soll beispielsweise stehen:

**„Schau genau hin. Was passiert im Aquarium?“**

Prüfe systematisch sämtliche Fragezeichen-Schaltflächen in allen Jahrgangsstufen.

Jede Hilfe muss genau den Begriff, die Einstellung oder die Funktion erklären, neben der sie steht.

Verwende eine eindeutige technische Zuordnung.

Vermeide die versehentliche Wiederverwendung falscher Hilfetexte.

Die Erklärungen sollen normalerweise aus ein oder zwei sehr kurzen Sätzen bestehen.

Kein langes Lexikon im Popup.

Prüfe auch Tastaturbedienung, Touch und korrekte Beschriftungen für Hilfstechnologien.

Verhindere, dass Hilfen die Lösung einer laufenden Untersuchung vorwegnehmen.

## 6. Zentrale Neuerung: Interaktives Questbuch

**Ersetze das bisherige Notizbuch in sämtlichen Lernmissionen durch ein echtes interaktives Questbuch.**

Das bisherige Notizbuch ist zu kompliziert und leitet die Schülerinnen und Schüler nicht ausreichend an.

Nach dem Start einer Lernmission erscheint zwar ein vorbereitetes Aquarium, aber die eigentlichen Aufgaben sind nicht offensichtlich genug.

Das muss grundlegend verändert werden.

### Anforderungen an das Questbuch

Beim Start jeder Lernmission erscheint automatisch die erste Aufgabe.

Das Questbuch zeigt:

- Den kurzen Namen der Mission.
- Die aktuelle Aufgabe.
- Eine konkrete Handlung.
- Bei Bedarf einen kleinen Hinweis.
- Den Fortschritt.
- Einen verständlichen nächsten Schritt.

Die Lernenden müssen sofort erkennen:

**Was soll ich jetzt machen?**

Es soll nicht erforderlich sein, zunächst mehrere Menüs zu öffnen oder die richtige Simulationsfunktion zu suchen.

Das Questbuch muss auf Desktop und iPad gut sichtbar sein, darf aber das Aquarium nicht unnötig verdecken.

Verwende möglichst ein kleines, ein- und ausklappbares Aufgabenfenster.

### Wenige Schritte statt vieler Aufgaben

Jede Lernmission erhält ungefähr drei bis fünf zentrale Schritte.

Grundstruktur:

**1. Anschauen**

Was ist im Aquarium zu sehen?

**2. Vermuten**

Was könnte passieren?

**3. Ausprobieren**

Führe eine konkrete Untersuchung durch.

**4. Vergleichen**

Was hat sich verändert?

**5. Erklären**

Was hast du herausgefunden?

Die Reihenfolge darf angepasst werden, wenn das biologisch oder didaktisch sinnvoller ist.

Die Aufgaben müssen logisch aufeinander aufbauen.

### Aufgaben direkt mit der Simulation verbinden

Das Questbuch soll tatsächliche Spielhandlungen erkennen.

Beispiele:

- Ein Organismus wurde betrachtet.
- Das Licht wurde verändert.
- Ein Versuch wurde gestartet.
- Zwei Becken wurden verglichen.
- Ein Messwert wurde angesehen.
- Ein Elternpaar wurde ausgewählt.
- Eine Kreuzung wurde durchgeführt.
- Mehrere Generationen wurden untersucht.
- Eine Antwort wurde ausgewählt.

Der Fortschritt darf nicht nur durch wahlloses Klicken auf „Weiter“ simuliert werden.

Prüfe sinnvolle fachliche Voraussetzungen.

Akzeptiere auch alternative korrekte Untersuchungswege.

Falls eine Aufgabe nicht abgeschlossen werden kann, erkläre kurz, welche Handlung noch fehlt.

**Beispiel: „Starte zuerst den Versuch.“**

### Verständliche Rückmeldungen

Nach einer Handlung soll das Questbuch eine kurze Rückmeldung geben.

Bei einer richtigen Antwort beispielsweise:

„Richtig! Im dunklen Becken ist weniger Sauerstoff.“

Bei einer falschen Antwort:

„Schau noch einmal auf beide Werte. Welcher ist kleiner?“

Keine langen Fehlermeldungen und keine bloßen roten Fehlersymbole.

Eine falsche Antwort soll einen erneuten Versuch ermöglichen.

Die fachliche Erklärung folgt erst nach der Untersuchung beziehungsweise nach einer sinnvollen Auswertung.

## 7. Beispiel: Questbuch für Klasse 8

**Mission: Woher kommt der Sauerstoff?**

### Aufgabe 1

„Schau dir die beiden Aquarien an.“

„Was ist gleich?“

Kurze Auswahlmöglichkeiten.

### Aufgabe 2

„Was glaubst du?“

„Was passiert mit dem Sauerstoff ohne Licht?“

Antwortmöglichkeiten:

- Es wird mehr.
- Es wird weniger.
- Es bleibt gleich.

### Aufgabe 3

„Schalte bei einem Aquarium das Licht aus.“

„Starte den Versuch.“

Das Questbuch erkennt den Eingriff und den tatsächlichen Versuchsstart.

### Aufgabe 4

„Vergleiche den Sauerstoff in beiden Aquarien.“

Die Simulation zeigt die benötigten Ergebnisse möglichst einfach an.

Die Schülerinnen und Schüler beantworten eine kurze Vergleichsfrage.

### Aufgabe 5

„Was hast du herausgefunden?“

Kurze fachliche Sicherung:

„Pflanzen geben bei Licht Sauerstoff ab. Ohne Licht fällt diese Sauerstoffquelle weg.“

Beachte dabei, dass auch Atmung und Gasaustausch die tatsächlichen Sauerstoffwerte beeinflussen. Stelle nicht fälschlich dar, dass sich der Verlauf ausschließlich aus der Fotosynthese erklärt.

Die fachlich genauere Erklärung kann bei Bedarf im Lehrkraftmodus verfügbar bleiben.

## 8. Sämtliche 14 Lernmissionen überarbeiten

Überarbeite alle bestehenden Missionen vollständig:

### Klasse 8

1. Ein Aquarium ist ein Ökosystem.
2. Woher kommt der Sauerstoff?
3. Wer ist mit wem verbunden?
4. Den Fischen geht es nicht gut.
5. Vom Aquarium in den Wald.

### Klasse 9

6. Gleiche Art, verschiedene Individuen.
7. Eine Kreuzung vorhersagen.
8. Eine Population verändert sich.
9. Darwin und Lamarck prüfen.

### Klasse 10

10. Zu viele Nährstoffe.
11. Kohlenstoff in Bewegung.
12. Ein gestörtes System stabilisieren.
13. Vom Becken in die Nordsee.
14. Wattenmeer nutzen und schützen.

Für jede Mission:

- Nur ein zentrales biologisches Lernziel.
- Wenige konkrete Aufgaben.
- Sehr kurze Schülertexte.
- Passende Handlungen in der Simulation.
- Einfache Beobachtungs- und Vergleichsfragen.
- Verständliche Rückmeldungen.
- Eine kurze fachliche Erkenntnis am Ende.

**Vermeide verpflichtende Arbeitsaufträge zum Zeichnen, Skizzieren, Erstellen von Wirkungsgefügen auf Papier oder umfangreichen Schreiben.**

Falls Diagramme benötigt werden, erzeuge sie zunächst automatisch aus den echten Simulationsdaten.

Die Lernenden sollen passende Diagramme lesen und verstehen, nicht komplizierte Diagramme selbst konstruieren müssen.

Ergänze keine zusätzlichen fachlichen Teilziele, nur weil sie im Curriculum erwähnt werden.

Konzentriere jede Quest auf einen zentralen biologischen Zusammenhang.

## 9. Unterschiedliche Lernansprüche bei gleicher sprachlicher Einfachheit

### Klasse 8

Sehr kurze, konkrete Aufträge.

Schwerpunkt: Beobachten, Vergleichen und grundlegende ökologische Zusammenhänge verstehen.

### Klasse 9

Ebenso verständliche Aufträge.

Schwerpunkt: Unterschiede zwischen Individuen, Vererbung, Fortpflanzung und Veränderungen über Generationen.

Fachbegriffe wie Genotyp, Phänotyp und Allel werden schrittweise eingeführt.

### Klasse 10

Kurze, klare Aufgaben trotz anspruchsvollerer Zusammenhänge.

Schwerpunkt: Ursachen, Folgen und mögliche Lösungen ökologischer Probleme.

Die Lernenden vergleichen Eingriffe und treffen begründete Entscheidungen.

**Klasse 10 bedeutet nicht automatisch komplizierte Sprache.**

## 10. Freies Forschen erhalten

Im Modus „Freies Forschen“ darf keine feste Questfolge vorgeschrieben sein.

Das Questbuch dient hier als freiwillige Unterstützung.

Beispielsweise:

„Was möchtest du untersuchen?“

„Was glaubst du, wird passieren?“

„Probiere es aus.“

„Was hast du herausgefunden?“

Die Lernenden sollen auch ohne das Questbuch frei experimentieren können.

Verwende weiterhin die altersgemäß reduzierte Benutzeroberfläche.

## 11. Notizbuch und technische Exporte vereinfachen

Entferne aus regulären Schüleransichten Begriffe wie:

- „Lernprodukt als JSON“
- „Lesbares Protokoll“
- „CSV“
- „SVG“
- „Seed“
- „Modellkonfiguration“
- „Messmetadaten“

Diese Begriffe sind für die Zielgruppe nicht erforderlich.

Verwende stattdessen:

**„Meine Ergebnisse“**

**„Ergebnis speichern“**

**„Versuch wiederholen“**

**„Für die Lehrkraft speichern“**

Das Questbuch kann die Ergebnisse der abgeschlossenen Aufgaben sammeln.

Dafür soll keine zusätzliche komplizierte Notizbuchoberfläche erforderlich sein.

Erhalte im Hintergrund die vollständigen Datenexporte, Messwerte, Archive und wissenschaftlich nachvollziehbaren Untersuchungsdaten.

Der Lehrkraft- und Expertenmodus darf die technischen Formate weiterhin anbieten.

Die zuvor korrigierten Funktionen R1–R8 dürfen nicht verloren gehen.

## 12. Die gesamte Schüleroberfläche reduzieren

Prüfe nicht nur das Questbuch.

Überarbeite auch:

- Jahrgangsauswahl und Startbildschirm.
- Missionsauswahl.
- Beobachten.
- Wasserwerte.
- Beckenübersicht.
- Vergleichsversuche.
- Messungen.
- Fachhilfen.
- Glossar.
- Artenkatalog.
- Shop.
- Genetik.
- Evolutionsuntersuchungen.
- Diagramme.
- Meldungen.
- Missionsabschluss.

Bei jeder Anzeige muss klar sein, warum die Lernenden sie benötigen.

Streiche irrelevante Informationen aus der regulären Oberfläche.

Klasse 8 soll weiterhin überwiegend die vereinfachten Bereiche Temperatur, Sauerstoff, Pflanzennährstoffe und Wasserbelastung sehen.

Komplexe chemische Bezeichnungen und Formeln dürfen nicht ohne konkreten Lernbedarf auftauchen.

Klasse 9 soll sich auf Vererbung und Evolution konzentrieren.

Klasse 10 darf komplexere Zusammenhänge untersuchen, aber mit ebenso übersichtlicher Bedienung.

## 13. Fachliche Grenzen erhalten, aber richtig platzieren

Die Simulation muss fachlich korrekt bleiben.

Behalte insbesondere:

- Fotosynthese und Zellatmung als unterschiedliche Prozesse.
- Stoffkreislauf und Energiefluss.
- Unterschiedliche Wirkungen von Nährstoffen und belastenden Stoffen.
- Nitrit und Nitrat als verschiedene Verbindungen im Rechenkern.
- Genotyp und Phänotyp.
- Dominanz und Fitness als unterschiedliche Konzepte.
- Natürliche Selektion und genetische Drift.
- Die begrenzte Übertragbarkeit vom Aquarium auf Wald, Nordsee und Wattenmeer.

**Die fachliche Korrektheit bleibt verbindlich. Die wissenschaftliche Erklärungstiefe der Schüleroberfläche wird dagegen drastisch reduziert.**

Ausführliche Hintergründe werden in der Lehrkraftdokumentation bereitgestellt.

## 14. Qualitätssicherung

Erstelle neue automatisierte Tests, die nicht nur die Funktionalität, sondern auch die konkrete Lernführung überprüfen.

Teste unter anderem:

1. Jede der 14 Lernmissionen startet mit einer sichtbaren ersten Quest.
2. Die aktuelle Aufgabe ist ohne zusätzliche Navigation erkennbar.
3. Die Quest kann durch tatsächliche Handlungen abgeschlossen werden.
4. Die Untersuchung nutzt den echten Simulationskern.
5. Rückmeldungen passen zur fachlichen Antwort und zu den tatsächlichen Ergebnissen.
6. Falsche Antworten ermöglichen einen weiteren Versuch.
7. Alle Fragezeichen zeigen die korrekt zugeordneten Erklärungen.
8. Unnötige Fachsprache und technische Exportbegriffe erscheinen nicht in den regulären Schüleransichten.
9. Schüleransichten enthalten keine curricularen oder fachdidaktischen Metaerklärungen.
10. Die Oberfläche funktioniert auf Desktop und in iPad-Touch-Emulation.
11. Freies Forschen bleibt ohne verpflichtende Questfolge möglich.
12. Bestehende Spielstände und R1–R8 funktionieren weiterhin.

Erstelle Screenshots aller drei Jahrgangsstufen und repräsentativer Questschritte.

Prüfe die tatsächliche Darstellung im Browser.

Besonders wichtig ist die vollständige Durchführung ausgewählter Missionen vom Start bis zur fachlichen Sicherung.

Die erfolgreiche Anzeige einer Quest reicht nicht als Funktionsnachweis.

Ein automatisierter Sprachtest kann problematische Begriffe finden, ersetzt aber keine inhaltliche Durchsicht sämtlicher Schülertexte.

## 15. Verbindliche Arbeitsweise

Arbeite in mehreren klar abgegrenzten Schritten.

Priorität:

**P1:** Arbeitsstand sichern, Schülertexte und Hilfezuordnungen korrigieren, fachliche Metaebene entfernen.

**P2:** Interaktives Questbuch entwickeln und in die Lernmissionen integrieren.

**P3:** Alle 14 Missionen zu kurzen, verständlichen und spielbaren Questfolgen überarbeiten.

**P4:** Restliche Schüleroberflächen grundlegend reduzieren, Freies Forschen und Exporte vereinfachen.

**P5:** Vollständige Browserprüfung, fachliche Prüfung und Dokumentation.

Sichere nach jedem abgeschlossenen Schritt den aktuellen Stand.

Falls dein Kontingent erneut erreicht wird, müssen sämtliche abgeschlossenen Arbeiten auf GitHub gespeichert und die noch offenen Aufgaben in `docs/learning/WORK_STATE.md` dokumentiert sein.

**Beende die Arbeit nicht nach einer bloßen Bestandsaufnahme oder dem ersten erledigten Entwicklungsschritt.**

Arbeite selbstständig weiter, soweit deine Ausführungsgrenzen dies zulassen.

## 16. Abschluss

Arbeite ausschließlich im bestehenden Entwicklungsbranch und Pull Request #8.

Erstelle keinen weiteren Pull Request und führe keinen Merge durch.

Erhalte die kostenlose GitHub-Pages-Veröffentlichung, die bestehenden 3D-Modelle, das Tutorial, den Expertenmodus, den Lehrkraftmodus, die Genetik und die bisherigen Spielstände.

Verwende keine zusätzlichen kostenpflichtigen Dienste.

Dokumentiere:

- Welche Schülertexte vereinfacht wurden.
- Welche Informationen entfernt oder in den Lehrkraftmodus verschoben wurden.
- Wie das Questbuch funktioniert.
- Welche Questfolgen in allen 14 Missionen implementiert wurden.
- Wie die Aufgaben mit dem tatsächlichen Spielgeschehen verknüpft sind.
- Welche fachlichen Vereinfachungen vorgenommen wurden.
- Welche Tests tatsächlich bestanden wurden.
- Welche offenen Aufgaben noch bestehen.

**Teile mir zunächst kurz mit, welchen Arbeitsstand du wiederherstellen konntest. Setze die Implementierung danach selbstständig fort.**

**Oberstes Ziel: Schülerinnen und Schüler sollen das Spiel ohne lange Einführung verstehen, mit wenigen klaren Aufgaben selbstständig arbeiten und dabei die wesentlichen biologischen Zusammenhänge wirklich begreifen.**