# GitHub-Übergabe

Entwicklungsbranch: [`feature/biology-learning-environments`](https://github.com/Feerson1617/Simulation-Aquarium/tree/feature/biology-learning-environments). Implementierung und lokale Gesamtprüfung sind abgeschlossen; [Abschlussbericht](REPORT.md), [Testergebnisse und Screenshots](VALIDATION.md), [Fortschrittsdatei](WORK_STATE.md).

## Pull Request und automatische Vorschau

Die Erstellung eines Entwurfs-PR gegen `main` wurde mit `gh pr create --draft --base main --head feature/biology-learning-environments` versucht. Die GitHub-API antwortete mit:

```text
Post "https://api.github.com/graphql": Forbidden
```

Git-Push funktioniert; die API-Sperre verhindert die bestätigte PR-Erstellung in dieser Umgebung. Zum Abschluss wurde kein neuer PR-Ref gefunden. Deshalb gibt es keine bestätigte PR-Nummer und keine als erreichbar geprüfte Spielvorschau. Zugangsdaten oder zusätzliche Konten wurden nicht angefordert.

[Pull Request für den gesicherten Branch auf GitHub anlegen](https://github.com/Feerson1617/Simulation-Aquarium/pull/new/feature/biology-learning-environments). Zielbranch `main`, Titel **Biologie-Lernumgebungen für Klassen 8–10**; die fertige Beschreibung steht in [PR_BODY.md](PR_BODY.md). Es ist keine weitere Implementierung nötig, um den Stand zu prüfen.

Der unveränderte bestehende Workflow `.github/workflows/pages-pr-previews.yml` reagiert auf offene PRs aus demselben Repository und veröffentlicht deren Inhalt separat zur Hauptseite. Nach erfolgreicher PR-Erstellung und erfolgreichem Pages-Lauf trägt er den Vorschau-Link beim PR ein. Dessen Ausführung lässt sich hier ohne erstellten PR nicht bestätigen. Weder ein Merge noch eine Veröffentlichung auf `main` wurde vorgenommen.
