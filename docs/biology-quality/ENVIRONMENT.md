# Entwicklungsumgebung und offene WebKit-Prüfung

Die aktuelle statische Anwendung ist in Chromium mit139 Modultests und95 Browserprüfpunkten sowie dem vollständigen Einzel-HTML-Download geprüft. Es gibt keinen erforderlichen npm-Build, keine Datenbank, keine externen Laufzeitdienste und keine zusätzlichen Accounts. **Die verlangte WebKit-Abnahme ist noch offen; die Umgebung wird deshalb nicht als vollständig für beide Engines eingerichtet bezeichnet.** [Prüfbericht](VALIDATION.md).

## Tatsächlich vorhandene und geprüfte Werkzeuge

Git 2.52, Node 24.19/npm 11.9, Python 3.12, Playwright 1.62 und Chromium 154 mit lokalem SwiftShader. Setup-/Serverhelfer und Caches liegen außerhalb des Spiels unter /workspace/aquarium-devtools. Diese Schritte wurden wiederholt ausgeführt:

```bash
cd /workspace/Simulation-Aquarium
bash /workspace/aquarium-devtools/setup.sh
python3 /workspace/aquarium-devtools/start.py
node --test tests/*.test.mjs
```

Der Starter bestätigt HTTP200 und den tatsächlichen SHA-256 der aktuellen index.html, bevor er einen vorhandenen Server wiederverwendet. Liveprozesse bleiben nach Wiederherstellung nicht garantiert. Browserprüfungen laufen mit isolierten Testprofilen seriell; daraus werden keine Hardware-FPS oder Safari-Eigenschaften abgeleitet.

Der gesamte Arbeitsbereich wurde einschließlich versteckter Verzeichnisse und Abhängigkeitscaches durchsucht. Einziger tatsächlicher Projekt-Checkout: `/workspace/Simulation-Aquarium`, Remote `Feerson1617/Simulation-Aquarium`, keine Submodule. Der Server-Symlink zeigt auf diesen Checkout. `/workspace/.git` ist eine leere Schutzfläche, kein Git-Repository. Bei der abschließenden Deklaration werden Discovery und vollständiger lokaler HEAD erneut geprüft. Keine Ordnernamen oder Remote-Tipps ersetzen die tatsächliche lokale Commit-ID.

## Lokale WebKit-Bibliotheken ohne Root-Rechte

Die aktuelle Shell ist UID 1000 ohne sudo. Eine reguläre Systeminstallation war damit nicht verfügbar. Die nötigen19 offiziellen Debianpakete wurden stattdessen ausschließlich in `/workspace/aquarium-devtools/webkit-portable` bereitgestellt: eigener APT-Cache, verifizierte Debian-InRelease-/Paketlisten, zusätzliche SHA-256-Prüfung jeder Archivdatei gegen diesen Index und Entpacken ohne Ausführung von Maintainerskripten. Keine Systempakete wurden installiert oder aktualisiert. Private Cache-Locks betreffen nur den eigenen Cache; Signatur-, TLS- und Artefaktprüfung bleiben aktiv, Proxy und CA-Vertrauen erhalten.

Sechs benötigte Bibliothekswurzeln lassen sich laden; alle 16 enthaltenen ELF-Objekte finden ihre Abhängigkeiten. Der erneute Setupaufruf überprüft Dateien und Archive und verwendet den bestehenden geprüften Bestand. [Paket-/Dateibeleg](evidence/setup/webkit-portable-receipt.json), [erster vollständiger Erfolg](evidence/setup/portable-setup.log), [Wiederholung](evidence/setup/portable-repeat.log). Das Rezept ist gezielt für die vorhandene Debian 13-/Playwright 1.62-Umgebung geprüft.

```bash
python3 /workspace/aquarium-devtools/setup-webkit-portable.py
python3 /workspace/aquarium-devtools/run-webkit.py -m playwright --version
```

Der Runner setzt Bibliotheks-, Font-, Schema- und Cachepfade nur für den aufgerufenen Prozess, erhält die übrige Umgebung und wählt `AQUARIUM_BROWSER=webkit`. Normale Chromiumprüfungen bleiben davon unberührt. Der Playwright-Treiber wurde damit sauber initialisiert und beendet. **Der WebKit-Browser selbst ist noch nicht vorhanden.** Bibliotheks-/Treiberproben sind kein bestandener Spiel- oder 3D-Test.

## Verbleibender Download und anschließende Prüfungen

Der offizielle Browserdownload wurde für `cdn.playwright.dev` und `playwright.download.prss.microsoft.com` vom Cloud-Proxy mit403 gesperrt. Die Regel wird nicht umgangen. Nach tatsächlich aktiver Freigabe ist auszuführen:

```bash
python3 /workspace/aquarium-devtools/run-webkit.py -m playwright install webkit
```

Danach aus dem Repository nacheinander dieselben vollständigen Lernprüfer:

```bash
python3 /workspace/aquarium-devtools/run-webkit.py tests/biology_quality_browser.py
python3 /workspace/aquarium-devtools/run-webkit.py tests/quest_browser.py
python3 /workspace/aquarium-devtools/run-webkit.py tests/learning_review_browser.py
python3 /workspace/aquarium-devtools/run-webkit.py tests/biology_visual_browser.py
```

Der aktuelle Code dieser Prüfer unterstützt die Enginewahl; Chromium-Default und Startargumente bleiben gleich. Die Questgruppe umfasst alle 14 Desktopwege und drei vollständige Touchwege in 768×1024. Der native Touch-Ziehteil des separaten Geräteprüfers bleibt ausdrücklich Chromium-CDP. Linux-WebKit ist ebenfalls kein physisches Safari-iPad. Erst tatsächlicher Browserstart, sichtbare 3D-Szene und abgeschlossene Spielhandlungen begründen diese weitere Abnahme.

## Konfiguration, Netzwerk und Wiederherstellung

Der erste gespeicherte Entwurf ergänzte den damaligen tatsächlichen Repository-HEAD, Setup-/Startanweisungen und die vier Ziele `cdn.playwright.dev`, `playwright.download.prss.microsoft.com`, `www.ospar.org`, `www.nationalpark-wattenmeer.de`. Die bereits gespeicherten Ziele `api.github.com` und `feerson1617.github.io` sowie das Paketmanager-Preset bleiben erhalten. Keine Geheimnisse oder zusätzlichen Konten werden benötigt. Die administrative Installationsvariante wurde im gespeicherten Entwurf durch den tatsächlich geprüften lokalen Bibliotheksweg ersetzt. [Bestätigter Speichernachweis](evidence/environment-draft.json).

Ein gespeicherter Entwurf installiert nichts und aktiviert keine Netzwerkregel. Review, Speichern und Veröffentlichen der **Cloud-Umgebung** erfolgen über den unterstützten Konfigurationsablauf. Die Beobachtung der aktiven Umgebung ist davon getrennt; zuletzt wurde die alte eingeschränkte Regel ohne eigene Zielhosts bestätigt. OSPAR-/Nationalpark- und öffentliche PR-Vorschauabrufe waren ebenso mit CONNECT403 blockiert. Die bereitgestellte Curriculum-PDF wurde unabhängig davon gelesen.

Eine Wiederherstellung in einer neuen Aufgabe ist erst nach dortiger tatsächlicher Prüfung verifiziert. Der gespeicherte Installationsweg muss vorhandene geänderte Helfer erhalten und darf weder Spielquellen noch Tests oder Lockdateien verändern. Für den ausdrücklich autorisierten Entwicklungsauftrag liegen die Codeänderungen und ihre Nachweise separat auf dem bestehenden PR-Branch.
