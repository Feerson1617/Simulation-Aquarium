# Biologische Lernqualität – Arbeitsstand

Auftrag: [REQUEST.md](REQUEST.md), bestehender PR #8, Branch `feature/biology-learning-environments`.

Übernommen: sauberer lokaler und bestätigter GitHub-Head `6c86274bac47f96fe6309355f851713f2d42cbc0`; main unverändert `666df90ac05de61181f380f2190539a9cef04044`. Keine fremden oder ungesicherten Änderungen vorhanden. Alte Testberichte sind frühere Prüfstände, keine Abnahme dieses neuen Auftrags.

Originalcurriculum gelesen: bereitgestellte PDF, S. 9–10 (Ökologie, Untersuchungen), 14–15 (Genetik, Evolution), 19–20 (Kohlenstoff/anthropogene Beeinflussung, Nordsee/Wattenmeer, Bewertungsfolgen). Bisherige R1–R8-/Quest-/Geräteberichte gelesen. Ein zusätzlicher Gesamtprüfbericht zu A01–A11 wurde nicht separat angehängt; konkrete Befunde und Korrekturvorgaben stehen vollständig im neuen Auftrag.

Reihenfolge: A01–A05 (Selektion/Zufall, Ausgangsbecken, Fischzustand, Datenherkunft, verpflichtende biologische Lernhandlungen); danach A06–A10 (Temperatur, Vorhersagebezug/Genauigkeit, zielbezogene Messwerte, Unterstützung, Modellregeln); erst danach A11 anhand einer Beispielmission. Spielstände, abgeschlossene historische Quests und alte Lernprodukte erhalten. Keine Artansprüche für Tests ändern. Keine Modellkurven für erwartete Antworten erzwingen.

Noch offen: Umsetzung, gezielte Node-/Browserregressionen, Chromium/WebKit-Verfügbarkeit, A01–A11-Korrekturmatrix und vollständige Lernhandlungsmatrix. Aktive Cloud-Netzwerkregel sperrt weiterhin öffentliche Pages/API; vorhandener Konfigurationsentwurf ist nicht aktiviert. Kein neuer PR, kein Merge/main-Push. Nur kostenfreie lokale Werkzeuge.

## Gesicherter Zwischenstand A01–A04

Neutrale/gerichtete Erklärung und Modellannahme getrennt; tatsächliche Wiederholungen wählbar. Lernbecken GH12 innerhalb der unveränderten Artenbereiche; vorbereitetes Ersatzwasser GH12/25°C unabhängig vom Heizersollwert. Fischzustand, lebende/verstorbene Fische und Wirbellose getrennt, zusätzlicher ausfallberücksichtigender Verlaufswert; neue Messpunkte metricsVersion2/Modell learning-biology-4. Historische Werte bleiben unverändert. Automatische Texte/Antworten werden nicht mehr als eigene Notizen ausgegeben; explizite Herkunft, Alttexte unbekannt. Neue Fachmodule biology-quality.mjs und learning-provenance.mjs.

124 Node-Tests bestanden vor der zusätzlichen Frischwasserkorrektur; fünf gezielte neue Fachfälle einschließlich Frischwasser werden erneut ausgeführt. Noch keine aktuelle Browserabnahme. A05–A11 noch offen. WebKit-Installation offiziell versucht: Downloadhosts cdn.playwright.dev und playwright.download.prss.microsoft.com durch Proxy403 gesperrt; keine Umgehung.
