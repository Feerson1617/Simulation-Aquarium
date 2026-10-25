# Lokale Bibliothek für verlustfreie Beckenarchive

`lz-string.mjs` enthält **lz-string1.5.0**, Copyright2013 pieroxy, unter der [MIT-Lizenz](lz-string.LICENSE). Die unveränderte komprimierte Bibliothek wird von zwei benannten ES-Modul-Funktionen umgeben. Lizenztext ist auch im Modul enthalten, damit der Einzel-HTML-Export den Lizenzhinweis mitführt.

Quelle und SHA-256 der heruntergeladenen npm-Datei sowie des unveränderten Bibliothekscodes stehen in [lz-string.PROVENANCE.json](lz-string.PROVENANCE.json). Kein CDN-Aufruf, Konto, Schlüssel, Laufzeitdienst oder Bezahldienst. Das Spiel lädt die Bibliothek relativ vom selben statischen Projektpfad.

Verwendet für `tanks.version=2`, Codec `lz-string-utf16-v1`. Es wird ausschließlich der bereits berechnete JSON-Archivtext verlustfrei komprimiert. Keine Änderung an Raten, Zufallsfolge, Messwerten oder Organismen. `unpackTankArchive()` liest neue und alte unkomprimierte Archive; die eigentlichen Spielstände und übrigen JSON-Lernprodukte bleiben normale JSON-Dateien.
