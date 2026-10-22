# Wiederaufnahme: zusammenhängende Untersuchungen

Auftrag: [Original](REQUEST.txt), [unabhängiger Prüfbericht](REVIEW.html). Neuer Branch `feature/coherent-learning-workspaces`; Ausgangs-main `8e41962132fe3778fe73f8e14c650f42e18d848d`. PR8 ist nachweislich gemergt. Lokaler Stand war sauber; nichts aus früheren Ausführungen verworfen. Erster gesicherter neuer Commit `d52a4e8`. Der folgende Entwicklungsschritt enthält den laufenden Prototyp; den exakten aktuellen Head liefert `git rev-parse HEAD`.

## Verbindliche Grenze

Masterauftrag Abschnitt15: „Vor dieser Freigabe keine flächendeckende Neugestaltung aller Missionen.“ Es ist noch keine Sichtfreigabe erteilt. Aktueller Umfang: Phase1 Datenidentität / Null-Eingriff und Phase2 Temperaturprototyp. Phasen3–5 sind beauftragt, folgen aber erst nach Sichtfreigabe. Neuer PR mit Vorschau wird für dieses Gate vorbereitet; kein Merge und kein main-Push.

## Bisher umgesetzt

- `learning-context.mjs`: Versuch/Durchgang/Reihe/Wiederholung/Seite/Zeit/Revision und Zustandskennung; tatsächliche kompakte Checkpoints, unveränderliche Auswahlkopien.
- Gespeicherte Ansichten verwenden die gewählte Reihe/Wiederholung. Betrachten übernimmt nicht das aktuelle Spielbecken; explizites Übernehmen ist gesondert.
- Frühe Auswahl steuert Karte/Tabelle/Diagrammzeiger. Alte Zeitpunkte ohne Beckenstand erhalten keine erfundene Szene.
- Typisierte Eingriffsbelege statt Vergleich kompletter JSONs/Journal. Die vorhandene Null-Wasserwechsel-Sonderprüfung wurde bestätigt; der pauschale alte Berichtsbefund ist in diesem main so nicht unverändert reproduzierbar. Wasser0% erzeugt nun auch keinen Kernaufruf/Protokollschein.
- Temperaturprototyp: zwei tatsächliche Becken, vorhandene hochwertige Modelle, ein geteilter WebGL-Kontext, tatsächliche Organismen-IDs, allmähliche Messwerte, gemeinsame Versuchsuhr.
- Neuer Durchgang sichert das frühere Produkt und setzt Population, Belege und Versuche getrennt von Fortsetzen zurück.
- Alle14Missionen in [MISSIONS.md](MISSIONS.md) mit Gegenstand/Handlung/Quelle/Erkenntnis/Fehlerweg/offener Sicht dokumentiert.

## Prüfung / noch laufend

139 bestehende Node-Tests bestanden nach der ersten Integration. Zusätzlich10 neue Kontext-/Archiv-/Null-Eingriff-/Export-/Auflösungsfälle bestanden. Der vollständige neue Chromium-Durchlauf des Temperaturwegs läuft. Danach WebKit und Regressionen; Screenshots vor Freigabe tatsächlich sichten.

WebKit26.5 ist heruntergeladen und startet. Alle19 ELF-Dateien wurden mit den jeweiligen offiziellen Bundle-lib/sys-lib-Verzeichnissen und privaten Debianbibliotheken ohne fehlende Abhängigkeiten geprüft. Upstream MiniBrowser ersetzt LD_LIBRARY_PATH; ein zusätzlicher lokaler Starter erhält den privaten Präfix. Kein Systempaket/keine Berechtigung verändert.

## Fehlende Referenzpakete

Die im Auftrag erwähnten `Simulation-Aquarium-main 2.zip` und `Aquarium-Pruefpaket.zip` liegen hier nicht vor. Deren SHA-Angaben stammen aus den Anhängen, kein eigener ZIP-Hashnachweis. Der aktuelle GitHub-main stimmt exakt mit dem genannten Commit überein. Reproduktionen verwenden diesen Code, die beiden neuen Anhänge und eigene Tests.

## Letzte / nächste Befehle

- `node --test tests/*.test.mjs`
- `python3 tests/coherent_workspace_browser.py`
- WebKit: portabler Starter mit `AQUARIUM_WEBKIT=/workspace/aquarium-devtools/webkit-portable-browser.sh`
- Als Nächstes: Browserbefunde beheben, aktuelle Quellen hashen, repräsentative Bilder sichten, Regression durchführen und neuen PR/Vorschau bereitstellen. Dann konkrete Nutzer-Sichtfreigabe; keine selbst erteilte Freigabe.
