# Biologische Lernqualität – Arbeitsstand

Auftrag: [REQUEST.md](REQUEST.md), bestehender PR #8, Branch `feature/biology-learning-environments`.

Übernommen: sauberer lokaler und bestätigter GitHub-Head `6c86274bac47f96fe6309355f851713f2d42cbc0`; main unverändert `666df90ac05de61181f380f2190539a9cef04044`. Keine fremden oder ungesicherten Änderungen vorhanden. Alte Testberichte sind frühere Prüfstände, keine Abnahme dieses neuen Auftrags.

Originalcurriculum gelesen: bereitgestellte PDF, S. 9–10 (Ökologie, Untersuchungen), 14–15 (Genetik, Evolution), 19–20 (Kohlenstoff/anthropogene Beeinflussung, Nordsee/Wattenmeer, Bewertungsfolgen). Bisherige R1–R8-/Quest-/Geräteberichte gelesen. Ein zusätzlicher Gesamtprüfbericht zu A01–A11 wurde nicht separat angehängt; konkrete Befunde und Korrekturvorgaben stehen vollständig im neuen Auftrag.

Reihenfolge: A01–A05 (Selektion/Zufall, Ausgangsbecken, Fischzustand, Datenherkunft, verpflichtende biologische Lernhandlungen); danach A06–A10 (Temperatur, Vorhersagebezug/Genauigkeit, zielbezogene Messwerte, Unterstützung, Modellregeln); erst danach A11 anhand einer Beispielmission. Spielstände, abgeschlossene historische Quests und alte Lernprodukte erhalten. Keine Artansprüche für Tests ändern. Keine Modellkurven für erwartete Antworten erzwingen.

Noch offen: Umsetzung, gezielte Node-/Browserregressionen, Chromium/WebKit-Verfügbarkeit, A01–A11-Korrekturmatrix und vollständige Lernhandlungsmatrix. Aktive Cloud-Netzwerkregel sperrt weiterhin öffentliche Pages/API; vorhandener Konfigurationsentwurf ist nicht aktiviert. Kein neuer PR, kein Merge/main-Push. Nur kostenfreie lokale Werkzeuge.

## Gesicherter Zwischenstand A01–A04

Neutrale/gerichtete Erklärung und Modellannahme getrennt; tatsächliche Wiederholungen wählbar. Lernbecken GH12 innerhalb der unveränderten Artenbereiche; vorbereitetes Ersatzwasser GH12/25°C unabhängig vom Heizersollwert. Fischzustand, lebende/verstorbene Fische und Wirbellose getrennt, zusätzlicher ausfallberücksichtigender Verlaufswert; neue Messpunkte metricsVersion2/Modell learning-biology-4. Historische Werte bleiben unverändert. Automatische Texte/Antworten werden nicht mehr als eigene Notizen ausgegeben; explizite Herkunft, Alttexte unbekannt. Neue Fachmodule biology-quality.mjs und learning-provenance.mjs.

124 Node-Tests bestanden vor der zusätzlichen Frischwasserkorrektur; fünf gezielte neue Fachfälle einschließlich Frischwasser werden erneut ausgeführt. Noch keine aktuelle Browserabnahme. A05–A11 noch offen. WebKit-Installation offiziell versucht: Downloadhosts cdn.playwright.dev und playwright.download.prss.microsoft.com durch Proxy403 gesperrt; keine Umgehung.

## Laufende A05-Umsetzung

Neue learning-activities.mjs mit kleinen Zuordnungen, echten Beobachtungsbelegen, F1/F2-Archivprüfung und Neutral-/Selektionspaarprüfung. Neue QuestsVersion2, historische Version1 weiter lesbar; unfertige alte Quest wird vor Ergänzung neuer Anforderungen exakt archiviert. Wattenmeer wird echte Fallaufgabe statt Frischwasserexperiment. Reihenhistorie begrenzt auf drei alte Läufe, unveränderte tatsächliche Daten. 130/130 Node-Tests auf aktuellem Zwischenstand bestanden (/tmp/biology-quality-actions-node-full.log). Browser-Smoke in /tmp/biology-quality-smoke.py, Session3909: Nahrungskette bestanden; Wattenmeer/Navigation noch in Prüfung. A05 noch inhaltlich/visuell nachprüfen (Darwin-Gegenprognose und regionale Nordseeinformation), danach A06–A11.

A05-Zwischenstand erneut 130/130 Node-Tests bestanden. Tatsächlicher Wattenmeer-Browserfall abgeschlossen: Maßnahme, Tiernutzen, menschlicher Aufwand und Erfolgskontrolle; keine Wasser-/Plastikmesswerte erzeugt. Nahrungsketten-Smoke bestand vor zusätzlicher Konsumentenkarte. Dessen anschließender Navigationstest stoppte am im Test übersprungenen Mehr-Menü (kein Spielfehler); Wattenmeer anschließend separat vollständig geprüft. Bilder und Logs unter /tmp/biology-quality-smoke und /tmp/biology-quality-wadden-smoke.log. Umfassende finale Browserabnahme weiterhin offen. A06–A11 folgen jetzt.

## A06–A10 umgesetzt, finale Browserprüfung ausstehend

Temperaturziel27°C statt20, tatsächliche Erwärmung innerhalb der gemeinsamen Artbereiche; wirkungsloser/falsch gerichteter Heizeingriff gibt den neuen biologischen Abschluss nicht frei. Vorhersagen beziehen sich auf den Kontrollvergleich; eigene Auswahl wird mit realem Ergebnis verglichen. Pro-Messgröße-Vergleichsschwellen statt universeller Dreistellenrundung. Notwendige zweite Werte ergänzt; Reihen-/Wiederholungsvergleich bleibt auf reale gespeicherte Läufe begrenzt. Hilfenstufen im normalen Questbuch; konkrete Fehlerrückmeldungen; gespeicherter Seed variiert Antwortpositionen stabil über Neuladen. Nitrifiziererwachstum folgt tatsächlichem NH4-/NO2-Umsatz, ohne Energiequelle Erhaltungsschwund. Gemeinsame freie NH3-Konzentration für Warnung und Gesundheit. Oxidations-Stoffbilanz unverändert. Inline-JS-Syntax bestanden.

Zwischenlauf134 Node-Tests:133 bestanden, ein neuer Test hatte nach Umstellung auf Erwärmung noch die falsche ungültige Schlussantwort; Test gezielt korrigiert. Danach27/27 gezielte Fach-/Gerätetests bestanden, darunter zusätzliche Rettungsbewertung: zuerst lebende Fische, bei gleicher Anzahl deren Kondition. Ein Mittelwert gesunder Überlebender verdeckt keine verlorenen Fische. Vollständige abschließende Node-/Browserregression weiterhin offen.

Nächster SchrittA11: kompakte Temperaturmission als begrenzter Prototyp, Browser-/Bildprüfung, danach erst Übertragung auf weitere Schüleransichten. Anschließend alle14 Lernhandlungen vollständig, gezielte biologische Kernproben, Export-/Altprodukt-/R1–R8-/Geräte-/Tutorial-/Platzierungsregression. Testskripte mit alten einzelnen F1-/Antwort-/Notizannahmen müssen an die neuen verbindlichen Lernhandlungen angepasst werden, ohne deren Prüfungen zu streichen.
