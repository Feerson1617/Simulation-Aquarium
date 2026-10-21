# Abgeschlossener Stand: Questbuch für PR #8

> Historischer Abschluss der Questphase b5751b0. Danach wurde die Gerätefassung 5440886 übernommen; die gezielte Nachprüfung wird in [Geräte-Korrektur](../device-controls-correction/VALIDATION.md) fortgeschrieben. Die folgenden 107/74 Belege bleiben ihrem früheren Quellstand zugeordnet.

Branch `feature/biology-learning-environments`, bestehender PR #8. Ausgangsstand 677e6ce übernommen, keine Fremdänderungen verworfen. Alle Implementierungen regelmäßig auf denselben Branch gesichert; kein Merge, kein Push auf main.

## P1–P5 abgeschlossen

- P1: kurze Schülertexte, eigene richtige Beobachten-Hilfe, eindeutige Kontexthilfen, Metaebene bei Lehrkräften.
- P2: gespeichertes Questbuch mit fünf Stufen; echte Beobachtung, Vermutung, Simulation/Kreuzung und datenabhängige Auswertung; erneuter Versuch nach falscher Antwort.
- P3: alle 14 Missionen mit einem zentralen Ziel und kurzen spielbaren Folgen. Vollständige Desktopdurchläufe; drei Jahrgänge zusätzlich vollständig per Touch.
- P4: reduzierte Werkzeuge, Arten-/Genetikansichten, Meine Ergebnisse, freiwillige Forschungshilfe und einfache Speicherbeschriftungen. Vollständige technische Exporte und R1–R8 erhalten. Frühere Notizen/Einstellungen gesichert.
- P5: tatsächliche Browser-/Bildkontrolle, korrigierte iPad-Kameragröße, Pinzettenmenü/Esc, Prozentdarstellung, alternative Pflanzenmaßnahme, Modul-/Bestands-/Exportprüfungen und Dokumentation.

## Nachweise

**107 Modultests, 74 verschiedene Browserprüfpunkte und Einzeldatei-Export bestanden.** [Aktueller Prüfbericht](quest/VALIDATION.md), [Gestaltung und Datenübergang](quest/DESIGN.md), [alle 14 Folgen](quest/MISSIONS.md), [Abnahmematrix](quest/ACCEPTANCE.md). Vollständige Rohbelege unter quest/evidence. Frühere 100/82 werden nicht addiert, Touchwiederholungen zählen einmal.

Quellstände transparent getrennt: vollständige Questgruppe 303c869; Schüler-/Touchkorrekturen 486f0a8; letzte technische Diagrammbeschriftung und Bestands-/Exportprüfung b3b7814. Letzte Implementierungsänderung: b3b7814b862d4fee0445e236610700a594a141b4. Nachfolgende Commits enthalten nur Dokumentation/Belege. Laufzeithashes in quest/evidence/runtime.sha256 und learner-runtime.sha256; ursprünglicher Questlauf direkt in quest/evidence/quest/runtime.sha256. Biologischer Kern in der großen HTML-Datei bleibt unverändert; exakt eine resize()-Methode für Lernansichten geändert. AGENTS.md, Assets und bestehende Pages-Workflows unverändert.

Temporäre, für Wiederaufnahme nicht erforderliche Helfer: /tmp/quest-final-regressions.py, /tmp/quest-postvisual-validation/status.json, /tmp/quest-collect-final.py, /tmp/quest-finalize-docs.py. Alle relevanten Tests und Endbelege sind im Repository.

## Übergabe und offene Grenzen

Nur diesen PR fortsetzen. Bei neuen Aufgaben zuerst Git-Status/Branch und etwaige neue Nutzeränderungen prüfen; abgeschlossene Arbeit nicht erneut implementieren. Bestandene Gruppen nur bei relevanten Änderungen wiederholen. Kein neuer PR und kein eigenständiger Merge.

Git-Push funktioniert. GitHub-API nicht freigeschaltet; die neue Beschreibung liegt in PR_BODY.md, ohne eine erfolgreiche externe Aktualisierung zu behaupten. Externe CI-/Preview-Ausführung nicht bestätigt.

Physische Safari-/Schul-iPads, vollständige Hilfstechnikprüfung und Unterrichtserprobung/Lernwirksamkeit offen. Kein umfassender Fotorealismus-Abschluss; vorhandene Modelle erhalten. Keine neuen Konten, Dienste oder Kosten eingeführt.
