# Finale Korrekturen für PR #9

Die sechs Missionen und das eine Hauptaquarium bleiben erhalten. Die Korrekturen betreffen Aufgaben, Hilfen, lesbare historische Daten, Pinzettenmeldungen und die räumliche Anfangsanordnung der fünf Expertenszenarien. Biologische Berechnungen, Vererbung, Zufallsfolgen, Artgrößen, gespeicherte Versuchsdaten und bestehende Speicherplätze wurden nicht für deutlichere Ergebnisse verändert.

Ausgang: `ffc061279f01f0030fe35503def0d1b329e5f73b`. Laufzeitstand: `03798ff6337e5b2b91c84d3fd836bd4c2979db63`. Nach dem umfassenden Prüfstand `766aa47` wurde ausschließlich eine CSS-Eigenschaft ergänzt: Archivlinks stehen auch innerhalb aufgeklappter Details einzeln als große Touch-Ziele. Dieser Schritt ist separat in drei Formaten geprüft. Spätere Commits enthalten Prüfbelege und Dokumentation. Maßgeblich für die ausgelieferte Fassung ist zusätzlich der vollständige Branch-Commit im PR und im Abschlussbericht.

[PR #9](https://github.com/Feerson1617/Simulation-Aquarium/pull/9) · [Vorschau](https://feerson1617.github.io/Simulation-Aquarium/pr-preview/pr-9/) · [eigene Bildgalerie](REVIEW.html) · [Prüfprotokoll](TESTS.md) · [verbindlicher Auftrag](REQUEST.md)

## Korrekturen und Lernhandlungen

| Befund | Sichtbare Änderung | Reproduzierbare Handlung |
|---|---|---|
| F13 | Alte Klasse-8-Produkte öffnen ohne `.join`-Fehler. Unbekannte historische Messungen bleiben unbekannt; ihre Grafik wird nicht erfunden. Dateiname und Datensatz sind ausdrücklich genannt. Ein Fehler entfernt die vorherige Ansicht. | Historischen Leser öffnen; unveränderte V1-Produkte 8, 9, 8, 9 importieren. Bei Klasse 8 `fishAlive` wählen. Danach defektes JSON und einen Aquarium-Spielstand im Produktleser öffnen. |
| F04 | Alle sechs Missionen bieten konkrete erste Vergleichsschritte und danach stärkere Hilfen. Rückmeldungen erklären die tatsächlich gewählte falsche Antwort. Belege bleiben beim Lesen der Hilfe zugänglich. Fehlerrückmeldung steht direkt bei der Frage. | In jeder Mission eine dokumentierte falsche Alternative wählen, Tipp öffnen, weiteren Tipp lesen, schließen und die Belege erneut auswerten. |
| F06 | Keine Eltern, fehlende Mutter, fehlender Vater und ungeeignete Ausgangsfarben erhalten unterschiedliche Hinweise. Ein zweites Tier desselben Geschlechts ersetzt erkennbar das vorige. Die erste Kreuzung bereitet Aa-Kinder für den nächsten Schritt vor. | M3 zuerst ohne Eltern starten, dann nur Vater, nur Mutter und zwei Weibchen auswählen. Zwei dunkle Gründer versuchen. Danach dunkel × hell und mit tatsächlichen F1-Eltern weiterarbeiten. Beide reziproken Kreuzungen bleiben möglich. |
| F07 | Elternbeiträge nennen gespeicherten Versuch, frühere Generation, Fisch-ID, Farbe/Genotyp, relative Auswahlchance und tatsächliche Kinderzahl. Versuch und Generation sind auswählbar. Aktuelle Fische und frühere Eltern sind ausdrücklich getrennt. | M4 drei Versuche durchführen. Elternbeiträge öffnen; Versuch 1 und Generation 1 auswählen. Mit der aktuellen Generation im Aquarium und deren echten Fischdaten vergleichen. |
| F09 | Archive zeigen Missionsnamen, Klasse, vorhandenen Zeitpunkt, Durchgang und Dateityp. Unbekannte Zeiten bleiben undokumentiert. Technische Kennungen stehen in optionalen Details. Ein Weg führt zum passenden historischen Leser. | Einen eigenen Durchgang sichern, wiederholen, Menü → Lehrkraft → Archive öffnen. Die alte Datei über die angegebene Funktion lesen; daraus entsteht kein neuer Missionsabschluss. |
| F10 | Pinzettenanleitung und Ergebnis stehen sichtbar vor dem HUD. Es gibt einen eindeutigen Ausstieg. Meldungen unterscheiden letzte freie Position, unveränderten Ausgangspunkt und tatsächlichen Abbruch. | Frei forschen → Pflege → Pinzette. Pflanze frei verschieben, auf ein belegtes Ziel ziehen, loslassen; danach einen neuen Zug abbrechen. Reload, Datei sichern und wieder öffnen. |
| F12 | Wurzel UID 9 und Stein UID 10 sind in allen fünf frisch gestarteten Szenarien an gültigen freien Stellen sichtbar. Objekte, Größen und Kollisionsregeln bleiben erhalten. Alte Spielstände werden nicht umgeräumt. | Expertenmodus → Szenarien → jedes der fünf Szenarien frisch starten, Wurzel/Steine ansehen, sichern, neu laden. |
| F03-R | Plausible kurze Alternativen ersetzen leicht erkennbare Ablenkantworten. M3 verlangt eine Übertragung vom gewählten echten Kind auf eine gedachte Kreuzung mit aa. M4 trennt tatsächliche Elternbeiträge, Auswahlchance und Dominanz. | In M3 ein reales F2-Kind wählen, dessen Erbanlagen lesen und mögliche Farben mit einem aa-Partner überlegen. Es wird dabei keine weitere Nachkommengruppe erzeugt. In M4 eine Elternchance mit der tatsächlichen Kinderzahl vergleichen. |
| F11 | Gleichheit heißt „so viel wie am Anfang“. Zunahme, Gleichheit und Abnahme verwenden den jeweiligen tatsächlichen Datenzweig. | Im frischen freien Aquarium sofort Messen öffnen. Bei M6 dieselbe Pflanze vor und nach der Untersuchung vergleichen; nur die gemessene Mengenänderung wird benannt. |

## Was erhalten blieb

Der Quellvergleich belegt unveränderte Lernmodelle, Ökologie, Vererbung, Populationsberechnung, physikalische Regeln und Artgrößen. In der großen `index.html` ist ausschließlich der Aufruf zum Anordnen frisch vorbereiteter Expertenszenarien ergänzt. Die Lernmissionen verwenden weiterhin ihren bisherigen Start. Die Pinzettenänderung im Controller betrifft ausschließlich den Rückmeldungstext; Kollisions- und Bewegungsablauf sind unverändert.

Die F01/F02/F03-Kern/F05/F08-Basis wurde vom Nutzer akzeptiert. Die Mengenbalken zeigen weiterhin reale Modellbestände mit derselben Anfangsreferenz. Abbaufluss und Nettoänderung bleiben verschieden. Es wurden keine Krümelzahlen, Organismen oder Stoffumwandlungen erfunden. Ein deutlicherer Hinweis ist keine veränderte biologische Messung.

## Belegqualität und Grenzen

Die Galerie enthält unveränderte eigene Browserbilder, die vollständigen Prüfberichte protokollieren echte Klicks, Touch-Ereignisse, Dateiauswahl und gespeicherte Zustände. Auslesefunktionen lokalisieren vorhandene Objekte und prüfen ihre Daten; die Lernzustände werden nicht durch Testskripte auf „abgeschlossen“ gesetzt. Die Schülerhandlungen in der Galerie lassen sich unabhängig nachspielen.

Chromium und WebKit liefen unter Linux mit Softwaregrafik. Browser-Touch und Tablet-Auflösungen sind keine Tests auf einem physischen iPad. Unterrichtstaugliche Formulierungen und eine erfolgreich durchspielte Mission sind außerdem noch kein empirischer Nachweis, dass Schülerinnen und Schüler den Zusammenhang selbstständig verstanden haben. Diese pädagogische Endabnahme bleibt bei der unabhängigen Prüfung und Unterrichtserprobung.

Das neu hochgeladene ZIP überstieg die 32-MiB-Grenze des verfügbaren Dateitransfers. Es wurde nicht entpackt oder als geprüft ausgegeben. Die beiden Aufträge und der vollständige HTML-Abnahmebericht waren lesbar; die 14 unveränderten Originalspielstände aus dem zuvor verfügbaren Paket und beide V1-Fixtures wurden für eigene Importe verwendet. Neue ausschließlich im ZIP enthaltene Rohbelege sind damit nicht unabhängig dateiweise abgeglichen.

Die Einzel-HTML-Datei enthält die lokalen Modelle und ist etwa 151 MB groß. Download und anschließende Offline-Nutzung nach HTTP-Laden sind geprüft. Der direkte Chromium-Dateistart ist durch die verwaltete Browserrichtlinie blockiert (`ERR_BLOCKED_BY_ADMINISTRATOR`) und bleibt offen. Auch das Speicherverhalten älterer Schul-iPads ist damit nicht nachgewiesen. Die vorhandene Darstellung bleibt eine vereinfachte 3D-Simulation; vollständiger Fotorealismus wird nicht behauptet.

Es wurden keine kostenpflichtigen Werkzeuge, zusätzlichen Konten oder neuen Laufzeitdienste eingeführt. Nur der bestehende Entwicklungsbranch wurde aktualisiert. Kein neuer PR, kein Merge und keine Änderung an `main`.

## Bewertung zur Endabnahme

F03-R, F04, F06, F07 und F09–F13 sind im dokumentierten Umfang korrigiert und mit eigenen Browserhandlungen überprüft. Alle sechs Missionen wurden in beiden Engines abgeschlossen; die Einzelheiten und Versionsgrenzen sind im Prüfprotokoll offengelegt. Der Stand ist für die unabhängige Endabnahme vorbereitet. **Noch nicht alle vereinbarten Nachweise sind erfüllt:** Beim Standalone-Kriterium G ist der echte lokale Dateistart durch die Browserrichtlinie blockiert. Eine uneingeschränkte Gesamtabnahme wird deshalb nicht erklärt. Physische iPad-Tests und tatsächliche Lernwirksamkeit bleiben ebenfalls unbewiesen.
