# Abschluss: Detailbilder, Pinzette und Fotorekonstruktion

Stand: 20. Oktober 2026. Basis: main `3430325b96c28631964aa23ea051ee2fa4053a1e` (gemergter PR #5).
Branch: `feature/catalog-ui-realism-review`; [Pull Request #6](https://github.com/Feerson1617/Simulation-Aquarium/pull/6), ohne Merge.

## Ergebnis im Spiel

- Die Farbauswahl im Fischshop heißt **Farbe**. Varianten, Geschlechter und die zusätzlichen Genetikoptionen bleiben erhalten.
- Artbeschreibungen und die Detailkarte eines bereits eingesetzten Tiers, einer Pflanze, Koralle oder Dekoration verwenden `catalogImage(e)` und damit exakt dieselbe lokale Artdatei wie der Katalog.
- X-/Z-Positionsregler und die alternative Klickplatzierung ausgewählter Objekte sind entfernt. Die Pinzette unterstützt Fische, Wirbellose, Pflanzen, Korallen und Dekorationen mit Maus, Touch und der bestehenden Tastaturbedienung.
- Bei Tieren verschiebt sie den gespeicherten Bewegungsbereich. Die Schwimmhöhe bleibt erhalten; nach dem Loslassen bewegen sich die Tiere selbstständig weiter. Nur feste Objekte werden am Bodengrund verankert.
- Drehung, Darstellungsgröße, Wasser-, Zeit- und Grafikregler bleiben verfügbar. Das Speicherformat und die Schlüssel der vorhandenen Spielstände bleiben erhalten.
- Die vorhandenen produktiven Art-GLBs wurden nicht ersetzt. Die drei fotobasierten Pilotarten wurden in einer temporären Testkopie tatsächlich durch den normalen GLB-Lader in das Spiel eingesetzt und aus mehreren Blickwinkeln aufgenommen.

[UI vorher](ui-model-review/comparison/before-object-guppy.png) · [UI nachher](ui-model-review/comparison/after-object-guppy.png) · [echte Modellvergleiche und Entscheidung](ui-model-review/README.md) · [kleine Änderungen in der großen HTML-Datei](ui-model-review/HTML_CHANGES.md).

## Nachgewiesene Prüfungen

| Prüfung | Ergebnis und Nachweis |
| --- | --- |
| Node-Modultests | 55 bestanden, einschließlich Genetik, Fortpflanzung, Ökologie, Grafik, Katalog und neuer Tierplatzierung; [Lauf](https://github.com/Feerson1617/Simulation-Aquarium/actions/runs/39272918280) |
| Bestehende Art-GLBs | 2 Python-Prüfungen bestanden; derselbe Lauf |
| Neue UI-/Browserprüfung | Bestanden: Guppy, Molly, Panzerwels, Anubias, Schnecke, Koralle und Stein; tatsächlicher Szenenklick; echte Pinzettengesten mit Tier/Koralle; Wasser/Zeit/Grafik; Desktop-Hoch, Touch-Porträt und Tutorialstart; [Bericht](ui-model-review/browser-report.json) |
| Bestehende Pinzettenprüfung | 12 Prüfungen bestanden: Maus/Touch, Abbrechen, Kamera, Kollisionen, Glasgrenzen, Kauf, Tastatur und Laden alter Spielstände; derselbe Lauf |
| Genetik im echten Browser | 9 Prüfungen bestanden: wirkliche Shopkäufe/Farben, F1/F2, kleinere Jungfische, Import/Reload, Platy mit zwei Genorten, Eier und Schlupf, Touch; [Lauf](https://github.com/Feerson1617/Simulation-Aquarium/actions/runs/39289867062), [Bericht](ui-model-review/genetics-report.json) |
| Ökosystem/Szenarien | 12 Prüfungen bestanden: sechs Analyseansichten, Fütterung/Beute, alle fünf Szenarien, Tag/Nacht, Notizen/Backup und getrennte Speicherplätze, Export/Import und Touch; derselbe Lauf, [Bericht](ui-model-review/ecosystem-report.json) |
| Eigenständiger HTML-Download | Bestanden, direkt über eine echte `file:`-URL: 150.080.176 Bytes, Beckenaufstellung, Dekoration, Farbvariante, Genetik und Pinzette ohne weitere HTTP-Ressourcen; [Lauf](https://github.com/Feerson1617/Simulation-Aquarium/actions/runs/39352975285), [Bericht](ui-model-review/standalone-report.json) |
| Drei fotobasierte Modelle im Spiel | Guppy/Panzerwels und erster Anubias-Durchlauf aufgenommen; [Lauf](https://github.com/Feerson1617/Simulation-Aquarium/actions/runs/39272907955). Gezielt korrigierter Pflanzenversuch: [Lauf](https://github.com/Feerson1617/Simulation-Aquarium/actions/runs/39352881052), endgültiger Befund im verlinkten Modellbericht. |
| Bestehende Pages-Lösung | PR-Vorschauläufe erfolgreich. `.github/workflows/pages-pr-previews.yml` unverändert; kein Merge und keine Umschaltung der Hauptversion |

Der erste gemeinsame Browserlauf endete nach erfolgreichen UI- und Pinzettenprüfungen an einer zu frühen Genetik-Testabfrage. Frisch geladene GLBs waren bereits als Individuen sichtbar, hatten aber noch nicht ihre aktualisierten Weltmatrizen. Der Test wartet jetzt auf alle tatsächlichen F2-Individuen mit ihrer gerenderten Wachstumsgröße; die Größenbehauptung wurde beibehalten. Danach bestanden Genetik und Ökosystem vollständig. Es wurde dafür keine Spielmechanik verändert.

Keine JavaScript-Ausnahmen, Shaderfehler oder fehlenden Spielressourcen in den bestandenen Prüfungen. Der Genetiklauf protokolliert nur eine harmlose 404-Anfrage nach `favicon.ico`.

## Umgebung und Grenzen

Der lokale Codex-Executor war nicht benutzbar. Deshalb konnten lokaler Branch, `git status` und eventuell nicht gepushte Dateien der unterbrochenen Sitzung nicht gelesen werden. Daraus folgt nicht, dass solche Änderungen verloren wären. Über GitHub wurden Hauptbranch, Entwicklungsbranches und offene PRs geprüft; der gemergte PR #5 war der jüngste verfügbare Ausgangspunkt. Änderungen wurden früh und regelmäßig im neuen Branch gesichert.

Die Tests und die tatsächliche CPU-Inferenz liefen auf kostenlosen Standard-Linux-Runnern des öffentlichen Repositorys, ohne zusätzliche Konten oder kostenpflichtige APIs. Temporäre Prüfworkflows hatten nur Lesezugriff und veröffentlichten Artefakte; sie sind nach Abschluss entfernt. Die ausführbaren Prüfskripte bleiben im Repository. Die ursprüngliche Pages-Konfiguration bleibt erhalten.

Die Browseraufnahmen stammen aus echtem Chromium/WebGL mit Software-Rasterisierung. Touch-/iPad-Formate wurden emuliert. Ein physisches iPad mit Safari sowie Leistung und Bildwirkung auf einer echten Desktop-GPU wurden in dieser Sitzung nicht getestet. Fotorealismus wurde nicht erreicht; die Grenzen und kostenlosen Alternativen stehen im Modellbericht.
