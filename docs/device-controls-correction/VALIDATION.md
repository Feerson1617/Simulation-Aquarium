# Gezielte Korrektur nach unabhängiger Prüfung

Die drei P2-Befunde aus der unabhängigen Prüfung sind korrigiert: Fensterlicht behält Stärke und Dauer, Geräte speichern mit sinnvollem Tastaturfokus, neue Lernprodukte werden gegen die maßgebliche Modellkonstante geprüft. Hinzu kommen gemeinsame Schalter für Belüfter/Abschäumer, exakte alte Futterwerte und ein Schutz gegen alte ausstehende Questantworten nach einer wirkungslosen Neuberechnung. [Änderungen und Fundstellen](CHANGES.md).

Ausgangsstand: tatsächlicher PR-Head `5440886a4a6970558cba27379b7b847455aa4756`, main `666df90ac05de61181f380f2190539a9cef04044`. Der lokal saubere Vorgänger `b5751b0` wurde zuerst per Fast-forward aktualisiert; keine fremden Änderungen verworfen. Nur bestehender [PR #8](https://github.com/Feerson1617/Simulation-Aquarium/pull/8), Branch `feature/biology-learning-environments`; kein Merge und kein Push auf main. [Korrekturprompt](REQUEST.txt), [unabhängiger Prüfbericht](INDEPENDENT_REVIEW.txt).

## Aktuelle lokale Ergebnisse

`node --test tests/*.test.mjs`: **120/120 bestanden**, 0 fehlgeschlagen, 0 übersprungen. [Ungekürztes Protokoll](evidence/modules.log).

| Browsergruppe | Ergebnis | Tatsächlicher Quellcommit | Beleg |
| --- | --- | --- | --- |
| Geräte, Fokus, Fensterlicht, Altstand und Übernahme | 18 bestanden | `106199d` | [Bericht](evidence/devices/report.json) |
| Alle 14 Missionen, Touch, freie Jahrgänge, Hilfen, Migration | 26 bestanden | `106199d` | [Bericht](evidence/quests/report.json) |
| R1–R8, aktuelle und historische Lernprodukte | 12 bestanden | `3870260` | [Bericht](evidence/review/report.json) |
| Spielstart, freie Runde, Beckenplatzierung, vollständiges Touch-Tutorial, Speichern/Laden | 13 bestanden | `3870260` | [Bericht](evidence/readiness/report.json) |
| Pinzette, echte Maus-/Touch-Gesten, Kollisionen, Modelle und Tastatur | 12 bestanden | `3870260` | [Bericht](evidence/placement/report.json) |

Zusammen **81 erfolgreich gemeldete Browserprüfpunkte** in fünf Gruppen, einschließlich bewusst wiederholter Touchabläufe; keine Behauptung von 81 verschiedenen Missionen. Historische 74 Browserpunkte und unabhängige 117 Modultests werden nicht addiert. Alle 14 Missionen wurden in der aktuellen Questgruppe über die Oberfläche abgeschlossen; zusätzliche Touchabschlüsse betreffen drei Missionen. Keine direkte Manipulation der Questschritte.

Der vollständige HTML-Download wurde separat heruntergeladen und als einzige Datei geprüft: **151.156.244 Bytes**. Geräte-/Regler-/Lernmodule und Styles sind enthalten; Fensterlicht, Filter mit Fokus, Genetik, Dekoration, Farbvariante, Pinzette und echter biologischer Vergleich funktionieren ohne weitere HTTP-Ressourcen. [Protokoll](evidence/standalone.log). Native `file:`-Navigation: **durch verwaltete Chromium-Richtlinie gesperrt; dieselbe einzelne Datei über einen lokalen Server ohne Begleitdateien geprüft**.

## Quellstände und Nachvollziehbarkeit

Letzte Änderung an ausführbaren Spielquellen: `703ee49e04251bcad69325cfa1cf8845e46fd583`. Geräte-, Quest- und Modulgruppe liefen auf `106199d665e80ce7cf842b785053a503ff1e72cc`. Die weiteren Gruppen liefen auf `38702602ec5700c08a750e0255a3e7cc3a85bf80` nach zwei gezielten Korrekturen allein am neuen Altprodukt-Test. Danach werden nur Dokumentation und Belege ergänzt. **Alle ausgeführten HTML-/MJS-/CSS-Dateien sind über sämtliche verwendeten Quellstände bytegleich.** Auch wiederverwendete Testskripte und Helfer wurden gegen den neuen Stand auf identische Bytes geprüft. Es werden keine nicht ausgeführten Wiederholungsläufe behauptet.

[Maschinenlesbare Übersicht](evidence/verification.json), [Quellhashes](evidence/runtime.sha256), [Befehle, Zeitpunkte und echte Einzelcommits](evidence/status.json). Die Software-WebGL-Läufe verwendeten Chromium, Playwright und isolierte Profile, seriell. Das belegt Funktionen, keine Hardwareleistung.

Die Acorn-Quellprüfung gegen `5440886` bestätigt unveränderte zentrale Funktionen für Biologie, Zeit, Laden, Wasserwechsel und Renderer (`Qf`, `hd`, `ud`, `tp`, `y1`). Unter 554 obersten Funktions-/Klassendeklarationen änderte sich nur `U1`; weitere gezielte Änderungen betreffen die Hilfskonstante `Ti`, Imports und Ereignisverarbeitung. [Quellvergleich](evidence/source-audit.json). `AGENTS.md`, Assets und bestehender Pages-Vorschauworkflow bleiben unverändert.

## Inhalt der Prüfungen

- Maus/Tastatur und emulierter Touch mit **768×1024** sowie **1366×1024**: alle drei freien Jahrgänge, Temperaturquest, Experten-Altstand und Übernahme/Weiterrechnen. Tab/Shift+Tab, Pfeile, Escape, Enter, Touch-Ziehen/Abbruch, Schalter und erreichbares Weiterbedienen nach Speichern. Kein gleichzeitiges Kamerabewegen.
- 20/24,5/25/26 °C, wirkungslose 25-°C-Einstellung, veraltete Ergebnisantwort und Erklärung, Neuberechnung und Abschluss. Sollwert ändert die Wassertemperatur nicht sofort; das gemeinsame Modell mit 22 °C Raumtemperatur bleibt eine qualitative Vereinfachung.
- Dauerhafte Einstellungen bleiben beim Weiterrechnen erhalten; einmaliger Wasserwechsel wird nicht erneut angewendet. Übernommene Becken behalten Bakterien, historische Daten und andere Zustandsfelder. Der vorhandene Lade-Journaleintrag wird gesondert geprüft.
- R1-Sanierung: **50 % Wasserwechsel / 14 Tage**, Kontrolle endet tatsächlich **Tag 48**, Versuch erreicht unabhängig **Tag 59**. Fehlende spätere Kontrollwerte bleiben leer und als beendet markiert, einschließlich CSV und Lehrkraftansicht.
- Frische Produkte: `learning-devices-3` aus `LEARNING_MODEL_REVISION`, auch in der festgehaltenen Laufkonfiguration. Echter historischer Export: unverändert `learning-evidence-2`, unveränderte Originaldatei, sämtliche gelesenen Messwerte, Laufkonfigurationen, Status und Notizen. Der bisherige Lehrkraftimport übernimmt bewusst keine vier Beckenpayloads zur Weiterrechnung; dieses bestehende Verhalten wird separat bestätigt.
- Der Fensterlichtfall benutzt einen vollständigen Version-1-Kompatibilitätsstand aus der unveränderten alten Version `b5751b0` mit kontrolliertem Altimport; **keine persönliche Originaldatei des Nutzers wurde mitgeliefert**. [Herkunft und Vorgehen](../../tests/fixtures/legacy-window-light-b5751b0.md). Laden, echte Eingabe, Speichern, Neuladen, Stärke/Dauer und Futterwert 0,65 wurden geprüft. Zwei bereits im alten Szenario nicht platzierbare Objekte bleiben gespeichert; die bestehende Platzwarnung wird nicht als neue Grafikabnahme ausgegeben.

## Offene externe Grenzen

Die öffentliche [PR-Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-8/) wird durch die aktive Cloud-Netzwerkregel mit **CONNECT 403** gesperrt. [Zugriffsprotokoll](evidence/preview-network.json). **Kein tatsächlicher Vorschau-Fingerprint und keine interaktive Temperatur-/Licht-/Sanierungsprüfung auf Pages nachgewiesen.** Auch aktuelle externe CI-Ergebnisse und die Änderung der GitHub-PR-Beschreibung sind nicht bestätigt; [PR_BODY.md](../learning/PR_BODY.md) liegt als vorbereiteter Beschreibungstext im Branch.

Ein physisches Safari-iPad ist nicht verfügbar; Chromium-Touch-Emulation ersetzt diese Unterrichtsabnahme nicht. Es wurden keine neuen Konten, Bezahldienste oder Laufzeitdienste eingeführt. Die Spielversion ist nicht pauschal als fotorealistisch oder für jedes Schulgerät leistungsgeprüft abgenommen.

## Entwicklungsläufe

Frühere Abbrüche und korrigierte Testannahmen stehen getrennt in [DEVELOPMENT.md](DEVELOPMENT.md) und [historischen Zwischenbelegen](evidence/development/README.md). Sie zählen nicht zusätzlich zur obigen Abnahme.
