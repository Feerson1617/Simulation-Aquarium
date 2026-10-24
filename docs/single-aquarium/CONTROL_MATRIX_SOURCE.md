# Funktionen der Schüleroberfläche

64 Funktionsgruppen aus den relevanten Oberflächenmodulen; statische Zuständigkeitsprüfung, keine behauptete Laufzeitsichtbarkeit. Die Rohfundstellen sind separat in evidence/controls-source-inventory.json erfasst. Das alte eingebettete Experten-HTML wurde nicht als neuer Schülerbildschirm gezählt.

| Element | Bisheriger Kontext | Entscheidung | Begründung / neue Verwendung |
|---|---|---|---|
| Jahrgang / Mission / Modus | Startoberfläche | Kontext | Vor dem Einstieg auswählen, im Aquarium nicht als ständige Leiste. Sechs neue Missionen statt alter 14er-Liste. |
| Aktuelle Aufgabe / Fortschritt | Questbuch | Dauerhaft | Eine kompakte Aufgabenkarte; keine große dauerhaft leere Seitenfläche. Fortschritt nicht starr fünf Phasen. |
| Mehr / Start / zurück | Mehrmenü und HUD | Dauerhaft/erweitert | Ein beschriftetes Menü bleibt. Missionswechsel und Start darin, nicht zusätzlich in mehreren Leisten. |
| Aquarium anschauen | Questphase 0 | Entfernen | Kein Pflichtklick nur zum Setzen eines observed-Flags. Die geforderte Beobachtung geschieht an einem relevanten Objekt. |
| Beobachten | HUD / Panel | Entfernen als Hauptmenü | Objektauswahl und kontextbezogene Messung statt generischem Panel. |
| Ausprobieren / Untersuchen | HUD / Panel | Entfernen als Hauptmenü | Direkt benannte Handlung am aktuellen Lernschritt statt Zwischenmenü. |
| Tiere & Pflanzen / Artkarte | Material/Katalog | Kontext | Kurze Karte zum ausgewählten Tier/Pflanze. Vollkatalog im Freien Forschen/Expertenbereich. |
| Fisch zeigen | Aquariumkacheln | Kontext | Gut treffbare Alternative zur direkten Tierauswahl behalten. Aktuelle ID muss stimmen. |
| Wasser ansehen | Aquariumkacheln | Entfernen/ersetzen | Nicht pauschal Wasser anklicken lassen; nur benötigte Messung direkt anbieten. |
| Einsetzen / Kaufen | Katalog | Kontext/erweitert | Nur bei biologisch begründeter Aufgabe; sonst Freies Forschen/Experte. Kein Einkaufszwang vor jeder Mission. |
| Pinzette | Material/Mehr | Erweitert | Für freies Gestalten erhalten; nur kontextuell, wenn Platzierung lernrelevant ist. |
| Heizstab / Zieltemperatur | Geräte | Erweitert | Als Gerät erhalten, aber keine eigene Pflichtmission, kein Pflichtminispiel. |
| Licht einstellen | Gerät | Kontext | M1, eventuell M6: eindeutig hervorgehoben. Eine passende Auswahl, nicht Intensität+Stunden+Zeitraum gleichzeitig. |
| Filter öffnen / betrachten | Gerät | Kontext | M2: Ort der Prozesse. Reinigung nicht als zwingende Katastrophenaufgabe. |
| Filterdurchfluss | Gerät | Erweitert | Freies Forschen/Experte; kein unspezifischer Pflichtregler. |
| Belüfter / Abschäumer / Technik | Geräte | Erweitert | Nicht dauerhaft in Lernmissionen; vorhandene Funktionen erhalten. |
| Futtergabe | Pflege | Kontext | M2 eine konkrete Handlung; Ereignis nur einmal anwenden. |
| Futterautomatik / Tagesration | Pflege | Kontext | M5 Ursache und Maßnahme sichtbar; sinnvolle Rationsauswahl statt technischer Faktorwüste. |
| Wasserwechsel | Pflege | Kontext | M5 eine passende Auswahl. 0 % nicht als wirksame Änderung anerkennen. |
| Dünger / CO₂-Dosierung | Pflege | Erweitert | Keine Kernmission „mehr hinein, mehr messen“. Für eigenes Forschen erhalten. |
| Becken 1 / Becken 2 / Seite | Vergleich | Entfernen | Keine Paarsteuerung im regulären Schülerbetrieb; nicht bloß CSS-verstecken. |
| Beide Becken öffnen / auswählen | Vergleich | Entfernen | Ein Hauptaquarium, historische Läufe als Belege. |
| Gemeinsame Versuchsuhr | Vergleich | Ersetzen | Eine eindeutige Zeit pro aktivem Durchgang. Keine zwei aktiven Zeitsysteme. |
| Versuch starten / Vergleich berechnen | Untersuchung | Ersetzen | Eine konkrete Aktion „Entwicklung ansehen“. Tatsächliche Simulation im sichtbaren Aquarium. |
| Tage / Beobachtungszeitraum | Untersuchung | Entfernen aus Pflichtmission | Sinnvoll vorgegeben; nur die benötigte Beobachtungsdauer kurz nennen, kein Eingabefeld. |
| Wiederholungszahl | Untersuchung | Erweitert | M4 bietet eine inhaltlich begründete weitere Wiederholung, keine vorauszusetzende Zahleneingabe. |
| Seed / gleiche Zufallsfolge | Population/Experte | Erweitert | Technische Reproduzierbarkeit in Hintergrund/Lehrkraft. Unabhängigkeit nicht vortäuschen. |
| Aktuelles Becken als Ausgangslage | Untersuchung | Erweitert/ersetzen | Für Pflichtwege gespeicherten Anfang gezielt und sichtbar wiederherstellen. Freies Forschen darf eigene Starts sichern. |
| Neuen Versuch planen | Untersuchung | Kontext | Nach begründeter Frage: gleicher Anfang und genau eine andere Bedingung. Kein generischer Planungsdialog. |
| +1 Tag / +1 Woche / +2 Wochen | Globale Zeit | Entfernen aus Pflichtleiste | Nur zum Lernschritt passende Beobachtungsaktion. Generationswechsel ist keine natürliche Tagesdauer. |
| Abspielen / Anhalten | Verlauf | Kontext | Nur bei laufender Entwicklung/Wiedergabe; erkennbar live oder gespeichertes Ergebnis. |
| Zeitpunkt-Dropdown | Verlauf | Erweitert/ersetzen | Kleine eindeutige Zeitmarken „Anfang“, „kurz danach“, „später“ aus echten Zuständen. |
| Messzeitpunkt / Werte merken | Messung | Kontext/automatisch | Benötigte Messung automatisch speichern. Manuelle Messreihen im freien Modus behalten. |
| Messgrößenwahl | Messung | Erweitert | Mission zeigt nur ein bis zwei nötige Größen, nicht vollen Auswahlkatalog. |
| Alle Werte / Tabelle | Ergebnisse | Erweitert | Bei Bedarf, nicht in ständig sichtbarer Instrumententafel. |
| Diagramm | Ergebnisse | Kontext | Nur die relevante Frage; höchstens zwei gespeicherte Verläufe derselben Größe. |
| Reihe / Wiederholung auswählen | Ergebnisse | Erweitert | Automatisch passend zur Aufgabe; historische Auswahl optional, Identitäten erhalten. |
| Frühere Durchgänge | Archiv | Erweitert | Unveränderliche historische Ergebnisse; nicht als zweite aktive Welt. |
| Als eigenes Becken übernehmen | Archiv | Erweitert | Explizite Kopie, nicht Nebenwirkung von Ansehen; im Experten-/freien Modus. |
| Erbanlagen zeigen | Genetik | Kontext | Nach passender Beobachtung an denselben ausgewählten Individuen. |
| Mutter/Vater-Dropdown | Genetik | Ersetzen | Direkte Elternauswahl im Hauptaquarium plus gleichwertige kompakte zugängliche Liste. |
| Nachkommen erzeugen | Genetik | Kontext | Nur aktuelle Eltern; echte Nachkommen und Zugehörigkeit, keine zweite Population. |
| Gruppe 1 / Gruppe 2 vergleichen | Population | Entfernen | Eine aktuelle Kohorte, serielle Versuche und gespeicherte Zahlen. |
| 24er-Kartenraster als Hauptwelt | Population | Entfernen/kontextuell | Hauptaquarium ist dieselbe Population; eine kleine Zählhilfe darf ergänzen. |
| Umgebung / Farbvorteil | Population | Kontext | Modellannahme bei M4 konkret benennen, kein unerklärtes Dropdown „Umwelt“. |
| Generation ansehen | Genetik | Kontext | Aktuelle Generation klar; ältere Generationen nachvollziehbar als Archiv, nicht zeitgleich konkurrierend. |
| Punnett-Quadrat | Genetik | Erweitert/kontextuell | Sinnvolle Vertiefung nach Beobachtung; keine zusätzliche Pflicht vor jeder Kreuzung. |
| Noch einmal / frischer Start / fortsetzen | Ergebnisse | Kontext | Eine verständliche Wiederholung; technische Varianten verborgen. Bei Datenverlust absichern, sonst keine Bestätigungskaskade. |
| Quest einklappen / Zur Aufgabe | Quest | Kontext | Eine kleine Karte, bei Bedarf schließen/wiederfinden; nicht drei parallele Auftragsansichten. |
| Tipp / weiterer Tipp | Hilfe | Kontext | Zuerst Objekt/Ort, dann Daten, dann Erklärung; keine automatische Lösung. |
| Wörterhilfe / Glossar / ? | Hilfe | Kontext/erweitert | Kurze Hilfe am tatsächlich verwendeten Begriff, vollständiges Glossar optional. |
| Meine Ergebnisse / Notizen | Ergebnisse | Erweitert/Abschluss | Ein Ergebnisort; kein dauerhaftes zweites Notizbuch. Eigene kurze Begründung freiwillig. |
| Ergebnis speichern / für Lehrkraft | Ergebnisse | Kontext | Am Abschluss eine verständliche Aktion, vollständige Daten im Hintergrund. |
| CSV / SVG / JSON / alle Daten | Export | Erweitert | Nur technische Ansicht/Lehrkraft; keine Dateiformatkenntnis voraussetzen. |
| Konfiguration importieren/exportieren | Lehrkraft | Erweitert | Nicht im normalen Lernweg; Zugänglichkeit und Altformate bewahren. |
| Quellen / Curriculum / Modellklärung | Hintergrund | Erweitert | Lehrkraftbereich; unverzichtbare Erkenntnisgrenzen kurz im passenden Lernschritt. |
| Prozessknoten / große Pfeilfläche | Nahrung/Kohlenstoff | Ersetzen | Wenige am ausgewählten Objekt verankerte Erklärungen statt paralleler Hauptwelt. |
| Waldblätter / Fossilkarten | Transfer | Erweitert | Unterrichtsergänzung, kein neues Aquariumspiel und kein Erfüllungszwang. |
| Hafenobjekte / regionale Ansicht | Transfer | Aus Pflichtweg entfernen | Gutes externes Fallmaterial erhalten; nicht in Fischaquarium umdeuten. |
| Rückkehr zum Beckenvergleich | Region | Entfernen | Keine regionalen Parallelwelten im normalen Schülerweg. |
| Grafikprofil / Darstellung | System | Erweitert | Bei Start oder Menü, nicht während jeder Aufgabe. Keine Modelländerung durch Qualitätsprofil. |
| Warnungen / Gesundheitsanzeige | Status | Kontext | Aktuelle relevante Gefahr kurz verständlich; keine künstliche 100-Punkte-Bewertung als wissenschaftliche Messgröße. |
| Tastatur-/Touch-Alternative | Zugang | Kontext | Barrierearme Alternative nicht als überflüssige Dublette streichen; keine motorische Geschicklichkeitsprüfung. |
| Lehrkraftfreigabe weiterer Werte | Lehrkraft | Erweitert | Eine nachvollziehbare zusätzliche Freigabe, kein standardmäßig volles Labor. |
