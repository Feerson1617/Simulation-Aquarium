# Simulation-Aquarium

Deutschsprachiges Aquariumsimulationsspiel zum Aufbauen, Beobachten und Erforschen eines vereinfachten Ökosystems. Für Desktop-Browser und Touch-Bedienung entwickelt; statisch auf GitHub Pages unter `/Simulation-Aquarium/` nutzbar. Das Spiel und Teile seiner Inhalte wurden mit KI-Unterstützung erstellt.

**Release-Kandidat 1.0: Webversion freigabefähig.** Die letzte Korrektur behebt
den Tastaturfokus im M4-Elterndialog. M5/M6 sowie die vorgesehenen Modi und
Speicherwege sind abschließend geprüft. Die große Standalone-Datei bleibt ein
eingeschränkt freigegebenes Backup; echte iPad-/Safari-Hardware wurde nicht geprüft.
[Abschlussbericht und Freigabegrenzen](docs/release-final/REPORT.md),
[Originalbilder](docs/release-final/REVIEW.html),
[Einsatz und manueller Merge](docs/release-final/CHECKLIST.md),
[Prüfungen reproduzieren](docs/release-final/REPRODUCE.md).
Die [vorherige Release-Prüfung](docs/release-v1/REPORT.md) und die nachfolgenden
älteren Abnahmen bleiben Nachweise ihrer jeweiligen Versionen.

## Ein Aquarium, sechs Kernfragen

Die unabhängige Prüfung des Stands `5b661044` akzeptiert F01–F12 im dokumentierten Umfang. Der aktuelle [Restkorrekturauftrag R01–R03](docs/single-aquarium/release-corrections/REQUEST.md) behebt historische CSV-Exporte, erhält die Bedienposition im Leser und ermöglicht interne Offline-Wechsel in der Einzeldatei. [Technische Umsetzung und Grenzen](docs/single-aquarium/release-corrections/TECHNIK.md), [Abschlussbericht und Prüfgrenzen](docs/single-aquarium/release-corrections/TESTS.md), [neue Vorher-/Nachher-Belege](docs/single-aquarium/release-corrections/REVIEW.html). Die [frühere Bildabnahme](docs/single-aquarium/final-corrections/REVIEW.html) bleibt als versionsbezogener Nachweis erhalten. Die sechs Fragen bleiben: Licht und Sauerstoff, Futterreste, Vererbung, Populationsentwicklung, Wasserwechsel und Kohlenstoff. Jede Frage verwendet **ein tatsächliches Hauptaquarium**. Frühere Durchgänge bleiben gespeicherte Daten; kontrollierte Vergleiche beginnen ausdrücklich noch einmal ab demselben vollständigen Anfang.

**Einfache Sprache:** Klasse 8 wertet echte Balken und Verläufe selbst aus. Eine Vergleichszahl (Anfang = 100) macht kleine Veränderungen sichtbar, ohne die richtige Deutung vorwegzunehmen. Keine chemischen Kürzel oder Konzentrationseinheiten im normalen Lernweg. Originalwerte und Einheiten bleiben unverändert im Lehrkraftangebot und im Export. [Sprachregeln](docs/single-aquarium/LANGUAGE.md).

Genetik verwendet dieselben tatsächlichen Fische für Szene, Farbe, Erbanlagen und Elternschaft. Generationen sind als Zeitraffer gekennzeichnet; frühere Tiere werden archiviert. Zufällige Vererbung erhält keine festen Farbquoten. M4 trennt gleiche Chancen, unabhängige Zufallsfolgen und eine ausdrücklich gesetzte Fortpflanzungsregel.

**Frei forschen** öffnet ein eigenes aktuelles Aquarium für Klasse 8, 9 oder 10 mit den Gruppen Tiere/Pflanzen, Pflege und Messen. Katalog, Gerätetechnik, Pinzette, Dateien und freiwillige Notizen sind gezielt zugänglich. **Tutorial und Expertenwerkzeuge** bleiben erhalten. Lehrkräfte können gestufte Hilfen und freiwillige eigene Erklärungen lokal einstellen. Kein Konto, Backend oder Bezahldienst erforderlich; alte Dateien behalten ihre Bedeutung und ihre Speicherplätze.

[Abschlussbericht mit echten Prüfbelegen](docs/single-aquarium/FINAL_VALIDATION.md), [gesicherter Arbeitsstand](docs/single-aquarium/WORK_STATE.md), [sechs Lernhandlungen und alle 14 Altzuordnungen](docs/single-aquarium/MISSIONS.md), [Lehrkraftmaterial und tatsächlicher Curriculumabgleich](docs/single-aquarium/TEACHER.md). Die [frühere M1-Gate-Abnahme](docs/single-aquarium/VALIDATION.md) und die [14-Missions-/Zwei-Becken-Prüfungen](docs/coherent-learning/FINAL_VALIDATION.md) bleiben historische Belege ihrer jeweiligen Versionsstände.

Lokal prüfen: `node --test tests/*.test.mjs`, bei laufendem Entwicklungsserver anschließend `python3 tests/final_missions_browser.py` und `python3 tests/single_research_browser.py`. Gezielte Import-, Szenario- und Pinzettenprüfungen stehen in `tests/final_legacy_browser.py`, `tests/final_operations_browser.py` und `tests/final_tweezers_browser.py`. Die bisherigen Browserprüfungen bleiben historische beziehungsweise ergänzende Funktionsprüfungen. Die Tests verwenden echte Handlungen, getrennte Testprofile und Desktop/Tablet-Ansichten. `AQUARIUM_URL` ändert das Ziel. Eine vorhandene WebKit-Installation wird mit `AQUARIUM_BROWSER=webkit` und `AQUARIUM_WEBKIT` gewählt. Alte Browserprüfungen für 14 Missionen betreffen die ausdrücklich aufrufbaren historischen Werkzeuge. Physische Safari-iPads und Unterrichtserprobung sind eigene Prüfschritte.

## Geräte im erhaltenen Expertenbereich

Heizstab, Filter und Lampe sowie eingebaute Belüfter und Abschäumer lassen sich am sichtbaren 3D-Gerät oder dessen großer Schaltfläche öffnen. Das hervorgehobene Gerät hat einen gemeinsamen Drehregler mit Ziehen, Pfeiltasten, Plus/Minus und direkter Eingabe, auch mit Dezimalkomma. Im Freien Forschen gelten die Änderungen für das aktuelle Becken; beim Planen eines Vergleichs für Becken 2. Licht bietet im aktuellen Becken auch einen Helligkeitsregler. Belüfter und Abschäumer haben Ein-/Aus-Schalter. Nach Speichern oder Abbrechen bleibt die Tastaturbedienung am Gerät oder in den Lernwerkzeugen möglich. Natürliches Fensterlicht behält Stärke und Dauer im Einstellmenü ohne erfundene Lampe. Alte Futterwerte wie 0,65 bleiben erhalten. Die fachlichen Freischaltungen einer Mission gelten weiter.

Einstellungen bleiben bis zur nächsten Änderung bestehen. Der getrennte **Beobachtungszeitraum** begrenzt nur die berechnete Datenreihe. Wasserwechsel, Nährstoffeintrag und Pflanzenzugabe sind einmalige Aktionen. Wassertemperatur und biologische Folgen reagieren erst mit vergehender Spielzeit. Nach einem geänderten Versuchsplan müssen ausstehende Quest-Ergebnisse erneut berechnet und ausgewertet werden.

Die biologische Überarbeitung unterscheidet Zufall und Selektion, verlangt tatsächliche F1/F2- und regionale Lernhandlungen, trennt eigene Eingaben von Spieltexten und zeigt Fischüberleben neben dem Zustand lebender Fische. Die reguläre Geräteplanung bietet zunächst einen Hauptweg mit aufklappbarer Zahlenalternative. **Historischer Stand vor dem neuen Masterauftrag:** 139 Modultests, 95 Browserprüfpunkte und der damalige HTML-Download waren bestanden. [Korrekturmatrix](docs/biology-quality/MATRIX.md) und [Prüfbericht](docs/biology-quality/VALIDATION.md) dokumentieren Quellstände und Grenzen. [Umgebung und offene WebKit-Prüfung](docs/biology-quality/ENVIRONMENT.md) beschreiben die vorhandenen Werkzeuge und die vorbereitete Installation. Die [frühere Geräteabnahme mit120 Modultests/81 Browserprüfpunkten](docs/device-controls-correction/VALIDATION.md) ist historisch; ihre Zahlen werden nicht auf den neuen Biologiestand übertragen. Für alle Jahrgänge, den Expertenmodus und künftige Codex-Aufträge gelten die [gemeinsamen Bedienregeln](docs/device-controls.md). [Priorisierte Fehlerprüfung und Testmatrix](docs/device-controls-audit.md), [vollständige eigenständige Codex-Anweisung für PR 8](docs/device-controls-codex-instruction.md). `AGENTS.md` bleibt unverändert maßgeblich.

## Desktop- und iPad-Darstellung

Im Expertenmodus zuerst **Desktop-Version** oder **iPad-Version** wählen, danach Freies Spiel, Tutorial oder Szenarien starten. In den Lernumgebungen ist die Darstellung separat erreichbar. Desktop beginnt mit **Maximum**. Unter **Zeit & Runde → Darstellung** sind später **Hoch**, **Ultra**, **Maximum** und **iPad** wählbar. Der Wechsel baut nur die Grafik neu auf; die biologische Simulation und gespeicherte Becken bleiben gleich. Die Darstellungsauswahl steht getrennt unter `aquarium-graphics-v1` in `localStorage`.

Maximum verwendet die native Pixeldichte, feinere Geometrie, bis zu 4096-Pixel-Oberflächentexturen, bis zu 8192-Pixel-Schatten und die aufwendigere Wasseroptik. Es gibt keine künstliche FPS-Obergrenze. Tatsächliche Hardwaregrenzen und ein Ressourcenbudget verhindern unkontrollierte Grafikallokationen. iPad verwendet dieselben Arten und Funktionen mit geringerer Geometrie-/Texturauflösung, mobilen Dekorations-LODs und einfacheren transparenten Materialien.

Der Grafikdurchgang berücksichtigt **alle 181 Katalogeinträge**, ersetzt alle **11 Dekorationen** durch eigene Blender-GLBs und verfeinert die gemeinsamen Tier-, Pflanzen-, Technik- und Materialpfade. Fünf vorhandene fototexturierte Volumenmodelle und das BlueMesh-Betta-Modell bleiben erhalten. **Die gewünschte umfassende Fotorealistik ist noch nicht erreicht.** Besonders native Tiere, Pflanzen, Wirbellose und Korallen brauchen weitere anatomische und künstlerische Arbeit; mehr Polygone allein genügen nicht.

Die [vollständige Bearbeitungsmatrix](docs/realism/CATALOG_STATUS.md) unterscheidet tatsächliche Änderungen und offenen Modellierungsbedarf. [Grafikarchitektur und Grenzen](docs/realism/README.md), [aktuelle Prüfungen und Live-Screenshots](docs/realism/VALIDATION.md).

## Maßstab und natürliche Körpergrößen

Alle sieben Beckentypen und sämtliche Organismen verwenden dieselbe Zentimeterkalibrierung: **1 Welteinheit entspricht 20 cm**. Art, Geschlecht, Alter, gespeicherter Wachstumsstand und eine kleine stabile Individualvariation bestimmen die Größe. Sie bleibt beim Wechsel von Becken oder Grafikprofil erhalten. Tiere, Pflanzen, Wirbellose und Korallen haben keine manuellen Größen-/Drehregler mehr; Dekorationen behalten diese Einstellungen. Alte Spielstände werden mit protokollierten räumlichen Anpassungen übernommen, ohne Organismen oder Genetik zu löschen.

Eine gezielte Anubias-Überarbeitung ergänzt breite geneigte Blätter und eine dokumentierte CC-BY-Fototextur. Die übrigen Modelle bleiben erhalten. [System, Migration und echte Vorher-/Nachher-Bilder](docs/physical-scale/README.md), [Größen aller Arten und Annahmen](docs/physical-scale/SIZES.md), [Prüfbericht](docs/physical-scale/VALIDATION.md). Vollständiger Fotorealismus und eine neue Netto-Wasservolumenbilanz sind damit noch nicht erreicht.

## Farbvarianten und Genetik

Im Fischshop aktualisiert **Farbe** bei 16 Arten sofort Name und echte 3D-Vorschau. Die gewählte Form bleibt beim einzelnen Tier gespeichert. **Genetik** öffnet echte Elternauswahl, Nachkommen, Abstammung und auf Wunsch Genotypen und Punnett-Quadrate. Molly und Platy dienen ausdrücklich vereinfachten Mendelversuchen; Zebrabärblinge legen zunächst Eier. Wochen- und Zweiwochen-Zeitraffer rechnen dieselbe biologische Simulation einschließlich Wasserwerten und Wachstum weiter.

127 bisher native Organismen erhalten neue eigenständige Blender-GLBs mit Desktop-/Mobilgeometrie. Vier Fischarten verwenden zusätzlich erzeugte Texturvorlagen. Das ist keine pauschale Fotorealismus-Abnahme; die sechs besten Bestandsmodelle bleiben erhalten. [Anleitung und Modellgrenzen](docs/species-genetics/README.md), [aktueller Modellstatus](docs/species-genetics/MODEL_STATUS.md) und [Abschlussbericht](docs/species-genetics/REPORT.md) beschreiben Umfang, Tests und verbleibende Arbeit. Die ältere Grafikmatrix unten dokumentiert den vorherigen Durchgang.

## Phase 1: Aquarium mit der Pinzette gestalten

Nach dem Aufstellen eines Beckens steht unten das Werkzeug **Pinzette** bereit:

1. Pinzette einschalten und ein Tier, eine Pflanze, eine Koralle oder eine Dekoration mit Maus oder Finger greifen.
2. Gedrückt halten und an eine freie Stelle ziehen. Die sichtbare 3D-Pinzette schließt sich, hebt den Gegenstand leicht an und setzt ihn beim Loslassen ab.
3. Beim Absetzen wird die neue Position automatisch im vorhandenen Spielstand gespeichert. Während des Ziehens bleibt die zuletzt gespeicherte Position unverändert.

Die Kamera bleibt im Pinzettenmodus gesperrt. Ein roter Ring kennzeichnet eine blockierte Stelle; beim Loslassen bleibt das Objekt an der letzten freien Stelle. Glasgrenzen, Objektgröße, Drehung, andere Pflanzenbasen, feste Dekorationen und die sichtbare Innenfilter-/Heizertechnik werden berücksichtigt. Schwimmpflanzen bleiben an der Oberfläche. Korallen werden auf dem Boden ausgerichtet. Bei Tieren verschiebt die Pinzette den Schwimmbereich; Schwimmhöhe und eigenständige Bewegung bleiben erhalten. Alle manuell veränderten Positionen werden ausschließlich mit der Pinzette gesetzt; die bisherigen X-/Z-Schieberegler und die alternative Klickplatzierung entfallen. Drehung und Darstellungsgröße bleiben ausschließlich für reine Dekorationen einstellbar.

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

Das Spiel benötigt keinen Build und keine Laufzeitpakete. `index.html`, sämtliche lokalen `.mjs`-/`.css`-Dateien sowie `assets/catalog`, `assets/realism` und `assets/species` gemeinsam bereitstellen. Relative Pfade unterstützen den Projektpfad `/Simulation-Aquarium/`. Die bestehenden Pages- und PR-Vorschau-Workflows bleiben erhalten.

Aus dem Repository-Verzeichnis kann Python den übergeordneten Ordner lokal bereitstellen:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory ..
```

Das Spiel liegt dann auf diesem Server unter `/Simulation-Aquarium/`. Die Cloud-Umgebung enthält die benötigten Entwicklungswerkzeuge bereits. Unter **Zeit & Runde → Komplettes HTML-Spiel herunterladen** wird weiterhin eine eigenständig nutzbare HTML-Datei einschließlich der neuen Funktionen erstellt. Spielstände zusätzlich als JSON exportieren; sie gehören nicht automatisch zum HTML-Download.

Das Speicherformat bleibt Version 1 mit dem bisherigen `localStorage`-Schlüssel `aquarium-werkstatt-v1`. Alte Spielstände werden weiterhin geladen. Die vorhandenen X-/Z-Positionen bleiben relative Beckenkoordinaten; die versionierte `spatial`-Migration prüft Grenzen und feste Nachbarn und archiviert alte biologische Größen-/Drehwerte. Das optionale Feld `aquascapePlaced` kennzeichnet eine per Pinzette gespeicherte Platzierung. Nur feste Objekte werden auf dem Boden verankert; Tiere schwimmen weiterhin selbstständig. Ein einmal gespeicherter Stand mit neuen Dekorationsarten benötigt diese oder eine neuere Spielversion.

## Tests

```bash
node --test tests/*.test.mjs
python3 tests/biology_quality_browser.py
python3 tests/device_controls_browser.py
python3 tests/quest_browser.py
python3 tests/quest_controls_browser.py
python3 tests/learning_review_browser.py
python3 tests/learning_additional_browser.py
python3 tests/learning_browser.py
python3 tests/readiness_browser.py
python3 tests/species_assets_test.py
python3 tests/physical_scale_browser.py
python3 tests/physical_hardware_browser.py
python3 tests/catalog_ui_browser.py
python3 tests/aquascaping_browser.py
python3 tests/standalone_browser.py
```

Bei Pull Requests führt `module-tests.yml` die kostenlosen Node-Modultests automatisch aus; Pages-Checks prüfen weiterhin die Veröffentlichung. CSV-Schema 2 beschreibt Messnamen, Einheiten, Typen, Seeds und Status: [Datenformat](docs/learning/CSV_SCHEMA.md).

Die Browserprüfungen benötigen Python-Playwright und Chromium und verwenden isolierte Browserprofile. Maßstab-, Katalog-, Aquascaping- und Standalone-Tests starten ihren eigenen vorübergehenden Server. Technik- und Genetiktests erwarten den eingerichteten lokalen Entwicklungsserver; `AQUARIUM_TEST_URL` erlaubt einen anderen Projektpfad. Lern-, Review-, Fokus-, Bereitschafts- und Ökosystemprüfungen verwenden `AQUARIUM_URL`; bei den beiden Expertenprüfungen Bereitschaft/Ökosystem den Zusatz `?expert=1` angeben. Beispiel für den oben beschriebenen Standardserver: `AQUARIUM_URL=http://127.0.0.1:8000/Simulation-Aquarium/ python3 tests/learning_review_browser.py`. GPU-Browserläufe auf dieser CPU-Cloud nacheinander ausführen. In dieser Cloud-Umgebung sind beide vorhanden. Auf anderen Entwicklungsrechnern lässt sich ein installierter Browser über `AQUARIUM_CHROMIUM` auswählen. Optional kann Playwrights eigener Chromium verwendet werden. Es sind keine zusätzlichen Konten nötig.

Getestet werden unter anderem echte Maus-/Touch-Gesten, Kamerasperre, Kollisionen, Glasgrenzen, Abbrechen, Tastaturbedienung, alle sechs neuen Modelle, alte Spielstände und der HTML-Download. Ergebnisse und Screenshots des Aquascaping-Tests liegen standardmäßig unter `/tmp/aquarium-phase1-results`; `AQUARIUM_TEST_RESULTS` ändert das Zielverzeichnis. Tablet-Emulation in Chromium ersetzt keinen Test auf einem echten Safari-iPad. Die vorhandenen Spielstart-/Tutorialprüfungen bleiben zusätzlich Teil der Regression.

Die nächsten Phasen sind in der [Roadmap](docs/ROADMAP.md) beschrieben. Änderungen werden über einen eigenen Branch und Pull Request geprüft; eine Veröffentlichung erfolgt nach manueller Freigabe.

## Katalog, Analyse und Szenarien

Der Featurestand ergänzt 181 lokale, mit Quellen belegte **Modellvorschauen**, den gemeinsamen Analysemodus **Ökosystem** und fünf Szenarien. Die Szenarien starten auf der Startseite und speichern separat vom freien Aquarium. Über den Auftragsknopf sind Hinweise und eigene Untersuchungsnotizen erreichbar. Im Analysemodus stehen Nahrungsnetz, begründete Fragezeichen, Artenprüfung, virtuelles Mikroskop, Stoffumwandlungen, Energiefluss und Umweltwerte zur Verfügung; dabei pausiert die Spielzeit.

Zersetzung, Mineralisierung und sauerstoffbegrenzte Nitrifikation sind jetzt getrennt gekoppelt; tatsächliche Nahrung beeinflusst die Tiergesundheit. Die laufende 3D-Szene ergänzt gemeinsame Schwarmbahnen und eine vom Beckenstand abhängige Wasseroberfläche. Die biologischen und grafischen Modelle bleiben vereinfacht. Eine vollständige Massen-/Energiebilanz oder erreichte Fotorealistik wird nicht behauptet.

Details: [Bedienung, Speicherplätze und Modellgrenzen](docs/ECOSYSTEM.md), [Bildquellen und Erzeugung](docs/CATALOG.md). Zum Bereitstellen alle `.mjs`-/`.css`-Dateien und die drei Assetverzeichnisse mitnehmen; weiterhin kein npm-Build und keine externen Laufzeitdienste. Der HTML-Download bündelt diese Dateien einschließlich Bilder und GLBs.

Zusätzliche Prüfungen in der eingerichteten Cloud-Umgebung:

```bash
node --test tests/*.test.mjs
python3 /workspace/aquarium-devtools/start.py
python3 tests/ecosystem_browser.py
```

Der letzte Befehl verwendet den lokalen Cloud-Server, isolierte Browserprofile und ausschließlich generierte Testspielstände. Ein anderer lokaler Projektpfad ist über `AQUARIUM_URL` konfigurierbar. Ergebnisse liegen unter `/tmp/aquarium-ecosystem-results`.

## Fortsetzung: Detailbilder und realistische Modelle

Artkarten und ausgewählte Beckenobjekte verwenden dieselben artspezifischen Bilder wie der Katalog. Die Fotorealismusprüfung und ihre technischen Grenzen stehen in [UI- und Modellprüfung](docs/UI_MODEL_REVIEW.md). Drei fotobasierte TripoSR-Piloten wurden ohne zusätzliche Konten auf kostenlosen CPU-Standardrunnern erzeugt und tatsächlich im Spiel aus mehreren Blickwinkeln verglichen. Auch der gezielt korrigierte Pflanzenversuch erreicht keine ausreichende anatomische Qualität; deshalb bleibt der bisherige Modellbestand erhalten und es gibt keine Ausweitung auf weitere Arten. [Vergleichsbilder, Quellen und Qualitätsentscheidung](docs/ui-model-review/README.md). Neue vereinfachte Massenmodelle sind nicht Teil dieses Durchgangs.

## Historischer Masterauftrag: zwei sichtbare Becken (durch neueren Auftrag ersetzt)

Der neue Vergleichsarbeitsbereich der Beckenmissionen zeigt zwei tatsächliche Becken mit vorhandenen 3D-Modellen in einem gemeinsamen WebGL-Kontext. Heizersollwert, gemessene Temperatur und Versuchsuhr sind getrennt. Dieselbe Auswahl aus Reihe, Wiederholung und Zeitpunkt steuert Becken, Messkarten, Diagramm und Exporte. Beckenaufzeichnungen werden verlustfrei lokal komprimiert; frühere unkomprimierte Lernprodukte bleiben lesbar. Die dafür lokal mitgelieferte Bibliothek steht unter der [MIT-Lizenz](vendor/lz-string.LICENSE).

Der Temperaturprototyp wurde am 22.10.2026 ausdrücklich freigegeben. Die gemeinsame Vergleichsfläche ist auf alle neun Beckenmissionen und Freies Forschen übertragen; Genetik verwendet zählbare tatsächliche Lernfische, regionale Fälle eine gesonderte qualitative Arbeitsfläche. [Fortsetzung und Bedienprinzipien](docs/coherent-learning/PHASE3.md), [geklärter Ammoniumpool](docs/coherent-learning/AMMONIA_POOL.md). [Ablauf und tatsächliche Bilder](docs/coherent-learning/PROTOTYPE.md), [Auftrag und Stand](docs/coherent-learning/WORK_STATE.md), [Missionsmatrix](docs/coherent-learning/MISSIONS.md).

Die technische Schlussprüfung umfasst **173 bestandene Modultests** und die **Hauptwege aller 14 Missionen in Chromium und WebKit**, ergänzt durch Touch, freie Jahrgänge, Tutorial, Altdaten und Einzel-HTML. [Abschlussbericht mit Bildern, genauen Versionsständen und offenen Grenzen](docs/coherent-learning/FINAL_VALIDATION.md). [Curriculum und Quellen für Lehrkräfte](docs/coherent-learning/CURRICULUM.md). Physische iPads, natives Datei-Offlineverhalten und Lernerfolg im Unterricht sind noch nicht geprüft.

**Dauerhafte Entwicklungsregel:** Bei jeder künftigen Änderung sind die Auswirkungen auf Klasse 8/9/10, die betroffenen Missionen, Freies Forschen, Lehrkraft-/Expertenmodus, Tutorial, Spielstände und Touchbedienung ausdrücklich zu prüfen und zu dokumentieren. Ein erfolgreicher technischer Test ist keine Unterrichts- oder Hardwarefreigabe.
