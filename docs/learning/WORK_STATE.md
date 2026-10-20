# Lernumgebungen – wiederaufnehmbarer Arbeitsstand

Stand: 20.10.2026. Branch `feature/biology-learning-environments`. Die Implementierung und lokale Gesamtprüfung des Masterauftrags sind abgeschlossen. **Nicht bei null beginnen und bestandene Prüfungen ohne neue Codeänderung nicht wiederholen.** Offen ist die externe Pull-Request-Erstellung; siehe [GitHub-Übergabe](GITHUB.md).

## Wiederhergestellte Grundlage und Sicherung

- Der saubere Vorgänger `78f3ce6` ist über PR #7 bereits in `main` (`666df90`) enthalten. Sein Dateibaum wurde vollständig übernommen. Keine doppelte Umsetzung früherer Modell-, Maßstabs- oder Genetikarbeiten.
- Alle Entwicklungsschritte wurden auf diesem Branch regelmäßig committed und nach `origin` gepusht. Der genaue Abschlusscommit ist mit `git log -1` nachvollziehbar. Die letzte Laufzeitcodeänderung ist `9e13bbb`; spätere Commits betreffen Dokumentation, Testskripte und Belege.
- Keine Änderungen an `AGENTS.md`, Modellen/Texturen oder Veröffentlichungsworkflows; kein Merge und keine Änderung an `main`.
- Das vom Nutzer hochgeladene Originalcurriculum wurde gelesen. Seitenzuordnung: [REPORT.md](REPORT.md); Herkunft/Prüfsumme und fachliche Grenzen: [AUDIT.md](AUDIT.md).

## Abgeschlossene Phasen

| Phase | Vorhandene Umsetzung |
|---|---|
| 1 · Didaktisches Audit und Fachkorrekturen | Originalcurriculum, Fehlvorstellungen, transparente Zustandsindikatoren, Ressourcenbegrenzung von Pflanzen/Algen, organischer Rückfluss |
| 2 · Gemeinsame pädagogische Architektur | Drei Lernprofile, isolierte Lernspeicher, gemeinsamer bisheriger Rechenkern, Missions- und freier Modus |
| 3 · Reduzierte Oberflächen | Jahrgangssprache, passende Werkzeuge/Messgrößen, optionales Seitenwerkzeug, Kontext-? und Glossar, getrennte Grafikprofile |
| 4 · Missionen und Untersuchung | Alle 14 Missionsprofile; identische Ausgangslagen, gezielter Eingriff, Wiederholungen, tatsächliche Zeitreihen, Notizbuch und JSON/CSV/SVG |
| 5 · Biologische Mechaniken | Reale Mendelkreuzungen und archivierte Abstammung, endliche Populationen mit Drift und hypothetischer Selektion, begrenzte Wald-/Küsten-/Kohlenstofftransfers |
| 6 · Lehrkraft und Lernstand | Drei Unterstützungsniveaus, Vorbereitung/Freigaben, Konfigurationsimport/-export, Lernproduktleser, Vorwissen/spätere Erklärung, Reset mit Wiederherstellung |
| 7 · Gesamtprüfung | 87 Modultests, 71 Browserprüfpunkte und Einzeldatei-Export bestanden; Screenshots und fachliche Grenzen dokumentiert |

## Prüfung und Belege

- Vollständige Tabelle und Ansichten: [VALIDATION.md](VALIDATION.md); maschinenlesbare Übersicht: [verification.json](evidence/verification.json).
- Browserprüfpunkte: Lernen **19**, gezielte Fach-/Bedienfälle **6**, bisherige Bereitschaft/Tutorial **13**, Aquascaping **12**, Ökosystem **12**, Genetik **9**. Alle acht Touch-Tutorialschritte sind enthalten.
- Die 19 Lernprüfpunkte wurden in zwei Abschnitten abgeschlossen. Der erste bestand sämtliche freien Forschungswege und alle 14 Missionen, bevor das Skript eine noch eingeklappte Lehrkraftoption anklicken wollte. Danach nur den offenen Lehrkraft-/Touch-Abschnitt fortgesetzt; keine Laufzeitänderung und keine Doppelzählung. Der ursprüngliche Bericht mit Status `failed` ist erhalten und erläutert.
- Der HTML-Gesamtdownload (151.023.814 Bytes) wurde als einzige Datei über HTTP geprüft. Direkter `file:`-Start ist durch die verwaltete Browserrichtlinie blockiert und nicht als bestanden ausgewiesen.
- [Prüfsummen](evidence/runtime.sha256) der sieben bearbeiteten Laufzeitdateien wurden nach allen Tests abgeglichen. Testläufe veränderten keine Spielquellen.
- Dauerhafte Repositorybelege liegen unter `docs/learning/evidence`. Zusätzlich existieren in dieser Umgebung `/tmp/aquarium-learning-final/status.json`, Gruppenprotokolle und `/tmp/aquarium-final-validation-runner.py`; diese temporären Dateien sind zur Wiederaufnahme nicht erforderlich.

## Falls die Arbeit erneut aufgenommen wird

1. `git status --short --branch`, `git log` und Remotezweige prüfen. Vorhandene Änderungen übernehmen, nicht zurücksetzen.
2. Prüfen, ob der Nutzer inzwischen einen PR aus diesem Branch erstellt oder gemergt hat. Kein eigener Merge. Bei vorhandenem PR diesen weiterverwenden.
3. GitHub-API-Zugriff war mit `Forbidden` blockiert; Git-Push funktioniert. [PR_BODY.md](PR_BODY.md) enthält die fertige Beschreibung. Ohne bestätigte PR-Erstellung keine Nummer oder aktive Vorschau behaupten.
4. Neue fachliche/technische Änderungswünsche auf dem gesicherten Stand bearbeiten und nur betroffene Prüfungen erneut ausführen.

## Reproduzieren bei neuen relevanten Änderungen

Statischen Server und Python-Playwright/Chromium wie in `README.md` verwenden. GPU-Browsergruppen in dieser CPU-Cloud einzeln ausführen:

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

## Bewusst verbleibende Grenzen

Reale Schul-iPads/Safari, Unterrichtserprobung und empirische didaktische Wirksamkeit sind noch nicht geprüft. Modellraten bleiben kalibriert; keine geschlossene Kohlenstoff-/Energiebilanz und keine Simulation von Gezeiten, Plastiktoxikologie oder Fischereiökonomie. Regionale Transferquellen wurden benannt, ihre aktuellen Webinhalte hier nicht live geprüft. Vollständiger Fotorealismus bleibt ein früheres separates Entwicklungsziel. Dies sind dokumentierte Grenzen und weitere Erprobungen, keine Behauptung vollständig abgebildeter natürlicher Ökosysteme.
