# Prüfbericht: Arten, Farbformen und Genetik

Geprüft am 19. Oktober 2026 auf dem Branch `feature/species-variants-genetics`, ausgehend von main `87491db`. Kostenfreie lokale Werkzeuge: Node.js 24, Python 3.12 mit Pillow/NumPy, Blender 4.3 und Playwright mit Chromium 154. Chromium verwendet in dieser Cloud SwiftShader. Die Laufzeiten sind deshalb keine Leistungsangaben für echte Geräte.

## Automatisierte Fach- und Dateiprüfungen

`node --test tests/*.test.mjs` prüft 54 Fälle: bestehende Aquascaping-, Grafik-, Katalog- und Ökosystemfunktionen sowie 15 Genetik-/Populationsfälle. Dazu gehören AA × aa, zufälliges Aa × Aa, ausdrücklich unabhängige dihybride Verteilung, echte F1-Eltern für F2, Bedingungen für Fortpflanzung, Eier/Schlupf, Jungtierwachstum, Migration, Speicherung und Populationsgrenzen. Eine statistische Stichprobe prüft die Verteilung; Würfe werden nicht auf ein festes Verhältnis gebracht.

`python3 tests/species_assets_test.py` prüft sämtliche 127 neuen Modellpaare: 254 eigenständige GLBs mit eingebetteten Bildern, gültigen Binärgrenzen und ausgerichteten quantisierten Attributen. Mobile Dateien enthalten tatsächlich weniger Geometrie. Einzeldateien bleiben unter 4 MB und die Summe unter 120 MB. Diese technischen Prüfungen bestätigen keinen Fotorealismus.

## Tatsächliche Spielabläufe im Browser

| Prüfung | Nachgewiesener Umfang | Protokoll |
| --- | --- | --- |
| Genetik, 9 Prüfungen | Käufe schwarzer AA-Weibchen und goldener aa-Männchen; fünf tatsächlich geborene schwarze Aa-F1; Kreuzung echter F1-Eltern mit F2; individuelle Texturquellen und kleinere Jungtiere; Import, Neuladen und Profilwechsel; Platy-AaBb und 4×4-Schema; Zebrabärbling-Eier und Schlupf; Touch | [genetics-browser.json](evidence/genetics-browser.json) |
| Vollständiger HTML-Download | 150.079.840 Byte große Einzeldatei startet, platziert Becken/Dekoration, zeigt einen quantisierten roten Guppy und öffnet Genetik/Pinzette ohne weitere Ressourcendateien | [standalone-browser.txt](evidence/standalone-browser.txt) |
| Große Population | 100 lebende Individuen, im iPad-Profil 64 detailliert sichtbar, im Desktop-Profil alle 100; ausgewähltes Tier sichtbar und gespeicherter Zustand unverändert | [population-browser.json](evidence/population-browser.json) |
| Allgemeine Regression, 13 Prüfungen | Start und Freies Spiel, 120-Liter-Beckenplatzierung, Katalog/3D, Pflege und Wasserparameter, Zeitfortschritt, Export/Import/Neuladen und alle acht Tutorialstufen mit Touch | [readiness-browser.json](evidence/readiness-browser.json) |
| Ökosystem und Szenarien, 12 Prüfungen | Sechs Analyseansichten, reales Nahrungsnetz, Fütterung/Beute, alle fünf Szenarien, Tag/Nacht, Notizen, Neustartsicherung und getrennte Speicherplätze, Export/Import sowie Portrait-Touch | [ecosystem-browser.json](evidence/ecosystem-browser.json) |
| Aquascaping, 12 Prüfungen | Alte v1-Spielstände; Maus- und Touch-Verschieben, Kamerasperre, Kollisionen, Glasgrenzen, Abbrechen, gespeicherte Positionen, Tastatur, Süß-/Meerwasserdekoration | [aquascaping-browser.json](evidence/aquascaping-browser.json) |
| Grafik, erster Teil | Vollständige Inventur von 181 Einträgen, alle 144 Organismen-/Dekorationspfade im echten Modelllader, Maximum-Aquarium, sparsamere iPad-Darstellung ohne Spielstandänderung und elf Maximum-Nahansichten | [graphics-primary.json](evidence/graphics-primary.json) |
| Meerwasser/Touch, 3 Prüfungen | Tatsächliches Maximum-Riffaquarium, Portrait-Touch-Bedienung und keine JavaScript-, Shader-, Ressourcen- oder externen Laufzeitanfragen | [graphics-marine-touch.json](evidence/graphics-marine-touch.json) |
| Letzte Modellkorrekturen | Elf zuletzt geänderte Modellpfade erneut geladen; geschlossene Gehäuse in echten Nahansichten; Schwertträger-Weibchen ohne Schwert, mit roter Zuchtfärbung; Vorschau verwendet denselben Renderer | [species-visual-browser.json](evidence/species-visual-browser.json) |
| Weibliche Guppy-Farbformen | Zusätzliche tatsächliche Materialprüfung: rote beziehungsweise blaue Flossen bleiben trotz zurückhaltender weiblicher Körperfärbung erhalten | [female-guppy-pigment.json](evidence/female-guppy-pigment.json) |

Der erste gesamte Grafiklauf hat **keinen erfolgreichen Gesamtstatus**: Nach fünf bestandenen Prüfungen enthielt seine künstlich zusammengesetzte Riff-Testdatei noch das Genetikarchiv anderer Tiere mit denselben IDs. Die Anwendung wies diese widersprüchliche Datei korrekt zurück. Der Test erzeugt nun konsistente Riffdaten; der betroffene Meerwasser-/Touch-Teil wurde danach erfolgreich erneut ausgeführt. Das ursprüngliche Fehlerprotokoll bleibt unverändert erhalten. Die Importvalidierung wurde nicht gelockert.

Im ersten Ökosystemlauf bestand der gesamte fachliche Szenarioteil; die abschließende Touch-Prüfung verwendete einen mehrdeutigen CSS-Selektor, der seit dem neuen Genetikdialog zwei Elemente findet. Der Test wählt nun den Ökosystemdialog über seinen zugänglichen Namen. Das [erste Protokoll](evidence/ecosystem-first-run.json) bleibt erhalten; anschließend bestand der vollständige wiederholte Lauf alle zwölf Prüfungen.

Der reale F2-Browserlauf zeigt ein schwarzes und drei goldene Jungtiere. Das ist eine kleine zulässige Zufallsstichprobe und kein behaupteter experimenteller Nachweis einer exakten 3:1-Quote. Die zugehörigen Eltern und Genotypen stammen aus dem gespeicherten Spielzustand.

Der verwaltete Chromium-Browser sperrt `file:`-Navigation. Deshalb wurde die tatsächlich heruntergeladene HTML-Datei allein über einen lokalen HTTP-Server ohne Module, Bilder oder andere Begleitdateien geprüft. Sie benötigt dabei keine weiteren HTTP-Ressourcen. Direktes Öffnen vom Dateisystem wurde unter dieser Browserrichtlinie nicht getestet. Der große HTML-Download enthält beide LODs; die normale Website lädt Modelle bedarfsgerecht.

## Sichtkontrolle und Grenzen

Die [Screenshots](screenshots/) zeigen die laufende Anwendung: Shopfarben, tatsächliche F2 im Aquarium, Genetikanalyse, Eier/Schlupf, Touch sowie neue Modelle neben erhaltenen Neon-/Molly-Modellen. Vier Kontaktbögen und die [181-zeilige Modellmatrix](MODEL_STATUS.md) ergänzen die Kontrolle. Katalogbilder sind Renderings des tatsächlichen Spielmodellpfades, keine erfundenen Aquariumsszenen.

Eine Sichtprüfung deckte eine gemeinsam veränderte Three.js-Bildquelle zwischen schwarzen und goldenen Mollys auf. Sie wurde durch unabhängige Instanztexturen behoben; der erneute gekoppelte Browserlauf prüft ausdrücklich getrennte Bildquellen und zeigt beide Farben gleichzeitig. Weitere Korrekturen betreffen die Geschlechtsmorphologie der Lebendgebärenden und geschlossene Schneckengehäuse.

Die letzte Sichtkontrolle entfernte außerdem die rechteckige Begrenzung eines weiblichen Pigmentflecks. Schwertträger-Weibchen behalten ihre Wild-/Zuchtfärbung; Guppy-Weibchen behalten die Flossenfarben ihrer roten beziehungsweise blauen Zuchtform. Die zwei zusätzlichen Guppy-Materialfälle wurden nach dieser letzten Korrektur separat im Browser ausgeführt und in die wiederholbare Sichtprüfung übernommen. Die [zusammengeführten 144 Messwerte](evidence/model-audit-ipad.json) verwenden für alle elf seit der großen Inventur geänderten Modelle die neuen Werte; [Herkunft der Messungen](evidence/model-audit-sources.json).

**0 neue Modelle sind vollständig als fotorealistisch abgenommen.** Die technischen Nachweise ersetzen keine anatomische Einzelabnahme anhand unabhängig geprüfter Referenzfotos. Teilweise blockierte externe Referenzabrufe, gemeinsame parametrische Grundformen und noch vereinfachte Oberflächen bleiben dokumentierte Grenzen. Die vier erzeugten Texturvorlagen sind keine Referenzfotografie.

Touch und iPad-Bildgrößen wurden in Chromium emuliert. Safari, echte iPads, Hardware-FPS und tatsächlicher GPU-Speicherverbrauch wurden nicht gemessen. Das Maximum-Profil benötigt deutlich mehr Ressourcen; die angezeigte Texturbudgetzahl ist eine Schätzung. Keine Veröffentlichung und kein Merge wurden ausgeführt.

## Wiederholung

Den lokalen Entwicklungsserver nach der Projektanleitung starten, danach GPU-Tests nacheinander ausführen:

```sh
node --test tests/*.test.mjs
python3 tests/species_assets_test.py
python3 tests/genetics_browser.py
python3 tests/population_browser.py
python3 tests/graphics_browser.py
python3 tests/species_visual_browser.py
python3 tests/aquascaping_browser.py
python3 tests/ecosystem_browser.py
python3 tests/standalone_browser.py
```

Browserprotokolle verwenden isolierte Testprofile und Testspielstände. Der Cloud-Startablauf wurde als Konfigurationsentwurf ergänzt; seine Veröffentlichung und die Wiederherstellung in einer neu erzeugten Cloud-Umgebung wurden nicht behauptet oder geprüft.

## Cloud-Entwicklungsumgebung

Node.js 24.19, Python 3.12.14, Blender 4.3.2, Chromium 154 sowie NumPy, Pillow und Playwright stehen zur Verfügung und wurden in den obigen Prüfungen tatsächlich verwendet. Der lokale Entwicklungsserver unterstützt den Projekt-Unterpfad der statischen Website. Zusätzliche Zugangsdaten, Konten und kostenpflichtige Dienste sind nicht erforderlich.

Die bestehende Installationskonfiguration wurde erhalten. Die Startanleitung im Cloud-Konfigurationsentwurf wurde um die Modellpipeline, Genetikprüfungen und den gesicherten Arbeitsbranch ergänzt. Installationsskript, Netzwerkregeln und Geheimnisse wurden dabei nicht verändert. Der Entwurf wurde gespeichert; ein veröffentlichter neuer Umgebungsstand beziehungsweise ein erfolgreicher Kaltstart einer neu erstellten Umgebung wird damit nicht behauptet.
