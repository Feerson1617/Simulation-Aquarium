# Prüfung der Aquarium Eingaben und Gerätebedienung

> Historisches Geräte-Audit des Ausgangsstands b5751b0 und der Gerätefassung 5440886. Die neuere unabhängige Nachprüfung und gezielte Korrektur stehen unter [device-controls-correction](device-controls-correction/VALIDATION.md). Die unten genannten früheren Läufe sind kein Browsernachweis des neuen Heads.

Am 21. Oktober 2026 wurde der offene [PR 8](https://github.com/Feerson1617/Simulation-Aquarium/pull/8) auf `feature/biology-learning-environments` geprüft. Ausgangspunkt war der neueste GitHub-Head `b5751b01f826bbf14b26b743155a05e8756c38bd`; Zielbranch war main bei `666df90ac05de61181f380f2190539a9cef04044`. Die [tatsächliche PR-Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-8/) und die lokale Korrektur wurden jeweils durch alle 14 Quests bis zum Abschluss bedient. Freies Forschen wurde für alle drei Jahrgänge mit Vergleich und Messungen geprüft, der Expertenmodus zusätzlich mit seinen Geräteeinstellungen.

Der gemeldete pauschale Fehler „Temperatur immer ungültig“ ist auf diesem Stand mit 20 °C nicht reproduzierbar. Bestätigt sind dagegen die Ablehnung von 24,5 °C, ein ungültiger Futter-Standardwert und eine Lücke bei ausstehenden Quest-Ergebnissen. Das ursprüngliche Feld „Tage“ steuert bereits die Vergleichsrechnung; im Modell gibt es keinen Ablauf-Timer für die Heizung. Die Oberfläche erklärt diese Trennung jedoch nicht ausreichend.

## Priorisierte Fehler

Die Fundstellen dieses Abschnitts beziehen sich auf den geprüften Ausgangscommit, damit sie nach der Korrektur nachvollziehbar bleiben. P1 bedeutet eine blockierte zulässige Bedienung oder einen fehlerhaften Lernabschluss; P2 bezeichnet begrenzte Eingabeprobleme, unklare Bedienung oder fachliche Modellprobleme.

### P1 Ungültiger Standardwert beim Wechsel auf Futter

**Fundstelle:** [learning-model.mjs Zeile 40](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-model.mjs#L40), [Validator ab Zeile 282](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-model.mjs#L282), Werkzeugwechsel in `learning-ui.mjs` ab Zeile 1144.

**Reproduktion:** Klasse 8 → Freies Forschen → Ausprobieren → Futter wählen → Versuch starten, ohne den automatisch gesetzten Wert zu ändern. Die Oberfläche setzt 0,65, der Validator erlaubt Schritte von 0,25 ab null. Ergebnis: „Ungültiger Eingriff.“ Dasselbe Problem betrifft den Werkzeugwechsel in `8-foodweb`, `8-health`, `8-forest`, `10-enrichment`, `10-restore` und `10-wadden`, soweit Futter freigeschaltet ist. Die frische Quest `8-foodweb` startet mit dem gültigen Wert 2 und ist deshalb zunächst abschließbar.

**Korrektur:** Default 0,75. Alte editierbare Pläne mit dem bekannten ungültigen Default werden abgeglichen; der gespeicherte Beckenwert `feedRate` und historische Daten bleiben erhalten. **Regression:** `device-controls.test.mjs` prüft alle Defaults, alle Quest-Eingriffe und die Wiederherstellung alter Entwürfe. Die Browserprüfung bestätigt den alten Fehler und gültige Vergleiche nach der Korrektur.

### P1 Geänderte Pläne erlauben Antworten zu veralteten Ergebnissen

**Fundstelle:** [Antwort-Handler ab learning-ui.mjs Zeile 1252](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-ui.mjs#L1252), [questEvent ab learning-quests.mjs Zeile 463](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-quests.mjs#L463), `answerQuest` ab Zeile 491.

**Reproduktion:** Mission 1 mit 20 °C berechnen. Im Ergebnisschritt auf 26 °C ändern, ohne neu zu rechnen. „In Becken 1“ wählen. Die alte Vorschau geht trotz Hinweis „Starte den Versuch neu“ auf Schritt 5 weiter. Dieselbe gemeinsame Antwortlogik betrifft ökologische und Populationsvergleiche aller Jahrgänge. Auch eine nachträglich geänderte ausstehende Erklärung braucht einen Schutz.

**Korrektur:** Ergebnisschritt und Erklärung verlangen eine zur aktuellen Planung passende Vergleichskonfiguration. Eine erneute Rechnung vor dem Abschluss entfernt die ausstehende alte Auswertung und verlangt eine neue Ergebnisantwort. Fertige Quests behalten ihre Historie. **Regression:** Die Modultests und der echte Browserablauf prüfen No-op, falsche Antwort, Änderung vor Ergebnisantwort, Änderung vor Erklärung, erneute Rechnung, neue Antwort und vollständigen Abschluss mit fünf Belegen.

### P1 Geräte sind nur dargestellt und nicht direkt bedienbar

**Fundstelle:** [interventionForm ab learning-ui.mjs Zeile 593](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-ui.mjs#L593), `index.html` in `U1` und den Pointer-Handlern von `y1`, `realism-renderer.mjs` in `buildEquipment`.

**Reproduktion:** Heizstab, Filter oder Lampe im Aquarium antippen. Es gibt keinen Geräte-Handler, keinen Drehregler und keine optische Zuordnung des abstrakten Lern-Dropdowns zum Gerät. Der Expertenmodus bietet separate Schieberegler im Einstellmenü. Ein eingebauter ausgeschalteter Heizstab verschwindet, weil seine Geometrie nur bei `heater === true` aufgebaut wird.

**Korrektur:** Gemeinsame Geräteoberfläche mit tatsächlichen Mesh-Treffern, großen räumlich mitgeführten Schaltflächen, Hervorhebung und Drehregler. Mausziehen, Tastatur, Texteingabe und Plus/Minus verwenden denselben numerischen Vertrag. Die vorhandene Heizung bleibt ausgeschaltet sichtbar. **Regression:** Gerätewerte und Helligkeit wurden in allen freien Jahrgängen und im Experten-Szenario gespeichert und nach Neuladen wieder geöffnet. Mausziehen und Pfeiltasten wurden real bedient. Die zusätzliche Browser-Suite enthält emulierte Touch-Kontexte; ein echtes Safari-iPad bleibt separat zu prüfen.

### P2 Temperatur hat ein unerklärtes Ganzzahlraster

**Fundstelle:** [learning-model.mjs Zeile 73](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-model.mjs#L73), generisches `type="number"` in `interventionForm`, `valueAsNumber` in den Apply-/Compare-Handlern.

**Reproduktion:** In Mission 1 den Wert 24,5 °C beziehungsweise 24.5 eingeben und starten. Der Wert liegt im angezeigten Bereich, verletzt aber `step: 1` und wird nur mit „Ungültiger Eingriff“ abgewiesen. Leere oder vom Browser nicht erkannte Dezimaleingaben führen ebenfalls zu nicht endlichen Werten. 20, 25 und 26 °C sind dagegen gültig; 25 °C entspricht bei gleicher Ausgangslage einer wirkungslosen Einstellung und darf den Versuchsschritt nicht erfüllen.

**Korrektur:** Lernheizung mit 0,5-°C-Schritten, locale-tolerantes Textfeld mit Dezimaltastatur und konkreter Bereichsmeldung am Feld. Text, Drehstellung und zugänglicher Wert bleiben auch nach Neuzeichnen synchron. **Regression:** Zahlen und Zeichenfolgen mit Punkt/Komma, leere Eingabe, NaN/Infinity, Grenzen und falsche Schritte; realer 24,5-°C-Versuch und nachfolgender Quest-Abschluss.

### P2 Fremde Werkzeugwerte können beim Laden auf ein anderes Control fallen

**Fundstelle:** `interventionForm` ab Zeile 593: Fallback auf das erste erlaubte Werkzeug bei gleichzeitiger Wiederverwendung von `session.study.value`; Wiederherstellung in `start`.

**Reproduktion aus einem alten Lernstand:** Ein gespeicherter Plan enthält ein inzwischen gesperrtes Werkzeug, beispielsweise Wasserwechsel mit 50. Wird dasselbe Profil mit einer engeren Freigabe geöffnet, fällt die Anzeige auf Licht zurück, verwendet aber weiterhin 50 als Wert. Dieser Wert ist für Licht ungültig. Das ist eine durch den Code bestimmte Wiederherstellungs-Lücke; der vorhandene Browserstand wurde dafür nicht durch injizierte Speicherwerte verändert.

**Korrektur:** Werkzeug und Default gemeinsam abgleichen; alte Planung separat erhalten, tatsächliches Becken und Vergleichsausgangslage nicht ändern. Explizite ungültige Entwürfe nicht als null, Nullwirkung oder gültigen Default ausgeben. **Regression:** Der Test für alte Pläne prüft gesperrtes Werkzeug, unveränderte Tage, alten Futterdefault, unverändertes Original und erhaltene leere Entwürfe.

### P2 Beobachtungszeitraum und Gültigkeit der Einstellung sind nicht erklärt

**Fundstelle:** [learning-student.mjs Zeile 198](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-student.mjs#L198), `learning-ui.mjs` Zeile 626, `runLearningComparison` in `learning-model.mjs`.

**Reproduktion:** Ausprobieren zeigt unmittelbar unter „Heizer“ das Feld „Tage“. Es ist nicht erkennbar, dass damit der Vergleich beobachtet und die Heizung nicht zeitlich befristet wird. Der Kern speichert `setTemp`, `hours`, `feedRate` und `co2Dose` bereits dauerhaft; Wasser, Nährstoffe und Pflanzen werden einmal vor der Simulationsschleife verändert.

**Korrektur:** Kein Tagefeld im Geräteeditor. Die normale Lernansicht hat einen getrennten, einklappbaren Beobachtungszeitraum. Dauerhafte und einmalige Eingriffe sind benannt, ebenso aktuelles Becken und Versuchsbecken. **Regression:** Weiterrechnen erhält Sollwerte, Wasserwechsel werden einmal je Wiederholung aufgerufen und Nährstoffeinträge nicht bei jedem Zeitschritt wiederholt.

### P2 Klasse 9 versteckt die Pflegeeingriffe im normalen Freien Forschen

**Fundstelle:** [learning-student.mjs Zeile 147](https://github.com/Feerson1617/Simulation-Aquarium/blob/b5751b01f826bbf14b26b743155a05e8756c38bd/learning-student.mjs#L147): Bedingung `tag.grade !== 9`; `GRADE_PROFILES[9].tools`.

**Reproduktion:** Klasse 9 → Freies Forschen → Beobachten. Der Bereich „Becken verändern“ fehlt, obwohl das Profil ökologische Werkzeuge enthält. Ausprobieren öffnet stattdessen zu Recht den getrennten Populationsversuch; darüber sind die realen Geräte des Aquariums nicht einstellbar.

**Korrektur:** Gemeinsame Gerätebedienung und Pflegezugang auch für Klasse 9. Die frei verfügbaren Basisgeräte werden konsistent angeboten. Eltern- und Umgebungswahl sowie Generationenzahl behalten passende fachliche Controls; einzelne Quests werden nicht pauschal freigeschaltet. **Regression:** Alle drei freien Jahrgänge wurden mit Vergleich, Messungen, Geräteänderungen und Neuladen geprüft.

### P2 Heizstab modelliert auch aktive Kühlung unter Raumtemperatur

**Fundstelle:** `index.html`, Rechenschritt `Qf`, Ausdruck mit `(i.heater ? i.setTemp : 22) - t.temp`.

**Reproduktion:** Sollwert 20 °C bei 25 °C Wasser setzen und mehrere Tage rechnen. Der alte Kern zieht das Wasser unter die fest implizierte Raumtemperatur von 22 °C in Richtung 20 °C. Ein Heizstab kann keine aktive Kühlung erzeugen.

**Korrektur:** Vereinfachter Newton-Wärmeaustausch; Ziel ist mit Heizung mindestens die Raumtemperatur, ohne Heizung die Raumtemperatur. Exponentieller Zeitschritt, kein sofortiger Sprung des Wasserwerts. Modellrevision `learning-devices-3` unterscheidet neue Daten von historischen Ergebnissen. **Regression:** Erwärmung und Abkühlung sind graduell, Kühlung unterschreitet 22 °C nicht, Teilung eines Zeitschritts verändert das Ergebnis nicht. Ein reales Becken blieb nach dem Setzen bei 25 °C und zeigte nach einem Tag 25,3 °C.

## Vollständige Missionsmatrix

„Bestanden“ bedeutet: Beobachtung, Vorhersage, tatsächlicher Versuch beziehungsweise Kreuzung/Genotypansicht, Auswertung und Erklärung wurden über die Oberfläche bis Quest-Schritt 5 durchgeführt. Die Ergebnisantwort wurde anhand der tatsächlich angezeigten Daten geprüft. Die normalen Defaultpfade funktionieren bereits im Ausgangsstand; die Fehlerliste betrifft zusätzlich andere Eingaben und Bedienwege.

| Quest | Tatsächlicher Eingriff | PR Vorschau b5751b0 | Korrektur lokal |
| --- | --- | --- | --- |
| 8-ecosystem | Temperatur | Bestanden | Bestanden, zusätzlich Dezimal- und Abschlussregression |
| 8-oxygen | Licht aus | Bestanden | Bestanden |
| 8-foodweb | tägliche Futtermenge | Bestanden | Bestanden |
| 8-health | Wasserwechsel | Bestanden | Bestanden |
| 8-forest | Licht aus | Bestanden | Bestanden |
| 9-traits | Erbanlagen vergleichen | Bestanden | Bestanden |
| 9-mendel | wirkliche Eltern kreuzen | Bestanden | Bestanden |
| 9-population | mehrere Generationen | Bestanden | Bestanden |
| 9-darwin | Selektionsumgebung und Generationen | Bestanden | Bestanden |
| 10-enrichment | einmalige Nährstoffzugabe | Bestanden | Bestanden |
| 10-carbon | dauerhafte CO₂-Zufuhr | Bestanden | Bestanden |
| 10-restore | Wasserwechsel | Bestanden | Bestanden |
| 10-northsea | einmalige Nährstoffzugabe | Bestanden | Bestanden |
| 10-wadden | Wasserwechsel | Bestanden | Bestanden |

Freies Forschen für 8, 9 und 10: Vergleiche, Zeitfortschritt und Messungen im Ausgangsstand sowie in der Korrektur bestanden. In der Korrektur zusätzlich Heizung 26,5 °C, Filter 40 %, Licht 10 h/Tag und Helligkeit mit Neuladen geprüft. Experten-Szenario: Heizung 24,5 °C, Filter 50 %, Licht 9 h/Tag gespeichert und nach Neuladen eindeutig im selben Szenario wiedergefunden. Freies Spiel: Start und Kauf/Platzierung eines 180-Liter-Beckens geprüft. Tutorial: Einstieg geprüft, kein vollständiger erneuter Acht-Schritte-Durchlauf.

## Tests und Grenzen

Die unveränderte Basis bestand alle 107 Modultests. Die Korrektur besteht alle 117 Modultests und ergänzt zehn gezielte Regressionen in `tests/device-controls.test.mjs`. Sie erhält die vorhandenen Testfamilien. Der [Testlauf](device-controls-evidence/module-tests.log) und die [Browsermatrix](device-controls-evidence/browser-checks.json) liegen mit repräsentativen Screenshots im Repository. Browserbelege wurden im Codex-Browser über echte UI-Aktionen aufgenommen, ohne Questzustände direkt zu setzen. Screenshots liegen je Mission und Modus in der zur Aufgabe gelieferten Belegsammlung. Die Python-Suite `tests/device_controls_browser.py` ist als zusätzliche ausführbare Regression für Maus und emulierten Touch beigefügt; sie wurde in dieser Sitzung nicht zusätzlich ausgeführt. Vorhandene Python-Suites sind auf die sichtbare Werkzeugauswahl statt des entfernten Dropdowns angepasst.

Das Geräte-Layout wurde im schmalen Browserfenster mit 848 × 477 Pixeln geprüft, die ursprüngliche Vorschau auch mit 1280 × 720 Pixeln. Der Regler verwendet mindestens 48-Pixel-Tasten und einen 96-Pixel-Drehknopf. Ein physisches iPad mit Safari sowie Hochformat/Querformat auf diesem Gerät wurden nicht getestet; dafür ist vor einer Unterrichtsfreigabe eine Geräteabnahme nötig.

Im älteren Experten-Szenario „Ein Becken – viele Beziehungen“ werden sowohl vorher als auch nachher zwei aus Platzgründen nicht dargestellte Objekte gemeldet. Bei schnellen lokalen Szenenwechseln wurden außerdem einzelne `Failed to fetch`-Meldungen für Guppy-/Amano-Modelle erfasst. Diese Meldungen sind nicht als behobene Eingabeprobleme ausgewiesen. Die normale 3D-Szene und die Geräte blieben sichtbar, es gab keinen weißen oder einfarbigen Startbildschirm. Der gespeicherte Konsolenauszug der geprüften öffentlichen Vorschau enthielt keine entsprechenden Fehler.

Die Korrektur verändert keine Datei `AGENTS.md`, keine Cloud-Dienste, keine Konten und keine Lizenzbedingungen. Sie wird nur auf dem bestehenden PR-Branch bereitgestellt. main und die öffentliche Hauptversion bleiben bis zu einer späteren Freigabe durch den Projektinhaber unverändert.
