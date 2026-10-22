# Historischer Entwicklungsstand vor dem Einbeckenauftrag

**Dieser Stand wurde durch den neueren Auftrag ersetzt. Aktuelle Entwicklung und neues M1-Sichtgate: [single-aquarium/WORK_STATE.md](../single-aquarium/WORK_STATE.md).**

Stand: 22.10.2026. Auftrag: [Masterauftrag](REQUEST.txt), [beigefügte Gegenprüfung](REVIEW.html). Branch: `feature/coherent-learning-workspaces`. PR: [#9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9). [Bedienbare Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/).

**Letzter Anwendungscode: `f12d5e8789cb70268469df8c6a60ecb15547cf91`.** Nachfolgende Dokumentations-/Belegcommits ändern diesen Code nicht. Den aktuellen Branch-Head liefert `git rev-parse HEAD`. Ausgangs-main bleibt `8e41962132fe3778fe73f8e14c650f42e18d848d`; kein Merge und kein Push auf main.

## Wiederaufnahme und Freigabe

Nach „ist freigegeben“ wurde der saubere, bereits gesicherte Branch bei `15d9ebc` fortgeführt. Vorherige Änderungen wurden erhalten. Das verbindliche Temperaturgate aus Abschnitt 15 ist damit ausdrücklich freigegeben. Neue Populations- und Regionalmuster wurden vor der breiten Übertragung tatsächlich im Browser geprüft und mit Bildern im Arbeitsverlauf vorgelegt. Es gibt kein ausstehendes zweites Temperaturgate.

## Abgeschlossen

- Phasen 1/2: gemeinsame Untersuchungsidentität, echte Zustände vor/nach Eingriff und historische Checkpoints, Null-Eingriffsschutz, zwei echte Temperaturbecken in einem WebGL-Kontext. Historischer Gatebericht: [VALIDATION.md](VALIDATION.md).
- Phase 3: gemeinsame Vergleichsfläche für alle neun Beckenmissionen und Freies Forschen 8/10; tatsächliche zählbare Populationen für Klasse 9; getrennte qualitative Hafenansicht. [Bedienprinzipien](PHASE3.md).
- Phase 4: alle 14 zentralen Lernhandlungen, bedienbare Stoff-/Energie-/Kohlenstoffwege, Blattvergleich, Land–Fluss–Nordsee, tatsächliche Allelherkunft und Fossilzuordnung. Beide Hafenmaßnahmen haben eigene Nutzen-/Aufwands-/Abschlusswege. Hilfen, Anzeigen und Rückmeldungen sind angepasst.
- Wiederholen archiviert den alten Versuch einschließlich Population/F1/F2 und verlangt neue Handlungen. Fortsetzen erhält den alten Versuch. Fehlende alte Zustände, Herkunft und Chemieeinheiten werden nicht erfunden.
- [Ammoniumpool-Vertrag](AMMONIA_POOL.md): TAN in mg NH₄-Äquivalent/L, passende freie NH₃-Berechnung, quantitative N-/O₂-Prüfung und unveränderte Altwerte mit unbekannter Grundlage. Keine Neukalibrierung der biologischen Raten.
- Phase 5: 173 Modultests, alle 14 Missionen in Chromium und WebKit, gezielte Touch-/Speicher-/Abbruch-/Modusprüfungen, Einzel-HTML und tatsächliche HTTPS-Vorschau. Exakte Quellenstände und Belege: [Abschlussprüfung](FINAL_VALIDATION.md), [Missionsmatrix](MISSIONS.md).

Die gesamte Browserstrecke läuft über sichtbare Bedienelemente. Read-only Prüfzugriffe überprüfen tatsächliche IDs und Werte; sie belegen keine intuitive Auffindbarkeit durch Kinder. Keine neue kostenpflichtige Abhängigkeit, kein neues Konto und keine Änderung von Umgebungsberechtigungen.

## Offene Grenzen

Keine bekannte reproduzierbare zentrale P1/P2-Funktionsstörung in den dokumentierten Schlussläufen. Offen bleiben physische iPads/Mobile Safari, Zielgeräte-Leistung, natives `file:`-Öffnen und Offline-Neustart sowie Unterrichtserprobung. Die etwa 151 MB große Einzeldatei ist kein iPad-Offline-Nachweis. Grafiken der Populationen/Prozesse sind ausdrücklich schematisch; keine neue Fotorealismusabnahme.

Der erneute Abruf der offiziellen SH-Seite wurde mit HTTP 403 blockiert; auch ein neuer OSPAR-Abruf war blockiert. [Quellen und curriculare Reichweite](CURRICULUM.md) trennen die vorliegende Schul-PDF, Angaben aus der beigefügten Gegenprüfung und unabhängig noch nachzuprüfende Landes-/Regionalquellen.

Die genannten ZIPs `Simulation-Aquarium-main 2.zip` und `Aquarium-Pruefpaket.zip` lagen hier nicht vor. Ihr Hash ist eine Auftragsangabe, kein eigener ZIP-Nachweis. Die bereitgestellte ETS-PDF wurde im vorangehenden Arbeitsschritt gelesen: SHA-256 `faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f`, insbesondere S. 9–10, 14–15 und 19–20.

## Wiederholbare Prüfung und nächster Schritt

```sh
git status --short --branch
git log -5 --oneline
node --test tests/*.test.mjs
python3 tests/coherent_workspace_browser.py
python3 tests/coherent_final_browser.py
AQUARIUM_PHASE3_SECTIONS=population,harbour,free python3 tests/coherent_phase3_browser.py
```

Server, beide Engines und weitere Aufrufe: [ENVIRONMENT.md](ENVIRONMENT.md), [Abschlussprüfung](FINAL_VALIDATION.md). Alle Entwicklungszwischenstände wurden frühzeitig auf dem eigenen Branch gesichert. Nächster Produktschritt ist die menschliche PR-/Vorschauprüfung und die ausgewiesene Geräte-/Unterrichtserprobung. Keine automatische Hintergrundfortsetzung und kein eigenmächtiger Merge.
