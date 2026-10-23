# Sichtabnahme F01–F03 · PR #9

Dies ist die angeforderte Zwischenabnahme, keine Merge-Empfehlung und kein Nachweis eines Lernerfolgs mit Schülerinnen und Schülern. F04–F11 werden erst nach dieser neuen Sichtabnahme abgeschlossen. Die frühere M1-Freigabe ersetzt sie nicht.

PR: https://github.com/Feerson1617/Simulation-Aquarium/pull/9  
Vorschau: https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/  
Anwendungscode: `4b79d08a48be6126fc7cd8c2df3b785a44c234f8`. Spätere Commits ergänzen Nachweise und Dokumentation. Der gesamte aktuelle Paketstand wird bei der Übergabe als exakter Commit genannt.

## Sichtbare Änderungen

**F01 – tatsächliche Reste.** Die Mengenansicht gehört zum einen Aquarium. M2 zeigt vor dem Füttern, direkt danach und nach drei Tagen. Alle drei Balken benutzen dieselbe lineare Skala und dieselbe Referenz: vor dem Füttern = 100. Aus den tatsächlichen Restemengen `0,35 → 0,47 → 0,4502356925` werden `100 → 134,3 → 128,6`. Die Frage nennt ausdrücklich den Vergleich **nach dem Füttern** mit **nach drei Tagen**. Es werden keine Krümel erfunden oder als gezählte Einzelteile dargestellt.

Der Abbaufluss `0,2970494329` wird getrennt von Beständen zu einzelnen Zeitpunkten gezeigt, ebenfalls bezogen auf den Ausgang vor dem Füttern. Die zusätzliche Entscheidung verlangt, Abbau und Nettoänderung zu unterscheiden. Die ausführliche Erklärung ist eine ausdrücklich angeforderte Hilfe. Daraus wird kein sichtbarer Mikroorganismen- oder Atomnachweis abgeleitet.

M5 zeigt die beiden gespeicherten Endmengen nach zehn Tagen auf derselben Skala: Wasserwechsel `22,7252798167`, weniger Futter `1,1226958062`, bezogen auf den gemeinsamen Anfang `11,1241707440`. In der Anzeige: `204,3` und `10,1`, Anfang = `100`. Die direkte Wirkung auf gelöste Nährstoffe wird separat angezeigt. Der zweite Versuch stellt weiterhin das ganze ursprüngliche Aquarium wieder her. Es gibt keine zweite aktive Welt.

**F02 – tatsächliches Glasbecken und individuelle Auswahl.** Die Kamera passt die projizierten Glasecken in den Beobachtungsbereich ein. Maßgeblich ist die Größe des Glases im Bild, nicht die freie Canvasfläche. Desktop/Querformat nutzen den Raum rechts der Aufgabe; Hochformat nutzt fast die gesamte Breite. „Becken einpassen“ stellt die Ansicht wieder her. Die Rückwand ist heller; dunkle Fischvarianten bleiben dunkel. Zentimeterverhältnisse, Modelle und Wachstumsberechnung sind unverändert.

Ausgewählte echte Lebewesen haben einen kontrastreichen Rahmen mit Art und kurzer Kennung. Die Auswahl folgt ihrem gerenderten Objekt und wird beim Laden wiederhergestellt. Direkte Treffer berücksichtigen die tatsächlichen Objekte; bei Touch wird der nahe Bereich um kleine Objekte berücksichtigt. Die vorhandenen Auswahlknöpfe bleiben als Alternative. Ein in der Entwicklung reproduzierter Fehler nach Kameradrehung wurde durch Beenden der Restbewegung, Aktualisieren der Kameramatrizen und Zuordnung zum tatsächlichen Besitzer des getroffenen Modells korrigiert.

**F03 – Rohbelege vor der eigenen Deutung.** Die direkten Lösungssätze sind entfernt. M1 zeigt beide gespeicherten Linien, M2/M5 Mengenbalken und M6 die Modellmenge des ausgewählten Individuums. In M2 wird die Lösungserklärung nicht mehr automatisch vor der Frage geöffnet. Keine neue Pflicht zum Schreiben eines Fachtextes.

## Prüfung aller sechs Missionen auf vorweggenommene Lösungen

| Mission | Notwendige Rohbelege / Ausgangsbedingungen | Eigene kurze Entscheidung | Grenze |
|---|---|---|---|
| M1 | Lichtzeiten, gleicher Anfang, beide tatsächlichen Verläufe auf gemeinsamer Skala | Nettotrends zuordnen, anschließend Bildung/Verbrauch/Luftaustausch unterscheiden | Ein steigender Gesamtwert allein ist kein Herkunftsbeweis. |
| M2 | Vor-/Nachfütterungs- und Endmenge, gespeicherter Abbaufluss separat | Veränderung nach Fütterung, Umwandlung statt Verschwinden, Abbau versus Nettoänderung | Eine Erklärung über winzige Lebewesen wird nur auf Wunsch geöffnet; diese sind keine sichtbar gezählten Individuen. |
| M3 | Tatsächliche Fischfarben, Zählhilfe, Eltern-IDs und weitergegebene Allele | F1 auswerten, konkretes Kind erklären, mögliche statt feste F2-Anzahl | Der alte Satz „Zweimal a ergibt hell“ steht nicht mehr direkt vor der gleichlautenden Antwort. Die Definition bleibt als Hilfe zugänglich. |
| M4 | Gesetzte Chancen als notwendige Versuchsbedingung; echte Anzahlen der Wiederholungen | Zufall einordnen und erläutern, wie Elternwahl Farbanteile beeinflussen kann | Die Frage fragt jetzt nach dem Zusammenhang, nicht nur nach der gerade genannten Regel. Elternbeitragsdarstellung F07 bleibt offen. |
| M5 | Gemeinsamer Anfang, konkrete Maßnahmen, direkte Nährstoffwerte, spätere Restemengen | Maßnahmen anhand ihrer Daten vergleichen und fortlaufenden Eintrag berücksichtigen | Die Beschreibung der Maßnahme nennt keine vorweggenommene Mengenwertung. |
| M6 | Art/ID und Anfangs-/Endmenge derselben Pflanze | Wachstum einordnen, Kohlenstoffquelle/-rückkehr erklären, Beleggrenze erkennen | Die Modellmenge ist keine Wägung und kein Beweis für die Herkunft einzelner Atome. Wissenschaftliche Erklärung als bewusst gewählte Hilfe. |

Rohzahlen wie „12 dunkel, 0 hell“ oder tatsächlich geerbte Allele bleiben verfügbar. Sie sind Beobachtungsdaten, keine ausformulierte Schlussfolgerung. Hilfen dürfen die Erklärung geben, nachdem Lernende sie bewusst angefordert haben. Bereits vorhandene Ergebnisse behalten ihre ursprünglichen Antworten und sind kein Nachweis, dass neue Fragen nochmals bearbeitet wurden.

## Reproduzierbare Schülerhandlungen

Vor einem eigenen neuen Durchlauf in einer bereits abgeschlossenen Mission „Noch einmal untersuchen“ wählen. Vorhandene Dateien werden dadurch nicht gelöscht; der alte Versuch wird archiviert. Alternativ ein frisches Browserprofil verwenden.

1. **M2:** Mission öffnen → „Ich bin unsicher“ → Mengenansicht vor dem Füttern ansehen → „Einmal füttern“ → zweite Zeile vergleichen → „Entwicklung ansehen“ → anhalten, Hilfe schließen und weiter beobachten → nach drei Tagen die beiden ausdrücklich genannten Zeilen vergleichen. „Es sind mehr Reste“ als Fehlantwort prüfen, dann korrigieren. Über „Weiter untersuchen“ zu den Stofffragen; es öffnet sich keine Lösung automatisch. Bei der Abbaufrage die drei tatsächlichen Modellbalken auswerten; Erklärung nur auf Wunsch öffnen. Ergebnis speichern und wieder laden.
2. **M5:** Mission öffnen → Vermutung → zuerst Wasserwechsel → direkte Werte ansehen → zehn Tage beobachten → „Mit gleichem Anfang noch einmal“ → weniger Futter → wieder zehn Tage. Die beiden Endbalken gegen denselben Anfang vergleichen. Falsche Zuordnung wählen, Hilfe testen, korrigieren. Ergebnisdatei speichern; nach einem neuen Versuch wieder öffnen.
3. **Kamera und Auswahl:** M1 und M3 jeweils bei 1366×960, 768×1024 und 1366×1024 öffnen. Das Glas vollständig betrachten. In M1 mittlere Anubias und linke Wasserpest direkt antippen; Art/ID im Rahmen kontrollieren. Kamera ziehen, „Becken einpassen“ wählen, Pflanze mit Maus erneut auswählen. In M3 einen dunklen Fisch direkt antippen und mit seiner Auswahl-Schaltfläche abgleichen. Für die erste Kreuzung dunkel × hell wählen; die dunklen Eltern der Titelfrage werden erst aus deren Nachkommen ausgewählt.
4. **Antworten nicht vorlesen:** M1 bis zum Kurvenvergleich, M2 bis zur Mengenfrage, M3 bis zu F1 und zur Allelfrage, M4 bis zum Vergleich und zur Frage nach der Elternwahl, M5 bis zum Maßnahmenvergleich, M6 bis zur Wachstumsfrage spielen. Vor dem Antworten nur Belege lesen. Die angebotene Aussage selbst daraus ableiten. Nach einer Fehlantwort bleibt eine Korrektur möglich.
5. **M6:** Wasserpflanze auswählen → Art/ID am Rahmen und in der Mengenansicht vergleichen → beobachten, pausieren, neu laden → dieselbe ID wiederfinden → drei Tage abschließen. Erst die Wachstumsbeobachtung auswerten; anschließend bei Bedarf die Erklärung zur Kohlenstoffquelle anfordern.

Das Testskript `tests/correction_gate_browser.py` verwendet sichtbare Schaltflächen, echte Browser-Touch-/Maus-/Tastaturereignisse und eigene Datei-Downloads. Diagnoseschnittstellen lesen Zustand und Projektionskoordinaten; sie setzen keine Mission, Antwort oder Questvariable. `AQUARIUM_CORRECTION_IDS` begrenzt den Umfang, `AQUARIUM_CORRECTION_RESULTS` den Ausgabeordner. WebKit wird über die vorhandene portable Laufzeit gestartet.

## Überschneidungen und weiterhin offen

F03 erfordert bereits die gemeinsamen M1-Linien aus F05 und eine eindeutig zugeordnete M6-Anfangsreferenz aus F08. Die M3-Einstiegsbeschreibung erklärt jetzt die Reihenfolge der Kreuzungen. Diese Überschneidungen bedeuten keine vollständige Abnahme von F04–F11.

Offen bleiben insbesondere die spezifischen Fehlerhilfen F04, die vollständige Prüfung/Feinarbeit an F05, getrennte M3-Elternfehlermeldungen und Nullfälle F06, verständliche Elternbeiträge F07, vollständiger M6-Identitäts-/Auswahlweg F08, Archivnamen F09, Pinzettenhinweise und erfolgreicher Touch-Versatz F10 sowie die übrigen Sprachstellen F11. Lange Elternlisten sind scrollbar; der untere Kartenbereich kann dafür gescrollt werden müssen. Der Außenfilter liegt bei enger Beobachtung am Bildrand und kann teilweise außerhalb des Ausschnitts liegen; die Glasecken und die Lebewesen werden priorisiert.

Physisches Schul-iPad/Safari, Unterrichtsverständnis mit Lernenden und natives `file:`-Öffnen wurden hier nicht nachgewiesen. Linux-WebKit mit Browser-Toucheingaben ist kein Hardwaretest. Alte 14er Dateien werden nicht als neue Lernleistung ausgegeben; ein vollständiger neuer Importlauf aller historischen Dateien gehört nicht zum F01–F03-Nachweis. Technische Abschlüsse belegen Bedienbarkeit und Datenzuordnung, nicht automatisch Lernqualität.

Die letzte Gestenprüfung auf `4b79d08a48be6126fc7cd8c2df3b785a44c234f8` bestätigt zusätzlich in Chromium und WebKit: nach Loslassen einer Maus-/Touchauswahl bleibt die Kamera beim anschließenden bloßen Bewegen stabil. Der zunächst reproduzierte Fehler und seine Korrektur sind im [Testbericht](TESTS.md) getrennt belegt.
