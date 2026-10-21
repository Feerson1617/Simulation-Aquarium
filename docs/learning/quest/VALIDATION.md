# Prüfung der Questfassung

**Bestanden: 107 Modultests, 74 verschiedene Browserprüfpunkte und der vollständige Einzeldatei-Export.** Keine früheren 100/82 Prüfungen aus Revision 2 addiert. Erneute Touchdurchläufe nach der Bildkorrektur zählen nur einmal.

## Was wirklich ausgeführt wurde

| Gruppe | Prüfpunkte | Quellstand | Beleg |
| --- | ---: | --- | --- |
| Node-Module: bestehende Biologie/Genetik/Bestand plus sieben Questfälle | 107 | 486f0a8 | [Log](evidence/unit.log) |
| Alle 14 Desktopquests, freies Forschen, Lehrkraft, Standardhilfen, Altstandmigration | 23 | 303c869 | [Vollständiger Bericht](evidence/quest/report.json) |
| Drei vollständige iPad-Touchquests nach Bildkorrektur | 3 | 486f0a8 | [Bericht](evidence/touch/report.json) |
| Zusätzliche Freigaben, Questhilfe, Pinzette/Esc, Hilfen aus, Prozentdarstellung, alternative Pflanzenmaßnahme | 6 | 486f0a8 | [Bericht](evidence/controls/report.json) |
| Regressionen R1–R8: Daten, Abbrüche, eigene Reihen, Genetikarchive, Kohlenstoff, Dateiaustausch | 11 | b3b7814 | [Bericht](evidence/review/report.json) |
| Gezielte Fach-, Fokus- und Speicherfälle | 6 | b3b7814 | [Bericht](evidence/focused/report.json) |
| Start, freie Runde, alter Spielstand, vollständiges Tutorial, Tablet und Laufzeitfehler | 13 | b3b7814 | [Bericht](evidence/readiness/report.json) |
| Maus-/Touch-Platzierung, Speichern, Abbrechen und Grenzen | 12 | b3b7814 | [Bericht](evidence/aquascaping/report.json) |
| Heruntergeladenes vollständiges HTML-Spiel als alleinige Datei | bestanden | b3b7814 | [Log](evidence/standalone.log) |

Die vollständige Questgruppe bestand vor der abschließenden Bild- und Bedienkorrektur. Danach wurden alle drei Jahrgänge nochmals vollständig per Touch geprüft, zusätzliche Bedienfälle ergänzt und die Bestands-/Exportgruppen ausgeführt. Die letzte Änderung betrifft ausschließlich die technische Beschriftung eigener Messreihen. Modultests und unveränderte Schülerabläufe wurden dafür nicht unnötig erneut ausgeführt. Die jeweiligen Quellstände und SHA-Dateien sind getrennt erhalten: [aktuelle Laufzeit](evidence/runtime.sha256), [Schülerkorrekturen](evidence/learner-runtime.sha256), [ursprüngliche vollständige Questgruppe](evidence/quest/runtime.sha256). Dokumentationscommits ändern diese Laufzeitdateien nicht.

## Lernführung und echte Daten

Alle 14 Missionen wurden vom sichtbaren Start bis zur abschließenden fachlichen Auswahl durchgespielt. Beobachtungsfragen lassen sich vor dem tatsächlichen Beobachten nicht abschließen. Vermutungen werden gespeichert, aber nicht benotet. Eine unveränderte Lichtdauer oder nur eine Generation zählt nicht als geforderte Untersuchung. Falsche Beobachtungs-, Daten- und Sicherungsantworten bleiben wiederholbar.

Die Sauerstoffläufe wurden zusätzlich mit einer direkten Probe desselben biologischen Kerns verglichen. Die Ergebnisse und Nachkommen stammen aus echten Kern-/Mendelrechnungen. Die Vergleichsantwort folgt den tatsächlich angezeigten Werten und erlaubt bei gleich gerundeten Zahlen „etwa gleich“. Eltern-/Nachkommenidentitäten und Wiederholungen bleiben erhalten. Die Stabilisierungsquest akzeptiert auch die freigegebene Pflanzenmaßnahme. Freies Forschen funktioniert ohne feste Questfolge oder Pflichteingaben.

R1–R8 bestehen erneut. Besonders der 14-Tage-Wasserwechselfall: Kontrolle endet Tag 48 mit 13 Messpunkten; Versuch erreicht unabhängig Tag 59 mit 57 Messpunkten. Keine erfundenen Kontrollwerte nach dem Abbruch. Neue Pläne überschreiben die Herkunft alter Ergebnisse nicht. Eigene Messreihen funktionieren ohne Vergleich, unbekannte Anfangsflüsse bleiben unbekannt und ein einzelner gültiger Messwert wird als Punkt gezeichnet. Echte JSON-, CSV- und SVG-Dateien wurden heruntergeladen und bei der Lehrkraft wieder gelesen. Auch alte Version-1-Produkte bleiben lesbar. Der ausführliche Kohlenstofftransfer wird entsprechend dem neuen Auftrag im Lehrkraftbereich geprüft; der historische R4-Logtext nennt ihn noch „student carbon transfer“.

Die Hilfe neben Beobachten lautet jetzt „Schau genau hin. Was passiert im Aquarium?“. Alle Standardhilfen wurden in drei Jahrgängen per Tastatur geöffnet, mit Tab/Esc bedient und auf korrekten Fokus geprüft. Die Hilfeschaltflächen sind mindestens 44 × 44 CSS-Pixel groß. Die zusätzlich freigegebene Nitritanzeige hat ihre eigene passende Nitrat-/Nitriterklärung. Die normalen Browsertexte wurden auf technische Exportbegriffe und curriculare/metadidaktische Angaben geprüft; dies ergänzt die manuelle Textdurchsicht.

Alte Lernnotizen und Einstellungen wurden mit einem tatsächlichen Altstand übernommen und exportiert. Ein künstlich gesperrter Browserspeicher erzeugt eine sichtbare Meldung und verhindert den Dateiexport nicht. Die alte freie Runde wird durch die Lernspeicher nicht überschrieben. Tutorial, vorhandene Modelle, Artenbestand und reale Platzierung wurden mitgeprüft.

## Sichtbare Kontrolle

Die iPad-Hochformatansicht wurde visuell kontrolliert. Die erste Fassung machte das Aquarium neben dem Werkzeug zu klein. Eine gezielte Anpassung der Kameragröße beseitigt die doppelte Verkleinerung; Becken, Modelle und biologische Regeln bleiben gleich. In der großen HTML-Datei wurde dafür exakt eine resize()-Methode geändert. Die Expertenanpassung bleibt unverändert. Die ursprünglichen Aufnahmen liegen als nachvollziehbarer Vorzustand in `evidence/quest`; die aktuellen in `evidence/touch`.

Aktuelle Aufnahmen: [Klasse 8 – Sauerstoff](evidence/touch/touch-8-oxygen-compare.png), [Klasse 9 – Nachkommen](evidence/touch/touch-9-mendel-compare.png), [Klasse 10 – Kohlenstoff](evidence/touch/touch-10-carbon-compare.png). [Prozentwerte in der Populationstabelle](evidence/controls/population-percent-table.png), [Bedienung im Hochformat](evidence/controls/touch-controls.png).

## Einzeldatei und Grenzen

Der vollständige Download ist **151.126.607 Byte** groß. Er startet als alleinige Datei über einen lokalen HTTP-Server und benötigt keine weiteren Modul-, Bild- oder Modellanfragen. Natives `file:` wurde durch die verwaltete Chromium-Richtlinie blockiert und daher nicht als bestanden gewertet. Statische relative Pfade und die bestehenden Pages-/PR-Vorschau-Workflows bleiben erhalten. Die externe GitHub-Preview-/CI-Ausführung wurde hier nicht bestätigt.

Verwendet wurden die bestehende kostenlose lokale Toolchain: Node-Testläufer, Python, Playwright, Chromium mit Software-WebGL, Git sowie die vorhandenen Formatierungs-/Analysewerkzeuge. Keine neuen Konten, Bezahldienste oder Laufzeitpakete.

Automatisierte richtige Antworten beweisen kein Verständnis. Physische Schul-iPads in Safari, vollständige Hilfstechnikprüfung und Unterrichtserprobung bleiben offen. Wissenschaftliche Raten und Grenzen stehen in der [Fachprüfung](../AUDIT.md); es gibt keine neue globale Klima-, Meeresmüll- oder geschlossene Stoff-/Energiebilanzsimulation.

## Historie der Korrekturen

[Entwicklungsbelege](evidence/development/README.md) halten unterbrochene Läufe, den gefundenen Pinzettenfehler und die abweichende technische SVG-Beschriftung fest. Sie sind nicht zu den Endzahlen addiert. Zusammengefasste maschinenlesbare Zahlen: [verification.json](evidence/verification.json).
