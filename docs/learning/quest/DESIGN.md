# Kurze Schülerführung und Questbuch

Der Auftrag [REQUEST.md](REQUEST.md) setzt auf dem geprüften Stand 677e6ce auf. Der biologische Rechenkern, vorhandene 3D-Modelle, Expertenmodus, alte Spielstände, Tutorial und statische Veröffentlichung bleiben erhalten. Neue Dateien sind reine Browsermodule; keine Dienste, Konten, Laufzeitabhängigkeiten oder Kosten.

## Oberfläche und Sprache

Die normale Ansicht enthält Aquarium, Missionsnamen, eine einklappbare Aufgabe und vier Werkzeuge. „Mehr“ enthält Darstellung, Wörterhilfe, Pinzette, Start und Lehrkraftzugang. Es öffnet jeweils nur ein Werkzeug. Das Aquarium verkleinert sich neben dem Werkzeug, statt vollständig dahinter zu verschwinden. Auf schmalen Telefonen nutzt das Werkzeug die volle Breite. Auf Desktop und iPad bleibt das aktuelle Questziel im Werkzeug sichtbar.

Durchgesehen wurden sämtliche neu sichtbaren Texte in `learning-student.mjs`, alle 14 Questdefinitionen, die Start-/Missionsauswahl und Hilfen. Vergleich und Sicherung haben konkrete Fragen; Vermutungen bekommen inhaltlich passende Antwortsätze. Keine Pflichttexte, Papierzeichnungen oder Wirkungsgefüge. Vorhandene Lernnotizen bleiben als frühere Ergebnisse zugänglich.

| Bisher | Schüleransicht |
| --- | --- |
| Tierkondition unauffällig | Den Fischen geht es gut. |
| Versorgungsindikator, Warnpfade, didaktische Schwellen | Nährstoffe und Probleme im Wasser; Einzelheiten nur bei Lehrkräften |
| Forschungsnotizbuch mit neun Schreibfeldern | Questbuch und Meine Ergebnisse |
| Kontrollierter Vergleich / veränderte Bedingung | Ausprobieren / Was änderst du? |
| Phänotyp / Allelfrequenz auf jedem Bildschirm | Farbe / Anteil; Begriffe erst an der passenden Aufgabe |
| JSON / CSV / SVG / Seed / Modellkonfiguration | Für die Lehrkraft speichern / Ergebnis speichern |
| Curriculum und Modellklärung in Missionskarten/-fenstern | Ausführliche Missionshintergründe im Lehrkraftmodus |

Das ist eine strukturelle Trennung: `learning-student.mjs` erzeugt die reduzierte Oberfläche; die bisherigen detaillierten Ansichten bleiben in `learning-ui.mjs`. Die Lehrkraft kann eine Schüleransicht oder eine technische Mission bzw. freies Forschen öffnen. Unterstützungseinstellungen verändern weiterhin keine biologischen Rechenregeln. Zusätzliche Messgrößen können gezielt freigegeben werden. Die Schülerdatei enthält die vollständigen Daten, obwohl ihre Schaltfläche kein Dateiformat benennt.

## Ereignisse und Rückmeldungen

Jede Mission besitzt fünf Schritte: Anschauen, Vermuten, Ausprobieren, Vergleichen, Erklären. Die erste Aufgabe erscheint automatisch. Einklappen beeinflusst weder Becken noch Fortschritt. Aufgaben stehen bei geöffneten Werkzeugen direkt im Werkzeug.

1. Anschauen erfordert tatsächlich geöffnetes Beobachten, eine Artkarte oder ein betrachtetes Individuum und eine passende Antwort. Wahlloses Antworten vorher führt nicht weiter.
2. Jede der angebotenen Vermutungen ist zulässig. Sie wird vor dem Versuch gespeichert und nicht als richtig/falsch bewertet.
3. Ein echter berechneter Versuch mit einer veränderten passenden Bedingung, eine tatsächlich erzeugte Nachkommengeneration, die Anzeige verschiedener vorhandener Erbanlagen oder ein echter Vergleich über mindestens zwei Generationen schließt die Handlung ab. Gleiche Lichtdauer und 0 % Wasserwechsel zählen nicht. Andere gültige Werte, Elternpaare sowie helle/dunkle Umgebungen sind möglich. Gesundheitsmissionen erlauben unterschiedliche passende Pflegemaßnahmen. Darwin benötigt einen Unterschied der Elternwahl; die Populationsmission darf auch nur Zufall untersuchen.
4. Die Frage folgt dem tatsächlichen Ergebnis. Ökologische Vergleiche verwenden den letzten gemeinsamen endlichen Messpunkt. Ein länger überlebendes Becken bleibt unabhängig berechnet; seine späteren Werte werden nicht mit erfundenen Gegenwerten verglichen. Rundungsgleiche Anzeigen erlauben „etwa gleich“. Kreuzungsfragen zählen tatsächliche Nachkommenfarben. Ein erneuter Versuch ersetzt die noch offene Vergleichsfrage.
5. Eine kurze Auswahlfrage sichert den einen Zusammenhang. Falsche Antworten bleiben wiederholbar. Erst danach erscheint die zusammenfassende Erklärung. Keine automatische Schulnote oder Verständnismessung.

Die Auswahl ist eine konkrete Interaktion, kein frei klickbarer Weiterknopf. Ein lokales Questbuch ist dennoch kein manipulationssicheres Prüfungssystem. Beobachten prüft eine tatsächliche Oberfläche, nicht den Blick oder das Verständnis eines Menschen.

## Daten und bestehende Spielstände

Die vorhandenen Speicherplätze und die Version 2 der Ergebnisdateien bleiben gültig. `quest` ergänzt Antworten, Zeitpunkte, Handlungsbelege und eingefrorene Ergebniswerte samt Laufzuordnung. Import ist begrenzt und ausschließlich lesend. Es wird kein importierter Rechenkernzustand ausgeführt.

Beim ersten Öffnen einer früheren Mission bleiben Versuchseinstellungen, Messungen, Kreuzungen und Vergleich unverändert. Bestehende Notizen werden zusätzlich unter `earlierNotes` erhalten, bevor Questantworten aktuelle Felder belegen. Lehrkräfte und Schüler können sie lesen; Exporte erhalten sie ebenfalls. Bereits abgeschlossene Quests laden mit Fortschritt. „Noch einmal“ erstellt vorher die vorhandene lokale Sicherung. Die alte Datei `aquarium-werkstatt-v1` wird durch Lernmodi nicht ersetzt.

Freies Forschen hat keine Pflichtfolge. Frage und Ergebnis sind freiwillige Notizen; Versuche, Pflegemaßnahmen, Messen und Kreuzungen funktionieren auch ohne Eingaben. Die Ergebnisansicht bietet freiwillige Orientierung. Vollständige CSV-/SVG-Exporte, genaue Laufkonfiguration, unabhängige Enden, Wiederholungen und Eltern-/Nachkommenarchive bleiben über die technische Untersuchung und die Lehrkraftleseansicht verfügbar (R1–R8).

## Fachliche Vereinfachungen

Fotosynthese und Atmung bleiben verschiedene Prozesse; Pflanzen verbrauchen ebenfalls Sauerstoff. Die Sauerstoffsicherung nennt auch Luftaustausch. Der Kern trennt Nitrat, Nitrit und Ammoniak weiterhin. Versorgung und Belastung sind verschiedene Anzeigen; Details und Schwellen stehen bei der Lehrkraft. Relative Bestände und Gesundheitswerte sind keine Naturmessungen in Gramm oder eine Diagnose am echten Tier.

Der Farbversuch ist eine getrennte endliche Gruppe mit echter zufälliger Weitergabe von Allelen. Die vier ursprünglichen Mollys im 3D-Becken werden davon nicht durch eine neue Generation ersetzt. Genotyp/Phänotyp werden bei Bedarf erklärt. Dominanz ist kein automatischer Vorteil. Auswahl der Eltern ist hier eine offengelegte Versuchsannahme; Zufall wirkt mit. Historische Evolutionstheorien werden nicht vollständig rekonstruiert; eine bedarfsgerichtete Veränderung wird als Alltagsvorstellung geprüft.

Wald, Nordsee und Wattenmeer bleiben begrenzte Übertragungen. Der Wasserwert berechnet keine Plastikverletzungen. Kohlenstoffzufuhr im Becken ist keine globale Emissionsrechnung. Anthropogene Verbrennung, Landnutzung, institutionelle Quellen und genaue Grenzen aus R4 bleiben bei der Lehrkraft zugänglich. Für das Wattenmeer benennt die kurze Sicherung einen Nutzen und Aufwand von Mehrweg. Fachliche Hintergründe und die abgeglichene Schulcurriculum-PDF werden nicht als Aquarium-Messdaten ausgegeben.

## Grenzen der Prüfung

Automatisierte Antworten und Textsuchen belegen Bedienabläufe und Datenbezug. Sie ersetzen keine Verständlichkeitsinterviews, empirische Lernwirksamkeit, vollständige Hilfstechnikprüfung oder Tests auf einem physischen Schul-iPad in Safari. Die 3D-Darstellung wurde erhalten, nicht als vollständig fotorealistisch neu bewertet.
