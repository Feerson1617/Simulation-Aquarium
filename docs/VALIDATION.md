# Aktuelle Prüfung der Phasen 2–5

Prüfdatum: **18. Oktober 2026**, Branch `feature/catalog-ecosystem-scenarios`. Diese Ergebnisse wurden in der aktuellen Cloud-Sitzung neu erhoben; frühere lokale Vorarbeiten wurden nicht als Nachweis übernommen.

| Prüfung | Ergebnis |
| --- | --- |
| `node --test tests/*.test.mjs` | **33/33 bestanden**: Pinzettengeometrie, vollständige HTML-Bündelung, 181 Bilddateien/Quellennachweise, Nahrungsrollen/-pfeile, begründete Lücken, mehrere Lösungen, Umweltprüfung, Szenariometadaten, N-Stöchiometrie, O₂-Begrenzung, Mineralisierung, Zeitschrittvergleich, Kleinstnahrung, Schulbahnen und Auswahlring |
| `python3 tests/ecosystem_browser.py` | **12 Prüfgruppen bestanden**: sechs Analyseansichten, tatsächliche Versorgungslücke, gestufte Hinweise, Umweltprüfung, Nahrung/Gesundheit im gemeinsamen Rechenkern, echter Futterkauf aktualisiert das Netz, Szenario-Notizen/Hinweise nach Neuladen, Neustart mit Sicherung, Export/Import, alle fünf Szenarien, Pflanzen-/Wassereingriffe, Tag/Nacht, freier Altspielstand und Tablet-Touch |
| Schutz des freien Spielstands | Bei Szenariostart, Speicherung, Wiederaufnahme, Neustart und Export/Import blieben die gespeicherten Bytes des freien Aquariums unverändert; anschließend wurde der alte Stand wieder aufgenommen |
| `python3 tests/aquascaping_browser.py` | **12 Prüfgruppen bestanden**, einschließlich echter Maus-/Touch-Gesten, Kamerasperre, Speichern/Wiederladen, Esc, Hindernissen, Pointer Capture, allen sechs Modellen, Wasserarten, Touch-Abbruch, Hochformat und Tastatur |
| `python3 tests/standalone_browser.py` | Heruntergeladene HTML-Datei allein gestartet, Dekoration gerendert und Pinzette bedient; keine zusätzlichen HTTP-Modul-/CSS-/Bildabrufe. Direkter `file:`-Aufruf durch Browserrichtlinie blockiert, daher isolierter lokaler Server mit ausschließlich der HTML-Datei |
| `/workspace/aquarium-devtools/check.py` | **13/13 Prüfgruppen bestanden auf dem endgültigen Spielstand**: Syntax, Projektpfad/HTTP, WebGL, Freies Spiel, Becken, Artenkauf, Wasser/Zeit, Speicherexport/-import/-wiederaufnahme, alle acht Tutorialschritte per Touch und Hochformat-Menü |
| Bilddateien mit Pillow | Alle 181 WebP decodiert, jeweils 384 × 256 Pixel, nicht einfarbig; 648746 Byte Bilddaten insgesamt |
| JavaScript / Laufzeitressourcen | Keine JavaScript-Ausnahmen, fehlenden Spielressourcen, Shaderfehler oder externen Laufzeitabrufe in den erfolgreichen geprüften Abläufen. Vorhandene automatische `favicon.ico`-404-Anfragen separat protokolliert |
| Repository | `git diff --check` ohne Befund; `AGENTS.md`, `main` und Pages-Workflows nicht geändert; Featurestände auf GitHub gepusht |

Maschinenlesbare Nachweise liegen dauerhaft im Repository: [Ökosystem/Szenarien](validation/ecosystem-2026-10-18.json), [Pinzette](validation/aquascaping-2026-10-18.json), [Grundprüfung](validation/readiness-2026-10-18.json). Die Ursprungsberichte/Screenshots liegen in dieser Sitzung zusätzlich unter `/tmp/aquarium-ecosystem-results/20261018T164104`, `/tmp/aquarium-phase1-results/20261018T163112` und `/workspace/aquarium-devtools/results/20261018T163459.523515Z`.

Zusätzliche gezielte Sicht-/Tastaturprüfung auf dem abschließenden Stand: hervorgehobene Verbindungen bei Artauswahl, aktuelle Schrittumsätze im Stickstoffbild, Esc/Fokusrückkehr und Freigabe der pausierten 3D-Szene bestanden.

Bilder: [Nahrungsnetz](screenshots/foodweb.png), [Ausgewählte Beziehungen](screenshots/foodweb-selected.png), [Stickstoffumsätze](screenshots/nitrogen-processes.png), [Szenario im Spiel](screenshots/scenario-aquarium.png), [Touch-Mikroskop](screenshots/analysis-touch.png), [Shop](screenshots/catalog-products.png), [Modellvergleich](screenshots/catalog-models.jpg).

**Prüfgrenzen:** Chromium mit SwiftShader und emuliertem Touch belegt keine Safari-/Schul-iPad-Kompatibilität oder echte Geräte-Bildraten. Es gab keinen direkten Dateiaufruftest und keine Langzeitkalibrierung sämtlicher Arten. Die Szenariowirkungen wurden über 1–3 Spieltage, nicht über Monate geprüft. Fotorealismus und geschlossene Stoff-/Energiebilanzen sind nicht erreicht; die genaue Abgrenzung steht in [ECOSYSTEM.md](ECOSYSTEM.md) und [CATALOG.md](CATALOG.md). Kein Merge oder öffentliche Veröffentlichung wurde ausgelöst. Die GitHub-API liefert `Forbidden`; daher wurde noch kein Pull Request angelegt.

---

## Historischer Nachweis der Phase 1

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
