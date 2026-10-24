# Kostenlose Entwicklungs- und Prüfwerkzeuge

Das Spiel bleibt eine statische Website mit relativen Pfaden, ohne Backend, neue Konten oder externe Laufzeitdienste. Bestehende Modelle, AGENTS.md und die GitHub-Pages-/PR-Vorschau-Workflows bleiben erhalten. Die zusätzlichen Prüfwerkzeuge laufen lokal in dieser Cloud-Umgebung und gehören nicht zu den Laufzeitvoraussetzungen des Spiels.

## Tatsächlich verwendet

- Node.js 24.19 für die vorhandenen und neuen Modultests; kein npm-Build erforderlich.
- Python 3.12.14, Playwright 1.62.0 und Chromium 154.0.8037.57 für sichtbare Bedienung, Screenshots, Downloads und echte Chromium-Touchereignisse.
- Offizielles Playwright-WebKit 26.5, Bundle 2336, unter Linux. Fehlende Debian-Bibliotheken liegen ausschließlich im privaten Werkzeugpräfix. Alle 19 ELF-Dateien wurden mit ihren Bundle-/Privatbibliotheken geprüft. Keine Systeminstallation oder Änderung von Konten/Berechtigungen.
- Git und GitHub CLI für den eigenen Branch und den neuen PR. Kein Merge und kein main-Push.
- Acorn lokal für den Syntaxbaumvergleich der biologischen Kernfunktionen mit main. Kein Anwendungs-Buildschritt.
- Lokal gebündeltes lz-string 1.5.0 für verlustfreie Beckenarchive; [Lizenz und Herkunft](../../vendor/README.md). Keine Netzwerkaufrufe für diesen Codec.

## Wiederholbare Aufrufe in dieser Umgebung

```sh
cd /workspace/Simulation-Aquarium
python3 /workspace/aquarium-devtools/start.py
node --test tests/*.test.mjs
AQUARIUM_COHERENT_RESULTS=/tmp/coherent-check python3 tests/coherent_workspace_browser.py
AQUARIUM_COMPAT_RESULTS=/tmp/coherent-compat python3 tests/coherent_compat_browser.py
AQUARIUM_TOOLS_RESULTS=/tmp/coherent-tools python3 tests/coherent_tools_browser.py
python3 tests/coherent_expert_context_browser.py
```

Standard-URL: `http://127.0.0.1:8000/aquarium-simulation/`. `AQUARIUM_URL` erlaubt andere autorisierte HTTP-Unterpfade. Die Browser nutzen isolierte Speicherprofile. Alle neuen Abschlüsse werden durch die sichtbaren Bedienelemente erreicht, nicht durch eingespritzte Questabschlüsse. Historische Fixture-Importe und die gezielte Speicherfehler-Injektion sind gesondert benannt.

Ohne den Cloud-Starter genügt ein normaler statischer Python-Server. Aus dem Repository zum Beispiel `python3 -m http.server 8001 --bind 127.0.0.1 --directory ..`; in einem zweiten Terminal `AQUARIUM_URL=http://127.0.0.1:8001/Simulation-Aquarium/ python3 tests/coherent_final_browser.py`. Der Pfad folgt dabei dem tatsächlichen Verzeichnisnamen. Kein Backend oder Anwendungskonto erforderlich.

WebKit benötigt hier den additiven lokalen Starter, weil der offizielle Shellstarter `LD_LIBRARY_PATH` ersetzt:

```sh
AQUARIUM_WEBKIT=/workspace/aquarium-devtools/webkit-portable-browser.sh \
AQUARIUM_COHERENT_RESULTS=/tmp/coherent-check \
python3 /workspace/aquarium-devtools/run-webkit.py tests/coherent_workspace_browser.py
```

Analog für die beiden anderen Prüfskripte. Die tatsächlich verwendete Starterdatei ist unter [evidence/setup/webkit-portable-browser.sh](evidence/setup/webkit-portable-browser.sh) dokumentiert. Der offizielle MiniBrowser wird direkt mit seinen privaten Bibliotheken gestartet; keine Sicherheits-, Netzwerk- oder Hostprüfung wird im Spiel ausgeschaltet.

Die Renderingtests verwenden Software-Rendering in der Cloud. Gemessene Lade-/Zeichenzeiten gelten für diese Umgebung und die dokumentierten Viewports. Physische iPads, Mobile Safari und Offline-Dateien auf iPadOS bleiben gesondert zu prüfen. Ein über HTTP bereitgestelltes Einzel-HTML ist kein bestandener `file:`-Offline-Test.

Die technische Mehrmissionsregression erlaubt `AQUARIUM_TEST_DPR=0.5`; Standard bleibt 1. Dieser Parameter reduziert ausschließlich die Test-Pixeldichte bei unverändertem CSS-Viewport, Objektbestand und Assertions. Er ersetzt keine visuelle oder physische Geräteabnahme.

Aktuelle Ergebnisse der vollständigen Übertragung und zusätzliche reproduzierbare Aufrufe stehen in [FINAL_VALIDATION.md](FINAL_VALIDATION.md). Die genaue Auswahl der Temperatur-Kontextansichten kann mit `AQUARIUM_CONTEXT_PROFILES=desktop,portrait,landscape` begrenzt werden; Standard sind alle drei. Der Bericht protokolliert die tatsächlich gewählten Formate.
