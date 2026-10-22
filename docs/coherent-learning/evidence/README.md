# Belege dieses Durchgangs

[Prüfbericht](../VALIDATION.md) und [sichtbarer Ablauf](../PROTOTYPE.md) erläutern Umfang und Grenzen. Die Berichte beziehen sich auf den dort genannten Anwendungscode; genaue Quellhashes stehen in den Hauptberichten und im Manifest. Neue Spielabschlüsse werden durch die Oberfläche erreicht.

- `prototype/`: vollständiger neuer Temperatur-/Kontextablauf, wirkliche Browserbilder, ausgewählter historischer JSON-/CSV-Export.
- `tools/`: Nebenansichten und tatsächlich vorbereitete, noch nicht gestartete Pläne.
- `compat/`: echte alte Produkte, Speicherfehler und Archivierung; Chromium zusätzlich mit nativen Touchereignissen.
- `quests/`: die 13 erhaltenen anderen Missionswege und weitere freie/Lehrkraft-/Hilfsfälle.
- `regression/`: freies Spiel, Platzierung, Katalog, Speicherung und vollständiges Touch-Tutorial.
- `expert/` und `expert-review/`: ergänzende historische Auswahl in der technischen Ansicht sowie die neun Sanierungs-/Genetik-/Altimportprüfungen; `expert-source-audit.json` grenzt die zwei geänderten Funktionen vom unveränderten Basiscode ab.
- `standalone/`: neu erzeugtes Einzel-HTML über HTTP, ohne zusätzlich angeforderte Spielressourcen. Kein nativer Offline-Dateinachweis.
- `preview-webkit/`, `preview-expert-webkit/` und `preview.json`: tatsächliche öffentliche Browseraufrufe sowie ausgelieferte Hauptdateien im Vergleich zu lokalen Hashes und main.
- `development/`: getrennte Fehlversuche. Diese sind keine bestandenen abschließenden Tests.
- `setup/`: tatsächlich verwendeter privater WebKit-Starter, Kernvergleich und öffentliche Vorschauprobe. Keine neuen Konten, Berechtigungen oder abgeschaltete Zertifikatsprüfung.

Die Auswahl enthält alle maßgeblichen JSON-Berichte und repräsentative echte Bilder. In älteren Berichten angegebene absolute `/tmp`-Pfade sind ursprüngliche Laufpfade; nicht jedes darin genannte Export-/Bildartefakt wird zusätzlich in Git dupliziert. Das 151-MB-Einzel-HTML liegt außerhalb von Git, sein Hash bleibt dokumentiert. Keine fehlende Datei oder Hardwareprüfung wird als bestanden ausgegeben.
