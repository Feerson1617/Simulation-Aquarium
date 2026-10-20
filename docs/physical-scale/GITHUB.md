# Branch, Pull Request und Vorschau

Entwicklungsbranch: `feature/physical-scale-realism`, Basis `main` 63e7bc9. Die Zwischenstände wurden regelmäßig auf `origin` gepusht. Kein Merge, keine manuelle Veröffentlichung und keine Änderung an AGENTS.md oder dem vorhandenen Pages-Workflow.

Git funktioniert über die bereitgestellte Authentifizierung. Der aktuelle Cloud-Lauf blockiert dagegen Anfragen an `api.github.com` mit `Forbidden`. Auch der abschließende konkrete Aufruf `gh pr create` scheiterte beim GraphQL-POST; [Ausführungsbeleg](evidence/github-pr-attempt.txt). Dieser Lauf hat keinen bestätigten PR und keine Spielvorschau angelegt. Der bestehende Umgebungsentwurf enthält die Freigabe bereits; die aktive Laufzeit hat sie noch nicht übernommen. Es wurden keine Zugangsdaten ausgelesen oder neue Konten angefordert.

[Pull Request für den gesicherten Branch öffnen](https://github.com/Feerson1617/Simulation-Aquarium/pull/new/feature/physical-scale-realism). Als Basis `main` und als Vergleich `feature/physical-scale-realism` wählen. Titel und Beschreibung stehen in [PR_BODY.md](PR_BODY.md). Dieser Link ist ein Erstellungsformular und kein bereits angelegter PR.

Der vorhandene Workflow `.github/workflows/pages-pr-previews.yml` erstellt nach Öffnen eines internen PRs eine separate statische Spielvorschau unter `pr-preview/pr-NUMMER/`. Die Produktionsdateien stammen dabei weiterhin aus main. Ein tatsächlicher Vorschaulink und Deployment-Erfolg können erst nach erfolgreicher PR-Erstellung und GitHub-Ausführung bestätigt werden. Pages muss bereits auf GitHub Actions eingestellt sein; siehe [bestehende Vorschau-Anleitung](../PR_PREVIEWS.md).
