# Gezielte Abschlussprüfungen wiederholen

Nur einen eigenen Testbrowser gleichzeitig starten. Große HTML-Builds und
Dateiprüfsummen außerhalb der Browserläufe erstellen. Die Browser verwenden
isolierte Profile; vorhandene Nutzerspielstände werden nicht verändert.

Voraussetzungen: Node.js, Python, Playwright, Chromium bzw. Playwright-WebKit.
Alle Werkzeuge sind kostenlos. Die Browserprotokolle nennen Version und Umgebung.
Der vorhandene Cloud-WebKit-Wrapper liegt unter
`/workspace/aquarium-devtools/run-webkit.py`; auf einem anderen Rechner kann die
installierte WebKit-Datei über `AQUARIUM_WEBKIT` angegeben werden.

```bash
node --test tests/*.test.mjs

# Ein Entwicklungsserver muss bereits den Projektpfad bereitstellen.
AQUARIUM_URL=http://127.0.0.1:8000/aquarium-simulation/ \
  AQUARIUM_FOCUS_RESULTS=/tmp/aquarium-focus \
  python3 tests/release_final_focus_browser.py

AQUARIUM_URL=https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/ \
  AQUARIUM_CORRECTION_RESULTS=/tmp/aquarium-paths \
  python3 tests/release_final_paths_browser.py

AQUARIUM_TUTORIAL_RESULTS=/tmp/aquarium-tutorial \
  python3 tests/release_final_tutorial_browser.py

AQUARIUM_SELECTION_RESULTS=/tmp/aquarium-selection \
  python3 tests/release_final_selection_browser.py
```

Für WebKit zusätzlich `AQUARIUM_BROWSER=webkit` und `AQUARIUM_WEBKIT` setzen.
In der Cloud läuft der Python-Aufruf über den genannten Wrapper. Die
Missionsprüfung verwendet echte Mausklicks/Touch-Eingaben, Pfeiltasten,
Dateidownloads und die Dateiauswahl. Keine abgeschlossenen Zustände werden gesetzt.

Für die neue Einzeldatei `AQUARIUM_BACKUP=1`, die lokale HTTP-Adresse unter
`AQUARIUM_URL` und ein getrenntes Ergebnisverzeichnis verwenden. Nach dem ersten
Laden sperrt dieser Test sämtliche HTTP(S)-Anfragen. Lokale Datei-APIs bleiben
verfügbar; der früher akzeptierte lange Test mit dem strikten Browser-
Offlineschalter wird ausdrücklich separat geführt. Internes Verlassen/Wiederöffnen
in der Einzeldatei wird nicht als HTTP-Neuladen ausgegeben.

Unabhängige Nachrechnung der tatsächlich neuen M5-/M6-Downloads:

```bash
node tools/release_final_data_audit.mjs /tmp/aquarium-paths/chromium/*-result.json
```

Die Nachrechnung prüft Wasservermischung, unveränderte Bodenreste direkt nach dem
Eingriff, vollständig gleiche Ausgangszustände, Zeitabstände, Einzelpflanzenwerte,
Messwerte und aufsummierte Prozessflüsse. Sie verwendet den vorhandenen
Archivdecoder, berechnet die verglichenen Werte aber selbst und erzeugt keine
Browserleistung oder neuen Missionsabschluss.

Weitere gezielte Skripte: `single_research_browser.py` (Klassen 8/9/10),
`final_operations_browser.py` (fünf Szenarien und 14 echte Altdateien),
`final_legacy_browser.py` (historische Lernprodukte 8/9),
`final_tweezers_browser.py` (echte Maus-/Chromium-Touch-Züge und Kollision),
`release_expert_tools_browser.py` (Analyse und Geräte),
`release_native_file_browser.py` (tatsächliches `file:`),
`release_v1_regression_browser.py` (sechs Einstiege, Dateien und HTML-Download).
Die jeweils verwendeten Umgebungsvariablen stehen am Anfang dieser Skripte.
Für externe historische Dateien akzeptiert `final_operations_browser.py`
`AQUARIUM_LEGACY_FIXTURES` mit dem Ordner der Originaldateien und `index.json`.

Die ergänzten unsichtbaren/deaktivierten Felder im Fokus-Skript sind ausdrücklich
eine synthetische DOM-Prüfvorrichtung. Der reale M4-Durchlauf und seine gespeicherten
Eltern/Generationen werden zuvor mit echten Spielhandlungen erzeugt. Die
Prüfvorrichtung verändert weder biologische Daten noch den Missionsfortschritt.
