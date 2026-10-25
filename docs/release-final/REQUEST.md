# VERBINDLICHE ABSCHLUSSANWEISUNG – AQUARIUM 1.0

## Ziel: Den Release-Kandidaten jetzt fertigstellen

Diese Anweisung ergänzt den beigefügten `Codex-Pruef-und-Korrekturprompt.txt` und hat bei Widersprüchen Vorrang.

Arbeite im bestehenden Repository `Feerson1617/Simulation-Aquarium`, Branch `feature/coherent-learning-workspaces`, PR #9.

Zuletzt unabhängig geprüfter HEAD: `00b9f7874e18646786e6e9d273f3abc9d9c3feec`.

Stelle den aktuellen HEAD vor Beginn erneut fest.

**Deine Aufgabe ist nicht mehr die Weiterentwicklung des Spiels, sondern die Beseitigung des letzten bestätigten Fehlers, das Schließen entscheidender Nachweislücken und die Fertigstellung eines freigabefähigen Release-Kandidaten 1.0.**

Du bist ausdrücklich autorisiert, notwendige gezielte Fehlerkorrekturen zu implementieren, zu testen, zu committen und auf den bestehenden PR-Branch zu übertragen. Kein Merge nach `main` ohne meine ausdrückliche Zustimmung.

## A. Bereits nachgewiesene Ergebnisse anerkennen

Die unabhängige Work-Prüfung bestätigt auf aktuellem HEAD:

- 202 bestandene Modultests.
- 24 erfolgreiche WebKit-Offline-Navigationsrunden.
- Vier vollständig gespielte Missionen M1–M4 einschließlich Download, neuem Versuch und Reimport.
- Behebung von U01.
- Korrekte Einbettung aller 476 Ressourcen der Einzeldatei.
- Keine nachgewiesenen neuen P0-, P1- oder P2-Spieldefekte in den überprüften Wegen.

Diese Nachweise dürfen berücksichtigt werden. Insbesondere die 24 Navigationsrunden müssen nicht ohne konkreten Anlass immer wieder neu erzeugt werden.

Die späteren Startabbrüche von Chromium und WebKit erfolgten vor dem Laden einer Spiel-URL. Behandle sie nicht ohne zusätzliche Belege als Programmfehler.

## B. K01 gezielt korrigieren

Behebe den bestätigten Fokusfehler im M4-Elterndialog in `single-classroom-ui.mjs`.

Die aktuelle Tastatur-Fokusbegrenzung ignoriert `select` und `input`.

Anforderungen:

1. Berücksichtige sämtliche tatsächlich sichtbaren, aktivierten und fokussierbaren Bedienelemente.
2. Versteckte Datei-Eingabefelder, deaktivierte Elemente, `inert` und negative Tabindizes dürfen nicht versehentlich in den Fokusumlauf gelangen.
3. Tab und Shift+Tab bewegen sich innerhalb des geöffneten Dialogs korrekt.
4. Escape schließt den Dialog und gibt den Fokus an den ursprünglichen Öffner zurück.
5. Beim Wechsel des archivierten Versuchs oder der Generation bleibt die Auswahl bedienbar.
6. Keine Veränderung von Eltern-, Nachkommen-, Allel- oder Archivdaten.

Ergänze passende Regressionstests und prüfe die tatsächliche Tastaturbedienung in Chromium und WebKit.

**Dies ist eine kleine UI-Korrektur. Kein Umbau der Dialogarchitektur, sofern nicht zwingend erforderlich.**

## C. Die zwei noch fehlenden Missionen abschließend prüfen

### M5 – Reicht ein Wasserwechsel?

Spiele die Mission auf dem aktuellen HEAD vollständig.

Prüfe Wasserwechsel und geringeren Futtereintrag aus identischem Ausgangszustand, unmittelbare und spätere Veränderungen, Pause/Wiederaufnahme, typische Fehlantworten, Rückmeldungen, Abschluss und echten Export/Reimport.

Rechne die Ausgangszustände und die gespeicherten Ergebnisse unabhängig nach.

### M6 – Woher kommt der Kohlenstoff?

Wähle eine konkrete Pflanze im tatsächlichen Aquarium aus und prüfe Art, UID, Markierung, individuelle Anfangsreferenz, Wachstum, Pause/Wiederaufnahme und Export/Reimport.

Prüfe die fachliche Unterscheidung zwischen beobachtetem Wachstum und der modellgestützten Erklärung der Kohlenstoffquelle. Öffne den fossilen Transfer und teste Fehlantworten einschließlich Korrektur.

Die frühere Anubias-Datei darf nicht als neu erzeugter aktueller Durchgang ausgegeben werden.

**Nach M6 ist eine zusätzliche echte Spielhandlung durchzuführen.** Das Spiel muss danach weiterhin bedienbar sein, einen Stand speichern und diesen korrekt wieder einlesen können.

## D. Regressionsprüfungen intelligent abschließen

Die vorliegenden umfassenden historischen Tests werden nicht grundlos komplett neu durchgeführt.

Unterscheide zwischen:

- unverändertem biologischem Code mit bestehenden Tests und eigenen früheren Browserbelegen;
- aktuell geänderter Oberfläche beziehungsweise Offline-Hülle, für die neue Browserprüfungen erforderlich sind;
- tatsächlich noch nicht geprüften Funktionen.

Für die aktuelle Webversion sind die sechs Missionen in Chromium und WebKit zu prüfen. Für M1–M4 genügen gezielte neue Regressionen unter Berücksichtigung der bereits vollständigen aktuellen WebKit-Durchläufe. M5 und M6 sind wie oben vollständig zu absolvieren.

Zusätzlich gezielt prüfen:

- Vollständiges Acht-Schritte-Tutorial.
- Freies Forschen für Klasse 8, 9 und 10.
- Expertenmodus und alle fünf Szenarien.
- Speicherung und Wiederherstellung.
- Historische Klasse-8-/9-Lernprodukte sowie die 14 älteren Aquariumdateien.
- Pinzette: erfolgreiche Verschiebung und abgewiesene Kollision.
- M4-Elternarchiv und neue Tastaturkorrektur.
- Sichtbarkeit und direkte Auswahl von Pflanzen/Fischen bei Desktop und Tablet-Hochformat.

Wo die Kernmodule nachweislich unverändert sind, dürfen vorhandene automatisierte Regressionstests und frühere unabhängige Belege mit ergänzenden aktuellen Smoke-Tests kombiniert werden.

Keine erfundenen Browserhandlungen oder Abschlusszustände.

## E. Prüfungsumgebung zuverlässig gestalten

Die vorherige Work-Sitzung litt unter erheblichem Ressourcenmangel.

Für die Abschlussprüfung:

- Einen frischen, funktionsfähigen Browserkontext verwenden.
- Große Standalone-Builds und Prüfsummenberechnungen nicht gleichzeitig mit umfangreichen Browserläufen ausführen.
- Ausreichenden freien Festplattenspeicher sicherstellen.
- Keine unnötig umfangreichen Screenshots, HARs oder DOM-Snapshots pro Animationsframe erzeugen.
- Keine fremden Prozesse ohne Berechtigung beenden.
- Bei einem Browserstartfehler vor dem Laden irgendeiner URL zunächst die Testumgebung prüfen und gegebenenfalls eine frische Umgebung verwenden.

Die bessere Modellleistung von Astra ersetzt keine tatsächlich funktionierenden Browserwerkzeuge.

Falls eine Umgebung erneut unbrauchbar wird, dokumentiere dies sauber und verwende eine andere verfügbare, geeignete Prüfumgebung. Keine Implementierungsänderung allein aufgrund eines nicht startenden Testbrowsers.

## F. Onlineversion und Offline-Einzeldatei getrennt freigeben

Die normale GitHub-Pages-Version ist das Hauptprodukt für den Unterricht.

Die 151-MB-Standalone-HTML ist eine zusätzliche lokale Backup-Variante.

**Webversion 1.0 ist freigabefähig, wenn:**

1. Alle 202 bestehenden Tests und neue relevante Regressionstests bestanden sind.
2. Alle sechs Missionen auf aktuellem Code vollständig und korrekt funktionieren.
3. Tutorial, Freies Forschen, Expertenmodi und Speicherung ohne nachgewiesene schwerwiegende Probleme funktionieren.
4. K01 behoben und getestet ist.
5. Keine reproduzierbaren P0-, P1- oder P2-Fehler in den vorgesehenen Unterrichtsabläufen verbleiben.
6. Die ausgelieferte PR-Vorschau dem tatsächlich geprüften Code entspricht.
7. Chromium und WebKit auf der normalen Webversion keine reproduzierbaren blockierenden Ausfälle zeigen.

Für die Offline-Einzeldatei zusätzlich die lange WebKit-Navigation berücksichtigen. Der neue 24-Runden-Nachweis ist positiv. Prüfe insbesondere die Wiederherstellung nach längerer Nutzung und mindestens eine neue Spielhandlung nach Abschluss der letzten Mission.

Falls ein ausschließlich auf die Standalone-Variante beschränkter Langzeitfehler verbleibt, diesen dokumentieren und das Offline-Produkt gegebenenfalls nur eingeschränkt freigeben.

**Ein solcher isolierter Standalone-Fehler blockiert nicht automatisch die unabhängig stabil nachgewiesene GitHub-Pages-Version.**

Ein auf der normalen Webversion reproduzierbarer schwerwiegender Defekt bleibt dagegen ein Freigabeblocker.

## G. Release Freeze

Ab sofort ausdrücklich untersagt:

- Neue Spielmechaniken oder Missionen.
- Neue Arten oder grafische Modelle.
- Änderung biologischer Raten oder genetischer Wahrscheinlichkeiten.
- Unnötige Änderung der Speicherformate.
- Umfangreiche UI-Neugestaltungen.
- Neue optionale Features.
- Neue unabhängige Prüfaufträge ohne konkreten Befund.
- Ein weiterer Pull Request anstelle von PR #9.

Erlaubt sind ausschließlich konkrete Fehlerkorrekturen, notwendige Regressionstests und kleine Release-Dokumentationsänderungen.

Keine 151-MB-HTML-Datei und keine riesigen neuen Browserbelegpakete unnötig ins Git-Repository übernehmen.

## H. Fertige Version 1.0 abliefern

Nach Abschluss:

1. Committe die notwendigen Änderungen auf dem bestehenden Branch und aktualisiere PR #9.
2. Stelle sicher, dass die aktuelle PR-Vorschau den endgültigen Code enthält.
3. Lege einen kurzen Release-Bericht mit aktuellem Commit, bestandenem Testumfang und gegebenenfalls verbleibenden Einschränkungen vor.
4. Erstelle eine Release-Checkliste für den Einsatz auf Desktop und iPad.
5. Bereite die Veröffentlichung über GitHub Pages vor, einschließlich kurzer Anleitung zum anschließenden Merge.
6. Gib eine eindeutige Freigabeentscheidung ab.

Das Abschlussurteil muss lauten:

**WEBVERSION 1.0: FREIGABEFÄHIG / BLOCKIERT**

**STANDALONE-HTML: FREIGABEFÄHIG / EINGESCHRÄNKT / BLOCKIERT**

**IPAD-/SAFARI-HARDWARETEST: BESTANDEN / NICHT GEPRÜFT / FEHLGESCHLAGEN**

Bei jedem tatsächlichen Blocker dessen Reproduktion, Auswirkungen und kleinste erforderliche Korrektur angeben. Keine hypothetischen Verbesserungen als neue Pflichtaufgaben deklarieren.

Wenn alle Web-Freigabekriterien bestanden sind, beende die Entwicklung und erkläre PR #9 ausdrücklich für bereit zur Freigabe durch den Projektinhaber.

**Wichtig: Nicht selbst mergen.**

## Abschließende Zielvorgabe

Wir wollen eine fachlich korrekte, stabile, bedienbare und veröffentlichbare Unterrichtssimulation 1.0.

Perfektionierung, Fotorealismus-Ausbau und künftige Erweiterungen gehören nicht mehr in diesen Release.

Erledige die letzte konkrete Korrektur, schließe die maßgeblichen Testlücken und liefere den fertigen Release-Kandidaten.

**Keine weitere allgemeine Entwicklungsrunde und keine neue unpriorisierte Mängelliste.**