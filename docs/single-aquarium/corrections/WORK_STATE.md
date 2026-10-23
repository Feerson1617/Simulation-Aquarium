# Korrektur F01–F11, neues Sichtabnahme-Gate

Die ausdrückliche ergänzende Freigabe des Nutzers vom 23.10.2026 erlaubt Änderungen, Commits und Pushs ausschließlich auf `feature/coherent-learning-workspaces`, offener PR #9. Kein neuer PR, keine Änderung an main, kein Merge oder PR-Statuswechsel.

Zuerst F01–F03: echte Resteanzeige mit Anfangsreferenz, größeres tatsächliches Aquarium mit korrekten Größenverhältnissen und klarer Auswahl, keine vorweggenommene Lösung in allen sechs Missionen. Eigene Vorher/Nachher-Browserbilder und reproduzierbare Schülerhandlungen bereitstellen. Der Nutzer verlangt ausdrücklich: „Ermögliche eine Sichtabnahme, bevor du sämtliche verbleibenden F04–F11-Änderungen abschließt.“ Dies ist eine neue Sichtabnahme, unabhängig von der früheren M1-Freigabe.

## Wiederhergestellt

Sauberer lokaler und entfernter Branch bei `7d6f815f2d35dd8a75da1ca8f273724ed1b975c5`. PR offen, kein Draft; main unverändert `8e41962132fe3778fe73f8e14c650f42e18d848d`. Alte Abschlussberichte und Nachweise bleiben historische Belege. Kein Verlust ungesicherter Arbeit.

## Aktuelle Arbeit

Korrekturprompt und unabhängigen Bericht gelesen. Alle drei Hauptbefunde am Ausgangscode bestätigt. Eigene Browseraufnahmen des unveränderten Ausgangs werden erstellt. Noch keine neue Sichtfreigabe und keine behauptete Abnahme. F04–F11 sind anschließend offen; unvermeidbare Überschneidungen (M1-Rohbelege, M6-Auswahl) werden gesondert dokumentiert.

Kostenlose vorhandene lokale Werkzeuge, Chromium/Playwright und portables WebKit. Keine physische iPad-Hardware vorhanden. Biologische Berechnungen, sämtliche Arten und historische Speicherstände erhalten.

## Fortsetzungsnotiz 23.10.2026, 09:49 MESZ

Anwendung auf dem PR-Branch bis `0cf199cee4fc4d3e73af08e26dbc62020cb7cdeb` gesichert und gepusht. F01–F03 umgesetzt; Mengenansicht `single-observation.mjs`, Kamera/Auswahl `single-aquarium-view.mjs`, gezielte Anpassungen der bisherigen zwei Lern-UIs und Inhalte/CSS. Rechenkern/Assets unverändert (578 geschützte Dateien, `/tmp/f01-source-audit.json`). Neue Sichtfreigabe noch NICHT erteilt.

Eigene Vorher-Bilder bereits im Git unter `corrections/evidence/before/` (18 Bilder, Report; Runtime 7d6f815, Dokumentationshead 5c0b2f5). Neue vollständige Chromium-Prüfung läuft unter `/tmp/f01-gate-verified/chromium`, Log `/tmp/f01-verified-chromium.log`: M1–M5 weitgehend abgeschlossen, M6 folgt. Nicht parallel doppelt starten. App während dieses Laufs unverändert lassen. Neue Tests: `tests/correction_gate_browser.py`.

Bereits bestanden: 191 Node-Tests (`/tmp/f01-node-final.log`); WebKit M2/M3/M5 auf 658eb16 (`/tmp/f01-gate-final/webkit`), danach Kameraauswahlfix 0cf199c mit WebKit M1/M3 (`/tmp/f01-gate-verified/webkit`); freie Jahrgänge mit Platzierung, Dateirückkehr/Quotenfehler (`/tmp/f01-free-regression/webkit`); M1 in eingebetteter Einzel-HTML nach HTTP-Laden offline (`/tmp/f01-offline/webkit`); 13 Expertenspiel-/Tutorialchecks (`/tmp/f01-expert/results/20261023T073929.284389Z`); öffentlicher M3-Lauf (`/tmp/f01-public/webkit`). Warteschlange `/tmp/f01-regression-queue.json` vollständig beendet. Kein physischer iPad-Test.

Bei Bildprüfung erkannt: M1-Kurven in der Aufgabenkarte lassen eine Antwort unter den Kartenrand geraten. Vorbereitete letzte Layoutkorrektur `/tmp/refine-f01-layout.py` **erst nach Ende des laufenden Chromium-Laufs** anwenden: Kurve in Beobachtungsanzeige auslagern, M3-Einstieg kürzen/Elternkarte anpassen, M5-Beschriftung kürzen. Danach gezielt M1/M3/M5 erneut mit echten Handlungen nachprüfen; Code committen/pushen, Bilder und genaue Quellstände dokumentieren. Vorherige Entwicklungsfehler nicht als bestanden ausgeben (u. a. `/tmp/f01-gate-current`, `/tmp/f01-gate-final/chromium`).

Entwurf `corrections/REVIEW.md` enthält Schülerhandlungen, Audit aller sechs Missionen und offene F04–F11. Fertige Bildübersicht `REVIEW.html`, aktueller Test-/Belegbericht, Commit/Preview-Abgleich und abschließende Übergabe zur Sichtabnahme stehen noch aus. Nur PR #9 aktualisieren; kein neuer PR, main/PR-Status nicht ändern, kein Merge.
