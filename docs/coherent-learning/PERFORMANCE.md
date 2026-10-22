# Messungen und Arbeitsbudgets des Prototyps

**Historische Gate-Messung.** Aktuelle Einzeldatei und Messwerte: [Abschlussprüfung](FINAL_VALIDATION.md#leistung-einzeldatei-und-weitere-grenzen). Die folgenden Budgets bleiben Ziele für die Geräteprüfung.

Anwendungsstand `a7ee966a3116faf4a231050718dc899fc1eea3fb`. Linux, Cloud-Software-Rendering, Profil `ipad`, 1366 × 1024 CSS-Pixel bei Pixeldichte 1. Während der Messung liefen weitere Browserprüfungen. Diese Zahlen sind **keine Messung einer iPad-GPU und keine bestandene Leistungsabnahme**.

## Tatsächliche Beobachtung

Der Einzel-HTML-Lauf misst vom Aufruf der lokalen HTTP-Datei bis zu beiden geladenen Modellsätzen: Chromium 23,59 s, WebKit 17,18 s. Die jeweils nur fünf Sekunden lange Beobachtung im Ergebnisfenster ergibt 0,39 beziehungsweise 1,56 gezeichnete Vergleichsbilder/s. Diese kurze, nebenläufige Softwaremessung ist zu niedrig für eine flüssige Darstellung und nicht belastbar auf Hardware übertragbar.

Die Instrumentierung meldete 144 Geometrien und 32 Texturen, einen WebGL-Kontext und je 19 tatsächliche Beckenobjekte. Das sind Ressourcenanzahlen, **keine GPU-Speicherwerte in Bytes**. Die zeitlich gemessenen Zeichenaufrufe enthalten JavaScript und Treiberwartezeit; sie sind keine reine GPU-Zeit. Die Rohdaten bleiben in [Chromium](evidence/standalone/chromium/report.json) und [WebKit](evidence/standalone/webkit/report.json) erhalten.

Die öffentliche PR-Vorschau lud im WebKit-Smoke-Test bis zu beiden Modellgruppen in etwa 14,0 s. CDN, nicht isolierter Kalt-/Warmcache und nebenläufige Tests begrenzen den Vergleich. Auch dieser Wert beweist kein Ladebudget auf einem Schulnetz.

Das damals gemessene Basisbackup hat 151.261.415 Bytes, SHA-256 `fb6f14f415e320b354a9dd9980fe7b648000b65fe32ea22308db874047d1ee02`. Es bleibt außerhalb von Git. Die Größe ist für Schul-iPad-Offline-Verteilung problematisch; aus einem erfolgreichen HTTP-Test wird keine native Datei- oder Speicherfreigabe abgeleitet.

Die spätere Korrektur ausschließlich der technischen Ergebnisansicht verändert keine dieser Renderfunktionen. Das finale Backup hat 151.262.469 Bytes (+1.054), SHA-256 `ade2e5f95adcd207f78629c5cc9ac6c3bf991364ba8b39ddbc64e9861c6e8079`; siehe [aktueller Artefaktnachweis](evidence/standalone-artifact.json). Die genannten Leistungsmessungen bleiben Messungen der Basisdatei und werden nicht als neue Messreihe ausgegeben.

## Konkrete Budgets für die nächste Geräteprüfung

| Bereich | Arbeitsbudget / unverletzliche Grenze | Stand |
|---|---|---|
| Vergleich | Ein WebGL-Kontext, beide Seiten gleichzeitig und alle tatsächlichen Tiere erhalten | Gemessen erfüllt |
| Auflösung | Vorhandenes iPad-Profil, Pixeldichte höchstens 1,25; keine versteckte Erhöhung | Profil erhalten; Messung bei Dichte 1 |
| Zeichnen | Vergleich höchstens 24 Zeichnungen/s; auf dem Ziel-iPad mindestens 20/s über 30 s anstreben | Obergrenze implementiert; Hardware-Untergrenze offen |
| Ladezeit | Vergleich auf dem Ziel-iPad nach warmem Laden in höchstens 5 s, kalter Start in höchstens 15 s anstreben | Hardware-/Schulnetzprüfung offen; Softwarelauf überschreitet teils 15 s |
| Ressourcen | Beim gleichen eingefrorenen Besatz nach zehn Zeit-/Profilwechseln kein fortlaufendes Wachstum der Ressourcenanzahlen | Entsorgung und Profilwechsel funktional geprüft; längere Ressourcenreihe offen |
| Archiv | Bisheriger Versuch bleibt bei Speicherfehler erhalten; fünfte Reihe archiviert die älteste gesondert | Fehler-Injektion und tatsächlicher Mehrmissionslauf geprüft |
| Daten | Animation verändert keine Biologiewerte und keinen biologischen Zufallsstand | Zustandsvergleich und unveränderte Kernfunktionen geprüft |

Das sind nachvollziehbare Ziele für die nächste Hardwareprüfung, keine nachträglich als bestanden gesetzten Zahlen. Vor einer breiten Freigabe sind vor allem Bildrate, Schulnetz-Ladezeit und Backup-Größe zu klären. Nötige Optimierungen dürfen Tierzahlen, Vergleichspartner, biologische Regeln oder gespeicherte Belege nicht verfälschen.
