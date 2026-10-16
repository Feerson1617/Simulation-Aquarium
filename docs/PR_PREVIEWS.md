# Automatische Pull-Request-Vorschauen

Dieses Repository veröffentlicht die stabile Aquariumsimulation weiterhin unter:

https://feerson1617.github.io/Simulation-Aquarium/

Der Workflow `.github/workflows/pages-pr-previews.yml` bündelt bei jeder Aktualisierung
auf `main` sowie bei Änderungen an internen Pull Requests eine Kopie des Standes
von `main` **an der Root-Adresse** und alle noch offenen internen Pull Requests
jeweils in einem eigenen Verzeichnis:

`https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-NUMMER/`

Eine Pull-Request-Vorschau ist öffentlich einsehbar, obwohl die Änderungen nicht
in `main` gemergt sind. Nur PRs aus Branches desselben Repositorys werden
übernommen; PRs aus Forks werden aus Sicherheitsgründen ausgeschlossen.
Die Vorschau wird bei Synchronisierung aktualisiert und nach Schließen des PRs
bei der nächsten erfolgreichen Veröffentlichung entfernt. Der Workflow führt
keinen Code aus dem PR aus, sondern kopiert dessen statische Dateien.

## Einmalige Aktivierung (durch Repositoryinhaber)

1. Zuerst diesen Pull Request prüfen und in `main` mergen.
2. Im Repository **Settings → Pages → Build and deployment → Source**
   die Auswahl von **Deploy from a branch** auf **GitHub Actions** umstellen.
   Nicht zusätzlich den von GitHub angebotenen Starter-Workflow erstellen;
   die Workflow-Datei existiert bereits.
3. Unter **Actions** den Workflow **Aquarium – Website und PR-Vorschauen**
   auswählen und **Run workflow** auf `main` klicken.
4. Auf einen erfolgreichen Lauf warten und sowohl die normale Spieladresse
   als auch den Vorschaulink eines offenen PRs prüfen.

Die GitHub-Pages-Umgebung `github-pages` muss Deployments vom Standardbranch
`main` erlauben; bei Schutzregeln nur `main` freigeben. Das Workflow-Ereignis
`pull_request_target` führt den Workflow **im Kontext von `main`** aus.
Der GitHub-Token darf hierfür Pull-Request-Metadaten lesen und beim erstmaligen
Öffnen eines internen PRs einmalig dessen Vorschau-Adresse kommentieren.
Es werden keine zusätzlichen Zugangsdaten benötigt.

## Nutzung

- Codex erstellt einen Branch und anschließend einen Pull Request.
- Bei einem neuen PR veröffentlicht der Workflow dessen Browser-Vorschau.
- Vorschau testen, dann wie gewohnt manuell mergen.
- Nach dem Merge erscheint der freigegebene Stand am üblichen Spiel-Link.

Die Vorschau ist **kein gesonderter privater Bereich**. Testdaten sollten
deshalb keine personenbezogenen oder vertraulichen Informationen enthalten.

## Grenzen und Hinweise

- Diese Änderung wurde als GitHub-Konfiguration vorbereitet, **noch nicht
  erfolgreich als GitHub-Actions-Deployment getestet**. Der erste Actions-Lauf
  ist die tatsächliche Aktivierungsprüfung.
- Bei größeren HTML-Spieldateien ist der gesamte Pages-Artefaktumfang zu beachten.
  GitHub Pages hat Größen-/Bandbreitenlimits. Sehr viele gleichzeitig geöffnete PRs
  können ein späteres Aufräum- oder alternatives Preview-Konzept erfordern.
- Ein möglicher 404 für `favicon.ico` ist von der bisherigen Anwendung bekannt.
- Wenn die GitHub-Pages-Einstellungen noch `Deploy from a branch` verwenden,
  erscheint zunächst **keine** automatische Vorschau.
- Bei fehlenden Workflow-Berechtigungen unter **Settings → Actions → General →
  Workflow permissions** kann das Kommentieren fehlschlagen. Das Spiel-Deployment
  sollte separat im Workflow-Protokoll untersucht werden.
- Für eine spätere Rückkehr zu der ursprünglichen Veröffentlichung lässt sich
  **Settings → Pages → Source → Deploy from a branch → main /(root)** auswählen.
  Das stellt die bisherige Veröffentlichungskonfiguration wieder her.
