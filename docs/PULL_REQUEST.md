# Gemeinsame Desktop-/iPad-Grafikprofile und Grafikdurchgang für den gesamten Katalog

Die bisherige Anwendung besitzt nur eine vereinfachte Grafikdarstellung. Dieser Branch ergänzt eine vorgeschaltete Desktop-/iPad-Auswahl und die später wechselbaren Stufen Hoch, Ultra, Maximum und iPad. Alle verwenden denselben biologischen Rechenkern und dieselben Spielstände; die separate Grafikpräferenz beeinflusst nur Darstellung und Ressourcen.

Alle 181 Katalogeinträge wurden inventarisiert und ihre lokalen Modellvorschauen erneuert. 11 Dekorationen erhalten eigene Blender-GLBs mit Desktop-/Mobile-LOD. 54 native Fisch- und 30 native Pflanzenmodelle verwenden verfeinerte Konturen, Blätter, Materialien und Animationen. Fünf bestehende fototexturierte Volumenmodelle und das BlueMesh-Betta bleiben erhalten. 19 Wirbellose und 24 Korallen erhalten gemeinsame Detail-/Materialverfeinerung; 37 Technik-/Bedarfsprodukte verwenden lokale Produktmodelle, Technik teilt ihre Geometriefabrik mit der tatsächlichen Szene.

Der gemeinsame Renderpfad ergänzt profilabhängige Schatten, Oberflächenmaterialien, bewegte Wassergeometrie und Normalen, Desktop-Transmission, dünne klare Glasapproximation, dezente Partikel und einen Unterwasser-Absorptionsproxy. Geglättete Schwimmbewegung berücksichtigt Körperausdehnung und Hindernisse; sie schreibt keine Animationspositionen in Speicherstände. Der HTML-Download bettet auch die neuen GLBs ein. GitHub Pages benötigt weiterhin keinen Build oder Laufzeitdienst; die bestehenden Vorschau-Workflows bleiben unverändert.

## Prüfung und sichtbarer Stand

- 39/39 Node-Tests bestanden, einschließlich biologischer Regressionen, Standalone-Bündelung, Profilgrenzen, aller 22 GLB-Bodenpivots/Bounds/LODs und größenabhängiger Schwimmgrenzen.
- 181/181 lokale WebP-Vorschauen aus dem echten Hoch-Modellpfad, alle visuell als Kontaktbögen gesichtet; 144/144 echte Organismen-/Dekorationspfade einzeln unter iPad geladen.
- Maximum-Süßwasser und -Meerwasser, vier Live-Nahansichten, vorgeschaltete Auswahl, byteidentischer biologischer Speicherstand beim Profilwechsel sowie emulierte iPad-Touch-Bedienung geprüft.
- 12/12 Pinzetten-, 12/12 Analyse-/Szenario- und 13/13 Bereitschaftsgruppen bestanden, einschließlich aller acht Tutorialschritte per emuliertem Touch. Die heruntergeladene HTML-Datei startet allein und lädt die neuen GLBs ohne zusätzliche Ressourcen.
- Unveränderte Live-Screenshots und Prüfberichte stehen im [aktuellen Prüfbericht](realism/VALIDATION.md).

Der erste Grafiklauf bestand fünf Prüfgruppen und verpasste anschließend eine kurzlebige Import-Toastmeldung, obwohl das Becken geladen war. Der Test wartet jetzt auf den tatsächlichen Zustand; die restlichen Meerwasser-/Touch-Prüfgruppen wurden gezielt erfolgreich erneut ausgeführt. Die ursprünglichen Berichte bleiben nachvollziehbar erhalten.

## Noch nicht erreicht

**Die angeforderte umfassende Fotorealistik ist nicht fertig.** 119 Einträge wurden wesentlich verbessert, ein detailliertes Original wurde erhalten und 61 bleiben deutlich vereinfacht. 0/181 sind vollständig nach dem gewünschten Fotorealismusmaßstab abgenommen. Die [vollständige Matrix](realism/CATALOG_STATUS.md) dokumentiert Änderung, Quellen und Modellierungsbedarf jedes Eintrags. Native Anatomie, Blattstrukturen, Koralliten, echte Holz-/Gesteinsoberflächen und reale Lichtausbreitung benötigen weitere künstlerische Arbeit; zusätzliche Polygone ersetzen diese nicht.

Kein echtes Safari-/iPad-Gerät oder Hardwarebenchmark. Maximum ist auf SwiftShader sehr langsam. Die historisch normalisierte Beckenwelt ist nicht für alle Beckentypen exakt in Zentimetern kalibriert. Direkte `file:`-Navigation ist im verwalteten Browser gesperrt; der Standalone-Test prüft dieselbe heruntergeladene Datei allein über isoliertes HTTP.

Keine neuen Konten, kostenpflichtigen APIs oder Dienste. Eigene GLBs sind CC0; ursprüngliche Fotolizenzen einschließlich Share-Alike sowie BlueMesh CC BY 4.0 bleiben erhalten. AGENTS.md, biologische Fachmodule und Pages-/PR-Vorschau-Workflows bleiben unverändert. Kein Merge und keine Veröffentlichung der Hauptversion.

Zum Ausprobieren nach Erstellung des PR die automatische Vorschau öffnen, **Desktop-Version → Mit maximaler Qualität starten → Szenarien** wählen. Später unter **Zeit & Runde → Darstellung** wechseln.
