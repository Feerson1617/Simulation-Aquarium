# Gemeinsame Grafikprofile und vollständiger Katalogdurchgang

Dieser Branch erweitert die bestehende Three.js-Anwendung. Er enthält keine zweite biologische Simulation. `bioprocesses.mjs`, `ecology.mjs`, `scenarios.mjs` und die bisherigen Speicherplätze bleiben erhalten. Die Profile ändern ausschließlich Grafikressourcen und Darstellung.

## Ausprobieren

Die PR-Vorschau nach Erstellung des Pull Requests verwenden oder das Repository lokal über HTTP starten. Auf der vorgeschalteten Auswahl **Desktop-Version → Mit maximaler Qualität starten** wählen; anschließend Freies Spiel, Tutorial oder Szenarien. Bereits gewählte Profile lassen sich auf der Startseite über „Darstellung … ändern“ oder im Spiel unter **Zeit & Runde → Darstellung** wechseln. Für ein sofort eingerichtetes Beispiel eignet sich das Nahrungsnetz-Szenario.

| Profil | Pixeldichte | Schattentextur, maximal | Prozedurale Textur, maximal | Fischkörperringe × Seiten | Partikel | Dekoration |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| iPad | bis 1,25 | 1024 | 512 | 48 × 28 | 48 | mobiles GLB |
| Hoch | native Gerätedichte | 2048 | 1024 | 72 × 40 | 160 | Desktop-GLB |
| Ultra | native Gerätedichte | 4096 | 2048 | 112 × 64 | 320 | Desktop-GLB |
| Maximum | native Gerätedichte | 8192 | 4096 | 160 × 80 | 640 | Desktop-GLB |

Die tatsächlichen GPU-Grenzen begrenzen Renderbuffer und Schatten. Es gibt keinen FPS-Deckel und keine pauschale Desktop-DPR-Grenze. Ein geschätztes Budget für neu erzeugte Detailtexturen beträgt 96 MiB auf iPad und 1 GiB auf Desktop; bei erschöpftem Budget werden weitere Texturen kleiner allokiert. Das ist **keine Messung des gesamten GPU-Speichers**. Geometrie, Schatten, bestehende Bildtexturen und Übertragungsbuffer kommen hinzu. Maximum ist im cloudseitigen Software-Renderer sehr langsam. Unsichtbares Rendering pausiert hinter Vollbildanalyse und Startauswahl; die Spielsimulation wird dadurch nicht ersetzt.

## Tatsächlich bearbeitete Modelle

- **54 native Fische:** artspezifische bestehende Anatomieparameter mit feineren Kopf-/Rumpf-/Schwanzstielkonturen, Flossen, Kiemendeckeln, korrigierter Zeichnungsorientierung und Oberflächendetail. Keine 54 neuen gescannten oder manuell gesculpteten Tiere.
- **30 native Pflanzen:** feinere Blätter, Stängel und Bandblattspitzen, Blattnormalen und Strömungsverformung. Bestehende artspezifische Wuchsmetadaten bleiben erhalten.
- **5 fototexturierte Volumenmodelle:** Neon, Molly, Clownfisch, Nana und Vallisnerie bleiben erhalten. Desktop-Unterteilung ermöglicht weichere Verformung, erfindet aber keine neue Anatomie. **1 BlueMesh-Betta** behält Rig, Texturen und Künstlermaterialien.
- **19 Wirbellose und 24 Korallen:** gemeinsame Tessellations-/Materialverfeinerung, bei weichen Kolonien Strömungsbewegung. Die primitive Grundanatomie wurde nicht durch vollständige neue Sculpts ersetzt.
- **11 Dekorationen:** eigene Blender-Geometrie in 22 selbstständigen GLBs, Bodenpivot und Platzierungsgrenzen geprüft; keine alten Dekorations-Platzhalter im neuen Ladepfad.
- **37 Produkte:** gemeinsame Geometrien für Filter, Leuchten und Technik, fünf Bodengrundmaterialien, sieben Becken und schematische Verpackungen für elf Verbrauchsmittel. Verbrauchsmittel haben weiterhin keine dauerhafte räumliche Beckenrepräsentation.

Die [181-zeilige Statusmatrix](CATALOG_STATUS.md) ist die maßgebliche Abgrenzung. 119 Einträge wurden wesentlich verbessert, ein detailliertes Original wurde erhalten, 61 bleiben deutlich vereinfacht; kein Eintrag ist ohne Modellpfad. **0/181 sind als vollständig nach dem angeforderten Fotorealismusmaßstab fertig abgenommen.**

## Wasser, Licht und Bewegung

Physical-/Standard-Materialien ergänzen lokale Schuppen-, Blatt-, Holz-, Stein-, Panzer- und Wasserdetails. Tone Mapping, Umgebungslicht und profilabhängige weiche Schatten sind gemeinsam konfiguriert. Wasser verwendet im Desktopprofil Transmission mit IOR 1,333, bewegte Normalen und geometrische Oberflächenwellen; die Wellen erhalten passende analytische Normalen. Glas verwendet eine klare dünne Reflexionsapproximation. Volle Transmission durch vier übereinander liegende Scheiben wurde wegen sichtbar unbrauchbarer Unschärfe verworfen.

Ein visueller Absorptionsproxy berücksichtigt Wassertiefe, Wasserart, Algen und Trübung. Dezente Schwebstoffe und schwache projizierte Lichtmuster ergänzen ihn. Das ist keine vollständige volumetrische Lichtausbreitung, spektrale Optik, Raytracing-Reflexion oder physikalisch berechnete Kaustik. Es gibt keinen neuen Postprocessing-Stack.

Die Ansichtsanimation glättet Schwimmgeschwindigkeit, Wendung und seitliche Neigung, ergänzt Körper-/Flossenbewegung und reserviert die Körperausdehnung an Glas und Oberfläche. Ein Hindernisproxy ergänzt die vorhandenen Schwarmbahnen. Er schreibt keine animierten Koordinaten zurück in den biologischen Spielstand. Pflanzen und weiche Korallen verformen sich strömungsabhängig; Steinkorallen bleiben starr. Das ist kein vollständiges Muskel-, Strömungs- oder Sozialverhaltensmodell.

## Kosten, Quellen und Bereitstellung

Blender 4.3.2, Python/Pillow, Node.js, Chromium/Playwright und die bereits eingebettete Three.js-Version wurden lokal verwendet. Keine zusätzlichen Konten, Schlüssel, kostenpflichtigen APIs oder Hostingdienste. Öffentliche Material-API-Abfragen an Poly Haven und ambientCG waren mit Proxy-403 blockiert; es wurden keine ungeprüften externen Assets eingebaut.

Neue GLBs: [CC0 und Erzeugung](../../assets/realism/ATTRIBUTION.md). Vorhandene Fototexturen behalten ihre individuellen Wikimedia-Lizenzen, einschließlich Share-Alike; Betta bleibt BlueMesh, CC BY 4.0. Keine pauschale CC0-Widmung für diese Inhalte. [Katalogmanifest](../../assets/catalog/manifest.json) enthält Zuordnung, Autoren, Links und Lizenzen.

Alle lokalen Module/Stile und beide Assetverzeichnisse gehören zur statischen Website. GLBs laden bedarfsgerecht mit der gewählten Detailstufe; der HTML-Export bettet beide LODs und alle Bilder ein. Kein neuer Build und keine Änderung an den Pages-/PR-Vorschau-Workflows. Die GLBs sind unkomprimiert klein gehalten; Draco, KTX2 und InstancedMesh wurden nicht eingeführt. Statische Technik wird nach Material zu Geometrien zusammengefasst.

## Verbleibende Arbeit

Die komplette künstlerische Neumodellierung der nativen Arten ist noch offen. Die Matrix nennt für jeden Eintrag den konkreten Bedarf: unter anderem Kopf-/Maulanatomie, Flossenstrahlen, Blattadern und Wuchsvarianten, gegliederte Wirbellosenkörper, Koralliten und realistische Gesteins-/Holzoberflächen. Automatisierte Tessellation liefert diese Merkmale nicht.

Die historisch normalisierte Beckenwelt ist nicht über alle sieben Beckengrößen exakt in Zentimetern kalibriert. Fischlängen berücksichtigen jetzt die Kataloggrößen innerhalb dieser Welt; eine vollständige Kalibrierung samt Pinzette, Kollisionen und Kameras braucht einen eigenen konsistenten Umbau. Den vorhandenen Spielständen wurde kein ungesicherter Koordinatenwechsel aufgezwungen.

Safari, echte iPads, Hardware-Speicherverhalten und Geräte-FPS müssen noch auf realen Geräten geprüft werden. Die bisherige Cloud-Prüfung verwendet Chromium und SwiftShader sowie emulierte Touch-Eingaben. Details und Bildkritik stehen in [VALIDATION.md](VALIDATION.md).
