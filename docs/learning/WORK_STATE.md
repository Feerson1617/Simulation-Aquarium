# PR #8 – Korrekturen nach unabhängiger Prüfung

Ausgangspunkt: 5b00ea1538cb740a28287ed5f83038f2df96d052 auf feature/biology-learning-environments; main 666df90. Remote-Branch und PR-Ref am 20.10.2026 abgeglichen, keine fremden oder ungesicherten Änderungen. Kein Merge. AGENTS.md gilt unverändert.

Auftrag und Prüfbericht: review/REQUEST.md und review/REVIEW.md. Der vollständige ursprüngliche Masterauftrag ist in dieser Umgebung vorhanden und unter review/MASTER_REQUEST.md gesichert. Originalcurriculum-PDF ebenfalls vorhanden und SHA-256 faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f bestätigt. Seite 19 ausdrücklich gelesen: anthropogene Beeinflussung des Kohlenstoffkreislaufs verpflichtend.

## Zwischenstand der Korrektur, 21.10.2026

R1–R8 sind im Datenmodell und in den Oberflächen implementiert; endgültige Browserabnahme noch offen. 98 Modultests bestanden im ersten Gesamtstand; nach Ergänzung der konkreten Abbruchursache und echter Version-1-Exportfixtures bestehen die elf gezielten Tests erneut. Vor der finalen Übergabe alle Modultests erneut ausführen.

Neue Daten: Status/Ende/Ursache je Beckenseite; ungleiche Messreihen; unveränderte Laufkonfiguration neben aktuellem Plan; vollständiger begrenzter lesender Import; Selektionsarchive; reproduzierbare und neue Mendelstichproben; eigene Messreihen; CSV-Schema 2. Kohlenstofftransfer ergänzt. Neuer, vom Korrekturauftrag ausdrücklich verlangter Workflow module-tests.yml; Pages-Workflows bleiben unverändert.

Gezielter Browserprüfer: tests/learning_review_browser.py. Erster Lauf /tmp/pr8-review-browser.log bestätigte drei Prüfpunkte (R1/R3/R8), stoppte danach an einer falschen erwarteten Unterstützungsbeschriftung im Prüfskript. Zweiter Lauf /tmp/pr8-review-browser-2.log läuft nach Korrektur und mit unabhängiger realer Kernfortsetzung. Rohberichte unter /tmp/aquarium-pr8-review. Keine vergangenen Browsererfolge als aktuelle vollständige Abnahme ausgeben.

## Noch abzuarbeiten / abschließend nachzuweisen

1. R1: Status und Fortsetzung je Becken, ungleiche Reihen, letzter Ausfallschritt.
2. R2: Begrenzter vollständiger lesender Import und Lehrkraftdarstellung.
3. R3: Feste Laufkonfiguration und sichtbare Trennung vom bearbeiteten Plan.
4. R4: Menschliche Beeinflussung des Kohlenstoffkreislaufs mit Material, Aufgabe, Sicherung und Grenzen.
5. R5: Neue Mendelstichprobe und identischen Seed reproduzieren.
6. R6: Archive und Fortpflanzungserfolg je Selektionslauf.
7. R7: Eigene Messreihen als Tabelle, Diagramm und Export.
8. R8: CSV mit eindeutigen Messnamen, Einheiten, Typen und Herkunft.
9. Gezielte Verhaltenstests, bestehende 87 Modultests und relevante Browserregressionen; PR-Modultestworkflow ergänzen.
10. REPORT/AUDIT/VALIDATION und vollständige Master-/14-Missionen-Abnahmematrix aktualisieren.

Die bisherigen 87/71 Nachweise gehören zum Ausgangsstand; sie belegen die Korrekturen R1–R8 noch nicht. Neue Tests und Codeänderungen getrennt dokumentieren. Lokale Werkzeuge und Projektunterpfad sind vorhanden; nicht neu installieren. GPU-Tests nacheinander ausführen. Physische Safari-iPads und empirische Lernwirksamkeit weiter offen. PR #8 ist angehängt; derselbe Branch wird aktualisiert. Git-Push funktioniert; api.github.com ist weiterhin nicht in der Netzwerk-Allowlist.

## Vor der abschließenden Gesamtregression

R1–R8-Browserfälle sind in zwei Abschnitten bestanden: /tmp/pr8-review-browser-2.log (Ökologie, Export/Import, eigene Messreihen sowie Mendelprüfung) und /tmp/pr8-review-browser-3.log (Genetikarchive, Kohlenstoff und Touch). Lauf 2 stoppte nach bestandener Mendelprüfung, weil das Skript Selektionswerkzeuge in der absichtlich reduzierten Mendelmission suchte; Abschnitt 3 wechselt dafür korrekt ins freie Forschen. Kein Produktfehler. Nachweise bleiben erhalten.

Zusätzlicher Randfall R2/R3 behoben: Ein noch unvollständig/ungültig bearbeiteter neuer Plan macht vorhandene gültige Ergebnisse beim Import nicht mehr unlesbar. Reine Entwürfe werden begrenzt als unberechnet markiert; berechnete Konfigurationen bleiben strikt validiert. Jetzt 12 neue gezielte Modultests (zusammen mit den bisherigen 87 = 99); die 12 bestehen. Die abschließende vollständige Suite wird auf dem folgenden eingefrorenen Laufzeitstand ausgeführt. Währenddessen keine Laufzeitdateien bearbeiten.

Nächste Schritte: unabhängigen seriellen Runner /tmp/pr8-final-runner.py ausführen/prüfen; Ergebnisse /tmp/pr8-final-validation/status.json und pro Gruppe .log. Danach Rohberichte/Screenshots nach docs/learning/evidence/revision-2 übernehmen; REPORT/AUDIT/VALIDATION/ACCEPTANCE finalisieren. PR #8 existiert tatsächlich; GITHUB.md ist korrigiert. CSV_SCHEMA.md und vollständige Master-/14-Missionen-Matrix ACCEPTANCE.md angelegt. Keine bestandenen Prüfungen ohne neue Änderung wiederholen.
