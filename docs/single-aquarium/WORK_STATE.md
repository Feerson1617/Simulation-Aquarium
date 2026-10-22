# Ein Aquarium: Fortsetzung nach M1-Freigabe

Ausgangspunkt `4e59de3beb4d4af8017472301c9d28cc8ade653c` wurde sauber wiederhergestellt und als `backup/coherent-learning-4e59de3` auf GitHub gesichert. Die Referenz-ZIP liegt unverändert unter `/workspace/exports/Simulation-Aquarium-4e59de3.zip`, SHA-256 `55ca0303d867a3e6e4cd9f75472c5a90c3347e90e666c75ae4f500ab0a85259f`.

Fortsetzung: `feature/coherent-learning-workspaces`, [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9), weiterhin offen und als Entwurf. Kein Merge, kein Push auf main. [Aktuelle Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/).

## Neue Freigabe und Sprachvorgabe

Der Auftraggeber hat M1 im Chat ausdrücklich freigegeben („jup, ist besser als vorher“) und leichte Sprache verlangt: insbesondere keine chemischen Einheiten im Schülerweg der Klasse 8. Phase 3 ist damit freigegeben. M1 zeigt echte Veränderungen ohne Formeln/Einheiten; genaue Werte bleiben im Lehrkraftbereich und Export. Die folgenden Angaben dokumentieren den zuvor erreichten Gate-Stand; die Fortsetzung wird darunter nachgeführt.

## Auftrag und früheres Gate

Der [neue Masterauftrag](REQUEST.txt) ersetzt die Zwei-Becken-/14-Missions-Vorgaben. [Bedienmatrix des Auftraggebers](CONTROL_MATRIX_SOURCE.md) und [beigefügte Gegenprüfung](REVIEW.html) sind Eingaben; deren Quellen-/Kernproben sind keine eigenen Browserbelege.

Phase 1 und der vollständige M1-Prototyp aus Phase 2 sind umgesetzt. **Diese Sichtfreigabe wurde inzwischen im Chat erteilt (siehe oben).** Abschnitt 15 verlangt: „Nur M1 als vollständigen vertikalen Prototyp bauen“ und „Vor Freigabe keine flächendeckende Oberflächenumstellung.“ Abschnitt 17: „Am vereinbarten Prototyp-Gate stoppen und Sichtfreigabe abwarten“. Die frühere Temperaturfreigabe gilt ausdrücklich nicht.

M2–M6 haben neue stabile Kennungen und fachliche Entwürfe, aber noch keine neuen spielbaren Wege. Die Startseite kennzeichnet sie als „In Vorbereitung“. Auch die vollständige neue freie Oberfläche und die abschließende Lehrkraft-/Curriculumüberarbeitung folgen nach dem Gate. [Alle sechs Lernhandlungen und sämtliche 14 Altzuordnungen](MISSIONS.md).

## Gesicherter Anwendungscode

- `ac4c0d5`: neuer Auftrag und Anhänge gesichert.
- `1f217b5`: tatsächliches Einbeckenmodell und M1, alte Speicherplätze getrennt.
- `824324c`: echte automatische Verlaufslinie.
- `ff96365`: stabile laufende Bedienelemente und ausdrücklicher historischer Expertenzugang.
- `c6a4383`: kompakte Tabletansicht und tatsächliche Geometrieprüfung.
- **`260cc516eff7242ff86482b0a086b707d64f3a86`**: aktueller Anwendungscode; aufgabenbezogene gestufte Hilfen, Datenrückmeldung statt vorweggenommener Lösung, Tastaturfokus bei Aufgabenwechseln. Nachfolgende Beleg-/Dokumentationscommits ändern diesen Laufzeitcode nicht.

## Umsetzung

Die normale Route verwendet den Zustand des vorhandenen Haupt-Renderers und kehrt vor der Konstruktion des alten Paarcontrollers zurück. M1 erzeugt keine zusätzliche aktive Population und keinen Paarrenderer. Vorhandene Modelle, Maßstäbe, Geräte und biologische Kernfunktionen sind unverändert.

Je drei Tage mit 8 h täglichem Licht und ohne Licht werden nacheinander am einzigen Aquarium ab 06:00 Uhr beobachtet. Dazwischen stellt eine benannte Handlung den **vollständigen** Start wieder her, einschließlich Individuen, Ressourcen, Zeit und Zufallszustand. Ausschließlich `hours` wird anschließend auf 0 gesetzt. Gespeicherte Durchgänge laufen nicht weiter.

Messkarte, Szene, Kurve, Aufgabenbeleg und Export tragen dieselben Zustands-/Zeitkennungen. Der reale Gegenbefund bleibt sichtbar: **7,80 → 8,24 mg/L mit Licht; 7,80 → 8,16 mg/L ohne Licht**. Beide Werte steigen. Keine geänderten Raten und keine erfundene fallende Dunkelkurve.

Zeit läuft nur nach ausdrücklichem Start. Hilfe, Menü, ausgeblendete Seite und Neuladen halten an. Ein neuer Speicherbereich, validierter Import, verlustfreie Kompression, unveränderte Altstände und eine direkte Dateisicherung bei Speicherfehlern erhalten Ergebnisse. Herkunft von Vermutung, Auswahl, Messwert, Spieltext und freiwilliger eigener Formulierung bleibt getrennt.

## Eigene Prüfbelege und Wiederaufnahme

[Prüfbericht mit Versionsgrenzen, Bildern und Rohbelegen](VALIDATION.md), [tatsächliches Bedieninventar](CONTROL_AUDIT.md). 179 Modultests bestanden. Der komplette M1-Weg wurde in Chromium und WebKit jeweils auf Desktop und Tablet im Hoch-/Querformat geprüft; die letzte Hilfe-/Fokusänderung zusätzlich gezielt in beiden Engines. Freies Spiel, Katalog, Beckenplatzierung, Speichern/Laden und alle acht Tutorialschritte wurden gesondert geprüft. Einzel-HTML, GitHub-Unterpfad und ausgelieferte Quelldateien sind getrennte Nachweise.

Keine Aussage über Lernerfolg, physische iPads/Safari, natives `file:`-Starten oder fertige M2–M6. Neue Dokumente/Belege haben Vorrang vor historischen 14-Missions-Protokollen.

**Aktueller fachlicher Schritt:** Phase 3 nach erteilter Sichtfreigabe fortsetzen. Zuerst M2/M5 nach demselben Prinzip und früh die Genetik-Identitätsbrücke für M3/M4 prüfen. Kein automatischer Merge. Bei Verbindungsabbruch zuerst Branch, Status, PR-Head und dieses Dokument prüfen und gesicherte Arbeit fortsetzen.
