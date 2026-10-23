import {cohort} from './single-classroom-model.mjs';

/** Hints direct attention first; biological explanations come after the learner asks. */
export function lessonHints(s){
 const common=['Halte die Entwicklung an. Vergleiche die beschrifteten Werte am Aquarium.','Vergleiche denselben Messpunkt mit seinem Anfang. Verwechsle die beiden Zeitpunkte nicht.','Eine Änderung zeigt noch nicht, welcher Vorgang sie verursacht hat.'];
 const stages={
  prediction:s.mission.startsWith('m4')?['Denk an den Unterschied zwischen Farbe und Anzahl: Kann ein dunkler Fisch auch wenige Junge haben?','Deine Vermutung wird später mit mehreren Gruppen verglichen.','Dominant beschreibt, welche Farbe bei A und a sichtbar ist. Wie häufig sie wird, prüfen wir erst.']:['Überlege, welche Beobachtung deine Vermutung prüfen könnte.','Du darfst unsicher sein. Die Untersuchung kommt erst danach.','Deine Vermutung wird gespeichert, aber nicht als richtig oder falsch bewertet.'],
  'feed-ready':['Merke dir den Balken „Vor dem Füttern“. Er bleibt deine Vergleichsmarke.','Nach dem Füttern kommt ein zweiter Wert hinzu. Vergleiche beide.','Futter kann gefressen werden oder als Rest im Becken bleiben. Wir beobachten die Reste.'],
  'food-observe-ready':['Vergleiche zuerst den Wert vor und direkt nach dem Füttern.','Die drei Tage beginnen mit dem Wert nach dem Füttern.','Am Ende vergleichen wir mit diesem zweiten Wert, nicht mit dem Wert vor dem Füttern.'],
  'food-observation':['Nimm den mittleren und den unteren Balken: „Nach dem Füttern“ und „Nach 3 Tagen“.','Lies beide Zahlen auf derselben Skala. Ist der spätere Wert größer, kleiner oder gleich?','Der Wert vor dem Füttern gehört zu einem anderen Vergleich. Er bleibt trotzdem als Referenz erhalten.'],
  filter:['Die Resteanzeige gehört zum ganzen Becken. Im Filter siehst du keine einzelnen winzigen Lebewesen.','Überlege, ob nicht mehr sichtbare Reste auch keine Stoffe mehr enthalten.','Abbau verändert Stoffe. Er macht sie nicht zu nichts.'],
  'food-process':['Unterscheide: Reste auffangen oder ihre Stoffe verändern.','Im Boden und Filter leben winzige Lebewesen. Was brauchen sie zum Leben?','Sie bauen Reste ab und brauchen dabei Sauerstoff. Andere Stoffe werden frei.'],
  'food-plant':['Denk an den Unterschied zwischen Fressen und der Aufnahme von Stoffen aus dem Wasser.','Was liefert der Pflanze Energie, und was liefert ihr Bausteine?','Licht liefert Energie. Einige beim Abbau frei werdende Stoffe dienen als Bausteine.'],
  'food-evidence':['Vergleiche den Unterschied der beiden Restebalken mit „In 3 Tagen abgebaut“.','Die Restemenge ist ein Bestand. Der Abbau zählt alles, was über die Zeit umgewandelt wurde.','Neue Reste entstehen gleichzeitig. Deshalb ist die Abnahme nicht der gesamte Abbau.'],
  'measure-ready':['Achte auf zwei Dinge: Was ändert sich sofort, und was kommt danach weiter ins Becken?','Wähle eine Maßnahme. Danach prüfen wir die andere ab demselben Anfang.','Ein einmaliger Wasserwechsel und weniger tägliches Futter greifen an verschiedenen Stellen an.'],
  'reset-measure-ready':['Der erste Versuch bleibt gespeichert. Prüfe jetzt die andere Maßnahme.','Der gesamte Anfang ist wiederhergestellt, nicht nur der Wasserwert.','So verändert sich nur die Maßnahme; die Ausgangslage bleibt gleich.'],
  'measure-observe-ready':['Lies die Anzeige direkt nach der Maßnahme, bevor du die zehn Tage startest.','Vergleiche gelöste Stoffe und Bodenreste getrennt.','Beim Wasserwechsel wurde Wasser ersetzt, aber kein Boden abgesaugt.'],
  'first-measure-finished':['Merke dir den Endwert. Er bleibt für den Vergleich gespeichert.','Stelle den gleichen Anfang wieder her und wähle die andere Maßnahme.','Unterschiedliche Starts könnten den Vergleich verfälschen.'],
  'measure-comparison':['Vergleiche die zwei Endwerte an Tag 10, nicht Anfang mit Ende verschiedener Versuche.','Beide Balken verwenden denselben Anfang als 100. Welcher Endbalken ist kleiner?','Die gemeinsame Referenz macht die Maßnahmen vergleichbar.'],
  'measure-explanation':['Prüfe getrennt die gelösten Stoffe direkt danach und die Reste an Tag 10.','Welche Maßnahme verändert auch das Futter, das morgen wieder hineinkommt?','Ein Wasserwechsel kann gelöste Stoffe senken. Tägliches Überfüttern kann dennoch neue Reste erzeugen.'],
  plant:['Suche ein grünes Blattbüschel. Die Markierung nennt die tatsächlich gewählte Pflanze.','Du kannst direkt tippen oder die vorhandene Wasserpest per Schaltfläche wählen.','Die Mengenanzeige bleibt an genau dieses Individuum gebunden.'],
  'growth-ready':['Merke dir Art und Kennung der Pflanze in der Anzeige.','Ihr Anfang ist die Referenz 100. Vergleiche später dieselbe Pflanze damit.','Wir beobachten eine Modellmenge. Die Anzeige wiegt die Pflanze nicht im echten Aquarium.'],
  'growth-observation':['Vergleiche den unteren Balken mit der Anfangsmarke 100.','Prüfe auch die Kennung: Gehören beide Werte zu derselben Pflanze?','Ein größerer, gleicher oder kleinerer Wert beschreibt die Menge. Die Herkunft der Stoffe bleibt damit offen.'],
  'carbon-source':['Die Größenanzeige zeigt eine Menge. Woher die Bausteine stammen, erklärt sie noch nicht.','Unterscheide mineralische Nährstoffe aus Dünger und den Baustein Kohlenstoff.','Wasserpflanzen nutzen Kohlenstoff aus gelöstem Kohlenstoffdioxid. Licht liefert die Energie zum Aufbau eigener Stoffe.'],
  'carbon-return':['Denke an lebende Pflanzen und an Pflanzenreste: Welche Vorgänge laufen dort ab?','Wachstum bindet Kohlenstoff. Prüfe, ob Atmung und Abbau in die andere Richtung wirken.','Bei Atmung und Abbau kommt Kohlenstoff als Kohlenstoffdioxid wieder ins Wasser.'],
  'carbon-evidence':['Trenne deine eigene Beobachtung von der Erklärung aus der Biologie.','Hast du nur eine Mengenänderung gesehen oder einzelne Kohlenstoffbausteine verfolgt?','Die Pflanzenmenge belegt keine atomare Herkunft. Dafür wären andere Untersuchungen nötig.'],
  founders:['Achte auf ♀ und ♂: Du brauchst ein Weibchen und ein Männchen mit verschiedenen Farben.','Die vorbereiteten dunklen Gründer tragen AA, die hellen aa. Beide Geschlechterkombinationen sind erlaubt.','Aus AA und aa entstehen Aa-Kinder. Diese dunklen Kinder dienen danach als Eltern, um die versteckte Erbanlage a zu untersuchen.'],
  'f1-observation':['Vergleiche die Farbe des hellen Elternteils mit den Farben seiner Kinder.','Von jedem Elternteil kommt eine Erbanlage. Was kann ein aa-Elternteil weitergeben?','Ein Aa-Kind trägt a, obwohl es dunkel aussieht. Sichtbare Farbe und vorhandene Erbanlagen sind verschieden.'],
  'choose-f1':['Wähle ein Weibchen und ein Männchen aus den jetzt sichtbaren Kindern.','Die erste Kreuzung hat Aa-Nachkommen vorbereitet. Beide können A oder a weitergeben.','Die Weitergabe erfolgt zufällig. Ein Elternteil gibt pro Kind eine seiner beiden Erbanlagen weiter.'],
  child:['Tippe auf einen echten Nachkommen. Vergleiche seine Farbe mit seinen beiden Erbanlagen.','Ein helles Kind ist besonders aufschlussreich. Gibt es keines, untersuche ein dunkles.','Eine kleine Gruppe kann auch ohne helle Junge entstehen. Die Erbanlagen lassen sich trotzdem untersuchen.'],
  inheritance:['Lies die Erbanlagen dieses Kindes. Welche davon könnte es selbst weitergeben?','Der gedachte helle Partner trägt aa und gibt a weiter. Kombiniere das mit den Möglichkeiten deines Fisches.','AA gibt A weiter, aa gibt a weiter, Aa kann A oder a weitergeben. A verdeckt a bei der sichtbaren Farbe.'],
  transfer:['Vergleiche die möglichen Erbanlagen der Eltern mit der kleinen Zahl beobachteter Kinder.','Ein einzelner Wurf ist eine Stichprobe. Er zeigt nicht alle Möglichkeiten gleich oft.','Bei Aa × Aa sind helle Kinder möglich. Ihre Anzahl ist in einer kleinen Gruppe nicht festgelegt.'],
  'neutral-ready':['Merke dir die Farben der Anfangsgruppe. Wir vergleichen später zwei Versuche mit diesen Gründern.','Alle Tiere haben dieselbe Chance bei der Elternwahl.','Zufällige Elternwahl und zufällige Weitergabe können die Anzahlen trotzdem verändern.'],
  'neutral-again-ready':['Vergleiche den Anfang mit dem ersten Versuch: Die Gründer sind dieselben.','Nur die Zufallsfolge ist neu. Die Elternchancen bleiben gleich.','Ein Unterschied am Ende muss deshalb nicht an einer anderen Regel liegen.'],
  'selection-ready':['Achte darauf, was jetzt anders ist: die Regel für die Elternwahl.','Helle Tiere erhalten die relative Chance 1, dunkle 0,5. Das sind keine garantierten Kinderzahlen.','Die Regel ist eine Annahme dieses Versuchs, kein gemessener Vorteil heller Mollys.'],
  generations:['Vergleiche die sichtbare Generation mit der vorherigen gespeicherten Gruppe.','Bei der Elternwahl zählt die angegebene Regel; einzelne Tiere können trotzdem keine Jungen haben.','Erbanlagen werden über tatsächliche Eltern weitergegeben. Farbe und Fortpflanzungserfolg sind verschieden.'],
  'trial-finished':['Öffne die Elternbeiträge. Vergleiche eine Elternchance mit der tatsächlich entstandenen Kinderzahl.','Die Tabelle gehört zur früheren Elterngeneration. Im Becken siehst du bereits deren Nachkommen.','Eine größere Chance erhöht die Wahrscheinlichkeit, garantiert aber keinen Erfolg.'],
  'neutral-comparison':['Lies beide dunklen Anzahlen bei „Gleiche Chancen“. War der Anfang verschieden?','Die Gründer und Regeln waren gleich, die Zufallsfolgen verschieden.','Gleiche oder unterschiedliche Endzahlen können aus Zufall entstehen. Daraus folgt noch kein Farb-Vorteil.'],
  'selection-explanation':['Suche in den Elternbeiträgen des dritten Versuchs ein Tier mit Chance 1. Lies daneben seine tatsächliche Kinderzahl.','Eine Chance gehört zur Regel; die Kinderzahl ist das tatsächliche Ergebnis.','Auch ein Tier mit größerer Chance kann in einer kleinen Gruppe ohne Junge bleiben.'],
  'dominance-explanation':['Vergleiche ein Aa-Tier mit seiner Chance, Eltern zu werden. Beschreiben beide Angaben dasselbe?','A legt bei Aa die sichtbare Farbe fest. Die Elternwahl folgt einer eigenen Regel.','Dominanz bedeutet keine garantierte Zunahme der Farbe oder Kinderzahl.'],
  free:['Wähle erst eine Frage, dann eine Änderung. Mit Messen kannst du Anfang und Jetzt vergleichen.','Ändere nicht mehrere Dinge zugleich, wenn du eine Ursache prüfen möchtest.','Sichere deinen Stand im Menü als Datei. Ein neues Ergebnis braucht einen neuen Versuch.'],
  complete:['Sichere deinen eigenen Durchgang als Datei, bevor du neu beginnst.','Frühere Durchgänge bleiben im Archiv. Sie sind keine neue Lernleistung.','Du kannst freiwillig einen kurzen eigenen Satz ergänzen.']
 };
 return stages[s.stage]||common;
}
export function wrongLessonAnswer(s,choice){
 const byChoice={
  opposite:s.stage==='growth-observation'?'Vergleiche die Menge derselben Pflanze mit ihrer Anfangsmarke. Die Herkunft ihres Kohlenstoffs ist eine andere Frage.':'Vergleiche nach dem Füttern mit Tag 3. Der Wert vor dem Füttern beantwortet einen anderen Vergleich.',
  vanish:'Der Filter hält Reste zurück, macht Stoffe aber nicht zu nichts. Winzige Lebewesen wandeln sie um.',
  'food-energy':'Pflanzen fressen die Reste nicht wie Fische. Sie nehmen Stoffe aus dem Wasser auf und nutzen Licht als Energiequelle.',
  seen:'Du vergleichst nur den Restebestand. Gleichzeitig entstehen neue Reste. Der gezählte Abbau über die Zeit ist daher etwas anderes.',
  lost:'Der helle aa-Elternteil gibt a weiter. Eine dunkle Farbe bedeutet nicht, dass dieses a verloren gegangen oder zu A geworden ist.',
  need:'Prüfe die Erbanlagen des gewählten Kindes und des aa-Partners. Weitergegeben werden vorhandene Erbanlagen; die Farbe wird nicht nach Bedarf angepasst.',
  fixed:'Die Eltern geben ihre Erbanlagen bei jedem Kind zufällig weiter. Eine neue kleine Gruppe muss die bisherigen Anzahlen nicht wiederholen.',
  guarantee:'Die beiden Versuche starteten mit gleichen Gründern und gleichen Chancen. Ein einzelner Zahlenvergleich belegt keinen erblichen Farb-Vorteil.',
  'dominant-wins':'Eine größere Chance ist keine feste Kinderzahl. Auch ein helles Tier kann bei zufälliger Elternwahl ohne Junge bleiben.',
  'more-young':'Dominanz beschreibt die Farbe bei Aa. Die Chance, Eltern zu werden, wird hier durch eine andere Regel festgelegt.',
  swap:'Vergleiche beide Restemengen an Tag 10 auf derselben Skala. Die direkte Wasserwirkung ist ein anderer Zeitpunkt.',
  never:'Wasserwechsel kann gelöste Stoffe verringern. Bodenreste und neues Futter bleiben davon zu unterscheiden. Schau auf die direkte und die spätere Wirkung.',
  ground:'Sand und Dünger liefern mineralische Nährstoffe. Wasserpflanzen nutzen Kohlenstoff aus Kohlenstoffdioxid im Wasser. Die Mengenanzeige allein beweist diese Herkunft nicht.',
  gone:'Auch eine lebende Pflanze atmet. Atmung und der Abbau von Resten geben Kohlenstoff wieder als Kohlenstoffdioxid ab.',
  proof:'Die Mengenänderung zeigt keine einzelnen Kohlenstoffbausteine. Ihre Herkunft wird hier biologisch erklärt, nicht direkt gemessen.'
 };
 return byChoice[choice]||'Vergleiche die beschrifteten Belege zu dieser Frage. Der Tipp zeigt dir den nächsten Vergleichsschritt.';
}
export function parentSelectionIssue(s){
 const fish=cohort(s.tank),mother=fish.find(e=>e.uid===s.parents[0]),father=fish.find(e=>e.uid===s.parents[1]);
 if(!mother&&!father)return 'Noch kein Elternpaar ausgewählt. Wähle ein Weibchen (♀) und ein Männchen (♂).';
 if(!mother)return 'Die Mutter fehlt. Wähle noch ein Weibchen (♀) aus dieser Gruppe.';
 if(!father)return 'Der Vater fehlt. Wähle noch ein Männchen (♂) aus dieser Gruppe.';
 if(mother.sex!=='♀'||father.sex!=='♂')return 'Dieses Paar ist unvollständig: Du brauchst ein Weibchen und ein Männchen.';
 if(s.stage==='founders'&&[mother.genotype,father.genotype].sort().join(',')!=='AA,aa')return 'Für diesen ersten Schritt fehlt die Kombination dunkel × hell. Wähle einen AA- und einen aa-Gründer. Ihre Aa-Kinder untersuchen wir danach als Eltern.';
 if(s.stage==='choose-f1'&&[mother,father].some(e=>e.genotype!=='Aa'))return 'Für den zweiten Schritt brauchst du zwei Aa-Nachkommen der ersten Kreuzung: ein Weibchen und ein Männchen.';
 return '';
}
