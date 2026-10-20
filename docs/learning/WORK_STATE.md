# Lernumgebungen – Arbeitsstand

Neuer Auftrag vom 20.10.2026: vollständige biologiedidaktische Rekonstruktion für Klassen 8–10 in sieben Phasen.

## Wiederherstellung und Basis

- Unterbrochener Stand `78f3ce6` vollständig erhalten, Arbeitsbaum unverändert.
- `origin/main` = `666df90`, Merge von PR #7; identischer Dateibaum wie `78f3ce6`.
- Neuer Branch `feature/biology-learning-environments`, auf diesem Merge begonnen.
- Maßstab, Modelle, Genetik, Pinzette, Grafikprofile und bisherige Speicherstände bleiben Grundlage.

## Quelle und Prüfgrenze

Vom Auftraggeber genannte Originalquelle: [Fachcurriculum Biologie SJ 2025/26](https://ets-toenning.de/wp-content/uploads/2025/07/Schulinternes-Fachcurriculum-Biologie-SJ-2025-26.pdf).
Abruf am 20.10.2026 durch verwaltete Netzwerkregel blockiert (CONNECT 403). Bis zum direkten Quellenabgleich gilt die ausdrücklich im Auftrag vorgegebene Zuordnung: 8 Ökologie/Wald, 9 Genetik/Evolution, 10 Mensch/Ökosysteme/Nordsee/Wattenmeer. Keine Behauptung einer verifizierten Lehrplan-Zertifizierung.

## Phasen

1. Audit und curriculare Karte: in Arbeit.
2. Gemeinsame pädagogische Architektur: ausstehend.
3. Reduzierte Oberflächen und Hilfen: ausstehend.
4. 14 Missionen und Untersuchungssystem: ausstehend.
5. Populationsgenetik/Selektion und ökologische Vertiefungen: ausstehend.
6. Lehrkraft, Differenzierung, Lernstandsdiagnose: ausstehend.
7. Fachliche, didaktische und technische Prüfung: ausstehend.

Keine Arbeiten aus PR #7 erneut ausführen; neue Funktionalität in schrittweise integrierten Modulen ergänzen. Keine Änderungen an AGENTS.md oder Veröffentlichungsworkflows. Kein Merge.

## Fortschritt nach dem Quellenabgleich

Das Original-PDF wurde anschließend vom Auftraggeber bereitgestellt. Text aus allen 36 Seiten extrahiert, relevante Abschnitte S. 3–4, 9–10, 14–15, 19–20 direkt geprüft. Die zuvor offene Quellenprüfung ist damit erledigt; die externe Website bleibt für den Entwicklungscontainer gesperrt.

Phasen 1–6 sind implementiert (`75f3602`): gemeinsame Jahrgangsarchitektur, reduzierte UI, 14 Missionen, Begriffshilfen, echte Vergleichsbecken, Generations-/Selektionsmodell, lokale Lehrkraftwerkzeuge und Lernprodukte. Phase 7 läuft. 83 Modultests bestehen. Erste Browserprüfung führte zur Korrektur der Esc-/Kamerasperre und zum Ausblenden der alten Zeitsteuerung. Abschluss erst nach vollständigem Integrationslauf und Bericht.
