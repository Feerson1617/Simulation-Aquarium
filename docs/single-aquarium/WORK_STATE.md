# Fortsetzung nach ausdrücklicher M1-Freigabe

Der Auftraggeber hat die neue M1-Sichtfreigabe ausdrücklich erteilt („jup, ist besser als vorher“) und **einfache Sprache, insbesondere keine chemischen Einheiten in Klasse 8**, verlangt. Phase 3/4 sind damit freigegeben. Keine neue Pause wegen des früheren Gates; kein Merge ohne gesonderten Auftrag.

## Git und Wiederaufnahme

- Repository `/workspace/Simulation-Aquarium`, Branch `feature/coherent-learning-workspaces`, [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9) weiterhin offen als Entwurf. Main bleibt unverändert bei `8e41962132fe3778fe73f8e14c650f42e18d848d`.
- Ausgang `4e59de3beb4d4af8017472301c9d28cc8ade653c` ist auf `backup/coherent-learning-4e59de3` gesichert. Die frühere ZIP bleibt unverändert unter `/workspace/exports/Simulation-Aquarium-4e59de3.zip` (SHA-256 `55ca0303d867a3e6e4cd9f75472c5a90c3347e90e666c75ae4f500ab0a85259f`).
- Gesicherte Fortsetzung: `57cdb4e` M1-Sprache/Freigabe, `cadc9a0` neue ökologische und genetische Wege, `9e760e2` Hilfen/Datenprüfung, `e86b4e7` konkrete Schlussfolgerungen, `830c428` ehrlicher gespeicherter Abbruch und Beobachtungstempo, `55998c6` freie Objektkarten, `d8bff67` Pinzettenwechsel und sofortige Positionssicherung, `5190634` zugängliche Bestandsliste und ausgewählte Tastaturplatzierung. Spätere Dokumentationscommits ändern diese Zuordnung nicht.
- [Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/). Zuerst Git-Status, PR-Head und dieses Dokument prüfen; ungesicherte Arbeit übernehmen, nicht erneut mit dem alten Zwei-Becken-Auftrag beginnen.

## Implementiert

Sechs Fragen und freie Jahrgänge verwenden jeweils genau einen aktuellen Hauptzustand. Kein Paarcontroller und keine nebenher berechnete Lernpopulation in der Standardroute. Genetik greift direkt auf die tatsächlichen Molly-Entitäten zu: UID, Eltern, Allele und gerenderte Farbvariante sind verbunden. Zwölf zufällige Nachkommen, vorbereitete ausgewogene Geschlechterverteilung, ausdrücklich Zeitraffer. Frühere Generationen sind Daten; freie Fortpflanzung ist im Lernversuch ausgeschaltet, im freien Modus erhalten.

M2 füttert einmal, zeichnet tatsächliche Abbauflüsse auf und unterscheidet Restmenge und Umwandlung. M5 startet mit fortlaufendem Futtereintrag, verändert nur die gewählte Maßnahme, prüft direkt danach und nach zehn Tagen und stellt für den zweiten Durchgang den ganzen Anfang wieder her. M6 beobachtet dieselbe Pflanze und trennt Wachstum von der Erklärung der Kohlenstoffherkunft. Alle Wege sichern Beobachtung, Auswahl und bereitgestellte Erklärung getrennt von freiwilligem eigenem Text.

Klasse 8 verwendet verständliche Veränderungen ohne Formeln/Einheiten; genaue Originaldaten bleiben für Lehrkräfte und Exporte erhalten. Freier Einstieg mit Katalog, Pflege, Messung, Pinzette, Objektkarte, Technik und Dateien. Einstellungen ohne Konto. Alte Daten werden nicht als neue Leistung umgedeutet. [Sprachregeln](LANGUAGE.md), [sechs Lernhandlungen und 14 Altzuordnungen](MISSIONS.md), [Lehrkraftübersicht](TEACHER.md).

## Neue Prüfungen – derzeit noch laufend

188 Modultests bestanden (`/tmp/classroom-node-final-188.log`). Alle fünf neuen Wege bestanden einen vollständigen ersten Chromium-Desktoplauf (`/tmp/classroom-first/chromium/report.json`, damalige Quellstände in dessen Hashes). Der spätere WebKit-Lauf hat bereits alle fünf Hochformat- und Desktopwege sowie Teile des Querformats bestanden; Endbericht erst nach Abschluss prüfen.

Aktive/neu zu prüfende Laufpfade:

- `tests/single_classroom_browser.py`: `/tmp/classroom-all/{chromium,webkit}/report.json`, Logs `/tmp/classroom-all-{engine}.log`. WebKit läuft mit drei Profilen. Der erste Chromium-Versuch brach bei der kurzen Beobachtung wegen einer unstabilen automatisierten Klickposition ab; Tempo auf das freigegebene 650-ms-Intervall angeglichen, unmittelbare Pause über echten Enter-Tastendruck. **Chromium-Gesamtlauf mit aktuellem Skript erneut erforderlich.**
- `tests/single_m1_browser.py`: `/tmp/classroom-language-m1/webkit/report.json` besteht Hochformat und Quotenfehler nach der sprachlichen Umstellung auf `9e760e2`; spätere kleine Textkorrekturen gesondert nachprüfen. Nicht als bereits abgeschlossene neue Sechs-Missions-Gesamtprüfung ausgeben.
- `tests/single_research_browser.py`: `/tmp/classroom-research-final/chromium/report.json`, Log `/tmp/classroom-research-final-chromium.log`, derzeit laufend. Vorherige Versuche fanden den echten Pinzetten-Aktivierungsfehler (Menü sperrte noch die Szene) und eine falsche Testannahme bei verdeckter Anubias: der tatsächliche Vordergrund-Holztreffer war korrekt. Diese fehlgeschlagenen Entwicklungsberichte sind keine Endabnahme.
- Einzel-HTML zuletzt unter `/workspace/aquarium-devtools/www/standalone-m1/index.html` gebaut; `/tmp/single-m1-standalone-artifact.json` enthält den damaligen Head und Hash. **Nach letzten Änderungen neu bauen und prüfen.** Builder `/tmp/build-single-m1.mjs`. Es enthält alle Module, bleibt außerhalb Git und beweist nicht natives Dateiöffnen auf einem iPad.

## Noch ausstehend vor Abschluss

Freien Bereich einschließlich tatsächlicher Platzierung, sofortigem Speichern, Einstellungen und Quotenfehler abschließen; neue vollständige Chromium-/WebKit-Profile vervollständigen; aktuelle Sprachansichten M1 prüfen; erhaltenes Tutorial/Expertenregression ausführen; Einzel-HTML und öffentliche Vorschau samt ausgelieferten Hashes prüfen. Belege kompakt mit exakten Quellständen kuratieren, README/PR-Beschreibung und endgültigen Prüfbericht aktualisieren. Keine pauschale Behauptung, alle Prüfungen liefen auf demselben Head, wenn spätere begrenzte Korrekturen separat geprüft wurden.

Die ETS-Original-PDF wurde erneut gelesen und an S. 9–10, 14–15, 19–20 abgeglichen; ihr SHA-256 stimmt mit dem früheren Beleg überein. Offizielles Fachportal per Proxy HTTP 403, OSPAR HTTP 403, ein Nationalpark-Unterpfad HTTP 404; keine Umgehung und keine behauptete aktuelle Originalprüfung der Landesfassungen. Quelle `/tmp/classroom-source-access.json`, Text `/tmp/ets-single-curriculum.txt`, hochgeladene PDF unter `/workspace/attachments/566817cd-a4ac-422d-9769-3e5a80fa35b5/`.

Physisches iPad/Safari, Unterrichtserprobung und natives `file:`-Starten bleiben ausdrücklich außerhalb der bisherigen Nachweise. Historische Unterlagen im M1-[Gate-Bericht](VALIDATION.md) und in `docs/coherent-learning` behalten ihre Bedeutung; neue Messungen nicht aus alten Protokollen erfinden.
