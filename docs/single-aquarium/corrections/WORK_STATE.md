# Historischer Stand: erste F01–F03-Sichtabnahme

**Abgelöst durch den [finalen Auftrag vom 23.10.2026](../final-corrections/REQUEST.md) und [aktuellen Arbeitsstand](../final-corrections/WORK_STATE.md).** Die unabhängige Abnahme akzeptiert die Basis; eine weitere Zwischenfreigabe ist nicht nötig. Die folgenden Angaben dokumentieren den damaligen Ablauf.

Verbindliche Nutzerfreigabe vom 23.10.2026: nur `feature/coherent-learning-workspaces`, offener PR #9. Commits/Pushs und PR-Vorschau erlaubt. Kein neuer PR, keine Änderungen an main, kein Merge, kein PR-Statuswechsel.

**Jetzt zur menschlichen Sichtabnahme vorlegen. F04–F11 erst danach abschließen.** Die frühere M1-Freigabe gilt nicht für dieses neue Gate. Der Nutzer verlangte ausdrücklich: „Ermögliche eine Sichtabnahme, bevor du sämtliche verbleibenden F04–F11-Änderungen abschließt.“

## Gesicherter Stand

Anwendungscode `4b79d08a48be6126fc7cd8c2df3b785a44c234f8`; spätere Commits ergänzen Dokumentation und Prüfnachweise. Alle Änderungen liegen auf PR #9. Ausgang `7d6f815f2d35dd8a75da1ca8f273724ed1b975c5` war sauber und vollständig wiederhergestellt. Main bei Beginn `8e41962132fe3778fe73f8e14c650f42e18d848d`; zum Abschluss erneut prüfen.

F01: echte relative Mengenbalken in M2/M5, gleiche Referenz, gespeicherter Abbaufluss getrennt vom Restebestand. F02: größere tatsächliche Glasansicht, hellere Rückwand, echte Auswahl mit Art/ID und direkter Touch-/Mauszuordnung, Rückstellung ohne Restbewegung. F03: alle sechs Missionen auf Vorwegnahmen geprüft; Rohbelege statt Lösungssätze, M2-Erklärung bewusst abrufbar, M1-Kurven direkt am Aquarium, Antwortkarte ohne abgeschnittene Auswahl. Biologische Berechnungen, Maßstab, Arten/Assets und Speicherformate unverändert.

## Maßgebliche Nachweise

[Bildübersicht](REVIEW.html), [Änderungen und Schülerhandlungen](REVIEW.md), [tatsächliche Tests und Grenzen](TESTS.md), [Belegmanifest](evidence/manifest.json). Diese Korrekturberichte sind aktueller als die früheren Abschlussberichte in `docs/single-aquarium/`.

191 lokale Modultests. Sechs vollständige Chromium-Lernwege auf 0cf199c, abschließende M1/M3/M5-Layoutwege auf b2f2cd1 in WebKit. Weitere WebKit-Durchläufe dokumentiert, keine behauptete einheitliche Vollmatrix. Freie Jahrgänge, Platzierung/Dateien/Quotenfehler, erhaltenes Expertenspiel samt acht Tutorialschritten, öffentliche M3 und eingebettete M1 nach Laden offline geprüft. Kein physischer iPad-Test. Der Quellvergleich schützt 578 unveränderte Dateien.

Alle Testprozesse sind beendet; frühere Warteschlangen nicht erneut starten. Lokale Originale: `/tmp/f01-gate-verified`, `/tmp/f01-layout-final`, `/tmp/f01-gate-final`, `/tmp/f01-free-regression`, `/tmp/f01-expert`, `/tmp/f01-offline`, `/tmp/f01-public`. Neue Prüfungen: `tests/correction_gate_browser.py` und `tests/correction_pointer_browser.py`. Abschließender Gestenfix auf 4b79d08 in beiden Engines bestanden (`/tmp/f01-pointer-final`). Historische Fehlläufe sind im Belegpaket als solche erhalten.

## Weiter nach Sichtabnahme

F04 spezifische Hilfen; F05 weitere M1-Abnahme; F06 getrennte Elternfehler/Nullfälle und Kreuzungsfolge; F07 verständliche archivierte Elternbeiträge; F08 vollständige M6-Individuumsprüfung; F09 verständliche Archivnamen; F10 sichtbare Pinzettenhinweise und echter erfolgreicher Touch-Versatz; F11 übrige Sprachstellen. Überschneidungen durch F01–F03 sind im Bericht genannt und keine pauschale Erledigung dieser Punkte.

Keine Unterrichts- oder Hardwarefreigabe aus technischen Abschlüssen ableiten. Genaues aktuelles Git-Head, PR-Vorschau und noch offene Grenzen bei der Übergabe nennen.
