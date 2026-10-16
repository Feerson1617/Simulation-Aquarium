# Phase 1 – durchgeführte Prüfung

Prüfdatum: 16. Oktober 2026. Branch: `feature/tweezers-aquascaping-phase-1`. Die eingebetteten bisherigen Bild-/Modelldaten wurden bei der Integration nicht verändert.

| Prüfung | Tatsächlich ausgeführtes Ergebnis |
| --- | --- |
| `node --test tests/aquascaping.test.mjs` | **12/12 bestanden**: bewegliche Kategorien, rotierte/skaliert begrenzte Grundflächen, nicht endliche Eingaben, Kollisionen, Innen-/Außentechnik, Schwimmpflanzen, freie Kaufpositionen, volle Flächen, Bodenneigung und gültige eigenständige HTML-Bündelung |
| `python3 tests/aquascaping_browser.py` | **12 Prüfgruppen bestanden** unter `/Simulation-Aquarium/`: alter v1-Spielstand, echte Mausbewegung, Kamera, Animation, Speichern/Wiederladen, Esc, Hindernisse, Pointer Capture, alle sechs Modelle, Wasserarten, echte Touch-Ereignisse/Touch-Abbruch, Hochformat, Tastatur und Ressourcenfehler |
| Abschließende Maus-/Touch-Aufnahmen | Beide Gesten auf dem endgültigen Stand nochmals ausgeführt; sichtbare geschlossene 3D-Backen, verschobenes Objekt und unveränderte Kamera geprüft; Screenshots aktualisiert |
| Größenwechsel während des Ziehens | Geste wird abgebrochen; zuvor gespeicherte Position bleibt erhalten |
| `python3 tests/standalone_browser.py` | Heruntergeladenes HTML allein gestartet, neue Dekoration gerendert und Pinzette eingeschaltet; keine zusätzlichen HTTP-Modul-/CSS-/Assetabrufe |
| Vorhandener Bereitschaftslauf | **13/13 bestanden**, einschließlich Spielstart, WebGL, Freiem Spiel, 120-Liter-Becken, Pflanze/Tier, Wasserprüfung, Zeitfortschritt, JSON-Export/-Import, Wiederaufnahme, sämtlichen acht Tutorialschritten und Touch-Menü im Hochformat |
| JavaScript / Ressourcen | Keine JavaScript-Ausnahmen, Shaderfehler oder fehlenden neuen Modul-/CSS-Dateien in den erfolgreichen Browserläufen; keine externen Laufzeitabrufe im geprüften Spielablauf |
| Git | Änderungen auf eigenem Branch; `git diff --check` ohne Befund; `AGENTS.md` unverändert |

Der Bereitschaftslauf wurde abschließend mit unveränderten Spieldateien und Exitstatus 0 ausgeführt. Er wird von der eingerichteten Cloud-Umgebung unter `/workspace/aquarium-devtools/check.py` bereitgestellt. Sein maschinenlesbarer Bericht befindet sich in dieser Umgebung unter `/workspace/aquarium-devtools/results/20261016T130248.326862Z/report.json`. Der gezielte Browserbericht liegt unter `/tmp/aquarium-phase1-results/20261016T124945/report.json`; die zusätzlich aktualisierten Maus-/Touch-Screenshots stammen vom endgültigen Stand.

Belege im Repository:

- [Maus: Pinzette hält eine Wurzel](screenshots/tweezers-mouse.png)
- [Touch: Pinzette hält eine Pflanze](screenshots/tweezers-touch.png)
- [Fünf Süßwasser-kompatible Ergänzungen](screenshots/decorations.png)
- [Meerwasser-Riffhöhle](screenshots/reef-cave.png)

**Offene Prüfgrenzen:** Es stand kein echtes Safari-iPad zur Verfügung. Chromium verwendet in dieser Cloud SwiftShader; die Läufe belegen Funktionen und Darstellung, keine Geräte-Bildraten. Direkte `file:`-Navigation wird vom verwalteten Browser mit `ERR_BLOCKED_BY_ADMINISTRATOR` gesperrt. Deshalb wurde die heruntergeladene HTML-Datei allein über einen lokalen Server geprüft; ein direkter Dateiaufruf wird nicht als bestanden ausgegeben. Die vorhandene fehlende `favicon.ico` erzeugt weiterhin einen ausdrücklich erfassten 404-Konsolenbefund. Ein langfristiger Biologie-/Stabilitätstest aller Arten gehörte nicht zu Phase 1.

Die Kollisionsprüfung verwendet konservative Grundflächen und keinen vollständigen 3D-Physiksolver. Die prozeduralen Modelle sind naturorientiert und unterscheidbar, noch nicht fotorealistisch. Weitere technische Grenzen und Assetherkunft stehen in [AQUASCAPING.md](AQUASCAPING.md), die späteren Entwicklungsschritte in [ROADMAP.md](ROADMAP.md).
