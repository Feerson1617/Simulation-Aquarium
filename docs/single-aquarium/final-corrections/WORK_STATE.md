# Finaler Korrekturauftrag, 23.10.2026

Ausgang: ffc061279f01f0030fe35503def0d1b329e5f73b; sauber, identisch mit GitHub. Nur feature/coherent-learning-workspaces / PR #9. Kein Merge, main bleibt unverändert. Nutzer akzeptiert F01/F02/F03-Kern/F05/F08 ausdrücklich; keine erneute Zwischenfreigabe nötig.

Offen in Arbeit: F13 historischer Leser; F04/F03-R Hilfen und Aufgaben; F06 Elternfehler; F07 Elternbeiträge; F09 Archivnamen; F10 Pinzettenoberfläche; F12 räumliche Szenariostarts; F11 Sprache. Danach vollständige Browserprüfung beider Engines, Originaldateien, freie Modi/Tutorial/Standalone und eigene Beleggalerie.

Neues ZIP übersteigt 32-MiB-Transfergrenze; HTML-Bericht und beide Aufträge vollständig verfügbar. 14 alte Originalspielstände aus früherem Paket unter /workspace/acceptance-20261023/historische-exporte, V1-Produkte unverändert im Repository. Neue ZIP-Rohbelege nicht als gelesen ausgeben. Eigene Baseline unter http://127.0.0.1:8000/final-before/ (Kopie unveränderter Laufzeit von ffc0612, Assets verlinkt).

## Zwischenstand Umsetzung

F13 auf 2f41831: historische Anzeige robust, fehlende Definitionen unbekannt, eindeutige Dateiquelle, Fehler leert Altansicht. Eigene Browserprüfung Klasse 8/9 wechselnd, unbekannte fishAlive-Werte, ungültige Datei und falscher Dateityp bestanden.

Weitere Laufzeitkorrekturen auf b16cfa5: spezifische Hilfen/Fehler und kurze Transferaufgaben; Elternauswahlhinweise; historische Elterntabelle mit Versuch/Generation; lesbare Archive und direkter historischer Leser; Pinzettenleiste und eindeutige Endmeldungen; neue Expertenszenario-Anordnung nur für explizit vorbereitete Expertenstarts (ein neuer Parameter in index.html). Lernanfänge bleiben unverändert. 198 Modultests bestanden.

Browserprüfungen laufen noch, keine finale Abnahme behaupten. Baselinekopie ffc0612 unter /workspace/aquarium-devtools/www/final-before. Eigene Baseline-Sechswege /tmp/final-baseline/chromium; deren ursprünglicher Bericht liest die Arbeitskopie als Hashquelle, deshalb vor Veröffentlichung tatsächliche Baseline-Hashes aus der Kopie und ffc0612 korrekt separat zuordnen. Eigene Vorher-Szenarien /tmp/final-scenarios-before (alle fünf mit fehlenden 9/10 reproduziert). Vorher-F13 /tmp/final-legacy-before; Nachher /tmp/aquarium-final-legacy/chromium.

Aktuelle neue Prüfskripte: final_missions_browser.py, final_legacy_browser.py, final_operations_browser.py, final_tweezers_browser.py. Vollwege müssen nach letzten Laufzeitänderungen in beiden Engines erneut laufen. Eigene Dateien importieren, 14 Altstände, Szenarien, Pinzetten in drei Formaten, freie Jahrgänge/Tutorial/Standalone und öffentliche Vorschau bleiben abschließend zu prüfen.
