# Wiederaufnahme und Sichtgate

Auftrag: [Masterauftrag](REQUEST.txt), [Prüfbericht](REVIEW.html). Neuer Branch: `feature/coherent-learning-workspaces`. Ausgangspunkt ist exakt `8e41962132fe3778fe73f8e14c650f42e18d848d` auf main; PR #8 ist gemergt. Der bei Arbeitsbeginn vorgefundene Stand war sauber. Frühere Arbeit wurde nicht verworfen. Die neue Entwicklung ist schrittweise auf GitHub gesichert.

**Geprüfter Anwendungsstand: `d0c4b17096289c18efa63a8b93aa49205c4cb1bd`.** Nachfolgende Dokumentations-/Belegcommits ändern diesen Anwendungscode nicht. Den aktuellen Branch-Head liefert `git rev-parse HEAD`.

## Verbindliche Arbeitsgrenze

Abschnitt 15 des Masterauftrags verlangt: „Vor dieser Freigabe keine flächendeckende Neugestaltung aller Missionen.“ Die ausdrückliche Sichtfreigabe liegt seit dem 22.10.2026 vor: Der Auftraggeber antwortete „ist freigegeben“. Phase 3 wird auf dem sauberen Branch-Head `15d9ebc` fortgesetzt. **Der Gesamtauftrag ist damit noch nicht abgeschlossen.**

Das Temperaturgate ist durch den Auftraggeber freigegeben. Die neuen Muster für Populationen und regionale Fälle werden vor breiter Übertragung gesondert sichtbar geprüft. Kein Merge, kein direkter main-Push, keine Änderungen an Konten oder Umgebungsberechtigungen.

## Umgesetzt

- Gemeinsamer Selektor für Untersuchung, Durchgang, Modellrevision, Reihe, Wiederholung, Seite, Zeitpunkt/Generation und Zustandskennung. Er verbindet Ergebnis, gespeicherte Beckenansicht, Diagramm, Tabelle, Frage und Export.
- Echte Zustände vor und nach dem Eingriff sowie zeitlich zugehörige Checkpoints. Alte Dateien ohne historischen Beckenstand zeigen ausdrücklich nur Messwerte. Nach Ausfall einer Seite entstehen keine erfundenen Folgezustände.
- Ansicht und aktuelles Spielbecken getrennt; ein gespeicherter Stand wird nur durch die ausdrückliche Übernahmehandlung kopiert. Ein neuer Plan bleibt von früheren Messergebnissen getrennt, auch im Lehrkraftimport.
- Typisierte Eingriffsbelege; Wasserwechsel 0 % erzeugt keinen Kernaufruf oder bloßen Journalnachweis. Die vorhandene Sonderprüfung auf main verhinderte bereits einzelne Null-Nachweise: Der pauschale alte Berichtsbefund wurde deshalb nicht unverändert übernommen.
- Temperaturprototyp: zwei reale Becken vor der Vermutung, vorhandene Modelle, ein WebGL-Kontext, Heizer nur in Becken 2, wirkliche Wasserwerte und gemeinsame Versuchsuhr. Fischfokus hält den Partner sichtbar; Ergebnis- und Hilfsansichten behalten denselben Vergleich.
- Getrennte Fortsetzung und Wiederholung. Ein neuer Durchgang archiviert das bisherige Produkt und setzt Population, F1/F2-Ereignisse und Lernbelege zurück. Alte Abschlüsse werden nicht als neue visuelle Leistung ausgegeben.
- Verlustfreie lokale Archivkompression mit MIT-lizenziertem lz-string 1.5.0. Abwärtskompatibilität für unkomprimierte Archive. Speicherfehler lassen den vorher gespeicherten Versuch bestehen; die fünfte Reihe archiviert die älteste gesondert.
- [Matrix aller 14 Missionen](MISSIONS.md) und dauerhafte Prüfregel für alle Klassen/Modi in der README.

Der neue [Entwurfs-PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9) und die [funktionierende Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/) sind vorhanden. Die Quellhashes der Auslieferung und ein tatsächlicher WebKit-Aufruf sind geprüft. Noch kein Merge.

Letzte abgegrenzte Datenkorrektur: Auch die technische Lehrkraft-/Expertenansicht löst Reihe, Wiederholung und Zeit über denselben Selektor auf. Geändert wurden ausschließlich `results()` und `runTables()`; [Quellvergleich](evidence/expert-source-audit.json). Gezielte Prüfungen einschließlich CSV/SVG bestehen in beiden Engines; neun zusätzliche WebKit-Schutzprüfungen zu Sanierung, Genetik und alten Produkten bestehen.

## Prüfung und Belege

[VALIDATION.md](VALIDATION.md) dokumentiert ausgeführte Prüfungen, genaue Quellenstände, Bilder und Grenzen. Entwicklungsfehlschläge werden dort von den abschließenden Ergebnissen getrennt. Ein technischer Missionsabschluss belegt weder eine neue sachgerechte Darstellung aller Missionen noch Unterrichtswirksamkeit.

Die Archivkorrektur entstand aus einem echten Fehler im Mehrmissionslauf: Nach neun Abschlüssen überschritt die unkomprimierte Speicherung das lokale Limit; die Kohlenstoffmission fiel beim Neuladen auf Aufgabe 2 zurück. Die korrigierte Version bestand anschließend den gesamten zusammenhängenden Lauf. Gemessenes Beispiel: 744.703 auf 326.040 JSON-Zeichen, 56,2 % weniger, alle Zustände exakt erhalten.

Abschluss dieses Gateabschnitts: 154/154 Modultests; je 15/15 Temperatur-/Kontextpunkte, je 22/22 zusätzliche Missions-/Modusprüfpunkte, 5/4 Kompatibilitätspunkte und je zwei Nebenansichtsprüfungen in Chromium/WebKit. Dazu 13 Start-/Tutorialpunkte, gezielte technische Auswahl einschließlich Einzel-HTML in beiden Engines und neun zusätzliche WebKit-Schutzprüfungen. Details und Unterschiede der Pixeldichten/Quellenstände stehen im Prüfbericht.

## Offen nach dem Sichtgate

1. Architektur auf passende Ökologiemissionen und Freies Forschen übertragen.
2. Ein gesondertes Muster für tatsächliche Lernindividuen/Generationen und eines für regionale Prozesse vorlegen; erst dann breiter verwenden (P1 E/F).
3. Übrige Missionsdarstellungen, maßnahmenspezifische Hafenantworten, Sprache/Hilfen und Waldvergleich überarbeiten (insbesondere P2 H/J/L).
4. Den vollständigen Stoffvertrag des Ammoniumpools einschließlich Einheiten, Schädigung und Altimporten prüfen (P2 K). Die Formel und biologischen Kernraten wurden hier nicht blind geändert.
5. Curriculare und institutionelle Regionalquellen für diese Überarbeitung gegenprüfen; vollständige Schlussregression und menschliche Sichtabnahme durchführen.

Echte iPad-Hardware/Safari, Unterricht mit Kindern und Leistung des Maximalprofils sind weiterhin offen. Linux-WebKit ist kein Hardwareabnahmesiegel.

## Referenzen und nächste Befehle

Die erwähnten ZIPs `Simulation-Aquarium-main 2.zip` und `Aquarium-Pruefpaket.zip` wurden nicht bereitgestellt. Ihre Hashes sind Angaben aus den Anhängen, kein eigener ZIP-Nachweis. Das Originalcurriculum ETS 2025/26 lag als PDF vor; relevante Seiten 9–10, 14–15 und 19–20 wurden gelesen. SHA-256: `faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f`.

```sh
git status --short --branch
git log -5 --oneline
node --test tests/*.test.mjs
python3 tests/coherent_workspace_browser.py
python3 tests/coherent_compat_browser.py
python3 tests/coherent_tools_browser.py
```

WebKit und ausführliche Aufrufvariablen: [ENVIRONMENT.md](ENVIRONMENT.md). **Aktueller Produktschritt: Phase 3 umsetzen; die Temperaturfreigabe nicht erneut einholen.** Keine automatischen Hintergrund-Fortsetzungsversprechen.
