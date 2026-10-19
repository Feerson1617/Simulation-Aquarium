# Simulation-Aquarium

Deutschsprachiges Aquariumsimulationsspiel zum Aufbauen, Beobachten und Erforschen eines vereinfachten Ökosystems. Für Desktop-Browser und Touch-Bedienung entwickelt; statisch auf GitHub Pages unter `/Simulation-Aquarium/` nutzbar. Das Spiel und Teile seiner Inhalte wurden mit KI-Unterstützung erstellt.

## Desktop- und iPad-Darstellung

Beim ersten Start zuerst **Desktop-Version** oder **iPad-Version** wählen, danach Freies Spiel, Tutorial oder Szenarien starten. Desktop beginnt mit **Maximum**. Unter **Zeit & Runde → Darstellung** sind später **Hoch**, **Ultra**, **Maximum** und **iPad** wählbar. Der Wechsel baut nur die Grafik neu auf; die biologische Simulation und gespeicherte Becken bleiben gleich. Die Darstellungsauswahl steht getrennt unter `aquarium-graphics-v1` in `localStorage`.

Maximum verwendet die native Pixeldichte, feinere Geometrie, bis zu 4096-Pixel-Oberflächentexturen, bis zu 8192-Pixel-Schatten und die aufwendigere Wasseroptik. Es gibt keine künstliche FPS-Obergrenze. Tatsächliche Hardwaregrenzen und ein Ressourcenbudget verhindern unkontrollierte Grafikallokationen. iPad verwendet dieselben Arten und Funktionen mit geringerer Geometrie-/Texturauflösung, mobilen Dekorations-LODs und einfacheren transparenten Materialien.

Der Grafikdurchgang berücksichtigt **alle 181 Katalogeinträge**, ersetzt alle **11 Dekorationen** durch eigene Blender-GLBs und verfeinert die gemeinsamen Tier-, Pflanzen-, Technik- und Materialpfade. Fünf vorhandene fototexturierte Volumenmodelle und das BlueMesh-Betta-Modell bleiben erhalten. **Die gewünschte umfassende Fotorealistik ist noch nicht erreicht.** Besonders native Tiere, Pflanzen, Wirbellose und Korallen brauchen weitere anatomische und künstlerische Arbeit; mehr Polygone allein genügen nicht.

Die [vollständige Bearbeitungsmatrix](docs/realism/CATALOG_STATUS.md) unterscheidet tatsächliche Änderungen und offenen Modellierungsbedarf. [Grafikarchitektur und Grenzen](docs/realism/README.md), [aktuelle Prüfungen und Live-Screenshots](docs/realism/VALIDATION.md).

## Farbvarianten und Genetik

Im Fischshop aktualisiert **Farbe** bei 16 Arten sofort Name und echte 3D-Vorschau. Die gewählte Form bleibt beim einzelnen Tier gespeichert. **Genetik** öffnet echte Elternauswahl, Nachkommen, Abstammung und auf Wunsch Genotypen und Punnett-Quadrate. Molly und Platy dienen ausdrücklich vereinfachten Mendelversuchen; Zebrabärblinge legen zunächst Eier. Wochen- und Zweiwochen-Zeitraffer rechnen dieselbe biologische Simulation einschließlich Wasserwerten und Wachstum weiter.

127 bisher native Organismen erhalten neue eigenständige Blender-GLBs mit Desktop-/Mobilgeometrie. Vier Fischarten verwenden zusätzlich erzeugte Texturvorlagen. Das ist keine pauschale Fotorealismus-Abnahme; die sechs besten Bestandsmodelle bleiben erhalten. [Anleitung und Modellgrenzen](docs/species-genetics/README.md), [aktueller Modellstatus](docs/species-genetics/MODEL_STATUS.md) und [Abschlussbericht](docs/species-genetics/REPORT.md) beschreiben Umfang, Tests und verbleibende Arbeit. Die ältere Grafikmatrix unten dokumentiert den vorherigen Durchgang.

## Phase 1: Aquarium mit der Pinzette gestalten

Nach dem Aufstellen eines Beckens steht unten das Werkzeug **Pinzette** bereit:

1. Pinzette einschalten und ein Tier, eine Pflanze, eine Koralle oder eine Dekoration mit Maus oder Finger greifen.
2. Gedrückt halten und an eine freie Stelle ziehen. Die sichtbare 3D-Pinzette schließt sich, hebt den Gegenstand leicht an und setzt ihn beim Loslassen ab.
3. Beim Absetzen wird die neue Position automatisch im vorhandenen Spielstand gespeichert. Während des Ziehens bleibt die zuletzt gespeicherte Position unverändert.

Die Kamera bleibt im Pinzettenmodus gesperrt. Ein roter Ring kennzeichnet eine blockierte Stelle; beim Loslassen bleibt das Objekt an der letzten freien Stelle. Glasgrenzen, Objektgröße, Drehung, andere Pflanzenbasen, feste Dekorationen und die sichtbare Innenfilter-/Heizertechnik werden berücksichtigt. Schwimmpflanzen bleiben an der Oberfläche. Korallen werden auf dem Boden ausgerichtet. Bei Tieren verschiebt die Pinzette den Schwimmbereich; Schwimmhöhe und eigenständige Bewegung bleiben erhalten. Alle manuell veränderten Positionen werden ausschließlich mit der Pinzette gesetzt; die bisherigen X-/Z-Schieberegler und die alternative Klickplatzierung entfallen. Drehung und Darstellungsgröße bleiben einstellbar.

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

Die Dekorationen verwenden jetzt eigene, lokal mit Blender erzeugte GLBs in zwei Detailstufen; Oberflächentexturen entstehen lokal aus eigenem Code. Es gibt keine zusätzlichen Konten oder Dienste. Die Modelle sind **noch nicht fotorealistisch**. Die genannten ökologischen Funktionen beschreiben mögliche reale Funktionen; neue Versteck-, Huminstoff- oder Biofilmwerte werden in Phase 1 nicht als zusätzliche Simulationsboni vorgetäuscht. Herkunft und technische Grenzen: [Aquascaping-Dokumentation](docs/AQUASCAPING.md), [GLB-Lizenz](assets/realism/ATTRIBUTION.md).

![3D-Pinzette beim Verschieben](docs/screenshots/tweezers-mouse.png)

## Lokal starten

Das Spiel benötigt keinen Build und keine Laufzeitpakete. `index.html`, sämtliche lokalen `.mjs`-/`.css`-Dateien sowie `assets/catalog` und `assets/realism` gemeinsam bereitstellen. Relative Pfade unterstützen den Projektpfad `/Simulation-Aquarium/`. Die bestehenden Pages- und PR-Vorschau-Workflows bleiben erhalten.

Aus dem Repository-Verzeichnis kann Python den übergeordneten Ordner lokal bereitstellen:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory ..
```

Das Spiel liegt dann auf diesem Server unter `/Simulation-Aquarium/`. Die Cloud-Umgebung enthält die benötigten Entwicklungswerkzeuge bereits. Unter **Zeit & Runde → Komplettes HTML-Spiel herunterladen** wird weiterhin eine eigenständig nutzbare HTML-Datei einschließlich der neuen Funktionen erstellt. Spielstände zusätzlich als JSON exportieren; sie gehören nicht automatisch zum HTML-Download.

Das Speicherformat bleibt Version 1 mit dem bisherigen `localStorage`-Schlüssel `aquarium-werkstatt-v1`. Alte Spielstände werden weiterhin geladen. Die vorhandenen X-/Z-Positionen werden wiederverwendet; das optionale Feld `aquascapePlaced` kennzeichnet eine per Pinzette gespeicherte Platzierung. Nur feste Objekte werden auf dem Boden verankert; Tiere schwimmen weiterhin selbstständig. Ein einmal gespeicherter Stand mit neuen Dekorationsarten benötigt diese oder eine neuere Spielversion.

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

Details: [Bedienung, Speicherplätze und Modellgrenzen](docs/ECOSYSTEM.md), [Bildquellen und Erzeugung](docs/CATALOG.md). Zum Bereitstellen alle `.mjs`-/`.css`-Dateien und beide Assetverzeichnisse mitnehmen; weiterhin kein npm-Build und keine externen Laufzeitdienste. Der HTML-Download bündelt diese Dateien einschließlich Bilder und GLBs.

Zusätzliche Prüfungen in der eingerichteten Cloud-Umgebung:

```bash
node --test tests/*.test.mjs
python3 /workspace/aquarium-devtools/start.py
python3 tests/ecosystem_browser.py
```

Der letzte Befehl verwendet den lokalen Cloud-Server, isolierte Browserprofile und ausschließlich generierte Testspielstände. Ein anderer lokaler Projektpfad ist über `AQUARIUM_URL` konfigurierbar. Ergebnisse liegen unter `/tmp/aquarium-ecosystem-results`.

## Fortsetzung: Detailbilder und realistische Modelle

Artkarten und ausgewählte Beckenobjekte verwenden dieselben artspezifischen Bilder wie der Katalog. Die Fotorealismusprüfung und ihre technischen Grenzen stehen in [UI- und Modellprüfung](docs/UI_MODEL_REVIEW.md). Der begrenzte TripoSR-Versuch läuft ohne zusätzliche Konten auf einem kostenlosen Standardrunner des öffentlichen GitHub-Repositorys; Ergebnisse werden vor jeder Übernahme einzeln geprüft. Neue vereinfachte Massenmodelle sind nicht Teil dieses Durchgangs.
