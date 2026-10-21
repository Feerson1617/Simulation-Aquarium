# GitHub-Übergabe zu PR #8

Aktuelle Fortsetzung: Questbuch, reduzierte Schüleransichten und vollständige Prüfbelege stehen im selben PR #8. Übersicht in [quest/VALIDATION.md](quest/VALIDATION.md). `PR_BODY.md` enthält die neue vorbereitete Beschreibung. Git-Push funktioniert; `api.github.com` steht weiterhin nicht in der erlaubten Zielmenge, ein passendes GitHub-API-Werkzeug ist nicht verfügbar. Deshalb keine erfolgreiche Beschreibungsänderung oder externe CI-/Preview-Ausführung behaupten. Die nachstehenden älteren Details dokumentieren die ursprüngliche R1–R8-Übergabe.

Der bestehende [PR #8](https://github.com/Feerson1617/Simulation-Aquarium/pull/8) verwendet [`feature/biology-learning-environments`](https://github.com/Feerson1617/Simulation-Aquarium/tree/feature/biology-learning-environments). Der Nutzer hat ihn nach der früheren Übergabe angelegt. Die Korrekturen R1–R8 werden auf genau diesen Branch gepusht; es wird kein zweiter PR benötigt. Beim Beginn stimmten Branch und PR-Ref mit `5b00ea1` überein. `main` stand auf `666df90` und wurde nicht verändert.

[Abschlussbericht](REPORT.md), [fachliches Audit](AUDIT.md), [Tests/Screenshots](VALIDATION.md), [Master- und Missionsabnahme](ACCEPTANCE.md), [wiederaufnehmbarer Stand](WORK_STATE.md). Die überarbeitete PR-Beschreibung liegt in [PR_BODY.md](PR_BODY.md).

Git-Push funktioniert. Die GitHub-API bleibt in dieser Umgebung durch die Netzwerk-Allowlist gesperrt (`api.github.com`, `Forbidden`); deshalb können PR-Beschreibung, neue Checkläufe und deren Ergebnisse hier nicht über die API bestätigt werden. Das ist kein Hindernis für die Sicherung der Codeänderungen im bestehenden PR. Grüne lokale Modultests werden nicht als bereits grüne GitHub-Checks ausgegeben.

Der unveränderte bestehende Workflow `pages-pr-previews.yml` stellt offene PRs desselben Repositorys separat zu `main` bereit. Die vom unabhängigen Review bestätigte Adresse lautet [Spielvorschau für PR #8](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-8/). Die aktuelle Ausführung nach den Korrektur-Pushes und der aktuelle Inhalt dieser externen Adresse wurden hier nicht live geprüft. Alle neuen Browsernachweise beziehen sich ausdrücklich auf den lokalen statischen Projektunterpfad.

Der neue Workflow `module-tests.yml` führt bei Pull Requests die vorhandenen und neuen Node-Modultests aus, ohne Paketinstallation, Geheimnisse, zusätzlichen Dienst oder Veröffentlichung. Sein YAML und der tatsächliche Befehl wurden lokal geprüft. Die bisherigen Pages-Checks sind weiterhin Veröffentlichungsprüfungen, kein fachlicher Wirksamkeitsnachweis. Kein Merge und kein Push auf `main`.

Die Aktualisierung der fertigen PR-Beschreibung wurde am 21.10.2026 nach der vollständigen Endprüfung konkret versucht:

```sh
gh pr edit 8 --repo Feerson1617/Simulation-Aquarium --body-file docs/learning/PR_BODY.md
```

Ergebnis: `Post "https://api.github.com/graphql": Forbidden`. Die Beschreibung konnte deshalb nicht über die API übertragen werden; `PR_BODY.md` enthält den endgültigen Text mit 100 Modultests und 82 Browserprüfpunkten. Die Code- und Dokumentänderungen werden über Git im bestehenden PR gesichert. Kein zusätzlicher Account oder Zugangsschlüssel wurde verlangt.
