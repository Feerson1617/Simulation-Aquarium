# FINALER KORREKTURAUFTRAG – Simulation Aquarium / PR #9

## 1. Auftrag und verbindliche Ausgangslage

Du sollst das Projekt **Simulation-Aquarium** jetzt zu einer technisch stabilen, für den Unterricht einsetzbaren Version führen. Es handelt sich ausdrücklich um eine gezielte Abschlusskorrektur und **nicht um eine neue Entwicklungsphase**.

Repository: `Feerson1617/Simulation-Aquarium`  
Bestehender Branch: `feature/coherent-learning-workspaces`  
Bestehender Pull Request: `#9`  
Unabhängig geprüfter HEAD: `5b661044cc85f640518572b5cd8fb4974d9d213b`

Vorliegende Prüfbasis: `Aquarium-Korrekturpaket-5b661044.zip`, mit unabhängig erstellten Fehlernachweisen, Screenshots, Kompatibilitätsdateien und dem ausführlichen Work-Korrekturprompt.

Die unabhängige Abschlussprüfung vom 23.10.2026 hat die sechs Pflichtmissionen in Chromium und WebKit erfolgreich vollständig durchgespielt. F01–F12 gelten innerhalb des dokumentierten Prüfumfangs als bestanden. Sie dürfen nicht durch neue Änderungen beschädigt werden.

**Dein Ziel ist, die drei verbleibenden Fehler R01, R02 und R03 zu beseitigen, die betroffenen und angrenzenden Funktionen selbst im Browser zu überprüfen und einen abschließenden belastbaren Freigabebericht vorzulegen.**

Prüfe vor Beginn den tatsächlichen HEAD, den PR-Status und die veröffentlichte PR-Vorschau. Bei inzwischen verändertem Code dokumentiere den Unterschied und passe deine Arbeit an den realen Stand an.

Arbeite auf dem bestehenden Branch und aktualisiere PR #9. Erstelle keinen unnötigen zweiten PR. **Kein automatischer Merge nach `main`.**

## 2. R01 – Historischer CSV-Export (verbindlich beheben)

**Fehler:** Eine gültige historische Klasse-8-Ergebnisdatei lässt sich im Lehrkraftbereich anzeigen, aber nicht als CSV exportieren. Es erscheint `Cannot read properties of undefined (reading '1')`.

Reproduktionsdateien im Repository:

- `tests/fixtures/learning-v1-grade-8.json`
- `tests/fixtures/learning-v1-grade-9.json`

Betroffene Funktionen in `learning-model.mjs`: `comparisonCSV`, `measurementCSV` und die Behandlung historischer Messdefinitionen.

Die frühere Klasse-8-Datei enthält eine Messgrößenliste mit `fishAlive`, deren historische Bedeutung nicht ausreichend dokumentiert ist. Die neue Anzeige behandelt diese Werte bereits vorsichtig, der CSV-Export greift aber auf eine fehlende Definition zu.

**Anforderungen:**

1. Verwende für historische Messgrößen eine konsistente, sichere Behandlung in Anzeige und Export.
2. Historisch unbekannte Werte bleiben ausdrücklich unbekannt. Sie dürfen weder durch aktuelle Werte ersetzt noch als Null dargestellt werden.
3. Tatsächlich gemessene Nullwerte bleiben numerisch 0.
4. Bekannte Messwerte, Einheiten, Modellzeiten und Herkunftsinformationen bleiben erhalten.
5. Historische Originaldateien dürfen nicht verändert werden.
6. Vergleichs- und SVG-Export müssen ebenfalls funktionsfähig bleiben.
7. Ungültige Dateien dürfen weiterhin keine scheinbar gültige vorherige Produktansicht zurücklassen.

**Pflichtnachweise:** Beide Originaldateien über den tatsächlichen Dateiöffner importieren, CSV wirklich herunterladen, Inhalt programmatisch gegen die Ausgangsdaten prüfen. Klasse 8 mindestens mit Sauerstoff und historisch unbekannter Fischzahl testen; Klasse 9 als erfolgreiche Kontrollprobe.

Erstelle zusätzlich gezielte automatisierte Regressionstests.

## 3. R02 – Scrollposition im historischen Leser (verbindlich beheben)

**Fehler:** Beim Wechsel der Messgröße wird das Lehrkraftpanel vollständig neu gerendert und springt zurück nach oben. Das bearbeitete Auswahlfeld ist danach nicht mehr sichtbar.

Untersuche insbesondere `learning-ui.mjs`, das Neurendern der Lehrkraftansicht und die Behandlung von Scrollposition beziehungsweise Fokus.

**Anforderungen:**

- Nach Auswahl einer anderen Messgröße bleiben Auswahlfeld und zugehörige Messdarstellung sinnvoll erreichbar.
- Die zuvor gewählte Messgröße bleibt erhalten.
- Tastaturfokus, Maus- und Touch-Bedienung bleiben konsistent.
- Keine globale Scrollsperre oder Sonderlösung, die andere Dialoge beeinträchtigt.

**Pflichtnachweise:** Reale Bedienung mit der V1-Klasse-8-Datei, vor und nach dem Messgrößenwechsel, mindestens auf Desktop und Tablet-Hochformat.

## 4. R03 – Offline-Navigation der eigenständigen HTML-Datei

**Nachgewiesener Fehler:** Die vom Spiel selbst erzeugte eigenständige `Aquarium.html` funktioniert bei direktem lokalem `file:`-Start. Wird sie dagegen über HTTP vollständig geladen und danach die Netzwerkverbindung deaktiviert, scheitert ein interner Missionswechsel an einem neuen Dokumentaufruf.

Nachgewiesen:

- Chromium: M1 → Missionsauswahl → M2, anschließend `ERR_INTERNET_DISCONNECTED`.
- WebKit: Missionsauswahl → M6, anschließend fehlgeschlagener Dokumentaufruf.

Die Ursache liegt unter anderem in Query-Links aus `single-learning-ui.mjs`. `createStandaloneDocument` in `aquascaping.mjs` bettet Ressourcen ein, ermöglicht aber nicht automatisch einen internen Ansichtswechsel ohne erneuten Dokumentabruf.

### Erwartetes Verhalten

In einer vollständig geladenen eigenständigen HTML-Datei sollen interne Spielansichten ohne erneuten HTTP-Dokumentabruf erreichbar sein.

Prüfe eine möglichst kleine, wartbare, lokale Routinglösung.

Berücksichtige sämtliche internen Wege:

- Hauptmenü und alle sechs Missionen M1–M6
- Freies Forschen für Klasse 8, 9 und 10
- Tutorial und Expertenmodus
- Historische Lehrkraftwerkzeuge
- Rückkehr zur Missionsauswahl
- Wiederholte Wechsel zwischen diesen Ansichten

Erhalte direkte Online-Einstiegslinks, normale GitHub-Pages-Navigation und den nachgewiesenen funktionierenden lokalen `file:`-Start. Browser-Zurück/Vorwärts soll konsistent funktionieren, soweit es die gewählte Routinglösung unterstützt.

Ein bloßer Austausch einzelner `href`-Attribute reicht nicht, wenn dadurch lediglich eine andere Art fehlerhafter Navigation entsteht.

### Besonders wichtig: Lebenszyklus und Datensicherheit

Beim internen Wechsel einer Spielansicht müssen gegebenenfalls:

- laufende Simulationsintervalle korrekt angehalten werden;
- aktuelle Spielzustände zuverlässig gespeichert werden;
- nicht mehr benötigte Ereignisbehandler entfernt werden;
- Animationen und Render-Loops beendet werden;
- überflüssige WebGL-Ressourcen und Renderer fachgerecht freigegeben werden;
- alte Szenenreferenzen und Eingabezustände verworfen werden;
- die bereits vorhandenen getrennten Speicherplätze und historischen Ergebnisse erhalten bleiben.

Es dürfen keine doppelten Simulationsprozesse, mehrfach reagierenden Schaltflächen, wachsenden Listener-Bestände oder konkurrierenden 3D-Ansichten entstehen.

Testweise mehrfach zwischen den Modi wechseln und überprüfen, dass Ressourcen und Zustände korrekt behandelt werden.

Keine künstlichen `completed`-Zustände, keine Manipulation der gespeicherten Untersuchungsdaten.

Die HTML-Datei muss weiterhin eine einzige lokal ausführbare Datei ohne erforderlichen CDN-Zugriff, Account oder zusätzliche Runtime-Dateien bleiben.

**Wichtige Umfangsgrenze:** Der nachgewiesene Offline-HTTP-Fall ist ein spezielles Nutzungsszenario. Er rechtfertigt keine unkontrollierte Neugestaltung der gesamten Simulation. Bevorzuge eine kleine, robuste Lösung. Falls ausschließlich eine tiefgreifende und regressionsgefährdende Architekturänderung möglich erscheint, dokumentiere diesen Konflikt ausdrücklich, statt das funktionierende Spiel durch einen ungeprüften Großumbau zu gefährden.

Ein vollständiger Browser-Neuladevorgang bei abgeschaltetem Netz ist nicht automatisch Teil dieses Abnahmekriteriums. Entscheidend ist zunächst der interne Wechsel in der bereits geladenen Datei.

### Pflichtnachweise

1. Neue Standalone-Datei durch die tatsächliche Downloadfunktion des Spiels erzeugen. Größe und neuen SHA-256-Hash dokumentieren.
2. Über HTTP laden, vollständig starten, danach den Browserkontext offline schalten.
3. Alle sechs Missionen und die genannten übrigen Spielansichten über reale Oberflächeneingaben erreichen.
4. Mindestens M1 und eine weitere Mission unter diesen Offline-Bedingungen vollständig spielen.
5. In Chromium und WebKit mit echten Maus-/Touch-Ereignissen prüfen.
6. Tatsächliche interne Dokument- und Assetanforderungen sowie Fehler protokollieren.
7. Direkten lokalen Datei-Start und normale Online-Navigation anschließend erneut überprüfen.

Die frühere Standalone-Datei hatte etwa 151 MB. Nach Änderungen wird sich ihr Hash erwartungsgemäß ändern. **Die generierte große HTML-Datei nicht unnötig in Git einchecken.**

## 5. Absoluter Schutz des funktionierenden Spielumfangs

Die folgenden bereits geprüften Funktionen dürfen weder entfernt noch fachlich verfälscht werden:

**Sechs Schüler-Missionen:** Alle Kernmissionen behalten ihre vollständigen Abläufe, Beobachtungen, Fehlantworten, Hilfen, Wiederholungen, Speicherung und Ergebnisse.

**Biologie:** Sauerstoffhaushalt, Photosynthese, Zellatmung, Zersetzung, Nährstoffumwandlung, Genetik, Drift, gerichtete Elternwahl und Kohlenstoffkreislauf müssen ihre bisherigen fachlich korrekten Modellmechanismen behalten. Keine Anpassung biologischer Raten, um gewünschte Ergebnisse zu erzwingen.

**Genetik:** AA×aa, Aa×Aa, F1/F2, Individuenidentitäten, echte Elternnachweise und zufällige Nachkommensverteilungen erhalten. Keine künstlichen 3:1-Ergebnisse.

**Aquarium und Grafik:** Ein aktuelles Hauptaquarium pro Schülerweg. Echte 3D-Objekte, Auswahl von Tieren/Pflanzen, Maßstab und bisherige Kollisionsregeln beibehalten. Keine neue Grafikoptimierungs- oder Modellierungsphase.

**Pinzette:** Erfolgreiches Platzieren, absichtliche Kollision und verständliche Rückmeldung mit Maus und Touch weiterhin funktionsfähig.

**Freies Forschen / Expertenmodus:** Katalog, Geräte, Wasserwechsel, Zeitentwicklung, Fortpflanzung, fünf vorbereitete Szenarien und Ökosystemanalyse beibehalten.

**Tutorial:** Alle acht Schritte müssen weiterhin vollständig durchführbar sein.

**Daten:** Alte Spielstände, 14 historische Aquarium-Dateien, die beiden V1-Lernprodukte und neue Missionsexporte bleiben kompatibel. Gespeicherte Daten nicht umschreiben oder durch neu berechnete Ersatzwerte verfälschen.

## 6. Verbindliche Abschlussprüfung

Nach den Korrekturen sind folgende Prüfungen zwingend:

**A. Automatisierte Tests**
- Sämtliche bestehenden Modultests erneut ausführen.
- Eigene gezielte Regressionstests für R01, R02 und R03 ergänzen.
- Fehlgeschlagene Tests nicht löschen, deaktivieren oder durch schwächere Assertions ersetzen.
- Keine Tests durch künstliche Abschlusszustände oder manipulierte Modelldaten grün machen.

**B. Tatsächliche Browsertests**
- Alle sechs Missionen in Chromium und WebKit, einschließlich realer Eingaben, Hilfen, Fehlantworten, Zeit- beziehungsweise Generationsfortschritt und Abschlüssen.
- Echte Datei-Exporte und Reimporte.
- Freies Forschen 8/9/10.
- Vollständiges Tutorial.
- Expertenmodus und fünf Szenarien als mindestens gezielte Smoke-Tests mit realen Spielhandlungen.
- Pinzette und Szenentreffer auf 1366×960, 768×1024 und 1366×1024.
- Historische Importe und Exporte einschließlich unbekannter Werte.
- Neue Offline-Navigation und wiederholte Ansichtswechsel.

**C. Unabhängige technische Kontrolle**
- Browserkonsole und fehlgeschlagene Ressourcenanforderungen prüfen.
- Laufende Simulationen nach Ansichtswechseln kontrollieren.
- Trennung der Speicherstände nach Mission und Spielmodus belegen.
- Unveränderte Vorher-/Nachher-Screenshots mit URL, HEAD, Zeitpunkt und Viewport bereitstellen.
- Tatsächliche heruntergeladene CSV-/JSON-Dateien unabhängig gegen ihre Quelldaten auswerten.

Ein bestandener Modultest allein ist kein Beweis für eine erfolgreich bedienbare Oberfläche. Ein Screenshot allein ist kein Beweis für einen funktionierenden Datei-Download.

## 7. Abschluss und Freigaberegeln

Liefere nach deiner tatsächlichen Arbeit:

1. Eine kurze Übersicht aller Codeänderungen mit Begründung.
2. Den finalen Commit, Branch und Link zum aktualisierten PR #9.
3. Eine übersichtliche Tabelle für R01, R02 und R03 mit Status **bestanden / fehlgeschlagen / nicht geprüft** und konkretem Nachweis.
4. Testergebnisse der bestehenden und neuen Regressionstests.
5. Echte Browserbelege für die korrigierten Probleme sowie die wichtigsten geschützten Schülerwege.
6. Eine Liste eventuell weiterhin offener Probleme, ausdrücklich nach Schwere und Auswirkung auf den Unterricht getrennt.
7. Eine begründete Aussage, ob du den Stand aus technischer Sicht zur Freigabe empfiehlst.

Prüfgrenzen bleiben Prüfgrenzen. Eine Browser-Touchsimulation ist kein physisches iPad. Ohne reale Lerngruppe darf keine empirisch bestätigte Unterrichtswirksamkeit behauptet werden.

**Verbindliche Regeln:**

- Keine neuen Funktionen außerhalb dieser Korrekturen.
- Keine kosmetische Komplettüberarbeitung.
- Keine Veränderung biologischer Ergebnisse zum Bestehen von Tests.
- Keine stillschweigende Änderung historischer Daten.
- Keine Veröffentlichung zusätzlicher kostenpflichtiger Dienste.
- Keine Behauptung einer vollständigen Freigabe bei offenen Pflichtfehlern.
- Kein Merge nach `main` ohne meine ausdrückliche Freigabe.

**Das Projekt befindet sich in der Abschlussphase. Arbeite die konkreten Aufgaben vollständig ab, prüfe das tatsächlich laufende Spiel und liefere einen belastbaren Endstand statt einer weiteren Entwicklungsplanung.**