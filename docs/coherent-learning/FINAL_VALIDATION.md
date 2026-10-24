# Abschlussprüfung des freigegebenen Masterauftrags

22.10.2026. **Anwendungscode: `f12d5e8789cb70268469df8c6a60ecb15547cf91`** auf `feature/coherent-learning-workspaces`. [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9) · [Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/) · [Missionsmatrix](MISSIONS.md) · [Bild- und Ergebnisindex aller 14 Missionen](evidence/final/missions/INDEX.md).

Die zentralen sichtbaren Handlungen aller 14 Missionen sind umgesetzt und über die tatsächliche Oberfläche geprüft. Der Temperaturprototyp war ausdrücklich freigegeben; nach sichtbarer Prüfung der Populations- und Hafenmuster wurden Phasen 3/4 übertragen und integriert. Die technischen Schlussprüfungen sind bestanden. Eine neue menschliche Gesamt-Sichtabnahme, physische iPad-Abnahme oder Unterrichtswirksamkeit wird daraus nicht abgeleitet. Main ist unverändert; kein Merge.

## Änderungen und P1/P2-Befunde

| Befund | Resultierendes Verhalten | Konkreter Beleg |
|---|---|---|
| A–C: Becken und Ergebnis nicht eindeutig zugeordnet | Zwei tatsächliche Becken vor der Vermutung; ein Kontext steuert Reihe, Wiederholung, Zeit, Szene, große Messkarten und Export. Ein neuer Plan bleibt vom alten Ergebnis getrennt. | Kontextprüfungen; [öffentliche Vorschau](evidence/final/preview/webkit/report.json) |
| D: wirkungslose Handlung als Eingriff | Wasser 0 % und unveränderte Lampe bleiben Kontrollläufe und erfüllen den Eingriffsschritt nicht. Ein echter Eingriff darf gleiche Messwerte erzeugen. | [Grenzfälle Chromium](evidence/final/boundaries/chromium/report.json), [WebKit](evidence/final/boundaries/webkit/report.json) |
| E: Population und Hintergrund verschieden | Zählbare tatsächliche Individuen, gleiche ID für Farbe, Genotyp, Geschlecht und Eltern. Tatsächliche F1/F2 und dokumentierte Allelziehung; Generationen ersetzen Tage. Fremde Mollykulisse ausgeblendet. | [Mendel im Hochformat](evidence/final/domains/webkit/portrait-mendel.png), beide Domänenberichte |
| F/L: unpassende Kulisse und Vergleichsebene | Bedienbare Nahrung-/Stoff-/Energienetze, Kohlenstoffspeicher und fossiler Zusatz, Land–Fluss–Nordsee. Baumblatt in Luft und Wasserpestblatt unter Wasser auf gleicher Ebene; auch Wasserpest kann im Boden wurzeln. | [Nahrung](evidence/final/missions/webkit/desktop-8-foodweb-active-process.png), [Blätter](evidence/final/missions/webkit/desktop-8-forest-active-process.png), [Kohlenstoff](evidence/final/missions/webkit/desktop-10-carbon-active-process.png) |
| G: Neustart mit alten F1/F2-Belegen | Wiederholen archiviert das komplette vorherige Produkt und setzt Population, Durchgang und Nachweise zurück. Alte Belege erfüllen keinen neuen Schritt. Freies Wiederholen sichert auch den vollständigen alten Bestand. | Domänen-/Kompatibilitätsprüfungen; Node-Archivtests |
| H: Netzsammlung endet mit Mehrwegsatz | Beide Hafenmaßnahmen besitzen eigene Quellenpfade, Nutzen, Aufwand, Gegenargument und Erfolgskontrolle. Keine Aquariumzeit oder Wasserchemie im Hafen. | [Netzsammlung Hochformat](evidence/final/domains/webkit/portrait-harbour-gear.png), beide Maßnahmen in beiden Engines und Einzel-HTML |
| I/J: Feedback, Hilfen und ungeeignete Anzeigen | Fehler mit Fehlersymbol/-farbe; Vermutung neutral. Hilfen stufenweise Ort → Daten → Zusammenhang. Pflanzen relativ zum Anfang 1; einheitliche Auflösung. Klasse 8 beginnt ohne automatische Nitritanzeige; tatsächliche Risiken bleiben verständlich sichtbar. | Hauptwege, Syntax-/Sprachprüfungen, gezielte manuelle Pflanzenmessung |
| K: unklarer Ammoniakvertrag | Neuer deklarierter TAN-Gesamtpool in mg NH₄-Äquivalent/L; freie Spezies mit passender Massenumrechnung. Alte Zahlen bleiben unverändert und als Grundlage undokumentiert gekennzeichnet. | [Stoffvertrag](AMMONIA_POOL.md), quantitative Node-Tests und tatsächlicher Browser-Loader |

In den dokumentierten Schlussläufen ist kein zentraler P1/P2-Funktionsfehler reproduzierbar geblieben. Nicht unabhängig nachprüfbare Landes-/Regionalquellen und menschliche/gerätebezogene Abnahmen sind unten ausdrücklich offen.

## Tatsächlich ausgeführte Schlussläufe

Alle Berichte enthalten ihren eigenen Git-Stand; die zusätzlichen Quellhashes stehen im [Manifest](evidence/final/manifest.json). Die Zahlen bezeichnen Prüfpunkte, keine Anzahl erfolgreicher Lernender. Alte Gateberichte unter `evidence/` sind historische Belege und werden nicht als neue Schlussläufe gezählt.

| Bereich | Bestandene Prüfung | Bericht / Quellenstand |
|---|---|---|
| Modultests | **173/173**, keine übersprungen | [Node-Protokoll](evidence/final/node.log), `f12d5e8` |
| Alle Missionen | **14/14 je Engine**, sichtbare Handlungen, Fehlversuch/Fortsetzung, Hilfen, Export, Reload in einem angesammelten Profil pro Engine; keine JS-/Requestfehler | [WebKit](evidence/final/missions/webkit/report.json), [Chromium](evidence/final/missions/chromium/report.json), `45d78b5` |
| Aktuelle Kontext-Endprüfung | **15 WebKit / 9 Chromium**, zwei verschiedene Reihen mit Wiederholung 2, Zeit/Seite/CSV/JSON, Temperaturformate, Nullmaßnahmen, Abbruchseite und echter F1/F2-Neustart. Nach Testablaufkorrekturen fortgesetzt; vorher bestandene Prüfungen bleiben ausdrücklich nachgewiesen. | [WebKit](evidence/final/context/webkit/report.json), [Chromium](evidence/final/context/chromium/report.json), `f12d5e8`; WebKit drei Formate, Chromium Desktop |
| Population/Hafen/Freies Forschen | **12/12 je Engine**: echte F1/F2, Eltern, historische Kohorte readonly, Wiederholen, beide Hafenwege, freie Jahrgänge 8/9/10 und Gruppenvergleich | [WebKit](evidence/final/domains/webkit/report.json), [Chromium](evidence/final/domains/chromium/report.json), `d980037` |
| Kritische Grenzfälle | **6/6 je Engine**: Nullwasser bis Ende, Abbruchseite, frühe/späte Kontexte, unveränderte Lampe, Regionalwechsel, echter Loader und eigene Pflanzenmessung | [WebKit](evidence/final/boundaries/webkit/report.json), [Chromium](evidence/final/boundaries/chromium/report.json), `f12d5e8` |
| Speicher/Altdaten/Bedienung | **5 Chromium / 4 WebKit**: echter Altabschluss mit Sicherung, fehlende alte Szene, Speicherfehler, fünfte Reihe, Lehrkrafthilfe und Hoch-/Querformat. Zusätzlich natives Chromium-Touchziehen | [Chromium](evidence/final/compat/chromium/report.json), `f12d5e8`; [WebKit](evidence/final/compat/webkit/report.json), `d980037` |
| Vollständige Touchwege | **3/3 WebKit**: Sauerstoff, Mendel, Kohlenstoff einschließlich tatsächlicher Tap-Aktionen, Export und Reload | [Touchbericht](evidence/final/touch/report.json), `f12d5e8` |
| Expertenregression | **13/13 Chromium**: Start, sichtbare Modelle, Platzierung, Katalog/Einsetzen, Wasser/Tag, Datei speichern/importieren, neues Profil, alle acht Tutorialstufen mit Touch, Hochformat | [Expertenbericht](evidence/final/expert/report.json), `d980037` |
| Neues Einzel-HTML | **5/5 je Engine**: Temperatur, echte F1/F2, beide Hafenwege, eigene Pflanzenmessung; nach Dokumentladen offline, keine nachgeladenen HTTP-Unterressourcen | [WebKit](evidence/final/standalone/webkit/report.json), [Chromium](evidence/final/standalone/chromium/report.json), `f12d5e8` |
| Tatsächliche PR-Vorschau | **56/56 Laufzeitdateien** stimmen per SHA-256 überein; wirklicher WebKit-Aufruf mit zwei realen Modellgruppen, Nebenansichten/Profilwechsel und Export eines noch nicht ausgeführten Plans mit früherem Ergebnis | [Hashabgleich](evidence/final/preview/public-hashes.json), [Browserbericht](evidence/final/preview/webkit/report.json), `f12d5e8` |

**Fortgesetzte Kontextprüfung:** Die Berichte verweisen auf ihre unveränderten ursprünglichen Fehlerberichte und protokollieren die Fortsetzung. Vorher bereits bestandene 13 WebKit-/7 Chromium-Punkte werden nicht als neu ausgeführt ausgegeben. Nur die verbleibenden Sanierungs-/Mendel-Schritte wurden nach Korrektur des Testablaufs mit frischen Browserkontexten wiederholt; eine zusätzliche Nullwasserprüfung ist als `rechecked` getrennt. Alle Laufzeitdateien stimmen per Hash überein. Die ursprünglichen Fehlschläge bleiben unter `report-before-resume.json` erhalten. Keine Questzustände wurden zum Erledigen geschrieben.

**Abgrenzung der Quellenstände:** Der einzige Anwendungsunterschied zwischen dem vollständigen `45d78b5`-Missionslauf und `f12d5e8` ist die Anzeige eigener protokollierter Pflanzenmessungen in `manualTable()`/`relativePlantComparison()`. Der tatsächliche erste endliche Messwert ist jetzt Anfang 1; frühere unbekannte Werte bleiben unbekannt. Diese Änderung ist in beiden aktuellen Grenzfall- und Einzel-HTML-Läufen sowie im Modultest geprüft. Alle Missionswege benutzen dafür keine eigenen Messreihen. Seit `d980037` folgten aufgabenspezifische Hilfe-/Anordnungskorrekturen und diese manuelle Anzeige; der komplette spätere Missionslauf bestätigt die Hilfe-/Phasenanordnung. Expertenrenderer, Freispielkern und Tutorial wurden in diesen Folgeschritten nicht verändert. Die älteren Teilprüfungen werden daher mit ihrem tatsächlichen Stand ausgewiesen.

Desktop-Hauptläufe: 1360×960 CSS-Pixel, WebKit DPR 1; Chromium DPR **0,5** wegen Cloud-Softwaregrafik. Zusätzliche Domänen-/Touchläufe: 768×1024, DPR 1 mit mobilem Touchkontext, Domänen zusätzlich Desktop 1366×960. Viele Domänenaktionen verwenden im mobilen Kontext einen Klick; der Touch-Hauptlauf verwendet tatsächliche Taps und die Chromium-Reglerprüfung native CDP-Touchereignisse. Fenstergrößen und Linux-WebKit ersetzen kein echtes iPad/Safari.

## Aussagekräftige Gegenproben und Datenherkunft

- Die kritische Sanierung lief mit dem tatsächlichen Kern 14 Tage: Kontrolle endet bei Tag **48,25**, die andere Seite bleibt bis **59** verfügbar. Früh 45,25 und spät 59 wechseln Bilder und Werte gemeinsam. Am Tag 59 wird keine Kontrollszene erfunden. Das gespeicherte gepaarte Ergebnis hat weiterhin seinen tatsächlichen Zeitpunkt 48,25; die aktuell beobachtete späte Einzelansicht ist getrennt gespeichert. Bei Tag 59 verlangt die sichtbare Frage einen Zeitpunkt mit beiden Seiten und bietet keine vorgetäuschte vollständige Paarantwort an. [Produkt](evidence/final/boundaries/webkit/restore-context.json), [Bild](evidence/final/boundaries/webkit/restore-missing-control.png).
- Genetik kontrolliert tatsächliche Eltern/UIDs und gezogene Allele. F2 dieses Laufs: 24 Tiere, **6 AA / 10 Aa / 8 aa**, also 16 dunkel/8 hell; kein erzwungenes 18:6. Die programmierte Fortpflanzungsbevorzugung ist eine offengelegte Modellannahme. Datierte Fossile ergänzen externe Belege; der Modelllauf beweist keine Evolutionstheorie.
- Die Prozessprüfungen verbinden konkrete sichtbare Quell-/Zielobjekte. Ungültige Pfeile erfüllen keine Aufgabe; alte Verbindungen einer anderen Untersuchung erfüllen keinen neuen Nachweis. Regionalwege sind qualitative Übertragung, keine Aquariumwasserwerte als Meeresmessung.
- Eigene Texte (`own-input`), ausgewählte Antworten (`selection`), tatsächliche Spielhandlungen (`game-action`) und bereitgestellte Erklärungen bleiben getrennt. Vollständige Produktfelder und tatsächliche Kontextkennungen stehen in den [Missionsauszügen](evidence/final/missions/products-excerpts.json). Die Auszüge sind keine vollständigen Reimportdateien.
- Die ursprünglichen 154 Modultests bleiben erhalten. Die erwartete Klasse-8-Gesundheitsanzeige wurde begründet von Nitrit auf Sauerstoff/Wasserprobleme angepasst; die echten Wasserwarnungen bleiben geprüft. Browser-Assertions für eine fortlaufende 3D-Kulisse wurden bei ausdrücklich getrennten 2D-Domänen durch tatsächliche UID-/Kohorten-/Objektprüfungen ersetzt. Die Anzahl dargestellter Versuchsindividuen wird nicht zur Beschleunigung verfälscht.
- Automatische Antwortorakel lesen tatsächliche Werte und Aufgabendefinitionen. Das ist ein Funktionstest und kein Beweis, dass Lernende die Antworten selbst finden. Es gibt keine Schreibzugriffe auf Questzustände zum Absolvieren der Schlussläufe; historische Import-Fixtures und Speicherfehlerinjektionen sind gesonderte Regressionen.

## Erhalt des Rechenkerns und der Spielmodi

Der [AST-/Quellvergleich](evidence/final/source-audit.json) prüft gegen main `8e41962132fe3778fe73f8e14c650f42e18d848d`: `hd`, `Qf`, `qs`, `tp` und die ursprüngliche `genetics.mjs` sind unverändert. In der eingebetteten HTML-Anwendung wurden nur Zustandsfabrik `cd`, Loader `ud` und die Labor-/Messbezeichnungen `z1`, `Ec`, `sd` verändert. Sie deklarieren bzw. kennzeichnen den Chemievertrag. Der vorhandene Renderer `y1` ist gegenüber dem freigegebenen Temperaturprototyp unverändert. `AGENTS.md`, Modelle/Assets und Workflows bleiben unverändert. Die biologische NH₃-Arithmetik ist quantitativ gegen absolute Schwellen geprüft; keine stillschweigende Neukalibrierung.

Die Anwendung bleibt statisch und benötigt keine neuen Konten, kostenpflichtigen Dienste oder externen Laufzeit-APIs. Werkzeuge: Node.js, Python/Playwright, Chromium, portable Linux-WebKit und Acorn; [Einrichtung](ENVIRONMENT.md). Eigene neue SVG-Schemata und bestehende Modelle bleiben klar unterscheidbar. Es wurden keine neuen fremden Bildassets übernommen.

## Leistung, Einzeldatei und weitere Grenzen

Die aktuelle Einzeldatei hat **151.330.837 Bytes**, SHA-256 `7a179de6a8391a84eb06ea40887b8cc54c581c991f1fbc3e1303cec62248a27c`; [Artefaktbeleg](evidence/final/standalone/artifact.json). Sie bleibt außerhalb von Git. Die genaue HTTP-Datei lädt in den dokumentierten Cloudläufen in etwa 14,23 s (Chromium) bzw. 12,33 s (WebKit) bis zu beiden Modellgruppen. Die kurze Software-Zeichenmessung liegt bei etwa 0,58 bzw. 5,51 Vergleichsbildern/s. Dies ist kein flüssiger Hardwarelauf und kein erfülltes iPad-Leistungsbudget. Der Renderer meldet einen WebGL-Kontext, 144 Geometrien und 32 Texturen: Ressourcenanzahlen, keine gemessenen GPU-Bytes. Animation lässt Biologiewerte unverändert. [Arbeitsbudgets](PERFORMANCE.md) bleiben Ziele für die Geräteprüfung.

Offen bleiben:

- Physische Schul-iPads/Mobile Safari, längerfristige GPU-/Speicher- und Maximalprofilmessungen, tatsächliches Schulnetz. Softwaregrafik und reduzierte Chromium-Testpixeldichte ersetzen sie nicht.
- Natives Öffnen/erneutes Öffnen per `file:` und Offline-Neustart unter iPadOS. Geprüft ist ausschließlich die bereits geladene Einzeldatei über HTTP mit anschließend abgeschaltetem Netz.
- Beobachtete Bedienung und Erklärungen echter Lernender, intuitive Auffindbarkeit, selbstständige Planung und Unterrichtserfolg. Keine automatische Notenvergabe oder Unterrichtsfreigabe.
- Unabhängiger aktueller Originalabgleich der Landesvorgaben und einiger institutioneller Regionalquellen: Abrufe wurden mit HTTP 403 blockiert. Der vorhandene Schul-PDF-Abgleich und Angaben aus der beigelegten Gegenprüfung sind getrennt dokumentiert: [Curriculum/Quellen](CURRICULUM.md). Neue DOI-Hintergrundverweise sind nicht als frisch heruntergeladene Primärartikel ausgegeben.

## Entwicklungsfehler und Korrekturen

Die Schlussberichte enthalten die bestandenen letzten Läufe. Während der Entwicklung wurden fehlende Prozess-Handler, ein beim Reload nicht stabiler optionaler Objektbeleg und unpassende Populationshilfe korrigiert. Ein späterer Hilfe-Scopefehler wurde vor dem erneuten vollständigen 14er-Lauf behoben. Die eigene Pflanzenmessung erhielt danach die gezielt nachgeprüfte Anfangsnormierung.

Ein Chromium-Autoplay über 14 Tage überschritt mit Softwaregrafik das 90-s-Limit. Die Hauptwege wählen für solche längeren Vergleiche den tatsächlich sichtbaren gespeicherten Endzeitpunkt; der Temperaturweg prüft weiterhin den echten Zeitablauf. Der Timeout wird nicht als Leistungsabnahme oder als fehlerfreier ursprünglicher Lauf ausgegeben. Eine zusätzliche Kontext-Nachprüfung bestätigte bereits 13 WebKit-Punkte einschließlich älterer Reihe/Wiederholung und drei Formaten, scheiterte dann aber am veralteten Testzugriff auf ein inzwischen ausgeblendetes Planfeld. [Ursprünglicher Fehlerbericht](evidence/final/development/context-before-plan-navigation.json). Der Test verwendet jetzt die sichtbare Handlung „Plan ändern“, beobachtet das tatsächliche Ende und öffnet die Datenansicht vor der Seitenauswahl. Er prüft die weiterhin sichtbare Kontrollkachel statt eines nicht mehr verwendeten Einzelbecken-Popups. Der parallel überholte Chromium-Lauf wurde nach Sicherung seines Logs beendet. Weitere frühe Fehler betrafen mehrdeutige Testselektoren und eine Groß-/Kleinschreibungsannahme; die biologischen Assertions wurden dabei nicht aufgeweicht.

## Reproduktion

Kostenlose lokale Werkzeuge und Serverstart: [ENVIRONMENT.md](ENVIRONMENT.md). In dieser Umgebung läuft der Server mit Projektalias `aquarium-simulation` unter Port 8000; `AQUARIUM_URL` kann einen anderen autorisierten statischen Unterpfad angeben.

```sh
node --test tests/*.test.mjs
AQUARIUM_QUEST_SECTIONS=desktop AQUARIUM_TEST_DPR=0.5 python3 tests/quest_browser.py
AQUARIUM_PHASE3_SECTIONS=population,harbour,free python3 tests/coherent_phase3_browser.py
python3 tests/coherent_final_browser.py
python3 tests/coherent_compat_browser.py
python3 tests/readiness_browser.py
```

Für WebKit dieselben Skripte über den dokumentierten privaten Starter; dabei bleibt `AQUARIUM_TEST_DPR=1` für die Missions-/Touchbelege:

```sh
AQUARIUM_WEBKIT=/workspace/aquarium-devtools/webkit-portable-browser.sh \
AQUARIUM_QUEST_SECTIONS=desktop AQUARIUM_TEST_DPR=1 \
python3 /workspace/aquarium-devtools/run-webkit.py tests/quest_browser.py
```

Einzeldatei im Expertenmodus über Zeit → vollständige HTML-Datei herunterladen, separat ohne weitere Dateien statisch ausliefern; anschließend `AQUARIUM_STANDALONE_URL` setzen und `tests/coherent_standalone_browser.py` in beiden Engines starten. Der Test schaltet das Netz erst nach dem Laden aus. Die öffentliche Fassung wird mit `AQUARIUM_URL=https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/` und `tests/coherent_tools_browser.py` über WebKit geprüft; reguläre Zertifikatsprüfung bleibt aktiv.

`AQUARIUM_CONTEXT_PROFILES` wählt beim Kontextskript die Formate. Eine ausdrücklich dokumentierte Fortsetzung nach bekanntem Testablauffehler ist nur mit `AQUARIUM_CONTEXT_RESUME=/pfad/zum/fehlgeschlagenen/report.json` und einem neuen `AQUARIUM_COHERENT_RESULTS`-Verzeichnis möglich; das Skript verlangt identische Laufzeit-Hashes und bewahrt den alten Bericht.

`node docs/coherent-learning/evidence/final/setup/source-audit.mjs` wiederholt den geschützten Kernvergleich mit dem dokumentierten lokalen Acorn; `AQUARIUM_ACORN_MODULE` erlaubt einen anderen vorhandenen Acorn-Modulpfad. `python3 docs/coherent-learning/evidence/final/setup/verify-evidence.py` überprüft Quellen, bestandene Berichte und den Auslieferungsbeleg und erneuert das Manifest. Die kuratierten Belege und Originalpfade stehen in [collection.json](evidence/final/collection.json), ihre Hashes im [Manifest](evidence/final/manifest.json). Die großen Testprodukte und etwa 151 MB HTML werden nicht als Spielassets vervielfältigt. Rohe CSV-Dateien behalten ihre originalen CRLF-Zeilenenden; ursprüngliche Fehlerprotokolle bleiben bytegetreu erhalten und werden nicht zur Erfüllung einer Quelltext-Whitespaceprüfung umgeschrieben.
