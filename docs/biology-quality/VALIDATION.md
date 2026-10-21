# Prüfung der biologischen Lernqualität A01–A11

**Laufender Bericht, noch keine vollständige Abnahme.** Ausgangspunkt6c86274, neuer Spielcode c904add. Ausschließlich bestehender PR8/Branch feature/biology-learning-environments, kein Merge/main-Push. [Auftrag](REQUEST.md), [Korrekturmatrix](MATRIX.md), [alle14 Lernziele und Handlungen](MISSIONS.md).

## Bereits tatsächlich bestanden

- **139/139 Node-Modultests**, 0 fehlgeschlagen/übersprungen. [Ungekürztes Protokoll](evidence/modules.log).
- **11/11 biologische Browserprüfpunkte** am tatsächlichen Simulationskern und der normalen Oberfläche. [Protokoll](evidence/biology.log), [strukturierter Bericht](evidence/biology/report.json).
- AST-/Bytevergleich gegen6c86274: nur qs/Qf/tp/z1 am eingebetteten Kern gezielt verändert. hd/ud/y1/ep und geschützte Mendel-/Populationsalgorithmen bytegleich; AGENTS, Assets und Pagesworkflows unverändert. [Quellaudit](evidence/source-audit.json).

Fachproben: ohne Substrat kein Nitrifiziererwachstum, Wachstum bei tatsächlichem Stickstoffumsatz mit N-Erhaltung, gleiche pH-abhängige freie NH₃-Basis für Schaden/Warnung, getrenntes NH4/NH₃-Labor bei hohem/saurem pH, Fischverluste mit überlebenden Schnecken ohne positiven Fischzustand, alle drei Hilfenstufen mit identischen biologischen Startwerten. Die Kernproben nutzen isolierte Zustände. Der Fischzustands-Import ist ausdrücklich ein kontrollierter Kompatibilitätsfall, kein normal gespieltes biologisches Szenario.

Visuell geprüft: [NH₃ erhöht](evidence/biology/ammonia-lab-alkaline.png), [NH₃ gering trotz höherem NH4](evidence/biology/ammonia-lab-acid.png), [keine Fische bei lebenden Schnecken](evidence/biology/no-fish-live-snails.png). Diese Bilder zeigen tatsächliche aktuelle UI und sichtbare 3D-Szene nach beendeter Einblendung.

## Konkrete Ergebnisse dieses Laufs

| Untersuchung | Tatsächlicher Befund | Einordnung |
| --- | --- | --- |
| 8-ecosystem, drei Spieltage | Kontrolle25°C, Versuch25,9024°C bei Heizersoll27°C | Soll und Ist sind verschieden; allmähliche Erwärmung statt aktiver Kühlung. |
| 8-oxygen, drei Spieltage | Kontrolle8,2839mg/L, Dunkelversuch8,1639mg/L O₂ | Vergleich zweier Becken zum selben Zeitpunkt. Hier keine Sauerstoffkrise; weitere Modellprozesse wirken mit. |
| 9-mendel, tatsächliche F1/F2 | F1:24Aa. F2:6AA/10Aa/8aa, also16dunkel/8hell | Die theoretischen3:1 sind Wahrscheinlichkeit, keine erzwungene Anzahl im endlichen Wurf. |
| Kontrollierter Fischverlust-Import | 0lebende/6verstorbene Fische,3lebende Wirbellose, Fischkonditionnull | Keine positive Fischkondition durch Schnecken; Anzahl und Kondition bleiben getrennt. |

Mendel: tatsächliche F1-Eltern1/6, F2-Eltern25/26 aus der erzeugten F1. Die im Test bewusst gewählte F2-Vermutung „Nur hell“ bleibt eine Auswahl (`selection`, Zielgeneration2), kein eigener Text und keine F1-Vorhersage. Export und Reload bewahren das tatsächliche Archiv. Die Zahlen dienen als konkrete Nachweise dieses dokumentierten Zufallsstarts, nicht als universelle Vorhersage für Natur oder andere Seeds.

## Noch laufend / ausstehend

Alle14 vollständigen biologischen Lernwege, zusätzliche Touchmissionen, alle Gerätefälle in drei Browserprofilen, R1–R8, Tutorial/Freispiel, Import/Export, Platzierung und einzelner HTML-Download. Ergebnisse werden erst nach tatsächlicher Ausführung übernommen. Während der gekoppelten Prüfung bleiben sämtliche HTML-/MJS-/CSS-Dateien unverändert; der serielle Runner kontrolliert ihre SHA-256-Werte vor jeder Gruppe und danach. Dokumentations-/Testanpassungen werden getrennt berichtet.

## Grenzen

Chromium154.0.8037.57, Playwright1.62.0, Node24.19.0, Python3.12.14; lokales WebGL mit SwiftShader und iPad-Grafikprofil. Touch/Hoch-/Querformat sind Emulation und kein Hardwaretest. Offizieller WebKit-Download scheitert an Cloud403 für cdn.playwright.dev/playwright.download.prss.microsoft.com. Physisches Safari-iPad ist nicht verfügbar. Öffentliche Pagesvorschau und regionale Quellwebseiten sind ebenfalls durch CONNECT403 blockiert. Keine Umgehung der verwalteten Regeln.

Originalcurriculum als bereitgestellte PDF gelesen: 36Seiten, SHA-256 faa37c2dafb2824dda8e890c21f05a69d4f479ea64c255ca815892174889b90f; Abgleich der hier verwendeten Einheiten auf S.9–10,14–15,19–20. Regionale Karten sind kurze fachliche Zusammenfassungen mit Quellen, keine Zitate, Schadenskurven oder eigenen regionalen Messdaten. Quellenliveprüfung bleibt getrennt offen.

Die Modelle sind didaktisch vereinfacht und nicht empirisch kalibriert; Unterrichtserprobung bleibt offen. Historische120/81- und frühere Zwischenlaufzahlen werden nicht in diese Prüfung addiert.
