# Release 1.0 – gezielte Wiederholung

Auftrag: [Release-Freeze W01/U01](REQUEST.md). Ausgangspunkt der unabhängigen
Nachprüfung: `3e6394bf29d21fa8cc685855a84bcc2eb06f57a4`.

## Sichtbare Schülerhandlungen

**U01:** Ein frisches Browserprofil mit 768 × 1024 öffnen. M1 „Beginnen“ antippen,
die Wasserpest direkt im Aquarium auswählen. Ohne zu scrollen müssen „Ja“, „Nein“,
„Ich bin unsicher“ und „Tipp“ vollständig lesbar und erreichbar sein. „Tipp“
antippen, schließen und eine Vermutung wählen. Bei 1366 × 960 und 1366 × 1024
wiederholen. Kamera und Größenverhältnisse dabei nicht verstellen.

**W01:** Mit einem frischen Profil im Grafikprofil „iPad“ beginnen. M2 öffnen,
„Menü“ → „Zur Missionsauswahl“, dann M6 öffnen und ebenso zurückkehren. Jede
Öffnung mit Rückkehr zählt als eine Runde. Mindestens zwölf Runden ausführen.
Danach M2 öffnen, „Ich bin unsicher“, „Einmal füttern“, „Menü“ → „Stand als Datei
speichern“. Zur Auswahl zurückkehren, M2 erneut öffnen und nochmals exportieren.
Die beiden JSON-Dateien müssen inhaltlich gleich sein. Anschließend „Tipp“ öffnen.

Die Messung trennt reguläre öffentliche Website (A), Standalone über HTTP (B),
dieselbe Datei nach Abschalten des Netzes (C) und direktes `file:`-Öffnen (D).
Kein paralleler Browserlauf. D wird als blockiert ausgewiesen, wenn die verwaltete
Browserrichtlinie lokale Dateien sperrt; kein Umgehen der Richtlinie.

## Automatische Prüfungen

```bash
node --test tests/*.test.mjs

# Immer nur einen Browserlauf starten. Die Ergebnisse werden pro Engine/Fall abgelegt.
AQUARIUM_BROWSER=chromium AQUARIUM_CASE=A AQUARIUM_ROUNDS=24 \
  AQUARIUM_STABILITY_RESULTS=/tmp/aquarium-v1-stability \
  python3 tests/release_v1_stability_browser.py

# B/C: URL der lokal bereitgestellten Einzeldatei; D verwendet deren echten Dateipfad.
AQUARIUM_BROWSER=chromium AQUARIUM_CASE=C \
  AQUARIUM_OFFLINE_URL=http://127.0.0.1:8000/standalone-v1/ \
  AQUARIUM_OFFLINE_HTML=/absolute/path/Aquarium.html \
  AQUARIUM_STABILITY_RESULTS=/tmp/aquarium-v1-stability \
  python3 tests/release_v1_stability_browser.py

AQUARIUM_PHASE=after AQUARIUM_URL=http://127.0.0.1:8000/aquarium-simulation/ \
  AQUARIUM_HINT_RESULTS=/tmp/aquarium-v1-hint \
  python3 tests/release_v1_hint_browser.py

AQUARIUM_URL=http://127.0.0.1:8000/aquarium-simulation/ \
  AQUARIUM_OFFLINE_HTML=/absolute/path/Aquarium.html \
  AQUARIUM_REGRESSION_RESULTS=/tmp/aquarium-v1-regression \
  python3 tests/release_v1_regression_browser.py

# Derselbe gezielte Regressionstest mit Einzeldatei und gesperrten HTTP(S)-Anfragen:
AQUARIUM_BACKUP=1 AQUARIUM_URL=http://127.0.0.1:8000/standalone-v1/ \
  AQUARIUM_OFFLINE_HTML=/absolute/path/Aquarium.html \
  AQUARIUM_REGRESSION_RESULTS=/tmp/aquarium-v1-regression \
  python3 tests/release_v1_regression_browser.py
```

Für WebKit `AQUARIUM_BROWSER=webkit` und `AQUARIUM_WEBKIT` auf die installierte
Browserdatei setzen. In dieser Cloud lädt der vorhandene Wrapper
`/workspace/aquarium-devtools/run-webkit.py` die portablen Laufzeitbibliotheken.
Die HTTP-Adresse ist jeweils an den eigenen Entwicklungsserver anzupassen.

Die Stabilitätsprobe misst alle zwei Sekunden Linux-`smaps_rollup` (PSS und
privater Speicher), RSS, Prozessswap, freien Arbeitsspeicher und Plattenplatz.
PSS berücksichtigt geteilte Speicherseiten anteilig. Der Playwright-Treiber wird
gesondert ausgewiesen. Keine erzwungene Garbage Collection, keine tiefen
Simulationsabfragen in Animationsframes, keine wiederholte DOM-Serialisierung.
Die gemessenen Spitzen sind Abtastwerte, keine garantierten absoluten Maxima.
Die Prüfung stoppt vor Erschöpfung des Testrechners. Ein solcher Abbruch ist kein
bestandener Test.

Die Cloud verwendet eine HTTPS-Prüfausnahme im isolierten Testprofil wegen des
vorhandenen Netzwerkproxys. Das ändert keine Anwendungseinstellung. Der
Standalone-Importtest sperrt HTTP(S)-Anfragen; W01-C verwendet dagegen ausdrücklich
Playwrights Netzwerk-Offlineschalter. Dieser untersagt in der vorhandenen Linux-
WebKit-Laufzeit auch bestimmte lokale File-API-Lesevorgänge. Diese beiden
Testverfahren dürfen nicht gleichgesetzt werden.

Die vollständigen, bereits abgenommenen Lernpfade werden durch diese begrenzten
Nachtests nicht erneut als neu geprüft ausgegeben. Referenz:
[vorherige Abnahme mit Versionsgrenzen](../single-aquarium/release-corrections/TESTS.md).
Alle neuen Touch-Nachweise sind Browseremulation auf Linux und keine physische
iPad-/Safari-Abnahme.

Der M2-Dateiimport verwendet die echten Exporte der vorherigen Anwendung
`3e6394b` unter `evidence/before/<Browser>-A/after-rounds.json` (online) bzw.
`<Browser>-C/after-rounds.json` (Backup). Diese alten Stände wurden in Chromium
online und in beiden Offline-Browsern übernommen. Der erste WebKit-Online-Lauf
prüfte noch den Export und Import seines eigenen neuen Stands; dieser Unterschied
ist im Bericht ausdrücklich erhalten.

Das Speicherdiagramm lässt sich aus den eingecheckten Rohdaten mit Python und
dem kostenlosen Paket Matplotlib neu erstellen. Dabei wird kein Browser gestartet:

```bash
python3 tools/release_v1_memory_report.py
```
