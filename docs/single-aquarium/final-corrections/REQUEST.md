# FINALER CODEX-KORREKTURAUFTRAG – AQUARIUMSIMULATION

## Ziel

Bringe die Aquariumsimulation `Feerson1617/Simulation-Aquarium` auf einen abschließend abnahmefähigen Stand.

**Bestehender PR:** #9  
**Branch:** `feature/coherent-learning-workspaces`  
**Zuletzt unabhängig geprüfter HEAD:** `ffc061279f01f0030fe35503def0d1b329e5f73b`

**Prüfgrundlage:** Der unabhängige Work-Abnahmebericht vom 23.10.2026, das `Aquarium-Abnahmepaket-aktuell.zip` und die darin enthaltenen eigenen Browserbelege, insbesondere F03-R, F04, F06, F07, F09, F10, F11, F12 und F13.

Ermittle den neuesten GitHub-Stand und lies `AGENTS.md`, bevor du Änderungen vornimmst.

## 1. Verbindliche Entwicklungsentscheidung

Die Verbesserungen F01, F02, F03-Kern, F05 und F08 werden auf Grundlage der unabhängigen Work-Abnahme als bereits ausreichend funktionierende Entwicklungsbasis akzeptiert.

**Du musst deshalb nicht erneut auf eine separate Sichtfreigabe für F01–F03 warten.**

Setze die nachfolgend beschriebenen verbliebenen Korrekturen zusammenhängend um.

Keine erneute grundlegende Architekturänderung. Keine neuen Missionen. Keine zusätzlichen Lernwelten. Kein Rückbau bereits funktionierender Mechaniken.

Erhalte verbindlich:

- Ein großes, aktives Hauptaquarium.
- Genau sechs Lernmissionen der Klassen 8–10.
- Die gestrichene Heizstab-Pflichtmission bleibt gestrichen.
- Serielle Untersuchungen aus derselben wiederhergestellten Ausgangslage.
- Korrekte gespeicherte Versuchsdaten und historische Produkte.
- Die bereits erfolgreich überarbeiteten Kamera- und Auswahlfunktionen.
- Die wissenschaftlich korrekten biologischen Berechnungen.
- Freies Forschen, Expertenmodus, Tutorial, Geräte, Pinzette und Artenkatalog.
- Die kostenlose GitHub-Pages-Veröffentlichung und das Einzel-HTML-Backup.

**Oberste Qualitätsregel:** Lernende müssen den Gegenstand ihrer Untersuchung erkennen, eine sinnvolle Handlung durchführen und anhand ihrer eigenen Beobachtung einen biologischen Zusammenhang erschließen können.

## 2. P1 – Historisches Lernprodukt reparieren (F13)

Der unabhängige Test hat einen reproduzierbaren Importfehler festgestellt.

In den historischen Lehrkraftwerkzeugen schlägt das Lesen eines gültigen Klasse-8-Lernprodukts mit folgender Meldung fehl:

`Cannot read properties of undefined (reading 'join')`

Der Fehler liegt im Zusammenspiel von `validateLearningProduct`, `comparisonMetricDefinitions` und `manualData` in `learning-ui.mjs`.

Der Altstand enthält die Messgröße `fishAlive`, für die die historische Definitionsliste nicht in allen Fällen eine Beschriftung liefert.

**Erforderliche Korrektur:**

- Fehlende historische Messgrößendefinitionen sicher behandeln.
- Gültige ältere Produkte weiterhin öffnen und anzeigen.
- Fehlende oder in ihrer Bedeutung nicht eindeutig rekonstruierbare Werte als unbekannt kennzeichnen.
- Keine gegenwärtigen Fischgesundheitswerte rückwirkend als historische Messungen ausgeben.
- Die Originaldaten unverändert erhalten.
- Bei fehlgeschlagenem Import keine irreführende alte Ansicht unter dem Namen der neuen Datei stehen lassen.
- Den gewählten Dateinamen und den tatsächlich angezeigten Datensatz eindeutig ausweisen.

**Verbindliche Regression:**

Teste die unveränderten Fixtures:

`tests/fixtures/learning-v1-grade-8.json`

`tests/fixtures/learning-v1-grade-9.json`

Öffne beide mehrfach in wechselnder Reihenfolge über den tatsächlichen Lernproduktleser.

Prüfe zusätzlich einen ungültigen Import sowie eine historische Messreihe mit fehlender Metrikdefinition.

Erstelle eigene Screenshots des funktionierenden Klasse-8- und Klasse-9-Imports und des nachvollziehbaren Fehlerfalls.

## 3. P2 – Fehlerhilfen und Rückmeldungen (F04)

Überarbeite die Hilfen in allen sechs Missionen.

Der erste Tipp darf nicht lediglich den Arbeitsauftrag wiederholen.

Er muss den Lernenden eine konkrete zusätzliche Orientierung geben, ohne die Lösung unmittelbar vorwegzunehmen.

Die weiteren Tipps dürfen schrittweise stärker unterstützen.

Fehlermeldungen müssen zu der tatsächlich gewählten falschen Antwort passen.

**Besonders zu berücksichtigen:**

- M1: Sauerstoffveränderung und biologische Sauerstoffquelle unterscheiden.
- M2: Restemenge und tatsächlich umgewandelte Stoffmenge unterscheiden.
- M3: Weitergabe von Allelen und zufällige Nachkommenverteilung erklären.
- M4: Dominanz, Zufall und Fortpflanzungschancen unterscheiden.
- M5: Wirkung eines Wasserwechsels und fortlaufenden Stoffeintrag auseinanderhalten.
- M6: Pflanzenwachstum nicht als direkten Beweis der Kohlenstoffherkunft behandeln.

Erhalte eindeutige Fehler-, Erfolgs- und Neutralrückmeldungen mit Text und Symbol.

Keine unnötig langen Erklärungen und keine verpflichtenden freien Fachaufsätze.

## 4. P2 – Elternauswahl in M3 (F06)

Unterscheide die tatsächlich vorkommenden Fehler:

- Noch kein Elternteil ausgewählt.
- Mutter oder Vater fehlt.
- Gleichgeschlechtliche beziehungsweise unvollständige Auswahl.
- Zwei dunkle Gründer, obwohl für den vorgesehenen ersten Lernschritt dunkel × hell verlangt wird.
- Ungeeignete Eltern für die F1-zu-F2-Kreuzung.

Die Meldung muss genau erklären, was zu korrigieren ist.

Erläutere in einfacher Sprache den Zweck der vorbereiteten ersten Kreuzung: Aus den entsprechenden Ausgangseltern entstehen Aa-Nachkommen, die anschließend untersucht und gekreuzt werden können.

Beide reziproken Ausgangskreuzungen müssen weiterhin möglich bleiben.

F1, F2, tatsächliche Fisch-IDs, Elternschaft und zufällige Allelweitergabe dürfen nicht verändert oder künstlich auf eine gewünschte Verteilung festgelegt werden.

## 5. P2 – Populationsauswertung in M4 (F07)

Die Tabelle „Tatsächliche Elternbeiträge“ benötigt folgende eindeutige Angaben:

- Zugehöriger gespeicherter Versuch.
- Zugehörige Elterngeneration.
- Fisch-ID.
- Sichtbare Farbe.
- Gegebenenfalls Genotyp.
- Relative Chance bei der Elternwahl.
- Tatsächlich entstandene Nachkommenzahl.

Ersetze die missverständliche Spaltenüberschrift „Gewicht“.

Erkläre bei Bedarf kurz, dass die verwendeten Zahlen relative Auswahlchancen darstellen, nicht Körpergewicht oder eine garantierte Anzahl von Kindern.

Historische Eltern müssen eindeutig als frühere Generation gekennzeichnet sein.

Das aktuell sichtbare Aquarium zeigt weiterhin ausschließlich die aktuelle Population.

## 6. P2 – Archivbedienung vereinfachen (F09)

Erhalte alle bestehenden Speicher- und Archivschlüssel intern.

Zeige stattdessen in der Benutzeroberfläche:

- Verständlichen Missionsnamen.
- Jahrgangsstufe.
- Datum beziehungsweise vorhandenen Speicherzeitpunkt.
- Versuch beziehungsweise Durchgang.
- Dateityp: Aquarium-Spielstand, Lernprodukt oder eigene Notiz.

Fehlende Metadaten dürfen nicht erfunden werden.

Technische IDs und Schlüssel dürfen optional in Details sichtbar bleiben, aber nicht die primäre Bezeichnung bilden.

Führe Nutzer verständlich zur jeweils passenden Importfunktion.

Historische Dateien dürfen nicht als neu abgeschlossene Lernmissionen anerkannt werden.

## 7. P2 – Pinzettenbedienung abschließen (F10)

Die eigentliche Verschiebung funktioniert nach unabhängiger Prüfung bereits mit Maus und Browser-Touch.

**Verändere deshalb den funktionierenden Kollisions- und Platzierungsalgorithmus nicht ohne konkreten reproduzierten Anlass.**

Korrigiere:

- Verdeckt dargestellte Pinzettenanleitung.
- Durch HUD-Elemente überlagerte Rückmeldungen.
- Mehrfach angebotene identische Beenden-Funktionen, soweit unnötig.
- Unklare Rückmeldung bei Abweisung einer Platzierung.
- Unterschied zwischen vollständig abgebrochener Platzierung und Übernahme der letzten gültigen Position.

Teste die Platzierung und eine echte Kollision in allen drei relevanten Bildschirmformaten.

Prüfe, dass die gespeicherte Position nach Reload, Export und Import erhalten bleibt.

## 8. P2 – Vorbereitete Expertenszenarien (F12)

In allen fünf aktuell mitgelieferten Expertenszenarien bleiben beim frischen Start zwei vorgesehene Objekte vorübergehend unsichtbar.

Betroffen sind nach unabhängiger Prüfung:

- UID 9 – Spiderwood.
- UID 10 – Stone.

Prüfe die tatsächlichen räumlichen Platzierungsbedingungen, die Größen und die vorhandenen Kollisionen.

Korrigiere die Ausgangsanordnung der mitgelieferten Szenarien so, dass alle vorgesehenen Objekte bei unveränderten biologisch beziehungsweise physikalisch korrekten Größen sichtbar platziert sind.

Nicht einfach die Warnung entfernen, Objekte aus dem Bestand löschen, Kollisionen abschalten oder Größen verfälschen.

Falls sich die ursprüngliche Ausstattung geometrisch tatsächlich nicht gültig unterbringen lässt, dokumentiere den konkreten Konflikt und die kleinste fachlich sinnvolle Alternative.

Teste alle fünf Szenarien aus einem frischen Stand sowie nach Speichern und erneutem Laden.

## 9. P2 – Erkenntnisfördernde Fragen verbessern (F03-R)

Prüfe die Fragestellungen aller sechs Missionen auf eine verbleibende Schwäche:

Teilweise muss lediglich eine zuvor ausgeschriebene Beobachtung erneut angeklickt werden.

Außerdem lassen sich falsche Antworten oft allein an Wörtern wie „immer“, „niemals“, „grundsätzlich“ oder „für immer“ erkennen.

Verbessere die Qualität der Aufgaben gezielt, ohne zusätzliche umfangreiche Quizfolgen einzuführen.

Insbesondere M3 und M4 sollen mindestens eine echte Dateninterpretation beziehungsweise einen kurzen begründbaren Transfer verlangen.

Rohdaten und notwendige Beobachtungen bleiben zugänglich; nur die Interpretation soll nicht vorweggenommen werden.

Falsche Alternativen sollen plausibel und ähnlich verständlich formuliert sein.

Die Schüleroberfläche bleibt bewusst einfach und reduziert.

## 10. P3 – Sprachliche Korrekturen (F11)

Beseitige Formulierungen wie:

„gleich viel als am Anfang“

Verwende beispielsweise:

„so viel wie am Anfang“

Prüfe außerdem alle datenabhängigen Formulierungen bei Gleichheit, Zunahme und Abnahme.

Behaupte kein Pflanzenwachstum, wenn die tatsächliche Untersuchung keines zeigt.

## 11. Verbindliche Abschlussprüfung

Nach den Korrekturen müssen diese Prüfungen durchgeführt werden:

**A. Gezielte Regression F03-R, F04, F06, F07, F09–F13.** Jeder bearbeitete Fehler benötigt einen klaren Vorher-Nachher-Nachweis.

**B. Alle sechs Lernmissionen erneut vollständig durchspielen.** Eigene Browserhandlungen mit tatsächlichen Objekten, Fehlerantworten, Hilfen, Ergebnis, Pause, Reload, Wiederholung und Sicherung.

**C. Chromium und WebKit verwenden.** Desktop und Tablet-Hoch-/Querformat für die jeweils kritischen Ansichten testen. Echte Touch-Ereignisse soweit in der Browserumgebung verfügbar.

**D. Freies Forschen in Klasse 8, 9 und 10 prüfen.** Insbesondere Tier-/Pflanzenauswahl, Geräte, Pinzette, Speichern und Laden.

**E. Tutorial und Expertenmodus prüfen.** Alle acht Tutorialschritte müssen weiter funktionieren. Die fünf Expertenszenarien müssen korrekt starten. Fortpflanzungsfunktionen dürfen nicht regressieren.

**F. Historische Daten prüfen.** Die 14 alten Aquarium-Spielstände und die beiden V1-Lernprodukte müssen über ihre vorgesehenen Funktionen lesbar sein.

**G. Standalone-HTML prüfen.** Keine Regression des bestehenden Downloads, lokalen Chromium-Dateistarts und Offlineverhaltens.

**H. Biologische Kernfunktionen prüfen.** Keine unbeabsichtigten Änderungen an Sauerstoffbilanz, Zersetzung, Pflanzenwachstum, Vererbung, Populationszufall und den gespeicherten Versuchsdaten.

Ein bestandener Modultest genügt für diese Abnahme ausdrücklich nicht.

## 12. GitHub und Abschluss

Arbeite auf dem bestehenden Entwicklungsbranch für PR #9.

**Commits und Pushs auf diesen Branch sind für diesen Korrekturauftrag ausdrücklich erlaubt.**

Kein neuer PR und kein Merge. `main` bleibt unverändert.

Arbeite selbstständig alle klar lösbaren Punkte ab. Sichere abgeschlossene Schritte regelmäßig.

Unterbrich die Umsetzung nicht erneut wegen einer bereits erteilten F01–F03-Sichtfreigabe.

Wenn eine fundamentale Änderung außerhalb dieses Auftrags erforderlich erscheint, dokumentiere die konkrete Ursache, statt eigenmächtig eine neue Architektur zu beginnen.

Liefere am Ende:

1. Vollständige Änderungsliste nach Fehlernummern.
2. Exakten neuen Commit und aktualisierten PR-Vorschaulink.
3. Tatsächliche Browser-Testresultate.
4. Relevante eigene Vorher-Nachher-Screenshots.
5. Ergebnisse der Modultests und Regressionen.
6. Offene, klar begrenzte Risiken.
7. Aussage, ob aus Entwicklersicht alle vereinbarten Abnahmekriterien erfüllt sind.

**Ziel ist eine finale, unterrichtstaugliche Version – keine weitere grundlegende Neuentwicklung.**

Die Arbeit ist erst dann abgeschlossen, wenn alle oben genannten überprüfbaren Fehler korrigiert beziehungsweise begründet als offen dokumentiert sind und die Simulation vollständig überprüfbar zur unabhängigen Endabnahme bereitsteht.