# PR #8 – abgeschlossener, wiederaufnehmbarer Korrekturstand

Stand: 21.10.2026. Branch `feature/biology-learning-environments`, bestehender PR [#8](https://github.com/Feerson1617/Simulation-Aquarium/pull/8). R1–R8 sind umgesetzt und abschließend geprüft. **Nicht erneut bei null beginnen.** Letzte Laufzeitcodeänderung: `7e82046`; spätere Abschlusscommits betreffen Berichte und Belege. Genaue aktuelle Git-Sicherung mit `git log -1` und `git ls-remote` prüfen.

## Erhaltene Grundlage

- Beginn bei `5b00ea1`; Remote-Branch und PR-Ref stimmten überein. `main` war `666df90` (PR #7 bereits enthalten). Keine fremden/ungesicherten Änderungen überschrieben.
- Originale: `review/REQUEST.md`, `review/REVIEW.md`, vollständiger biologischer Masterauftrag `review/MASTER_REQUEST.md`. Vollständige Zuordnung: [ACCEPTANCE.md](ACCEPTANCE.md).
- Originalcurriculum als Nutzer-PDF tatsächlich vorhanden und gelesen; 36 Seiten, 6.203.103 Bytes, SHA-256 `faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f`. S. 19 bei Korrektur erneut textuell und visuell geprüft.
- `AGENTS.md`, Modelle/Texturen und bestehende Pages-Workflows unverändert. Nur der ausdrücklich verlangte Modultestworkflow wurde ergänzt. Kein Merge und keine Änderung an `main`.

## Vorhandene Korrekturen

1. R1: Enden/Status/Modelldiagnose je Beckenseite, unabhängig weiterlaufende andere Seite, letzter Ausfallschritt, echte ungleiche Reihen.
2. R2: Begrenzter vollständiger lesender Import und Lehrkraftdarstellung, echte Version-1-Exportfixtures, wählbare Größen und Genetikbelege; keine importierte Engineausführung.
3. R3: Feste Laufkonfiguration/Planung getrennt vom bearbeiteten Plan, sofortige Kennzeichnung, auch bei unvollständigem neuem Entwurf lesbare alte Ergebnisse.
4. R4: Anthropogener Kohlenstofftransfer, Hintergrundmaterial zu Verbrennung/Landnutzung, Aufgaben, Sicherung, Quellen und Modellgrenzen.
5. R5: Gleiche Gründer mit gleichem oder neuem dokumentiertem Seed; tatsächliche F1/F2 und Versuchssicherung.
6. R6: Tatsächliche Eltern-/Nachkommenarchive je Seite/Wiederholung; rekonstruierbare Gewichte, Nachkommen und Frequenzen.
7. R7: Eigene Messreihen als Tabelle/Diagramm/Export, auch ohne Vergleich; sichtbarer Einzelpunkt bei nur einem bekannten Wert.
8. R8: [CSV-Schema 2](CSV_SCHEMA.md), Einheiten/Typen/Herkunft/Status; unbekannt und fehlend getrennt von Null, Textmetadaten als Literal.

## Endprüfung

**100 Modultests, 82 Browserprüfpunkte und Einzeldatei-Export bestanden.** Darunter Review 11, Lernen 19, gezielte Fach-/Fokusfälle 6, Bereitschaft/Tutorial 13, Aquascaping 12, Ökosystem 12, Genetik 9. Alle acht alten Touch-Tutorialschritte und alle 14 Missionsöffnungen sind enthalten.

Dauerhafte Nachweise: [VALIDATION.md](VALIDATION.md), `evidence/revision-2/verification.json`, Berichte/Exports/Screenshots und `evidence/revision-2/runtime.sha256`. Die Endgruppen liefen seriell auf unveränderten Laufzeitdateien. Ein früherer Gesamtlauf auf a498124 wurde für die Einzelpunktkorrektur gestoppt; historische Rohberichte bleiben erhalten und werden nicht zusätzlich gezählt. Der gültige vollständige Endlauf gehört zu `7e82046`.

Lokale temporäre Helfer: `/tmp/pr8-final-runner.py`, `/tmp/pr8-final-validation/status.json`, `/tmp/pr8-collect-evidence.py`, `/tmp/pr8-finalize-docs.py`. Zur späteren Wiederaufnahme sind sie nicht erforderlich; alle Endbelege und Testskripte stehen im Repository. Browsergruppen bei neuen relevanten Änderungen einzeln ausführen, nicht parallel auf der CPU-Grafik.

## GitHub und nächste Schritte

Code wurde regelmäßig auf denselben PR-Branch gesichert. PR #8 ist diesem Task angehängt. Git-Push funktioniert; GitHub-API-Zugriff ist durch die Allowlist gesperrt. Deshalb keine erfolgreiche externe Check-/Preview-Ausführung oder Änderung der PR-Beschreibung behaupten. Beschreibung in `PR_BODY.md`, Ablauf in [GITHUB.md](GITHUB.md). Keine neue PR-Erstellung nötig und kein eigenständiger Merge.

Bei Fortsetzung zuerst Status/Branches/Commits und etwaige Benutzeränderungen prüfen. Bestehenden PR weiterverwenden; keine bestandenen Gruppen ohne neue Änderungen wiederholen. Reproduktionsbefehle stehen in README und den Testskripten.

Offen außerhalb dieser technischen Umsetzung: physische Safari-/Schul-iPads, vollständige Hilfstechnikprüfung, Unterrichtserprobung/Verständnisinterviews und empirische Lernwirksamkeit. Modellraten bleiben kalibriert; keine geschlossene Kohlenstoff-/Energiebilanz, Gezeiten-, Plastiktoxikologie- oder globale Klimasimulation. Externe IPCC-/Regionalwebinhalte nicht live geprüft. Vollständiger Fotorealismus bleibt ein früheres separates Ziel, vorhandene Modelle erhalten.
