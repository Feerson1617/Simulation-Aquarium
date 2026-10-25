# Aquarium 1.0 – Abschlusskorrektur und Release-Entscheidung

Stand: 25.10.2026, 07:17 Uhr (Europe/Berlin). [PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9) · [geprüfte Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/) · [Sichtbelege](REVIEW.html).

| Produkt / Prüfung | Entscheidung | Begründung |
| --- | --- | --- |
| **WEBVERSION 1.0** | **FREIGABEFÄHIG** | K01 korrigiert; eigene aktuelle Browsernachtests und die ausdrücklich akzeptierten vollständigen Vorprüfungen decken die sechs Missionen ab. Keine reproduzierbaren P0-/P1-/P2-Fehler in den geprüften Unterrichtswegen. |
| **STANDALONE-HTML** | **EINGESCHRÄNKT** | Neue Datei funktioniert in den ausführbaren Prüfungen, einschließlich vollständigem M5/M6 und echter Fortsetzung nach M6. Der akzeptierte 24-Runden-Nachweis bleibt positiv. Rund 151,6 MB Dateigröße und bis zu 3,6 GiB Browserspeicher in der vorherigen Messung begrenzen die Zusage für speicherarme Geräte. |
| **IPAD-/SAFARI-HARDWARETEST** | **NICHT GEPRÜFT** | Linux-WebKit und Browser-Touch sind keine physische iPad- oder native Safari-Abnahme; der ursprüngliche 8-GiB-Mac stand nicht zur Verfügung. |

**PR #9 ist bereit zur Freigabe durch den Projektinhaber.** Kein Merge, kein neuer
PR und keine direkte Änderung an `main`. Die normale Website bleibt der
vorgesehene Unterrichtsweg; die Einzeldatei ist ein zusätzliches Desktop-Backup.

## Einzige Anwendungskorrektur

Anwendungscommit: [`4ed42e089bf7ecb32a05946bde15293c28b0c494`](https://github.com/Feerson1617/Simulation-Aquarium/commit/4ed42e089bf7ecb32a05946bde15293c28b0c494).
Nur `single-classroom-ui.mjs` wurde gegenüber `00b9f787` geändert. Die Tastatur
bezieht jetzt die sichtbaren, aktivierten Dialogfelder einschließlich `select`
und `input` ein. Versteckte, deaktivierte, inerte und negative Tab-Ziele werden
übersprungen. Tab/Shift+Tab umlaufen den Dialog; nach Auswahl von Versuch oder
Generation bleibt das Auswahlfeld fokussiert. Escape kehrt zum Öffner zurück.

Die echten K01-Browserprüfungen bestanden in Chromium und WebKit, auf der
Webanwendung und in der neuen Offline-Datei. Pfeiltasten änderten tatsächlich die
archivierte Auswahl. Die vollständigen Session-/Archivdaten blieben unverändert.
Zusätzliche synthetische DOM-Felder prüfen nur die Fokusregeln, keine Spielzustände.
Die ersten lokalen Nachtests nennen noch den Ausgangs-HEAD; ihr aufgezeichneter
Quellhash stimmt exakt mit dem später gesicherten Anwendungscommit überein.

Biologische Raten, Genetik, Zufall, Szenarien, Modelle, Größenverhältnisse,
Missionstexte und Speicherformate wurden nicht verändert. [Quellschutz](evidence/source-protection.json).

## Tatsächlich neu geprüft

- **202 Modultests bestanden**, einschließlich Syntax der erzeugten Einzeldatei
  und bytegenauer Prüfung aller **476** eingebetteten Ressourcen.
- **22 Browser-Prüffälle bestanden**; ein zusätzlicher nativer Chromium-Dateifall
  war durch die verwaltete Browserrichtlinie blockiert und zählt nicht als bestanden.
- **M5 vollständig in Chromium und WebKit online sowie WebKit offline:** gleiche
  vollständige Ausgangszustände; direkte und späte Wirkung; Pause/Wiederaufnahme;
  echte Fehlantworten und passende Hilfen; Abschluss, neuer Versuch,
  tatsächlicher Dateiexport und Reimport. Beide sinnvollen Reihenfolgen wurden
  ausgeführt: Chromium weniger Futter zuerst, WebKit Wasserwechsel zuerst.
- **M6 vollständig in denselben drei Fällen:** frische individuelle Wasserpest
  bzw. Anubias direkt im Aquarium angetippt, UID und Markierung geprüft; feste
  individuelle Anfangsreferenz über Pause, Neuladen/Wiederöffnen und Import.
  Wachstum beobachtet, alle vier Fehlantworten korrigiert, Kohlenstoffquelle von
  einem atomaren Herkunftsnachweis unterschieden und fossiler Transfer geöffnet.
  Keine alte Anubias-Datei wird als neuer Durchgang ausgegeben.
- **Nach M6:** neue M2-Beobachtung mit echtem Füttern und Zeitschritt gestartet,
  pausiert, verlassen, identisch wieder geöffnet, exportiert und identisch
  reimportiert. Die Hilfe reagierte anschließend weiter. Im Offline-Fall genau
  ein tatsächliches Spiel-iframe; verlassene Ressourcen aufgeräumt.
- **Weitere aktuelle Regressionen:** sechs Missionseinstiege in beiden normalen
  Webbrowsern; vollständiges Acht-Schritte-Tutorial in beiden; Freies Forschen
  8/9/10, fünf Expertenszenarien, historische Lernprodukte 8/9 und alle 14 echten
  älteren Aquariumdateien. Speicherung/Wiederherstellung, Geräte einschließlich
  Heizer, Analyseansichten, echte Pinzettenverschiebung und abgewiesene Kollision
  sowie direkte Pflanzen-/Kleinfischauswahl per Maus und Browser-Touch geprüft.

Die neuen M5-/M6-Dateien wurden separat nachgerechnet: vollständige gemeinsame
Baselines, 50%-Wassermischung, unveränderte unmittelbare Bodenreste, geringerer
Futtereintrag, Messwerte aus archivierten Aquarien, individuelle Pflanzenmengen,
Zeitabstände und aufsummierte Prozessflüsse. Das ist eine Datenprüfung, keine
zusätzliche Browserleistung. [Nachrechnung](evidence/data-audit.json),
[Browserindex](evidence/browser-index.json), [Dateien mit SHA-256](evidence/download-index.json).

## Nachweisgrenzen

Die [vorherige Speichermessung](https://github.com/Feerson1617/Simulation-Aquarium/blob/00b9f7874e18646786e6e9d273f3abc9d9c3feec/docs/release-v1/REPORT.md) bleibt versionsgebundener Beleg; in dieser Abschlussrunde wurde keine neue Speicher-Langzeitmessung behauptet.

Die ausdrücklich akzeptierte unabhängige Prüfung von `00b9f787` liefert die
vollständigen M1–M4-Durchläufe, U01 und 24 WebKit-Offline-Navigationsrunden. Diese
wurden nicht pauschal wiederholt und werden nicht als neu selbst gespielt
bezeichnet. Neue eigene Proben decken die geänderte Dialogbedienung und aktuelle
Einstiege/Speicherwege ab. Die [Missions-/F01–F11-Matrix](MATRIX.md) trennt eigene
aktuelle Browserhandlungen, Code-/Datenprüfungen, bestehende Belege und offene
Hardware-/Werkzeuggrenzen.

Jeweils nur ein eigener Browser, frische isolierte Profile, Linux-Softwaregrafik,
Grafikprofil „iPad“, genügend RAM und Plattenplatz. Kein Ressourcenabbruch,
kein ENOSPC und keine behauptete Produktstörung aus einem Browserstartfehler.
Die HTTP(S)-Sperre der neuen Offline-Dateitests erhält lokale Datei-APIs; sie ist
nicht identisch mit dem früher separat geprüften strikten Offlineschalter.
Online-Neuladen war tatsächlich ein HTTP-Reload, Offline-Wiederöffnen war interne
Navigation. Native `file:`-Bedienung bestand in WebKit; Chromium war per Richtlinie
gesperrt. Diese Sperre wurde nicht umgangen.

Die erste neue M5-Probe erreichte den Abschluss, ihr Export-Prüfselektor traf
jedoch den inaktiven Knopf hinter dem Menü. Das Skript wurde auf den offenen
Dialog begrenzt und der vollständige Dateirundlauf neu geprüft. Die Probe zählt
nicht als bestandener End-to-End-Lauf. Die Anwendung wurde dafür nicht geändert. Eine zweite Skriptprobe wartete bei der
kurzen M6-Beobachtung zu lange auf den Touch-Pausenknopf. Sie wurde mit echter
sofortiger Enter-Bedienung ersetzt. Der bereits vollständig bestandene Chromium-
M5-Dateirundlauf blieb als separat belegte Phase erhalten; M6 begann in einem
frischen Browserkontext. Keine durchgehende Sitzung wird dafür behauptet.
Eine dritte Skriptprobe verwendete direkt nach einem Formatwechsel noch alte
Desktop-Koordinaten außerhalb des Hochformat-Viewports. Der Test wartet nun auf
die tatsächlich angepasste Szene und prüft seine Zielkoordinaten vor der Eingabe.
Nur dieser Auswahlfall wurde wiederholt; der Anwendungscode blieb unverändert.
Sinkendes/gleiches Pflanzenwachstum und freie Fortpflanzung bleiben im vorhandenen
Modul-/historischen Nachweisumfang; keine künstlichen neuen Browserfälle erzeugt.

## Datei und Veröffentlichung

Neue HTML-Datei: **151.613.461 Bytes**. SHA-256:
`702ac91f186ce30534fe03788dd759e8ee0343e993b1e5057e4f1d48bc273a51`.
Sie wurde über den tatsächlichen Download-Knopf der aktuellen Vorschau erzeugt;
die Browserdownloads stimmen mit dem geprüften Build überein. Die große Datei
liegt außerhalb des Git-Repositorys. Alte HTML-Downloads aktualisieren sich nicht.

Der finale Nachweiscommit steht im PR und im beigefügten Verifikationsbeleg;
spätere Commits nach `4ed42e0` ändern ausschließlich Tests/Belege/Dokumentation.

Zur Veröffentlichung **PR #9 selbst nach `main` zusammenführen**, den Workflow
„Aquarium – Website und PR-Vorschauen“ abwarten und die
[öffentliche Startseite](https://feerson1617.github.io/Simulation-Aquarium/) neu
öffnen. Die [Desktop-/iPad-Checkliste](CHECKLIST.md) enthält die kurzen Schritte.
[Reproduktionsanleitung](REPRODUCE.md). Die Entwicklung für diesen Release ist abgeschlossen.
