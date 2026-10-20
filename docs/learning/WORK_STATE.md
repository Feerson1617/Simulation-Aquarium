# Lernumgebungen – aktueller Arbeitsstand

Stand: 20.10.2026. Branch `feature/biology-learning-environments`.

## Gesicherter Stand

- Wiederhergestellter Vorgänger `78f3ce6` war sauber. PR #7 ist bereits in `main` (`666df90`) gemergt; sein Dateibaum wurde vollständig übernommen.
- Phasen 1–6 des neuen Gesamtauftrags sind umgesetzt. Laufzeitcode zuletzt in `9e13bbb` gesichert; Dokumentation/Testkorrekturen danach separat.
- Das hochgeladene Originalcurriculum ist geprüft. Inhalte und Seitenbezüge: `REPORT.md`; Herkunft/Prüfsumme und biologische Grenzen: `AUDIT.md`.
- Keine Änderungen an `AGENTS.md`, Modellen/Texturen oder Veröffentlichungsworkflows. Kein Merge, keine Änderung an `main`.

## Laufende Endprüfung (Phase 7)

- **87 Node-Tests bestanden**, keine Fehler/übersprungenen Tests.
- **6 gezielte Browserprüfungen bestanden**: echte Ressourcenbegrenzung, Lernprodukte, Tastaturfokus, Pinzette/Rendererpause, unbekannte Anfangsumsätze und Export/Import, gesperrter Browserspeicher.
- Der unabhängige Testläufer schreibt nach `/tmp/aquarium-learning-final/status.json` und pro Gruppe in `.log`-Dateien. Er bleibt bei verlorener Chat-Ausgabeverbindung bestehen.
- Reihenfolge: Modultests → gezielte Browserchecks → vollständige Lernumgebungen → bisherige Bereitschaft/Tutorial → Aquascaping → Ökosystem → Genetik → Gesamtdownload. GPU-Browserläufe nur nacheinander ausführen.
- Laufzeitdateien bleiben während der Endprüfung unverändert. Prüfsummen: `evidence/runtime.sha256`.
- Frühere Teilläufe belegten bereits alle freien Forschungswege und die Missionsgruppen 8/9, wurden aber nicht als vollständige Abnahme gezählt. Ein Testprozess verlor seine Ausgabeverbindung (`Broken pipe`); keine Spielausnahme. Ein Importtest musste auf die asynchrone Dateilesung warten.

Nach Abschluss erfolgreiche Berichte und aussagekräftige Screenshots übernehmen, `VALIDATION.md` vervollständigen und diesen Arbeitsstand aktualisieren. Reale Schul-iPads/Safari und Unterrichtswirksamkeit nicht als geprüft ausgeben.

## Reproduzieren

Statischen Server starten; `README.md` beschreibt den Projektpfad. Danach einzeln:

```sh
node --test tests/*.test.mjs
python3 tests/learning_additional_browser.py
python3 tests/learning_browser.py
python3 tests/readiness_browser.py
python3 tests/aquascaping_browser.py
python3 tests/ecosystem_browser.py
python3 tests/genetics_browser.py
python3 tests/standalone_browser.py
```

## GitHub

Früh und regelmäßig gepusht. `gh pr create --draft --base main --head feature/biology-learning-environments ...` wurde versucht, scheitert an `Post https://api.github.com/graphql: Forbidden`. Git-Push funktioniert. `PR_BODY.md` ist vorbereitet. Keine PR-Nummer oder veröffentlichte Vorschau behaupten, solange keine Erstellung bestätigt ist. Die vorhandenen Vorschau-Workflows wurden nur gelesen, nicht verändert.
