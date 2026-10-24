# SIMULATION AQUARIUM – LETZTE STABILISIERUNG UND RELEASE V1.0

## Ziel: Projekt jetzt abschließen

Wir befinden uns im Release-Freeze. Die Spielentwicklung und die fachlich-didaktische Ausgestaltung sind abgeschlossen. Keine neuen Features, keine umfangreichen Neugestaltungen und keine erneute allgemeine Entwicklungsphase.

**Deine Aufgabe ist, die letzten Stabilitätsprobleme gezielt einzugrenzen, gegebenenfalls zu korrigieren und das Projekt zur endgültigen Veröffentlichung vorzubereiten.**

Repository: `Feerson1617/Simulation-Aquarium`  
Branch: `feature/coherent-learning-workspaces`  
PR: `#9`  
Zuletzt unabhängig geprüfter HEAD: `3e6394bf29d21fa8cc685855a84bcc2eb06f57a4`

Nutze die unabhängige Nachprüfung vom 24.10.2026 und das beigefügte Kompaktpaket. Ermittle vor der Arbeit den tatsächlichen aktuellen HEAD.

## 1. Bestehende Ergebnisse ausdrücklich akzeptieren

R01 (historischer CSV-Export), R02 (Scrollposition), R03 (Offline-Navigation) und die bisherigen F01–F13-Prüfbereiche gelten im jeweils nachgewiesenen Umfang als bestanden.

Alle sechs Missionen wurden in Chromium und WebKit online und offline mehrfach vollständig durchgespielt. Biologische Daten und Ergebnisse sind geprüft.

Implementiere diese Funktionen nicht erneut. Verändere weder biologische Modellparameter, Genetik, Zufall, Artgrößen, Szenarien, Lernaufgaben noch bestehende Speicherformate.

Neue Arbeiten sind ausschließlich für W01, U01 und die finale Release-Absicherung erlaubt.

## 2. W01: WebKit-Stabilitätsproblem – gezielte Ursachenanalyse

Das unabhängige Prüfpaket belegt wiederholte Ausfälle bei längeren Sitzungen mit der 151-MB-Standalone-Datei. Insbesondere etwa zehn M2/M6-Missionswechsel führten in WebKit zum nicht mehr antwortenden Browserinhalt.

Der Testrechner hatte 8 GiB RAM. Während der Prüfung stieg die systemweite Swap-Nutzung bis etwa 11,3 GB. Diese Messung allein belegt kein Software-Speicherleck.

**Konkreter technischer Verdacht, den du prüfen sollst:**

`standalone-navigation.mjs` erzeugt beim Missionswechsel jeweils ein neues iframe und schreibt darin über `document.write()` erneut die gesamte eingebettete Anwendung.

Untersuche, ob das wiederholte Parsen und Initialisieren des etwa 151 MB großen Dokuments dazu führt, dass WebKit Ressourcen nicht schnell genug freigibt beziehungsweise unnötig viele Kopien im Speicher entstehen.

Verlasse dich nicht allein auf Lifecycle-Zähler, die nach `dispose()` null anzeigen. Ermittle soweit möglich die tatsächlich beobachtbare Speicherbelastung.

### Verbindliche Eingrenzung

Vergleiche unter identischen Browser- und Grafikeinstellungen folgende Fälle:

A. Normale GitHub-Pages-Version, online.

B. Einzeldatei über HTTP geladen, Netzwerk bleibt eingeschaltet.

C. Einzeldatei einmal über HTTP geladen, anschließend Netzwerk deaktiviert.

D. Einzeldatei direkt lokal per `file:` geöffnet, soweit die Testumgebung es zulässt.

Nutze Chromium und WebKit. Beginne mit einem einzelnen Browserprozess und einer ressourcenschonenden Prüfung. Achte auf ausreichenden freien Arbeits- und Swap-Speicher.

Für den Vergleich M2 und M6 abwechselnd starten, zum Hauptmenü zurückkehren und fortfahren. Beginne mit mindestens zwölf Wechselrunden, da die bisherigen Fehler nach ungefähr zehn auftraten.

Erfasse Ressourcenstände vor der Prüfung, während der Wechsel und anschließend. Ermittle nach Möglichkeit die tatsächliche Speicherbelastung der betroffenen Browser-/WebContent-Prozesse. Systemswap allein reicht nicht.

**Wichtig für die Testmethodik:**

- Keine tiefen Snapshot-Abfragen in jedem Animationsframe.
- Keine vollständigen DOM-Serialisierungen je Wechsel.
- Screenshots nur an aussagekräftigen Kontrollpunkten, nicht ständig.
- Testskripte dürfen nicht selbst unnötige Speicherkopien erzeugen.
- Keine zusätzlichen parallelen Browserinstanzen bei der grundlegenden Diagnose.
- Ressourcenengpässe oder ENOSPC ausdrücklich dokumentieren.

Falls der Fehler weiterhin auftritt, unterscheide zwischen tatsächlichem Anwendungscodefehler, WebKit-spezifischer Dokumentfreigabe, speicherbegrenzter Testumgebung und Werkzeugproblem.

### Reparatur

Falls die Neuanlage des vollständigen Anwendungsdokuments Ursache oder wesentlicher Verstärker ist, wähle die kleinste sichere Lösung, die wiederholtes Parsen oder Kopieren des riesigen Bundles vermeidet.

Prüfe beispielsweise, ob eingebettete Ressourcen wiederverwendet werden oder die bereits initialisierte Laufzeit kontrolliert zwischen Spielansichten wechseln kann.

Diese Beispiele sind keine Pflichtarchitektur. Entscheidend ist eine nachweislich stabile, wartbare Lösung.

Eine solche Änderung muss ausdrücklich sicherstellen:

- Kein Verlust gespeicherter Missionsstände.
- Keine mehrfach aktiven Simulationen.
- Keine zusätzlichen aktiven Renderer oder WebGL-Kontexte.
- Keine weiterlaufenden Timer verlassener Ansichten.
- Keine unkontrollierten Eventlistener.
- Keine Veränderung der biologischen Spielmechanik.
- Unveränderte externe Navigation der normalen GitHub-Pages-Version.

Keine grafischen Modelle löschen, keine Arten entfernen und keine biologischen Prozesse abschalten, um die Speicherbelastung künstlich zu senken.

**Verhindere einen unverhältnismäßigen Umbau der funktionierenden Webanwendung.** Wenn die Sonderanforderung an die Standalone-Datei nicht ohne erhebliche Regressionen lösbar ist, muss sie als separate technische Einschränkung behandelt werden.

## 3. U01: Hilfeschaltfläche im Tablet-Hochformat

Behebe den nachgewiesenen kleinen Bedienfehler in M1 bei 768×1024.

Nach Auswahl der Wasserpflanze und Anzeige der drei Vermutungen ist der Tipp-Knopf teilweise verdeckt beziehungsweise nur nach zusätzlichem Scrollen vollständig erreichbar.

Gestalte ausschließlich den benötigten Oberflächenbereich kompakter beziehungsweise verbessere die Positionierung des Tipp-Knopfes.

Pflichtanforderungen:

- Alle drei Vermutungen bleiben gut lesbar.
- Der Tipp-Knopf ist ohne zusätzliche Suche gut erreichbar.
- Touch-Zielflächen bleiben ausreichend groß.
- Das sichtbare Aquarium darf nicht verkleinert werden.
- Keine Änderungen an Grafik, Kamera, Maßstab oder Auswahlmechanik.

Teste 768×1024, 1366×960 und 1366×1024 mit echten Bedienhandlungen. Stelle Vorher-/Nachherbilder bereit.

## 4. Finale Abnahmekriterien der Unterrichtsversion

**Hauptprodukt ist die GitHub-Pages-Version, die Schülerinnen und Schüler auf Desktop und iPad ohne Installation öffnen können.**

Diese Version hat gegenüber der zusätzlichen Offline-HTML Priorität.

Eine Freigabe als Webversion 1.0 setzt voraus:

1. Alle bestehenden automatischen Modultests bestehen.
2. Die sechs Missionen bleiben vollständig spielbar.
3. Tutorial, Freies Forschen und Expertenszenarien bleiben funktionsfähig.
4. Export, Import, Wiederholung und lokale Speicherung funktionieren.
5. Die Onlineversion bleibt bei wiederholter Navigation in Chromium und WebKit funktionsfähig; insbesondere kein reproduzierbarer Ausfall im normalen Unterrichtsweg.
6. Weder die Korrekturen noch die Navigation erzeugen zusätzlichen Datenverlust, unkontrollierte Ressourcenvermehrung oder Konsolenfehler.
7. U01 ist korrigiert.

Prüfe mindestens die betroffenen Navigations- und Speicherregressionen selbst im echten Browser. Verwende bestehende erfolgreiche Work-Nachweise als Referenz, nicht als Ersatz für die eigenen Nachtests des geänderten Codes.

Für die Onlineversion ist ein gezielter längerer Navigations-Stresstest sinnvoll, einschließlich einer echten Spielhandlung und eines Exports nach der letzten Wechselrunde.

## 5. Getrennte Entscheidung über die Offline-HTML

Die eigenständige HTML-Datei ist weiterhin gewünscht und muss als Backup erhalten bleiben.

Prüfe ausdrücklich ihre lokale Grundfunktion, die sechs Missionen, Speichern/Laden und den Wechsel zwischen den wichtigsten Ansichten.

Wenn die lange WebKit-Stressprüfung auf ausreichend ausgestatteter Hardware bestanden wird, kann die vollständige Offline-Unterstützung freigegeben werden.

Falls ausschließlich die sehr große Standalone-Datei bei wiederholten Wechseln unter WebKit und begrenztem Speicher ausfällt, während die normale GitHub-Pages-Version nachweislich stabil bleibt:

- Diesen Fehler keinesfalls als behoben ausgeben.
- Die Hardware- und Nutzungseinschränkung dokumentieren.
- Keine uneingeschränkte Offline-Stabilität versprechen.
- Aber die ansonsten stabile Onlineversion nicht allein deshalb zurückhalten.
- Das verbleibende Risiko und seine praktische Relevanz für Unterrichtsgeräte ausdrücklich bewerten.

Dagegen gilt: **Wenn die reguläre GitHub-Pages-Version in WebKit unter normalen Nutzungsbedingungen denselben Fehler zeigt, bleibt die Veröffentlichung blockiert.**

## 6. Einfrieren, nicht erneut ausbauen

Keine neuen Arten, kein neuer Shop, keine weiteren Unterrichtsmissionen, keine Grafiküberarbeitung, keine neuen Erklärungsfelder, keine zusätzlichen Lehrkraftfunktionen.

Keine neuen groß angelegten Prüfkampagnen außerhalb der genannten Stabilitäts- und Regressionstests.

Die vorhandenen positiven Ergebnisse müssen erhalten bleiben, statt immer neue Erfolgskriterien zu erfinden.

Auch der bisherige Anspruch an Fotorealismus ist kein Anlass für diese Abschlusskorrektur, das funktionierende Spiel erneut umzubauen.

## 7. Release-Kandidat fertigstellen

Nach der letzten Korrektur:

1. Alle relevanten automatischen Tests ausführen.
2. Hauptanwendung tatsächlich im Browser prüfen.
3. Geänderte Funktionen mit aussagekräftigen eigenen Belegen nachweisen.
4. GitHub-Pages-PR-Vorschau aktualisieren und deren ausgelieferte Version überprüfen.
5. Einen kurzen, klaren Release-Bericht anlegen.
6. Versionsstand, Commit und gegebenenfalls SHA-256 der Einzeldatei festhalten.
7. Den bestehenden PR #9 für die endgültige Freigabe vorbereiten.

Der Bericht soll ausdrücklich unterscheiden:

- **Webversion 1.0: FREIGABEFÄHIG oder BLOCKIERT**
- **Standalone-HTML: VOLLSTÄNDIG FREIGABEFÄHIG, EINGESCHRÄNKT oder BLOCKIERT**
- **Physische iPad-/Safari-Abnahme: BESTANDEN oder NOCH NICHT GEPRÜFT**

Begründe jede Entscheidung anhand der tatsächlichen Belege.

Falls die Webversion freigabefähig ist, liefere eine kurze Anleitung, welche letzten Schritte für das Zusammenführen nach `main` und die GitHub-Pages-Veröffentlichung erforderlich sind.

**Kein automatischer Merge. Keine automatische Freigabebehauptung für ungetestete iPads.**

## 8. Schlussanweisung

Das Projekt soll jetzt abgeschlossen werden.

Suche keine neuen optionalen Verbesserungen und eröffne keine weiteren Entwicklungsphasen.

Konzentriere dich vollständig auf W01, U01 und die Veröffentlichungssicherheit der bestehenden Version.

**Liefere am Ende einen fertigen, geprüften Release-Kandidaten und eine eindeutige Freigabeentscheidung – keine neue Wunschliste für weitere Entwicklungsarbeiten.**