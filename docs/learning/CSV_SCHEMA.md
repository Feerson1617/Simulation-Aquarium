# CSV-Schema 2 – Messungen und Herkunft

UTF-8, Semikolon als Trennzeichen, doppelt zitierte Felder, CRLF-Zeilen. Dezimalzahlen verwenden einen Punkt. Jede Datenzeile beschreibt **einen Messwert** zu einer Zeit, Wiederholung und Seite. Diese lange Tabellenform lässt sich nach Messschlüssel, Wiederholung und Seite filtern. Es gibt genau eine Kopfzeile, keine versteckten Kommentarzeilen. Schema `2` ersetzt die bisherigen unbeschrifteten Kurzspalten; vorhandene JSON-Lernprodukte der Version 1 bleiben lesbar.

| Spalte(n) | Bedeutung |
|---|---|
| CSV-Schema, Datensatztyp | `2`; `ecology`, `population` oder `manual` |
| Klasse, Modus, Mission | Lernprofil und Auftrag; `Freies Forschen` bei eigener Frage |
| Modellstand | Semantischer Stand `learning-evidence-2`; bei alten undokumentierten Daten ausdrücklich unbekannt |
| Eingriff, Eingriffswert, Eingriffseinheit | Tatsächlich berechneter Eingriff aus der festen Laufkonfiguration, nicht aus dem später bearbeiteten Formular |
| Modellumwelt | `neutral` = nur Drift, `dark` = dunkler Phänotyp begünstigt, `light` = heller Phänotyp begünstigt; hypothetische Gewichte 1/0,5 |
| Geplante Dauer, Dauereinheit | Angeforderter Umfang in Modelltagen bzw. Generationen |
| Ausgangszeit, Ausgangslage Kennung | Starttag/-generation und Kennung des tatsächlichen Ausgangszustands; die Kennung ist kein kryptografischer Herkunftsnachweis |
| Wiederholung, Seed, Seite | Laufnummer, tatsächlich verwendeter Zufallsstart; Kontrolle, Versuch oder eigenes Becken |
| Laufstatus, Endzeit, Tatsaechliche Dauer, Abbruchgrund | Ende **dieser** Seite. `completed` = bis zum geplanten Ende berechnet; `failed` = biologischer Modellabbruch; `stopped` = andere vorzeitige Beendigung. Nicht mit dem Status der anderen Seite gleichsetzen |
| Zeitschritt, Messzeit | Automatischer Beckenlauf: 0,25 Modelltage; Population: 1 Generation; eigene Messungen: manuell, genaue Zeiten in `Messzeit` |
| Messschluessel, Messgroesse | Stabiler Schlüssel und ausgeschriebener Name, z. B. `no2` / Nitrit; Nitrat bleibt `no3` |
| Einheit, Typ | Konzentration/Temperatur/Prozessumsatz; `Anzahl`, `Anteil` oder `Modellindex` ausdrücklich unterschieden |
| Wert, Wertstatus | Zahl oder leeres Feld mit begründendem Status, siehe unten |

## Unbekannt, nicht freigegeben und nach Abbruch fehlend

- `berechnet`: endliche Zahl; **0 ist eine echte Null**.
- `unbekannt`: kein berechneter Wert, beispielsweise der Prozessumsatz vor dem ersten Rechenschritt. `Wert` bleibt leer.
- `nicht freigegeben`: die Größe gehörte bei diesem eigenen Messpunkt nicht zu den freigegebenen Beobachtungen. `Wert` bleibt leer.
- `keine Folgemessung`: diese Seite besitzt an einem Zeitpunkt der anderen Seite keinen Messpunkt mehr. Das CSV stellt beide Zeitachsen gegenüber, ergänzt aber **keine erfundenen Werte**. Die internen/JSON-Datenarrays bleiben unterschiedlich lang.

Fotosynthese/Atmung sind Mengen im letzten Modellschritt (`mg O₂/L je Schritt`), keine über das ganze Beobachtungsintervall gemittelten Tagesraten. Biomasse und organische Reste sind relative Modellgrößen, keine gemessenen Gramm. Allelhäufigkeiten sind Anteile 0–1; AA/Aa/aa und Individuenzahl sind Anzahlen.

Bei **eigenen Beobachtungen** ist kein automatischer Kontrollversuch vorausgesetzt. Unbestimmte Eingriffs-, Dauer- oder Seedfelder werden nicht aus einem späteren Plan erfunden. Die Datei kennzeichnet solche Reihen als `manual` / `Eigenes Becken`; Eingriffe und konstant gehaltene Bedingungen gehören zusätzlich ins Forschungsprotokoll. Die Messzeitpunkte können unregelmäßig sein. JSON erhält Notizen und Messungen zusammen, SVG die ausgewählte beschriftete Reihe.

Nach Ausfall einer Seite können nur die verbliebenen Einzelverläufe verfolgt werden. Unterschiede nach diesem Zeitpunkt sind kein vollständiger gepaarter Vergleich. Der vom Kern zugeordnete Abbruchgrund ist eine Modelldiagnose und kein empirischer Nachweis einer einzigen Ursache in einem echten Aquarium.

Textmetadaten, die in Tabellenkalkulationen als Formel beginnen könnten, werden beim CSV-Schreiben als Literal gekennzeichnet. Zahlen bleiben Zahlen; der JSON-Import führt keine Formeln aus.
