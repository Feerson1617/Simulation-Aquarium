# Katalog- und Modellprüfung

Der Entwicklungsbranch setzt auf dem gemergten PR #5 auf. Die UI-Korrekturen und die erweiterte Pinzette sind implementiert. Die abschließende Browserprüfung und die Sichtprüfung der rekonstruierten Modelle laufen noch.

## Rekonstruktion

Der offizielle [TripoSR-Code](https://github.com/VAST-AI-Research/TripoSR/tree/107cefdc244c39106fa830359024f6a2f1c78871) unterstützt CPU-Ausführung. Der tatsächliche Versuch auf dem kostenlosen öffentlichen GitHub-Standardrunner erzeugte bereits Guppy und Panzerwels mit 256er Mesh-Abtastraster und gebackener 2048-Pixel-Textur. PyTorch meldete `CUDA available: False`. Die Durchläufe dauerten 95,39 und 58,40 Sekunden einschließlich Modellinitialisierung, Segmentierung, Rekonstruktion und Texturbacken. Es wurden keine geometrischen Ersatzmodelle erzeugt.

Der erste Anubias-Originalabruf scheiterte an HTTP 429. Ein weiterer Versuch verwendet die auf derselben Wikimedia-Dateiseite angebotene 1280-Pixel-Version. Quelle, Autor, Lizenz und Eingabehash werden protokolliert.

Die Kandidaten werden in GLB umgewandelt und ausschließlich in einer vorübergehenden Testkopie der echten Simulation geladen. Unveränderte Bestandsmodelle, Neonsalmler und Molly dienen unter identischer Beleuchtung und Kamerabedienung als Referenzen. Echte Browserbilder und GLB-Prüfwerte entscheiden über eine Übernahme. Die Produktionsdateien werden im Test anschließend wiederhergestellt.

## Abnahme

Eine größere Datei oder erfolgreiches Laden genügt nicht. Zu prüfen sind Körperproportionen, Kopf/Maul/Augen, getrennte und dünne Flossen, Barteln und Panzerplatten beim Wels, Blatt-/Stiel-/Rhizomstruktur der Pflanze, Texturdetails aus mehreren Richtungen sowie verbleibende Bewegungs- und Geschlechtsmerkmale. Ohne klaren Gewinn werden die Kandidaten nicht übernommen und das Verfahren nicht auf weitere Arten ausgeweitet.

## Weitere kostenlose Verfahren

- [Hunyuan3D 2.1](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1) nennt 10 GB VRAM für Form, 21 GB für Texturen und 29 GB für beides. Die [aktuelle 2.1-Lizenz](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1/blob/main/LICENSE) schließt die EU aus. Diese konkrete Version ist deshalb kein passender Standard für dieses Projekt.
- [COLMAP](https://colmap.github.io/faq.html) und [OpenMVS](https://github.com/cdcseacave/openMVS) sind kostenlose Wege für Fotogrammetrie. Dazu fehlen hier konsistente Mehrwinkelaufnahmen desselben unbewegten Organismus; verschiedene Fische oder bewegte Blätter bilden keinen verlässlichen Datensatz.
- Manuelle Blender-Modellierung mit lizenzierten Fototexturen bleibt eine kostenlose Alternative für die anatomische Nachbearbeitung. Sie wurde in dieser Sitzung bislang nicht ausgeführt und wird nicht als fertiges Ergebnis behauptet.

Aktueller Nachweis: [CPU-Versuch](https://github.com/Feerson1617/Simulation-Aquarium/actions/runs/39264911821). Ein grüner Workflowstatus bezeichnet den abgeschlossenen Versuch, keine gestalterische Qualitätsabnahme.
