# Entwicklungsumgebung und offene WebKit-Prüfung

Das Spiel bleibt eine statische Website mit lokalen HTML-/MJS-/CSS-/Assetdateien. Kein npm-Build, keine Datenbank, keine externen Laufzeitdienste, kein neuer Account und keine kostenpflichtige API. Einrichtung und Prüfung verwenden Git, Node24.19, Python3.12, Playwright1.62 und Chromium154 mit lokalem SwiftShader. Laufende Browsergruppen werden auf dieser CPU-Umgebung nacheinander ausgeführt; daraus werden keine Hardware-FPS abgeleitet.

## Aktuell tatsächlich nutzbar

```bash
cd /workspace/Simulation-Aquarium
python3 /workspace/aquarium-devtools/start.py
node --test tests/*.test.mjs
```

Der Starter überprüft HTTP200 und den tatsächlichen SHA-256 der ausgelieferten index.html. Vorhandene fremde Prozesse werden nicht beendet. Setup-/Starthelfer und Caches liegen außerhalb des Spiels in /workspace/aquarium-devtools. Die gespeicherten Helfer entsprechen dem vorhandenen Konfigurationsentwurf bytegenau.

Der gesamte Arbeitsbereich wurde einschließlich versteckter Verzeichnisse und Abhängigkeitscaches durchsucht. Einziger tatsächlicher Projekt-Checkout: `/workspace/Simulation-Aquarium`, Remote `Feerson1617/Simulation-Aquarium`, keine Submodule. Der Server-Symlink zeigt auf genau diesen Checkout. `/workspace/.git` ist eine leere Schutzfläche und kein Git-Repository. Bei der endgültigen Speicherung des Umgebungsentwurfs werden Discovery und vollständiger lokaler HEAD erneut geprüft; keine Repositoryliste wird anhand des Ordnernamens geraten.

## WebKit: konkrete Grenzen

Der offizielle Download wurde versucht und vom verwalteten Proxy für `cdn.playwright.dev` und `playwright.download.prss.microsoft.com` mit403 abgewiesen. Keine Umgehung der Regeln. Außerdem fehlen laut dpkg die erforderlichen Pakete `libgles2`, `libgtk-4-1`, `libharfbuzz-icu0`, `libhyphen0`, `libmanette-0.2-0`, `libwoff1`, `gstreamer1.0-libav` und `xvfb`; der offizielle install-deps-Trockenlauf kann sie im gegenwärtigen Paketbestand nicht auflösen. Die vollständige offizielle Abhängigkeitsliste wird vom installierten Playwright bestimmt, nicht manuell verkürzt.

Für den zu prüfenden Cloud-Setupentwurf sind daher diese zusätzlichen offiziellen Schritte vorgesehen:

```bash
python3 -m playwright install-deps webkit
PLAYWRIGHT_BROWSERS_PATH=/workspace/aquarium-devtools/playwright python3 -m playwright install webkit
```

Die Systempakete benötigen die Installationsrechte der Cloud-Einrichtung. Die Befehle sind hier Vorbereitung, keine Behauptung einer erfolgreichen Installation. Bestehende Setuphelfer, Paketmanagerfreigaben und Speicherpfade bleiben erhalten. Ergänzte Netzwerkziele werden einzeln begründet; kein allgemeiner Internetzugriff und keine neuen Zugangsdaten nötig.

## Prüfungen nach tatsächlicher Installation

Der Fach-, Quest-, R1–R8- und Bildprüfer akzeptiert `AQUARIUM_BROWSER=webkit`; der Chromium-Default und dessen Startargumente bleiben gleich. Dieselben biologischen Aktionen, Antwortprüfungen und Exporte werden benutzt, keine vereinfachte Ersatzquest.

```bash
PLAYWRIGHT_BROWSERS_PATH=/workspace/aquarium-devtools/playwright AQUARIUM_BROWSER=webkit python3 tests/biology_quality_browser.py
PLAYWRIGHT_BROWSERS_PATH=/workspace/aquarium-devtools/playwright AQUARIUM_BROWSER=webkit python3 tests/quest_browser.py
PLAYWRIGHT_BROWSERS_PATH=/workspace/aquarium-devtools/playwright AQUARIUM_BROWSER=webkit python3 tests/learning_review_browser.py
PLAYWRIGHT_BROWSERS_PATH=/workspace/aquarium-devtools/playwright AQUARIUM_BROWSER=webkit python3 tests/biology_visual_browser.py
```

Die Questgruppe umfasst alle14 Desktopwege und zusätzliche vollständige Touchwege in768×1024. Der native Touch-Ziehteil des separaten Geräteprüfers verwendet Chromium-CDP und bleibt als solcher gekennzeichnet. Linux-WebKit ist ebenfalls kein physisches Safari-iPad; eine echte Hardwareprüfung und Unterrichtserprobung bleiben getrennt offen.

## Konfigurationsstatus und Quellen

Der bisherige Entwurf enthält bereits api.github.com und feerson1617.github.io, ist aber nicht als aktive Laufzeitregel beobachtet. Für Browserinstallation, aktuelle PR-Prüfung und regionale Quellen sind die jeweiligen konkreten Ziele nötig. OSPAR-/Nationalpark- und öffentliche PR-Vorschauabrufe scheiterten ebenfalls mit CONNECT403. Die vorhandene Curriculum-PDF wurde unabhängig davon tatsächlich gelesen.

Ein gespeicherter Entwurf führt keine Befehle aus, installiert keine Pakete und aktiviert keine Netzwerkregel. Review, Speichern und Veröffentlichen der **Cloud-Umgebung** erfolgen im unterstützten Konfigurationsablauf. Eine Wiederherstellung in einer neuen Aufgabe wird erst nach tatsächlicher Prüfung als verifiziert bezeichnet. Aktive Umgebung und bloßer Entwurf werden im abschließenden [Prüfbericht](VALIDATION.md) getrennt angegeben.
