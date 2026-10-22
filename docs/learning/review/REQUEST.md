Bitte überarbeite den bestehenden PR #8 in Feerson1617/Simulation-Aquarium, Branch feature/biology-learning-environments. Geprüfter Ausgangsstand ist 5b00ea1538cb740a28287ed5f83038f2df96d052 gegen main 666df90ac05de61181f380f2190539a9cef04044. Prüfe zuerst, ob der Branch inzwischen weitergelaufen ist, und erhalte fremde Änderungen. Arbeite im bestehenden PR. Kein Merge und keine Veröffentlichung auf main ohne meine ausdrückliche Zustimmung.

Lies AGENTS.md und den beigefügten PR-8-Pruefbericht.md. Nutze das Originalcurriculum:
https://ets-toenning.de/wp-content/uploads/2025/07/Schulinternes-Fachcurriculum-Biologie-SJ-2025-26.pdf
36 Seiten, SHA-256 faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f; relevante Seiten 3–4, 9–10, 14–15, 19–20. Der ursprüngliche vollständige Masterauftrag war bei der unabhängigen Prüfung nicht abrufbar. Falls er in deiner Unterhaltung vorliegt, übernimm seine Anforderungen ausdrücklich in eine Abnahmematrix. Andernfalls kennzeichne den Abgleich als unvollständig; erfinde keine Vereinbarungen. Beginne dennoch mit den unabhängig belegten Korrekturen.

Behebe zuerst diese vier P1-Mängel:

1. Abbruch je Becken statt für das ganze Paar.
In learning-model.mjs, runLearningComparison, stoppt control.failed || test.failed beide Reihen. In 10-restore mit 50 % einmaligem Wasserwechsel und 14 Tagen endet dadurch auch das noch lauffähige Versuchsbecken bereits an Tag 48. Speichere Status, Zeitpunkt und Grund je Seite; rechne die andere Seite weiter. Kennzeichne fehlende Folgedaten sichtbar und im Export, ohne Werte zu erfinden oder einen fortbestehenden vollständigen Paarvergleich zu behaupten. Erfasse Scheitern auch dann, wenn es im letzten angeforderten Schritt eintritt. Passe Tabelle, Diagramm, Validator, Lehrkraftansicht und Exporte konsistent an. Gleich lange Datenarrays dürfen nicht auf Kosten erfundener Messwerte erzwungen werden.

2. Lernprodukte vollständig lesend auswerten.
validateLearningProduct und validateLearningComparison verwerfen derzeit unter anderem Werkzeug, Wert, geplante Dauer, Umwelt, Seed, Planung, Modellannahmen, Abbruchstatus, manuelle Messungen und Populationsarchive. Behalte diese Angaben nach begrenzter Schema- und Werteprüfung bei und zeige sie in der Lehrkraftansicht an. Importierte Simulationszustände müssen nicht ausgeführt werden. Lehrkräfte brauchen die tatsächlich untersuchten Größen statt nur Sauerstoff beziehungsweise Allel A. Lokale und importierte Produkte sollen denselben fachlichen Inhalt zeigen. Bestehende gültige Exporte müssen weiterhin lesbar bleiben.

3. Berechneten Lauf und bearbeiteten Plan auseinanderhalten.
Nach „Aktuelles Becken als Ausgangslage“ bleibt die Beschriftung zunächst alt; nach erneutem Rendern kann sie Tag 46 nennen, während das Diagramm noch Daten von Tag 45–48 zeigt. Auch Eingriffs-, Dauer- oder Umweltänderungen lassen alte Ergebnisse unmarkiert stehen. Gib jedem Ergebnis eine unveränderliche Konfiguration samt Ausgangslage. Markiere nach Änderungen deutlich, dass eine Neuberechnung nötig ist, oder zeige das ältere Ergebnis mit seiner eigenen Konfiguration getrennt. Aktualisiere die Oberfläche sofort. Zuordnung von Daten, Vorhersage und tatsächlichem Lauf muss auch beim Export eindeutig bleiben.

4. Kohlenstoffmission um menschliche Beeinflussung ergänzen.
Das Curriculum verlangt auf Seite 19 ausdrücklich auch die anthropogene Beeinflussung des Kohlenstoffkreislaufs. 10-carbon enthält bisher nur die lokalen Beckenprozesse und CO₂-Dosierung. Ergänze eine fundierte, jahrgangsangemessene Transferkarte mit Aufgabe, Material/Quellen, Sicherung und Modellkritik, z. B. zu fossiler Verbrennung oder Landnutzung und Veränderungen von Speichern und Flüssen. Trenne Aquariumdaten von Hintergrundbelegen und globalen Schlussfolgerungen. Eine Dosierstufe im Wasser darf keine globale Emissionssimulation vortäuschen. Erhalte den qualitativen Charakter der Kohlenstoffdarstellung.

Behebe anschließend die vier P2-Mängel:

5. Mendelversuche unabhängig wiederholen.
Ein vollständiger Neustart mit AA × aa und anschließend denselben F1-Eltern erzeugt immer wieder AA 6, Aa 10, aa 8, weil createLearningPopulation stets denselben Seed nutzt. Biete eine neue dokumentierte Wiederholung bei gleicher Ausgangsgenetik an und erhalte zusätzlich eine reproduzierbare Wiederholung desselben Seeds. Zeige die Unterscheidung verständlich. Keine fest programmierten Mendelverhältnisse oder künstlichen Streuungen.

6. Selektionsarchive erhalten.
compareLearningPopulations verwirft die tatsächlichen Eltern-/Nachkommenereignisse seiner Kontroll- und Selektionsläufe und gibt nur Häufigkeiten zurück. Speichere begrenzte Archive oder hinreichende Ereignisdaten je Wiederholung und Seite. Zeige die Verknüpfung von Phänotyp, hypothetischem Elternwahlgewicht, tatsächlichen Eltern, Nachkommenzahl und Allelfrequenzen. Das separate Ausgangspopulationsarchiv ersetzt diese Laufarchive nicht.

7. Manuelle Messreihen nutzbar machen.
„Messzeitpunkt protokollieren“ erhöht aktuell nur den sichtbaren Zähler; die gespeicherten Werte sind im Lernmodus nicht als Reihe einsehbar. Ergänze für eigene Messungen Tabelle, sinnvoll beschriftetes Diagramm und Datenexport, auch wenn noch kein automatischer Vergleich berechnet wurde. Nutze die für das Lernprofil oder durch die Lehrkraft freigegebenen Größen. Erhalte unbekannte Prozessanfangswerte als unbekannt. Die Lehrkraft muss dieselben Daten lesen können.

8. Eigenständig verständliche CSV.
Ergänze klare Messnamen, Einheiten und Typen (Anzahl, Anteil, relativer Index). Speichere eine dokumentierte Zuordnung zu Profil, Mission, Eingriff/Wert, Modellstand, Wiederholung/Seed, Zeitschritt und Abbruchstatus. Unbekannte/fehlende Werte müssen von Null unterscheidbar bleiben. Bestehende JSON-/SVG-Funktionen erhalten und bei Bedarf versioniert erweitern.

Verbindliche fachliche Leitplanken:
Nitrat/Nitrit getrennt halten; keine pauschale Nitrat-Giftanzeige oder verdünnenden Warnmittelwerte. Fotosynthese lichtabhängig, Atmung auch nachts; verfügbaren Ressourcenverbrauch und organischen Rückfluss erhalten. Selektion und Drift trennen; Dominanz ist kein Fitnessvorteil. AA/Aa dürfen bei gleichem Phänotyp nicht allein wegen des Genotyps verschiedene Fitness bekommen. Keine bedarfsgerichteten Alleländerungen. Ein Generationsklick ist keine natürliche Entwicklungsdauer. Wald, Nordsee und Wattenmeer bleiben ausdrücklich begrenzte Transfers. Meeresmüll nicht als Pflanzennährstoff oder erfundene Schadenskurve modellieren. Alle 14 Missionen, drei Jahrgänge, Freies Forschen, Hilfen und drei Unterstützungsstufen erhalten. Alte Spielstände, Expertenmodus, Tutorial, Katalog und Grafikprofile erhalten. Keine weiteren Konten, Kosten oder externen Laufzeitdienste einführen; AGENTS.md unverändert lassen.

Verifiziere die Korrekturen mit aussagekräftigen Verhaltenstests:
- 10-restore, Wasserwechsel 50 %, 14 Tage: ausgefallene Kontrolle korrekt markiert, lauffähiger Versuch über Tag 48 hinaus; keine erfundenen Folgemessungen. Dasselbe bei Scheitern genau am letzten Schritt prüfen.
- Echter JSON-Export → validierter Import → Lehrkraftansicht: Eingriff, Wert, geplante und tatsächliche Dauer, Status, Seed/Umwelt, Annahmen, eingefrorene Planung, manuelle Messungen und Genetikbelege bleiben nachvollziehbar. Nicht nur das Vorhandensein irgendeines Diagramms prüfen.
- Alten Vergleich berechnen, Ausgangslage und Eingriff ändern: Oberfläche und Export dürfen alte Daten nicht als Resultat des neuen Plans ausgeben.
- F1/F2 mit gleichem Seed reproduzierbar; verschiedene dokumentierte Seeds liefern unabhängige Ziehungen. F1 AA × aa bleibt vollständig Aa; F2 nicht auf ein exaktes Verhältnis festlegen.
- Allel- und Merkmalszählungen sowie Fortpflanzungserfolg aus den gespeicherten Selektionsereignissen rekonstruieren und mit den Zeitreihen vergleichen; Neutralität, umgekehrte Umwelt und verlorene Allele prüfen.
- Eigene Messzeitpunkte ohne automatischen Vergleich aufnehmen und tatsächlich in Tabelle, Diagramm, Export und Lehrkraftansicht wiederfinden.
- Curriculumprüfung der Kohlenstoff-Transferaufgabe durch Lesen des Originals und der fertigen Schüleransicht, zusätzlich zur technischen Prüfung.
- Vorhandene 87 Modultests ausführen; gezielte Browserprüfungen über den Projektunterpfad durchführen. Schul-iPad/Safari ehrlich als durchgeführt oder offen ausweisen. Prüfe relevante Regressionen einschließlich Expertenstart, Tutorial, Beckenplatzierung, Laden/Speichern und Hilfe/Tastatur/Touch.
- Ergänze einen kostenfreien automatischen Modultestlauf für Pull Requests; die bisherigen grünen Pages-Checks prüfen nur die Veröffentlichung. Browser- und Fachprüfungen weiterhin nach ihrem tatsächlichen Umfang benennen.

Liefere den überarbeiteten PR-Stand mit nach R1–R8 zugeordneten Änderungen, echten Testergebnissen und einer Abnahmematrix für alle 14 Missionen. Aktualisiere REPORT.md, AUDIT.md und VALIDATION.md auf den tatsächlich geprüften Stand. Behaupte weder empirisch belegte Lernwirksamkeit noch vollständige Erfüllung eines nicht vorliegenden Masterauftrags. Kein Merge ohne meine Zustimmung.
