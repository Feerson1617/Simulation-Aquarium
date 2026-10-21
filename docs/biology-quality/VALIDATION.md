# Prüfung A01–A11: Ergebnisse und Grenzen

Die Korrekturen sind auf dem bestehenden [PR #8](https://github.com/Feerson1617/Simulation-Aquarium/pull/8), Branch `feature/biology-learning-environments`, umgesetzt und in Chromium geprüft. **139/139 Modultests und 95 Browserprüfpunkte bestanden**, zusätzlich der vollständige Einzel-HTML-Download. **WebKit und echtes Safari-iPad sind noch nicht abgenommen.** Die verbleibende WebKit-Installation ist durch die aktive Cloud-Netzwerkregel blockiert; lokale Bibliotheken sind inzwischen ohne Root-Rechte bereitgestellt. Die Umgebung wird deshalb nicht als vollständig für beide Engines eingerichtet bezeichnet.

[Verbindlicher Auftrag](REQUEST.md), [Korrekturmatrix A01–A11](MATRIX.md), [alle 14 Lernziele und erforderlichen Handlungen](MISSIONS.md), [Umgebung und Installation](ENVIRONMENT.md). Ausgangspunkt: `6c86274bac47f96fe6309355f851713f2d42cbc0`. Kein neuer PR, kein Merge und kein Push auf main; `AGENTS.md`, Assets und Pagesworkflows unverändert.

## Tatsächlich abgeschlossene Prüfungen

`node --test tests/*.test.mjs`: **139 bestanden**, 0 fehlgeschlagen, 0 übersprungen. [Ungekürztes Protokoll](evidence/modules.log). Die 19 neuen Fachfälle ergänzen die bisherigen Tests; ältere120/81- und Zwischenlaufzahlen werden nicht addiert.

| Browsergruppe | Ergebnis | Beleg |
| --- | --- | --- |
| Biologische Kernproben, Fischstatus, Labor und Hilfenstufen | **11 bestanden** | [Bericht](evidence/biology/report.json), [Protokoll](evidence/biology.log) |
| 14 vollständige Desktopmissionen, drei Touchwege, Freiforschen/Lehrkraft/Hilfen/Migration | **26 bestanden** | [Bericht](evidence/quests/report.json), [Protokoll](evidence/quests.log) |
| Geräte/Fokus/Altwerte/Übernahme in drei Eingabeprofilen | **18 bestanden** | [Bericht](evidence/devices/report.json), [Protokoll](evidence/devices.log) |
| R1–R8, aktuelle und historische Lernprodukte | **12 bestanden** | [Bericht](evidence/review/report.json), [Protokoll](evidence/review.log) |
| Start, freies Becken, Katalog, Speichern/Laden, acht Touch-Tutorialschritte | **13 bestanden** | [Bericht](evidence/readiness/report.json), [Protokoll](evidence/readiness.log) |
| Pinzette, Kollisionen, Maus-/Touch-/Tastaturplatzierung und Modelle | **12 bestanden** | [Bericht](evidence/placement/report.json), [Protokoll](evidence/placement.log) |
| Bedingte Populationserklärungen und kompakter Hochformat-Geräteweg | **3 bestanden** | [Bericht](evidence/visual/report.json), [Protokoll](evidence/visual.log) |

Die 95 Punkte sind die tatsächlich gemeldeten Prüfpunkte dieser sieben Gruppen, einschließlich bewusst wiederholter Touchabläufe; keine Behauptung von 95 verschiedenen Missionen. Alle 14 Desktopwege verlangen die neuen biologischen Handlungen, echte Daten und Auswertungen. Drei Missionen wurden zusätzlich mit Touch in 768×1024 abgeschlossen. Die Gerätegruppe prüft Maus/Tastatur sowie Touch in 768×1024 und 1366×1024. Keine Questschritte wurden zur Fertigstellung direkt gesetzt.

Die Tests lesen tatsächliche berechnete Ergebnisse, geben auch falsche Antworten ab, laden echte Dateien herunter und prüfen erneut geladene Stände. Eigene kurze Begründungen werden gesondert eingegeben und als solche gekennzeichnet; angeklickte Vermutungen und Spieltexte bleiben andere Belegarten. In Lehrkraftansichten wurden aktuelle Produkte und echte ältere Dateien gelesen. Der alte Einzel-Neon-Kompatibilitätsstand behält seine bekannte Gruppenlücke und alten Wasserwerte; er wird ausdrücklich nicht als neu vorbereitetes gesundes Startbecken ausgegeben.

## Konkrete biologische Befunde

| Fall | Tatsächliches Ergebnis | Aussage |
| --- | --- | --- |
| Erwärmung, drei Spieltage | Kontrolle 25 °C, Versuch 25,9024 °C bei Soll 27 °C | Sollwert ist kein sofortiger Istwert; Heizen wirkt allmählich.20/24,5/25 °C erfüllen das Erwärmungsziel nicht. |
| Licht/Dunkelheit, drei Spieltage | 8,2839 gegenüber 8,1639 mg/L O₂ | Vergleich gleicher Zeitpunkte; dieser Lauf zeigt keine Sauerstoffkrise. |
| Tatsächliche Mendel-F1/F2 | F1: 24 Aa. F2: 6 AA/10 Aa/8 aa, also 16 dunkel/8 hell | 3:1 ist eine theoretische Wahrscheinlichkeit, keine erzwungene Wurfanzahl. |
| Kontrollierter Fischverlust-Import |0 lebende/6 verstorbene Fische,3 lebende Wirbellose, Kondition null | Schnecken erzeugen keinen positiven Fischzustandswert. Dieser Import ist ein gezielter Kompatibilitätsfall. |
| Sanierung 50 %/14 Tage | Kontrolle endet 48,25 mit Nitritursache; Versuch erreicht 59 mit 6 lebenden Fischen | Seiten laufen unabhängig; nach 48,25 werden keine Kontrollmessungen erfunden. |

Mendel-Eltern: F1 aus 1/6, F2 aus 25/26 der tatsächlich erzeugten F1. Die bewusst gewählte Vermutung „Nur hell“ bleibt eine Auswahl mit Zielgeneration2, kein eigener Text und keine F1-Vorhersage. JSON und Reload bewahren das Archiv. Die Zahlen sind konkrete Ergebnisse dieses dokumentierten Zufallsstarts, keine universellen Naturvorhersagen.

Nitrifizierer wachsen in den tatsächlichen Kernproben nur bei Umsatz geeigneter Stickstoffverbindungen; ohne Substrat sinkt der Bestand. Die bisherige Stickstoffteilbilanz bleibt beim Umsatz erhalten. Schaden, Warnung und aktuelle Laboranzeige nutzen dieselbe freie, pH-/temperaturabhängige NH₃-Konzentration. Die NH4-Messung wird davon getrennt. Alle 17 normalen vorbereiteten Lernprofile wurden gegen unveränderte tatsächliche Artansprüche geprüft; nur die ausdrücklich gestörten Gesundheits-/Sanierungsmissionen erlauben ihre vorgesehene Nitritbelastung.

## Tatsächliche Bildkontrolle

Geprüft wurden [neutraler Verlauf](evidence/visual/population-neutral.png), [gerichteter Verlauf](evidence/visual/population-selected.png), [Hochformatplan](evidence/visual/warming-plan-final-portrait.png), [Geräteregler](evidence/visual/warming-device-final-portrait.png), [NH₃ erhöht](evidence/biology/ammonia-lab-alkaline.png), [NH₃ gering](evidence/biology/ammonia-lab-acid.png) und [keine Fische bei lebenden Schnecken](evidence/biology/no-fish-live-snails.png).

Neutrale und gerichtete Bilder zeigen unterschiedliche, zur gewählten Umwelt passende Erklärungen sowie tatsächliche Kurven mit „Gruppe“-Beschriftung. Im normalen Geräteplan sind Zahleneingabe, weitere Werkzeuge, Zeiten und Wiederholungen aufklappbar; nach Öffnen erscheint das große Rädchen mit Touchhinweis. Die 3D-Szene ist sichtbar. Im offenen Hochformatplan bleibt sie relativ klein; zum direkten Einstellen wird der Geräteweg hervorgehoben und die Szene größer dargestellt. Vollständiger Fotorealismus oder Hardwareleistung werden durch diese UI-Bilder nicht behauptet. Der zuvor geprüfte A11-Prototyp liegt getrennt unter [Entwicklungsevidenz](evidence/development/prototype/report.json).

## Einzelner HTML-Download

**151.198.382 Bytes**, aus der tatsächlichen Anwendung heruntergeladen. Die Datei wurde allein ohne Begleitdateien bereitgestellt. Fensterlicht, Regler/Fokus, Genetik, Farbvariante, Dekoration, Pinzette, Questmodul und tatsächlicher biologischer Vergleich funktionieren ohne zusätzliche HTTP-Ressourcen. [Protokoll](evidence/standalone.log).

**Native `file:`-Navigation ist durch die verwaltete Chromium-Richtlinie gesperrt.** Deshalb wurde dieselbe einzelne Datei über Loopback geprüft. Das ist kein bestandener nativer Offline-/Safari-Dateitest; die Richtlinie wurde nicht umgangen.

## Quellstände und Entwicklungsläufe

Letzte Änderung am biologischen Kern: `c904addd9a38ac85aea34cb5a582e8d388c8e1e0`. Letzte Spielquellenänderung: `27003a429d1498083a14e68ca3fceb5c65618d04`, ausschließlich die Wiederherstellung der kontextbezogenen Sauerstoffhilfe. [Exakter Einfügevergleich](evidence/help-delta.json). Alle anderen HTML-/MJS-/CSS-Dateien blieben gegenüber c904add bytegleich. Vor jeder Gruppe und danach kontrolliert der serielle Prüfer die Quellhashes. [Zusammengeführter Ausführungsnachweis](evidence/status.json), [Quellhashes](evidence/runtime.sha256).

Die 17 vollständigen Missionswege wurden vor dieser einzelnen Hilfeschaltfläche abgeschlossen. Freie Jahrgänge und Lehrkraftimporte folgten; die betroffene Hilfenoberfläche, biologische Ansichten und alle weiteren Gruppen wurden am aktualisierten Stand geprüft. Erfolgreiche Abschnitte wurden beim Fortsetzen erhalten. Der zusammengeführte Bericht nennt die tatsächlichen Quellen und Originalzustände; es wird weder ein vollständig wiederholter Durchlauf noch Bytegleichheit dieser einen UI-Datei über alle Phasen behauptet.

Der AST-Vergleich gegen 6c86274 weist im eingebetteten Kern nur die beabsichtigten Änderungen an `qs`, `Qf`, `tp`, `z1` nach. Geschützte thermische, Lade-, Zeit-/Render- und genetische Funktionen bleiben gleich. [Quellaudit](evidence/source-audit.json). Die R1-Paarrechner-Grenze am letzten Rechenschritt bleibt im vorhandenen Modultest geprüft; der tatsächliche Browserkern zeigt den verschobenen Abbruch im 3,25-Tage-Lauf exakt an 48,25. Alte Produkte mit damaligem Ende48 bleiben unverändert.

Fehlgeschlagene oder bewusst unterbrochene Entwicklungsläufe sind [getrennt erhalten](evidence/development/README.md): undefiniertes F2-Prognosefeld, wiederhergestellte Sauerstoffhilfe, Prüfzugriff auf eingeklappte Zahlen, Gesundstart versus echter Altstand, dynamischer Details-Locator und SVG-Textzugriff. Nach der Umgebungsverbindungsänderung schloss die Gerätegruppe erfolgreich ab; der Wrapper war danach nicht mehr vorhanden. Die übrigen Gruppen wurden separat gestartet. Kein bestandener Gerätefall wurde dafür wiederholt. Originale Questfehlberichte stehen unter `evidence/quests/report-before-resume*.json`; ihre später fortgeschriebene `report.json` ist ausdrücklich ein zusammengesetzter Nachweis.

## Umgebung, Quellen und offene Abnahme

Chromium 154.0.8037.57/SwiftShader, Playwright 1.62.0, Node 24.19.0, Python 3.12.14. Die 19 offiziellen Debianpakete wurden mit verifizierten Paketlisten/Archivhashes in einen privaten Entwicklungsordner entpackt. Alle16 ELF-Objekte finden ihre Abhängigkeiten; sechs benötigte Bibliothekswurzeln lassen sich laden. Der wiederholte Setupaufruf verifiziert die vorhandenen Dateien. Systempakete und Spielquellen wurden dafür nicht geändert. [Paketbeleg](evidence/setup/webkit-portable-receipt.json), [Setup](evidence/setup/portable-setup.log), [Wiederholung](evidence/setup/portable-repeat.log), [Treiberprobe](evidence/setup/driver-probe.log).

**WebKit-Binary und dessen Spiel-/3D-Prüfungen fehlen weiterhin:** Der offizielle Download wurde vom Cloud-Proxy mit403 gesperrt. Ein gespeicherter Konfigurationsentwurf aktiviert keine Netzwerkregel; aktueller Entwurf/Beobachtung und konkrete nächste Schritte stehen in [ENVIRONMENT.md](ENVIRONMENT.md). Die Bibliotheksprobe ist kein WebKit- oder Safari-Spieltest. Physisches Safari-iPad, Unterrichtserprobung und frisch wiederhergestellte neue Cloud-Aufgabe bleiben offen. Native Touch-Ziehgesten der separaten Gerätegruppe verwenden Chromium-CDP.

Originalcurriculum tatsächlich aus der bereitgestellten PDF gelesen:36 Seiten, SHA-256 `faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f`; verwendete Einheiten S. 9–10,14–15,19–20 abgeglichen. Regionale Karten sind kurze fachliche Zusammenfassungen mit Quellen, keine Originalzitate, erfundenen Mengen oder Plastik-Schadenskurven. Der Liveabruf von OSPAR/Nationalpark und öffentlicher Pagesvorschau ist durch die beobachtete Netzwerkregel blockiert. Keine bestätigten neuen externen CI-/Pagesprüfungen oder aktualisierte GitHub-PR-Beschreibung behauptet; [PR_BODY.md](../learning/PR_BODY.md) wird als vorbereiteter Beschreibungstext im Branch gepflegt.

Die Modelle sind didaktisch vereinfacht und nicht empirisch kalibriert. Ein abgeschlossener Lernweg ist keine automatische Benotung und kein Nachweis von Lernwirksamkeit im Unterricht. Keine zusätzlichen Konten, kostenpflichtigen APIs oder Laufzeitdienste eingeführt.
