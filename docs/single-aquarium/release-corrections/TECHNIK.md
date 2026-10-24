# Begrenzte Restkorrekturen R01–R03

Ausgang ist der unabhängig geprüfte Commit `5b661044cc85f640518572b5cd8fb4974d9d213b`. Die Arbeit betrifft ausschließlich die drei verbliebenen Fehler; der biologische Kern, die sechs Missionsmodelle und ihre Aufgaben, Arten, Größenverhältnisse sowie vorhandene Spielstände bleiben erhalten.

## Historische Werte und Leser

`measurementEvidence` in `learning-model.mjs` bestimmt gemeinsam für Anzeige und CSV, welche Angabe ein gespeicherter Messpunkt tatsächlich trägt. Fehlende historische Fischdefinitionen ergeben ein leeres Wertfeld mit `historisch unbekannt`. Ein gemessener Wert 0 bleibt 0. Fehlende Folgemessungen und nicht freigegebene Messgrößen bleiben unterscheidbar. Das Originalprodukt wird dafür nicht verändert. Auch gemischte historische/aktuelle Messreihen werden pro Messpunkt beurteilt.

`preserveWorkspacePosition` in `learning-ui.mjs` sichert das bediente Feld, dessen sichtbare Lage, geöffnete Details und die lokale Panelposition. Nach dem Rendern wird das gleiche Feld ohne automatischen Sprung fokussiert. Die Grenze unter dem fixierten Panelkopf verhindert, dass das Feld dahinter verschwindet. Andere Dialoge erhalten keine globale Scrollsperre.

## Nur die Einzeldatei erhält eine lokale Navigation

Der normale GitHub-Pages-Aufruf bleibt eine statische Website mit den bisherigen Dokumentlinks. `game-route.mjs` liest dort unverändert die normale Seitenadresse. Nur der erzeugte HTML-Download erhält `standalone-navigation.mjs`: einen kleinen Host für genau einen aktuellen Dokumentrahmen mit der bereits eingebetteten Anwendung.

Beim internen Linkwechsel wird der aktuelle Stand zuerst gesichert. Schlägt das Speichern fehl, bleibt die Ansicht geöffnet und kann weiterhin eine Sicherungsdatei erzeugen. Nach erfolgreicher Sicherung werden Simulation, Timer und Animationen beendet, registrierte Ereignisbehandler entfernt, der bestehende Renderer über seine eigene `destroy`-Methode entsorgt und WebGL-Kontexte freigegeben. Danach wird der alte Rahmen entfernt. Eine neue Ansicht startet mit den bisherigen getrennten Speicherplätzen aus denselben bereits geladenen HTML-Daten. Sie benötigt keinen Dokumentabruf, CDN, Service Worker, Server oder weiteren lokalen Runtime-Dateien.

Die äußere Adresszeile nutzt die History-API; Zurück/Vorwärts öffnen dieselben lokalen Ansichten. Für Browser, die Änderungen der Query einer lokalen Dateiadresse ablehnen, ist eine History-Variante mit Fragment vorgesehen. Die normalen Direktlinks bleiben erhalten. Dateidownloads und externe Materiallinks werden nicht zu internen Spielrouten umgedeutet. Der HTML-Download innerhalb der Einzeldatei verwendet ebenfalls den vorhandenen lokalen Quelltext.

Der Host bewahrt höchstens 30 kleine Diagnoseeinträge auf, keine alten Fenster oder Szenen. Der nur dort verfügbare lesende Snapshot zeigt aktuelle Timer/Renderer und die entsorgten Ansichten. `registeredListeners` bezeichnet die eigene Registrierungsliste einschließlich zwischenzeitlicher einmaliger Handler, keine browserinterne Speicher- oder GPU-Messung. Die Abnahme prüft zusätzlich reale Wechsel, unveränderte gespeicherte Bytes, angehaltene Spielzeit, einzelne Wiederaufnahme und sichtbare Bedienung.

## Eingebettete Modelltexturen

Die Prüfung hat eine zusätzliche WebKit-Eigenschaft gezeigt: Im automatisierten Offline-Kontext scheiterten neu erzeugte Blob-Bildanfragen und selbst Blob-Lesevorgänge. Ein isolierter Test außerhalb des Aquariums reproduzierte dies. Ein erster FileReader-Ansatz beseitigte zwar fehlgeschlagene Anfragen, hinterließ aber weiße Modelltexturen und Konsolenfehler; er gilt ausdrücklich als fehlgeschlagener Entwicklungsversuch.

Der endgültige Standalone-Bündler kodiert die bereits vorhandenen GLTF-Bildpuffer direkt als Daten-URLs. Er verwendet dabei den vorhandenen HTML-Bild-Ladepfad des enthaltenen Three-Laders. Die Bildbytes, Modelle und Materialien bleiben unverändert. Der normale Online-Lader bleibt unverändert. Die beiden gezielten Anpassungspunkte werden beim Bündeln auf genau ein Vorkommen geprüft; passt eine spätere Lader-Version nicht mehr, bricht der Downloadbau mit verständlicher Meldung ab. Ein ungeprüfter Ersatzlader oder eine allgemeine Überschreibung der Browser-Bild-API wird nicht eingeführt.

## Größe und Grenzen

Der tatsächlich über die Spieloberfläche heruntergeladene Stand umfasst **151.600.562 Bytes**, rund 119,7 kB mehr als die unabhängig geprüfte Ausgangsdatei. SHA-256: `0195d5f10ad8ec0d843c7991c311f68be6f03ab4948004d8a09a8d96e8972be9`. Anwendungscode: `e8b9850724c0d354cfb0b5367c48ca796ba70d95`. Die große generierte Datei liegt außerhalb Git.

Die Offline-Zusage betrifft interne Wechsel in einer bereits vollständig geladenen Datei. Ein vollständiges Neuladen einer HTTP-Adresse ohne Netz wird damit nicht versprochen. Externe Quellen und Unterrichtsmaterialien sind weiterhin externe Dokumente. Die umfangreiche Einzeldatei benötigt beim Laden und Ansichtswechsel merklich Speicher und Zeit; ein erfolgreicher Linux-Browsertest beweist keine Eignung für ältere physische Schul-iPads. Technische Funktion ersetzt keine Unterrichtserprobung.
