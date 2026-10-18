# Simulation-Aquarium

Deutschsprachiges Aquariumsimulationsspiel zum Aufbauen, Beobachten und Erforschen eines vereinfachten Ökosystems. Für Desktop-Browser und Touch-Bedienung entwickelt; statisch auf GitHub Pages unter `/Simulation-Aquarium/` nutzbar. Das Spiel und Teile seiner Inhalte wurden mit KI-Unterstützung erstellt.

## Phase 1: Aquarium mit der Pinzette gestalten

Nach dem Aufstellen eines Beckens steht unten das Werkzeug **Pinzette** bereit:

1. Pinzette einschalten und eine Pflanze oder Dekoration mit Maus oder Finger greifen.
2. Gedrückt halten und an eine freie Stelle ziehen. Die sichtbare 3D-Pinzette schließt sich, hebt den Gegenstand leicht an und setzt ihn beim Loslassen ab.
3. Beim Absetzen wird die neue Position automatisch im vorhandenen Spielstand gespeichert. Während des Ziehens bleibt die zuletzt gespeicherte Position unverändert.

Die Kamera bleibt im Pinzettenmodus gesperrt. Ein roter Ring kennzeichnet eine blockierte Stelle; beim Loslassen bleibt das Objekt an der letzten freien Stelle. Glasgrenzen, Objektgröße, Drehung, andere Pflanzenbasen, feste Dekorationen und die sichtbare Innenfilter-/Heizertechnik werden berücksichtigt. Schwimmpflanzen bleiben an der Oberfläche. Tiere und Korallen werden nicht mit der Pinzette verschoben.

**Abbrechen:** Esc beendet den Modus und stellt bei einer laufenden Geste die Ausgangsposition wieder her. Eine unterbrochene Touch-Geste, Fokusverlust oder ein Wechsel des Spielstands bricht ebenfalls ab. Auf Touch-Geräten beendet das Kreuz im Hinweis den Modus. Nach Auswahl eines Objekts über seine Detailkarte erlaubt „Mit Pinzette greifen & verschieben“ auch Pfeiltasten; Umschalt vergrößert die Schrittweite.

Neue Dekorationen:

| Gegenstand | Wasser | Gestaltung und mögliche ökologische Funktion |
| --- | --- | --- |
| Verzweigte Fingerwurzel | Süßwasser | Fein verzweigte Äste, Deckung und Biofilmflächen |
| Knorrige Savannenwurzel | Süßwasser | Kompakte Wurzel mit Vertiefungen und Schatten |
| Geschichtete Schieferterrasse | Beide | Versetzte Platten, Spalten und Aufsitzflächen |
| Zerklüfteter Drachenstein | Süßwasser | Ockerfarbene Grate und ausgewaschene Mulden |
| Dunkler Basaltbogen | Beide | Dunkler Fels mit offenem Durchgang und Sichtschutz |
| Poröse Riffhöhle | Meerwasser | Helle, offen durchgängige Höhle mit Aufsitzflächen |

Die neuen Gegenstände suchen beim Kauf eine freie Fläche. Wenn kein Platz vorhanden ist, wird kein weiteres Objekt gestapelt. Wasserarten sind im Shop filterbar; unpassende neue Dekoration wird beim Kauf mit einem Hinweis abgewiesen. Alle bisherigen Katalogeinträge bleiben erhalten.

Die Modelle und kleinen Oberflächentexturen werden lokal aus eigenem Code erzeugt. Es gibt keine zusätzlichen Assetdownloads, Konten oder Dienste. Sie sind detaillierter als die bisherigen einfachen Dekorationen, **noch nicht fotorealistisch**. Die genannten ökologischen Funktionen beschreiben mögliche reale Funktionen; neue Versteck-, Huminstoff- oder Biofilmwerte werden in Phase 1 nicht als zusätzliche Simulationsboni vorgetäuscht. Herkunft und technische Grenzen: [Aquascaping-Dokumentation](docs/AQUASCAPING.md).

![3D-Pinzette beim Verschieben](docs/screenshots/tweezers-mouse.png)

## Lokal starten

Das Spiel benötigt keinen Build und keine Laufzeitpakete. Es besteht aus `index.html` und den lokalen Ergänzungen `aquascaping.mjs` / `aquascaping.css`. Alle drei Dateien zusammen auf GitHub Pages bereitstellen. Relative Pfade unterstützen den Projektpfad `/Simulation-Aquarium/`.

Aus dem Repository-Verzeichnis kann Python den übergeordneten Ordner lokal bereitstellen:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory ..
```

Das Spiel liegt dann auf diesem Server unter `/Simulation-Aquarium/`. Die Cloud-Umgebung enthält die benötigten Entwicklungswerkzeuge bereits. Unter **Zeit & Runde → Komplettes HTML-Spiel herunterladen** wird weiterhin eine eigenständig nutzbare HTML-Datei einschließlich der neuen Funktionen erstellt. Spielstände zusätzlich als JSON exportieren; sie gehören nicht automatisch zum HTML-Download.

Das Speicherformat bleibt Version 1 mit dem bisherigen `localStorage`-Schlüssel `aquarium-werkstatt-v1`. Alte Spielstände werden weiterhin geladen. Die vorhandenen X-/Z-Positionen werden wiederverwendet; das optionale Feld `aquascapePlaced` kennzeichnet eine genau auf der Bodenoberfläche verankerte Platzierung. Ein einmal gespeicherter Stand mit neuen Dekorationsarten benötigt diese oder eine neuere Spielversion.

## Tests

```bash
node --test tests/aquascaping.test.mjs
python3 tests/aquascaping_browser.py
python3 tests/standalone_browser.py
```

Die Browserprüfungen benötigen Python-Playwright und Chromium, starten ihren eigenen vorübergehenden Webserver und verwenden isolierte Browserprofile. In dieser Cloud-Umgebung sind beide vorhanden. Auf anderen Entwicklungsrechnern lässt sich ein installierter Browser über `AQUARIUM_CHROMIUM` auswählen. Optional kann Playwrights eigener Chromium verwendet werden. Es sind keine zusätzlichen Konten nötig.

Getestet werden unter anderem echte Maus-/Touch-Gesten, Kamerasperre, Kollisionen, Glasgrenzen, Abbrechen, Tastaturbedienung, alle sechs neuen Modelle, alte Spielstände und der HTML-Download. Ergebnisse und Screenshots des Aquascaping-Tests liegen standardmäßig unter `/tmp/aquarium-phase1-results`; `AQUARIUM_TEST_RESULTS` ändert das Zielverzeichnis. Tablet-Emulation in Chromium ersetzt keinen Test auf einem echten Safari-iPad. Die vorhandenen Spielstart-/Tutorialprüfungen bleiben zusätzlich Teil der Regression.

Die nächsten Phasen sind in der [Roadmap](docs/ROADMAP.md) beschrieben. Änderungen werden über einen eigenen Branch und Pull Request geprüft; eine Veröffentlichung erfolgt nach manueller Freigabe.

## Katalog, Analyse und Szenarien

Der Featurestand ergänzt 181 lokale, mit Quellen belegte **Modellvorschauen**, den gemeinsamen Analysemodus **Ökosystem** und fünf Szenarien. Die Szenarien starten auf der Startseite und speichern separat vom freien Aquarium. Über den Auftragsknopf sind Hinweise und eigene Untersuchungsnotizen erreichbar. Im Analysemodus stehen Nahrungsnetz, begründete Fragezeichen, Artenprüfung, virtuelles Mikroskop, Stoffumwandlungen, Energiefluss und Umweltwerte zur Verfügung; dabei pausiert die Spielzeit.

Zersetzung, Mineralisierung und sauerstoffbegrenzte Nitrifikation sind jetzt getrennt gekoppelt; tatsächliche Nahrung beeinflusst die Tiergesundheit. Die laufende 3D-Szene ergänzt gemeinsame Schwarmbahnen und eine vom Beckenstand abhängige Wasseroberfläche. Die biologischen und grafischen Modelle bleiben vereinfacht. Eine vollständige Massen-/Energiebilanz oder erreichte Fotorealistik wird nicht behauptet.

Details: [Bedienung, Speicherplätze und Modellgrenzen](docs/ECOSYSTEM.md), [Bildquellen und Erzeugung](docs/CATALOG.md). Zum Bereitstellen alle `.mjs`-/`.css`-Dateien und `assets/catalog` mitnehmen; weiterhin kein npm-Build und keine externen Laufzeitdienste. Der HTML-Download bündelt diese Dateien einschließlich der neuen Bilder.

Zusätzliche Prüfungen in der eingerichteten Cloud-Umgebung:

```bash
node --test tests/*.test.mjs
python3 /workspace/aquarium-devtools/start.py
python3 tests/ecosystem_browser.py
```

Der letzte Befehl verwendet den lokalen Cloud-Server, isolierte Browserprofile und ausschließlich generierte Testspielstände. Ein anderer lokaler Projektpfad ist über `AQUARIUM_URL` konfigurierbar. Ergebnisse liegen unter `/tmp/aquarium-ecosystem-results`.
