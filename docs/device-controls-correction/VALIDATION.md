# Gezielte Korrektur nach unabhängiger Prüfung

Ausgangsstand: tatsächlich gelesener PR-Head `5440886a4a6970558cba27379b7b847455aa4756`, main `666df90ac05de61181f380f2190539a9cef04044`. Lokal war `b5751b0` sauber vorhanden; der neuere Stand wurde per Fast-forward übernommen. Keine fremden Änderungen verworfen.

Auftrag: [Korrekturprompt](REQUEST.txt), [unabhängiger Prüfbericht](INDEPENDENT_REVIEW.txt). Nur bestehender PR #8, kein Merge und kein main-Push.

## Arbeitsstand

Fensterlicht, Fokus nach Commit/Abbruch, gemeinsame Geräteschalter und Experten-Futterwert sind gezielt korrigiert. Neue Produkte werden gegen die importierte Modellkonstante geprüft; ein tatsächlicher alter learning-evidence-2-Export wird separat unverändert validiert und im Browser gelesen. Zusätzlich wurde beim Prüfen ein alter Questbeleg nach neu berechnetem No-op erkannt: Ergebnisantworten prüfen jetzt auch dessen eigene eingefrorene Konfiguration. Die Oberfläche wurde nicht neu geschrieben.

Die vollständigen aktuellen Browserläufe stehen noch aus. Frühere 74 Prüfpunkte sowie die unabhängigen 117 Modultests sind historische Belege und kein aktueller Browsernachweis.

## Zugriff und Grenzen

Die öffentliche Vorschau https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-8/ wird durch die durchgesetzte Cloud-Netzwerkregel mit CONNECT 403 gesperrt. Kein Vorschau-Fingerprint und kein interaktiver Live-Nachweis behauptet. Physische Safari-iPads sind nicht verfügbar. Lokale Chromium- und Touch-Emulation erfolgen separat.

## Entwicklungsprüfung vor der endgültigen Abnahme

Die erste Geräte-Suite bestand acht ursprüngliche Fälle (Entwicklungsstand während der Korrektur; kein finaler Nachweis). Der erweiterte Lauf auf `3a19d48` wurde nach einem Fokusfehler gestoppt: andere Geräteanker waren bis zum nächsten Bild noch verborgen. Sichtbarkeit wird nun beim Öffnen/Schließen synchron aktualisiert, bevor der Fokus zurückkehrt. Der fokussierte DOM-Knoten wird im Test per Identität geprüft; seine räumlich mitgeführten CSS-Koordinaten dürfen sich ändern. Ein gezielter UI-Lauf durch Heizstab, Lampe und Filter mit Tab/Shift+Tab bestand danach.

Der zusätzliche frische Konsolenmitschnitt identifizierte außerdem ausschließlich einen automatischen 404-Abruf von `/favicon.ico`. Ein eingebetteter leerer Favicon-Verweis verhindert diesen ungewollten Abruf am Domainroot. Fehlende Modelle oder andere Fehler werden nicht ausgefiltert. Die vollständige Abnahme wird erneut ausgeführt.

Der Lauf auf `458721c` bestand zunächst alle drei freien Jahrgänge mit Maus/Tastatur sowie den vollständigen Temperatur-Quest. Im Expertenfall scheiterte der Test nach Neuladen am übersprungenen Einstieg in den Expertenmodus; die tatsächlich bedienten Fensterlicht-, Futter-, Filter- und Schalterpfade hatten bis dahin funktioniert, ohne Laufzeit-, Konsolen- oder Requestfehler. Der Test verwendet nun den echten erneuten Moduseinstieg. Dieser abgebrochene Lauf wird nicht als vollständige Abnahme gezählt.

Die Bildkontrolle fand überlappende Heizstab-/Abschäumerziele. Ein begrenzter vertikaler Versatz hält die großen Ziele innerhalb des Fensters getrennt. Die Tests prüfen die tatsächlichen Rechtecke und den Namen des geöffneten Geräts. Aufnahmen unmittelbar nach einer Größenänderung zeigten außerdem einen leeren Zeichenbereich vor dem nächsten Bild; nun wird vor Bildnachweisen auf mehrere neu gerenderte Bilder und tatsächlich gezeichnete Geometrie gewartet. Die sichtbare 3D-Szene wurde danach bestätigt.

Ein zusätzlicher Übernahmetest berücksichtigte zunächst den bestehenden Journal-Eintrag „Spielstand geladen“ nicht. Er prüft diesen Eintrag nun gesondert, erhält die bisherigen Einträge entsprechend dem bestehenden 100-Einträge-Limit und vergleicht jedes andere gespeicherte Feld exakt. Gezielte Nachläufe für Experten-Altstand und Lehrkraft-Übernahme/Weiterrechnen mit dauerhafter Heizung bzw. einmaligem Wasserwechsel bestanden. Die volle Suite folgt erneut.

Der Wiederholungslauf auf `fbb4502` bestand wieder alle drei freien Maus-/Tastaturfälle und den Temperatur-Quest. Die manuelle Sichtung der Fensterlicht-Aufnahme zeigte jedoch Geräteanker über dem offenen Expertenformular. Der Lauf wurde deshalb bewusst beendet (Testprozess SIGTERM, kein bestandener Gesamtbericht). Die Expertenankersichtbarkeit prüft nun zusätzlich, ob ein reguläres Menü offen ist. Die Einstellknöpfe im Menü öffnen weiterhin das jeweilige Gerät. Direkte Mausklicks und Fokus auf Dauer, Stärke und Futtermenge sowie ausgeblendete Anker werden eigens geprüft. Frühere Teilfälle werden nicht zur neuen vollständigen Abnahme addiert.

Der gekoppelte Lauf auf `703ee49` bestand alle sechs Desktopfälle. Der erste Hochformatfall stoppte danach an der unveränderten Renderwartebedingung (mehr als zwei neue Bilder und mehr als 3000 gezeichnete Dreiecke), obwohl die Fehleraufnahme das Becken zeigte und keine Laufzeit-, Konsolen- oder Requestfehler erfasst waren. Der genaue Auslöser dieses Timeouts ist nicht nachgewiesen. Derselbe Hochformatblock bestand anschließend in einer frischen Browserinstanz alle sechs Fälle mit unveränderten Bedingungen. Die Geräte-Suite startet nun jeden der drei Gerätetypen in einer eigenen Browserinstanz einschließlich eigenem Grafik-/Speicherlebenszyklus; alle 18 Fälle bleiben erhalten. Bei einer erneuten Zeitüberschreitung protokolliert sie außerdem Bildzähler, gezeichnete Geometrie, Fokus und Seitensichtbarkeit. Der Spielcode bleibt seit `703ee49` unverändert. Die abschließenden vollständigen Suites werden erneut ausgeführt.

Der vollständige Lauf auf `106199d` bestand 120 Modultests, alle 18 Gerätefälle und alle 26 Questfälle. Die folgende R1–R8-Gruppe stoppte nach zwei bestandenen Fällen an einer neu ergänzten falschen Feldannahme im Test: Die eingefrorene Modellkennung liegt unter `comparison.configuration.modelVersion`, nicht direkt unter `comparison.modelVersion`. Das tatsächlich heruntergeladene Produkt enthielt korrekt `learning-devices-3` auf Produktebene und in der Laufkonfiguration. Die Prüfung wurde auf den vorhandenen dokumentierten Pfad korrigiert; keine Modellkennung, kein Export und kein Spielcode wurde dafür verändert. Nur diese betroffene Gruppe und die noch ausstehenden Regressionen werden neu ausgeführt.
