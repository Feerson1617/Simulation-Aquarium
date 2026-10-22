> Inventar am damaligen M1-Gate. Die Sichtfreigabe liegt inzwischen vor; die sechs neuen Wege und der freie Einstieg werden weiter geprüft. [Aktueller Stand](WORK_STATE.md). Die alten Zahlen werden nicht als neue Gesamtprüfung ausgegeben.

# Bedieninventar und Entscheidungen am M1-Gate

Die [vorgegebene Matrix](CONTROL_MATRIX_SOURCE.md) enthält 64 Funktionsgruppen. Das sind Zuständigkeiten, keine gleichzeitig sichtbaren Buttons. Ihre erwähnte Rohdatei `controls-source-inventory.json` war nicht Teil der neuen Anhänge. Die folgenden Zahlen stammen deshalb aus **eigenen tatsächlichen Browserläufen** und werden nicht aus statischen Fundstellen abgeleitet.

## Messverfahren und alter Stand

Der Ausgangsstand `4e59de3` wurde getrennt unter einem lokalen Unterpfad aus Git-Dateien abgespielt, ohne den Arbeitsbaum oder Benutzerspeicher zurückzusetzen. Unveränderte Assets wurden geteilt. Chromium, CSS-Viewport 1366 × 960, DPR 0,5 nur für diesen alten Inventarlauf. [Rohinventar](evidence/baseline-4e-controls.json), [Startbild](evidence/baseline-4e-initial.png), [Gerätebild](evidence/baseline-4e-device.png).

| Tatsächlich geöffneter alter Bildschirm | Geometrisch sichtbare Bedienelemente |
|---|---:|
| 8-oxygen, Einstieg | 17 |
| Zusätzlich generische Beobachtungsansicht | 19 |
| Lampeneinstellungen für Vergleichsseite geöffnet | 24 |

Gezählt wurden Buttons, Eingaben, Auswahlfelder, Textfelder, Links und Summary-Elemente mit sichtbaren Rechtecken. Darunter sind die doppelten „Fisch zeigen“/„Wasser ansehen“ für beide Seiten sowie direkte Eingabe und Drehregler. Das ist keine Aussage darüber, dass verdeckte Hintergrundelemente im Dialog sofort bedienbar sind. Die beiden tatsächlichen 3D-Fenster messen jeweils 483 × 278,39 CSS-Pixel, zusammen 20,51 % der Bildschirmfläche; Dialoge können davon zusätzlich Teile verdecken.

## Neuer M1-Weg

Anwendungscode `260cc51`, tatsächlicher Desktop in Chromium und Tablet-Hochformat in WebKit, jeweils DPR 1. [Desktopinventar](evidence/delta-260-chromium.json), [Tabletinventar](evidence/delta-260-webkit.json). Die Vereinigung der sichtbaren Aufgabenkarte, Kopfzeile, Menü, Messkarte und Geräteanker wird geometrisch vom Viewport abgezogen; überlappende Flächen werden nicht doppelt gezählt. **„Frei“ bezeichnet die für das Aquarium verfügbare Fläche**, nicht den Anteil tatsächlich gezeichneter Glas-/Tierpixel. Diese HUD-Metrik ist nicht direkt identisch mit der alten 3D-Fensterfläche.

| Normaler M1-Schritt | Controls Desktop / Hochformat | Frei Desktop | Frei Hochformat |
|---|---:|---:|---:|
| Pflanze auswählen | 3 / 3 | 90.59 % | 85.68 % |
| Vermutung | 5 / 5 | 85.39 % | 77.44 % |
| Lichtlauf starten | 3 / 3 | 85.05 % | 77.06 % |
| Beobachtung angehalten | 3 / 3 | 86.43 % | 79.18 % |
| Erster Lauf beendet | 3 / 3 | 87.51 % | 80.91 % |
| Vollständiger Anfang wiederhergestellt | 3 / 4 | 87.28 % | 79.12 % |
| Dunkellauf starten | 4 / 3 | 87.43 % | 81.23 % |
| Beobachtungen vergleichen | 5 / 5 | 85.58 % | 77.74 % |
| Fehler bei Beobachtung | 5 / 5 | 83.69 % | 74.74 % |
| Erklärung auswählen | 7 / 7 | 84.51 % | 76.05 % |
| Fehler bei Erklärung | 7 / 7 | 84.51 % | 76.05 % |
| Ergebnis sichern | 6 / 6 | 85.91 % | 78.27 % |

Die laufende Beobachtung nutzt dieselbe kompakte Aufgaben-/Messkarte wie die angehaltene; nur Messwerte und die kleine Kurve werden währenddessen aktualisiert. 44 × 44 CSS-Pixel Mindestgröße für Buttons, kein horizontaler Überlauf, keine sichtbaren Zahlenfelder im normalen Weg. Die gesamte vorherige Drei-Profil-Prüfung beider Engines auf `c6a4383` liegt ebenfalls vor; ihr kleinster freier Anteil war 73,82 %. Nach kürzerem Fehlerfeedback sind es im gezielten aktuellen Hochformatlauf mindestens 74,74 %. Größere bewusst geöffnete Hilfe-/Datei-/Kurvenansichten sind temporär und halten die Zeit an.

Die eigentlichen Lernhandlungen brauchen **keinen Menüwechsel**: Pflanze, Vermutung, Start, vollständiger Reset, Lampe, zweiter Start und Begründung sind direkt benannt. Beim Reset erscheinen Lampenanker und gleichwertiger beschrifteter Schalter. Diese zwei Zugänge sind eine beabsichtigte Touch-/Tastaturalternative für dieselbe Änderung. Anders als der alte Geräteeditor öffnet die neue Lichtaktion kein Eingabe-/Übernehmen-Zwischenmenü. Hilfe und optionale gespeicherte Kurven brauchen je einen Aufruf und lassen sich mit Escape/Schließen verlassen; der Fokus kehrt zurück. Speichern, Darstellung und historische Expertenwerkzeuge sind im Menü; der Ergebnisexport auch direkt am Abschluss.

## Abgleich aller 64 Gruppen

„M1 umgesetzt“ gilt für den neuen Prototyp, nicht für künftige M2–M6. „Bestand“ bezeichnet erhaltene ausdrückliche Experten-/Lehrkraftwege. Deren bisherige Paar-/Populationswerkzeuge werden nicht als neue Schüleroberfläche ausgegeben. Die vollständige freie Oberfläche sowie differenzierte Lehrkraftkonfiguration und Quellen-Endprüfung bleiben Phase 4 nach der Sichtfreigabe.

| Nr. | Funktionsgruppe | Vorgegebene Entscheidung | Stand am Gate |
|---|---|---|---|
| 1 | Jahrgang / Mission / Modus | Kontext | Neue Auswahl mit sechs Fragen; nur M1 freigegeben zum Testen, fünf vorbereitet. |
| 2 | Aktuelle Aufgabe / Fortschritt | Dauerhaft | M1: kleine aktuelle Aufgabenkarte; kein fester Fünf-Phasen-Zwang. |
| 3 | Mehr / Start / zurück | Dauerhaft/erweitert | M1: ein Menü, Missionswechsel darin. |
| 4 | Aquarium anschauen | Entfernen | M1: Pflichtflag entfernt; reale Pflanzenwahl. |
| 5 | Beobachten | Entfernen als Hauptmenü | M1: generisches Hauptmenü entfällt. |
| 6 | Ausprobieren / Untersuchen | Entfernen als Hauptmenü | M1: direkt benannte Handlung. |
| 7 | Tiere & Pflanzen / Artkarte | Kontext | M1: ausgewählte echte Wasserpflanze; Vollkatalog im Bestand. |
| 8 | Fisch zeigen | Kontext | M1: passende Pflanzenalternative mit tatsächlicher UID statt Fischpflicht. |
| 9 | Wasser ansehen | Entfernen/ersetzen | M1: Sauerstoff direkt; kein pauschaler Wasserklick. |
| 10 | Einsetzen / Kaufen | Kontext/erweitert | Bestand erhalten; M2-/freie Kontexte nach Gate. |
| 11 | Pinzette | Erweitert | Bestand erhalten; keine M1-Pflichtplatzierung. |
| 12 | Heizstab / Zieltemperatur | Erweitert | Gerät im Bestand; keine Heizmission im neuen Pflichtweg. |
| 13 | Licht einstellen | Kontext | M1: eine Aktion an Lampe oder direkt daneben, nur hours ändern. |
| 14 | Filter öffnen / betrachten | Kontext | M2 nach Gate; Bestand erhalten. |
| 15 | Filterdurchfluss | Erweitert | Bestand, keine M1-Regler. |
| 16 | Belüfter / Abschäumer / Technik | Erweitert | Bestand, in M1 ausgeblendet. |
| 17 | Futtergabe | Kontext | M2 nach Gate; Bestand erhalten. |
| 18 | Futterautomatik / Tagesration | Kontext | M5 nach Gate; Bestand erhalten. |
| 19 | Wasserwechsel | Kontext | M5 nach Gate; keine M1-Pflichtmaßnahme. |
| 20 | Dünger / CO₂-Dosierung | Erweitert | Bestand, keine M1-Dosierung. |
| 21 | Becken 1 / Becken 2 / Seite | Entfernen | M1: kein Paarcontroller und keine Seitensteuerung. |
| 22 | Beide Becken öffnen / auswählen | Entfernen | M1: ein Haupt-Renderer, alte Läufe nur gespeicherte Daten. |
| 23 | Gemeinsame Versuchsuhr | Ersetzen | M1: Zeit und Zustandskennung nur des aktuellen Laufs. |
| 24 | Versuch starten / Vergleich berechnen | Ersetzen | M1: Entwicklung ansehen schaltet echten Hauptzustand fort. |
| 25 | Tage / Beobachtungszeitraum | Entfernen aus Pflichtmission | M1: drei Tage fest vorgegeben, kein Zahlenfeld. |
| 26 | Wiederholungszahl | Erweitert | M4 nach Gate; M1-Wiederholung als neuer gesicherter Versuch. |
| 27 | Seed / gleiche Zufallsfolge | Erweitert | M1: gleicher tatsächlicher Seed beim kontrollierten Reset; kein Unabhängigkeitsversprechen. |
| 28 | Aktuelles Becken als Ausgangslage | Erweitert/ersetzen | M1: vollständiger expliziter Start-Snapshot. |
| 29 | Neuen Versuch planen | Kontext | M1: sichtbarer gleicher Anfang, danach nur Licht. |
| 30 | +1 Tag / +1 Woche / +2 Wochen | Entfernen aus Pflichtleiste | M1: keine globalen Tag-/Wochenknöpfe. |
| 31 | Abspielen / Anhalten | Kontext | M1: ausdrücklich starten/anhalten, Laden bleibt angehalten. |
| 32 | Zeitpunkt-Dropdown | Erweitert/ersetzen | M1: gespeicherte Anfang-/Endwerte; kein Dropdown. |
| 33 | Messzeitpunkt / Werte merken | Kontext/automatisch | M1: automatische echte Vierteltagespunkte. |
| 34 | Messgrößenwahl | Erweitert | M1: nur Sauerstoff; Bestand für volle Auswahl. |
| 35 | Alle Werte / Tabelle | Erweitert | M1: kleine Tabelle nur bei Auswertung, keine Dauertafel. |
| 36 | Diagramm | Kontext | M1: kleine Livekurve; zwei gespeicherte Kurven optional. |
| 37 | Reihe / Wiederholung auswählen | Erweitert | M1: beide tatsächlich ausgeführten Bedingungen automatisch. |
| 38 | Frühere Durchgänge | Erweitert | M1: erster Lauf unverändert; Wiederholungen vorab archiviert, Datei verfügbar. |
| 39 | Als eigenes Becken übernehmen | Erweitert | Bestand erhalten; M1-Import ausdrücklich validiert, bloßes Ansehen übernimmt nichts. |
| 40 | Erbanlagen zeigen | Kontext | M3 nach Gate; Altgenetik bleibt Bestand. |
| 41 | Mutter/Vater-Dropdown | Ersetzen | M3-Identitätsbrücke nach Gate; keine neue zweite Population vorbereitet. |
| 42 | Nachkommen erzeugen | Kontext | M3 nach Gate; fachlicher Kern erhalten. |
| 43 | Gruppe 1 / Gruppe 2 vergleichen | Entfernen | Aus neuem Standardweg entfernt; M4 seriell nach Gate. |
| 44 | 24er-Kartenraster als Hauptwelt | Entfernen/kontextuell | Kein M1-Raster; M3/M4 am Hauptaquarium nach Gate. |
| 45 | Umgebung / Farbvorteil | Kontext | M4 nach Gate, explizite Annahme erforderlich. |
| 46 | Generation ansehen | Kontext | M3/M4 nach Gate, bisherige Werkzeuge Bestand. |
| 47 | Punnett-Quadrat | Erweitert/kontextuell | Bestand/Vertiefung; neuer M3-Weg nach Gate. |
| 48 | Noch einmal / frischer Start / fortsetzen | Kontext | M1: Fortsetzen, gesicherte Wiederholung, neue Attempt-ID. |
| 49 | Quest einklappen / Zur Aufgabe | Kontext | M1: eine kleine Karte, keine parallelen Auftragsansichten. |
| 50 | Tipp / weiterer Tipp | Kontext | M1: gestufte aufgabeneigene Hilfe, neuer Schritt beginnt bei Tipp 1. |
| 51 | Wörterhilfe / Glossar / ? | Kontext/erweitert | M1: kurze Hilfe am Auftrag; ausführliches Glossar Bestand. |
| 52 | Meine Ergebnisse / Notizen | Erweitert/Abschluss | M1: ein Abschluss; freiwilliger eigener Text im Menü, Herkunft getrennt. |
| 53 | Ergebnis speichern / für Lehrkraft | Kontext | M1: direkte verständliche Dateisicherung am Abschluss. |
| 54 | CSV / SVG / JSON / alle Daten | Erweitert | M1: keine Formatbegriffe im Lernweg; vollständige Daten im Export. |
| 55 | Konfiguration importieren/exportieren | Erweitert | Bestand; M1-Sicherung im Menü, historische Datei wird nicht als neue Leistung anerkannt. |
| 56 | Quellen / Curriculum / Modellklärung | Erweitert | Lehrkraftübersicht/Modellgrenze vorhanden; Quellen-Endprüfung nach Gate. |
| 57 | Prozessknoten / große Pfeilfläche | Ersetzen | M1: kurze Erklärung an ausgewählter Pflanze; M2/M6 nach Gate. |
| 58 | Waldblätter / Fossilkarten | Erweitert | Altmaterial Bestand, aus Pflichtweg entfernt; Endprüfung Phase 4. |
| 59 | Hafenobjekte / regionale Ansicht | Aus Pflichtweg entfernen | Altmaterial Bestand, keine regionale Parallelwelt im neuen Pflichtweg. |
| 60 | Rückkehr zum Beckenvergleich | Entfernen | Keine solche Navigation im neuen M1. |
| 61 | Grafikprofil / Darstellung | Erweitert | M1: Darstellung im Menü; Grafikprofile erhalten. |
| 62 | Warnungen / Gesundheitsanzeige | Kontext | M1: echter Abbruch bei kritischem Verlauf, keine ergänzten Werte. |
| 63 | Tastatur-/Touch-Alternative | Kontext | M1: reale Touch-Lampe, benannte Pflanzenwahl und Tastaturaktionen geprüft. |
| 64 | Lehrkraftfreigabe weiterer Werte | Erweitert | Bestehende historische Konfiguration erhalten; neue sechs Missionen nach Gate. |

Diese Zahlen dokumentieren Gestaltung und technische Bedienbarkeit. Sie messen keinen Lernzuwachs und ersetzen keine Sichtfreigabe oder Erprobung mit einer Lerngruppe.
