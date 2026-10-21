# Fortsetzung: Questbuch und kurze Schülerführung

Ausgangsstand 677e6ce, Branch feature/biology-learning-environments, bestehender PR #8. Keine lokalen Fremdänderungen. Remote Branch und PR-Kopf beim Start identisch. R1–R8 und historische Testnachweise bleiben erhalten.

## Fortschritt

P1 begonnen: eindeutige Hilfe „Beobachten“, kurze Hilfen für alle Jahrgänge, Missionskarten ohne Curriculum, einfache Starttexte. Auftrag vollständig in quest/REQUEST.md gesichert.

## Nächste Schritte

P2 interaktives, gespeichertes Questbuch; P3 alle 14 Folgen mit echten Ereignissen; P4 reduzierte Schülerwerkzeuge und Ergebnisse, technische Ansichten für Lehrkräfte; P5 neue Quest-, Browser- und Regressionstests. Bisherige 100/82 Nachweise gelten nur für den alten Laufzeitstand 7e82046, nicht als Prüfung neuer Änderungen.

Nur diesen Branch pushen. Kein Merge. GitHub-API ist bisher gesperrt; Beschreibung unter PR_BODY.md vorbereiten. Keine kostenpflichtigen Dienste. Physisches Safari/iPad und Unterricht bleiben offen.

## Gesicherter Zwischenschritt P2/P3/P4

Questzustand und 14 Folgen in learning-quests.mjs, reduzierte Ansichten in learning-student.mjs integriert. Fortschritt prüft echte Beobachtung, Vorhersage, geänderten berechneten Versuch, Kreuzung/Erbanlagen oder Generationen. Auswertung aus letzten gemeinsamen Messwerten, falsche Antwort wiederholbar. Bestehender Kern unverändert. Technische Untersuchung weiterhin über Lehrkraftmodus. Erste reale Desktop-Mission bis Auswertung getestet; 105 Modultests bestanden. Vollständiger Quest-/Touch-/Regressionslauf und Enddokumentation folgen, noch keine Endabnahme.

P4 integriert: „Meine Ergebnisse“, einfache Begriffe für Werkzeuge/Diagramme, wenige sichtbare Messgrößen, kleine Artenkarten, wissenschaftliche Hintergründe ausschließlich im Lehrkraftmodus. Dort sind technische Missionen und freies Forschen sowie die bisherigen Formate/Archive zugänglich. R1–R8-Browsertests wurden auf diesen tatsächlichen Zugang umgestellt; keine Kernprüfung entfernt. Sprachprüfung korrigiert auch unpassende Antwortsätze und unterscheidet Gruppen im Farbversuch von echten Becken. Neue Quest-Browserprüfung läuft zunächst als Entwicklungslauf; Endlauf nach Abschluss aller Korrekturen.

Weitere Fach-/Bedienkorrekturen: Passende Antworten zu Temperatur, Fischzustand und Pflanzen statt „Es wird mehr“; Gruppen und Prozentanzeigen im Farbversuch; Auswertung berücksichtigt sichtbare Rundung („etwa gleich“). Neue Berechnung ersetzt einen noch nicht beantworteten Vergleich. Frühere Notizen werden vor der Questmigration kopiert und mit exportiert. Technische Unterrichtshintergründe sind lesbar, ohne dabei Schülernotizen zu bearbeiten. Hilfeschaltflächen mindestens 44 × 44 Pixel; Pinzette aus dem Menü schließt das Menü und lässt sich direkt wieder beenden. 107 Modultests im Entwicklungslauf bestanden. P5 läuft.

Entwicklungsprüfung fand zusätzlich eine durch die Herauslösung der Hintergrundtexte eingeführte ungültige Variablenreferenz im technischen Notizbuch; vor dem Endlauf korrigiert. Ein Wasserwechsel von 0 % zählt nicht als Eingriff, auch falls die alte Pflegefunktion dabei einen Logeintrag erstellt.

Explizite Freigaben zusätzlicher Messgrößen durch Lehrkräfte werden auch in der neuen Schüleransicht berücksichtigt. Nitrat/Nitrit erscheinen ausschließlich bei konkreter Freigabe und erhalten unmittelbar die passende kurze Begriffshilfe. Standardansichten bleiben reduziert.

## Endlauf gestartet

Laufzeit eingefroren auf dd491b5. 107 Modultests im Endlauf bestanden. Jetzt laufen seriell: alle 14 Quests vollständig, drei zusätzliche Touchdurchläufe, freies Forschen, Lehrkraft/Altprodukte/Hilfen/Migration; danach Review R1–R8, gezielte Fach-/Speicherfälle, Bereitschaft mit Tutorial, Aquascaping und Einzeldatei. Status temporär /tmp/quest-final-validation/status.json, später dauerhafte Belege unter quest/evidence. Nicht die früheren 100/82 als neue Endprüfung ausgeben.

P1–P4 implementiert. Neue Erläuterung in quest/DESIGN.md, 14-Folgen-Matrix in quest/MISSIONS.md. Prüfbericht quest/VALIDATION.md noch ausdrücklich vorläufig. Nach abgeschlossenen Prüfungen Endzahlen/Belege/PR-Beschreibung und diesen Status finalisieren, Commit und Push auf denselben Branch; kein Merge.

Letzte sprachliche Durchsicht vor der endgültigen Abnahme: „Fortpflanzungserfolg“, „Biomasse“ und „Schichtung“ aus den betreffenden Schüleraufgaben gestrichen bzw. konkret erklärt; Wattenmeerfrage gekürzt. Keine Änderung an Versuchslogik oder Kern. Den begonnenen Endlauf auf dd491b5 deshalb nicht als vollständige Endabnahme zählen; Rohlogs bleiben unter /tmp/quest-final-attempt-dd491b5. Ein letzter frischer Lauf folgt auf diesem Sprachstand.
