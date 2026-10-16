# AGENTS.md – Aquariumsimulation

## Zweck und Prioritäten
Dieses Repository enthält ein deutschsprachiges, browserbasiertes Aquariumsimulationsspiel mit biologisch-ökologischem Lernanspruch. Es soll langfristig eine umfangreiche, visuell hochwertige Simulation werden und insbesondere auch auf Schul-iPads in Safari funktionieren. Das Spiel wird als statische Website über GitHub Pages veröffentlicht.

Bei jeder Aufgabe gelten diese Prioritäten:
1. Keine zusätzlichen Kosten oder Konten bei Drittanbietern.
2. Funktionierende Spielfunktionen und vorhandene Spielstände erhalten.
3. Stabilität und Bedienbarkeit auf iPads und Desktop-Browsern.
4. Fachlich nachvollziehbare Simulation und gute Spielbarkeit.
5. Langfristige Erweiterbarkeit, Wartbarkeit und Grafikqualität.

## Verbindliche Regel: Werkzeuge, Konten und Kosten
- Nutze eigenständig alle **tatsächlich verfügbaren und für die Aufgabe sinnvollen** Entwicklungswerkzeuge, Bibliotheken, Tests, lokalen Programme und sonstigen Hilfsmittel, um die bestmögliche Lösung zu erreichen. Beschränke dich nicht unnötig auf bereits verwendete Technologien.
- Setze ausschließlich Lösungen ein, die **dauerhaft kostenfrei** und **ohne zusätzlich anzulegende Konten oder Logins bei Drittanbietern** nutzbar sind. Dies gilt für Entwicklung, Builds, Grafik-/3D-Erstellung, Tests und den späteren Spielbetrieb.
- Ausnahme sind die vom Projektinhaber bereits eingerichteten Dienste **GitHub und Codex/ChatGPT**. Verlange keine weiteren Accounts, Anmeldungen, Zahlungsdaten, Abonnements oder API-Schlüssel.
- Vermeide Dienste mit kostenpflichtigen API-Aufrufen, nutzungsabhängigen Gebühren, kostenpflichtigen Credits, zeitlich begrenzten Gratisphasen oder versteckten Kosten. Auch ein kostenloser Einstieg mit später zwingender Bezahlung reicht nicht aus.
- Bevorzuge frei verfügbare Open-Source-Werkzeuge und lokale Verfahren, etwa Browser-APIs, Three.js/WebGL, Blender, Node.js und kostenlose Testwerkzeuge, soweit sie zur jeweiligen Aufgabe passen und ohne zusätzliche Registrierung verwendbar sind.
- Verwende externe Assets und Bibliotheken nur bei geklärter, zum öffentlichen Spiel passender Lizenz; dokumentiere erforderliche Urheber- und Lizenzhinweise. Keine unklar lizenzierten oder rechtswidrig kopierten Inhalte.
- Verwende Werkzeuge oder Integrationen nur, wenn sie wirklich verfügbar sind. Behaupte keinen Zugriff, den du nicht hast. Prüfe bei Unsicherheit die Kosten- und Kontobedingungen; andernfalls nutze eine sichere kostenlose Alternative und nenne die Einschränkung.
- **Keine externen Kauf-, Registrierungs- oder Buchungsvorgänge selbstständig auslösen.** Wenn sich eine Anforderung nicht kostenfrei und ohne zusätzlichen Account umsetzen lässt, melde dies und schlage eine kostenlose Alternative vor.
- Die Nutzung von Codex selbst kann das vorhandene ChatGPT-/Codex-Kontingent beanspruchen. Diese Regel verbietet zusätzliche Fremdkosten, nicht die vereinbarte Nutzung der bestehenden Entwicklungsumgebung.

## Visueller Qualitätsanspruch: Fotorealismus und Naturtreue
- **Fotorealistische und naturgetreue 3D-Darstellung ist ein dauerhaftes, zentrales Entwicklungsziel.** Nutze die tatsächlich verfügbaren kostenlosen Werkzeuge, Verfahren, Bibliotheken und legal nutzbaren Assets proaktiv, um die bestmögliche realistische Darstellung zu erreichen. Halte dabei sämtliche Kosten- und Accountregeln dieses Dokuments ein.
- **Orientiere dich an der realen Aquaristik und an biologischen Vorbildern:** Fische, Pflanzen, Wirbellose, Korallen, Bodengründe, Technik und Aquarien sollen hinsichtlich Anatomie, Proportionen, Größe, Formen, Farben und Oberflächen möglichst authentisch sein. Überprüfe relevante Details anhand verlässlicher Referenzen, sofern verfügbar.
- **Realitätsnähe betrifft auch Bewegung und Verhalten.** Arbeite auf natürlich wirkende Schwimmbewegungen, Flossenanimationen, Schwarm- und Revierverhalten, Pflanzenbewegung, Wachstum sowie plausible Reaktionen auf Umweltbedingungen hin.
- **Strebe eine physikalisch glaubwürdige Unterwasserwelt an:** Lichtbrechung und -absorption, weiche Schatten, Reflexionen, Transparenz, Wasserbewegungen, Oberflächenmaterialien und räumliche Tiefe sollen nach Möglichkeit realistisch wirken.
- **Keine simplen Platzhalter als dauerhaftes Qualitätsniveau:** stark stilisierte Symbole, primitive geometrische Formen oder sehr einfache Texturen dürfen zur Entwicklung und als Performance-Fallback dienen, sollen aber schrittweise durch hochwertigere Darstellungen ersetzt werden. Eine technische Funktion gilt nicht automatisch auch als visuell fertig.
- **Nutze mehrere Grafikqualitätsstufen**, falls notwendig. Erhalte eine optisch hochwertige Einstellung für leistungsstarke Geräte und ermögliche eine ressourcenschonende Darstellung für Schul-iPads. Optimiere mit passenden Techniken wie instanziertem Rendering, komprimierten Texturen und Detailstufen (LOD).
- **Prüfe die tatsächliche visuelle Qualität**, soweit möglich durch Screenshots, Browser-Tests und einen Abgleich mit realen Vorbildern. Dokumentiere ehrlich, welche Teile fotorealistisch sind und wo Vereinfachungen bestehen. Behaupte nicht, dass Fotorealismus bereits erreicht ist, wenn das Ergebnis erkennbar stilisiert bleibt.
- **Keine Ausnahmen von den Kostenregeln:** Verwende keine zusätzlichen Bezahldienste, kostenpflichtigen APIs, Testabos, neuen Accounts oder API-Schlüssel, um dieses Ziel zu erreichen. Falls ein gewünschtes Qualitätsniveau unter diesen Bedingungen noch nicht möglich ist, liefere die beste praktikable kostenlose Lösung, erkläre die verbleibenden Grenzen und schlage kostenlose Verbesserungen vor.

## Technische Leitlinien
- Das Spiel muss als **statische Website auf GitHub Pages** lauffähig bleiben. Keine für den Spielbetrieb erforderlichen Server, Datenbanken, geheimen Zugangsdaten oder kostenpflichtigen APIs einführen.
- Nutze relative Dateipfade, damit das Spiel unter einem GitHub-Pages-Projektpfad wie `/aquarium-simulation/` funktioniert.
- Unterstütze aktuelle Desktop-Browser und Safari auf iPads; beachte Touch-Bedienung, unterschiedliche Bildschirmgrößen, Ressourcenverbrauch und WebGL-Kompatibilität.
- Verwende möglichst performante, sparsame Grafiken. Hochwertige 3D-Grafik ist erwünscht, darf ältere Schul-iPads aber nicht unbrauchbar machen. Biete nötigenfalls reduzierte Grafikqualität oder Fallbacks an.
- Der gegenwärtige Stand basiert auf einer großen HTML-Datei mit eingebettetem CSS und JavaScript. Zerlege diese nur schrittweise und begründet in Module; vermeide riskante Komplettneuschreibungen.
- Erhalte bestehende Funktionen, Inhalte, Bedienelemente und Speicherstände (insbesondere die Nutzung von `localStorage`), sofern die konkrete Aufgabe nicht ausdrücklich Änderungen verlangt.
- Für wissenschaftliche Prozesse: fachlich plausible Regeln verwenden, Einheiten und Randbedingungen prüfen und didaktische Vereinfachungen als solche kenntlich machen. Kein angeblich exaktes naturwissenschaftliches Modell vortäuschen.

## Änderungen und Prüfung
- Untersuche vor Änderungen nur die für die Aufgabe relevanten Projektteile; arbeite möglichst gezielt und nachvollziehbar.
- Prüfe nach Änderungen mindestens, ob das Spiel ohne Konsolenfehler startet, die 3D-Szene sichtbar ist, **Freies Spiel** und **Tutorial** funktionieren und die Beckenplatzierung nicht beschädigt wurde.
- Prüfe bei betroffenen Funktionen auch Tier-/Pflanzenkatalog, Kauf-/Pflegemaßnahmen, Wasserparameter, Spielzeit, Touch-Bedienung und Speichern/Laden, soweit technisch möglich.
- Verwende automatische Tests und Browser-Tests, soweit die verfügbaren kostenlosen Werkzeuge dies erlauben. Beschreibe klar, was tatsächlich getestet wurde und was nicht.
- Vermeide Regressionen wie einen einfarbigen Bildschirm ohne Spielfunktion. Wenn etwas kaputtgeht, behebe die Ursache, statt funktionierende Features zu entfernen.
- Halte Änderungen in einem eigenen Branch bzw. Pull Request zur Prüfung bereit. **Nicht ungefragt direkt auf `main` pushen oder eine öffentliche Version veröffentlichen.** Die Freigabe zur Veröffentlichung erfolgt durch den Projektinhaber.
- Gib zum Abschluss eine kurze, verständliche Übersicht: Was wurde geändert? Welche Werkzeuge wurden verwendet? Welche Tests waren erfolgreich? Welche bekannten Einschränkungen bleiben?

## Kommunikation und Dokumentation
- Kommuniziere mit dem Projektinhaber auf **Deutsch**, klar und ohne unnötigen Fachjargon.
- Frage bei normalen technischen Detailentscheidungen nicht jedes Mal nach, sondern entscheide selbstständig im Rahmen dieser Regeln. Frage nach, wenn ein wesentlicher Produktentscheid, eine kostenpflichtige Abhängigkeit oder eine riskante, nicht rückgängig zu machende Änderung nötig wäre.
- Halte die `README.md` bei wesentlichen Änderungen an Nutzung, Installation oder Spielstruktur aktuell. Dokumentiere wichtige technische Entscheidungen so, dass spätere Codex-Aufgaben den Stand nachvollziehen können.
- Behandle diese Datei als dauerhaft geltende Projektanweisung; ändere sie nicht ohne ausdrücklichen Auftrag.
