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
