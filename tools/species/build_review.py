"""Record model coverage separately from photographic acceptance."""
import collections,json,struct,sys
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/species-genetics'
GAPS={
 'fish':'Artbezogene Referenzprüfung, feinere Kopf-/Maul- und Flossenanatomie, differenzierte Haut und echte Geschlechts-/Larvenstadien bleiben nötig. Geteilte Körperlofts und prozedurale Zeichnungen sind weiter erkennbar.',
 'plant':'Blattdicke, realistische Epidermis, unregelmäßige Alterungs-/Wuchsformen und Referenztexturen fehlen. Blätter sind weiterhin dünne, prozedurale Flächen.',
 'invert':'Mundwerkzeuge, Gelenke, innere Strukturen und artspezifische Oberflächen sind noch vereinfacht. Schalen und Cuticula sind prozedurale Rekonstruktionen.',
 'coral':'Artspezifische Skelettporen, detaillierte Koralliten und Gewebeoberflächen fehlen. Kolonien und Tentakel wiederholen prozedurale Formen.',
}
CHANGES={
 'fish':'Eigenes GLB mit kontinuierlichem Körperloft, Maul/Lippen, Opercula, Augen/Cornea, gebogenen Membranen und Strahlen; artspezifische Barteln, Filamente, Schilde oder Flossenanhänge nach Bestandsparametern.',
 'plant':'Eigenes botanisches GLB mit Blattkonturen/-relief, Rhizomen, Wurzeln und artbezogenen Rosetten, Quirlen, Verzweigungen oder geteilten Blättern.',
 'invert':'Eigenes GLB mit gegliederten Cuticula-/Extremitätenstrukturen, kontinuierlich gewundenen Schalen, Weichkörpern oder gerippten Klappen entsprechend der Gruppe.',
 'coral':'Eigenes GLB mit Kolonieästen/Koralliten, gewebeartigen Scheiben, LPS-Tentakeln oder achtstrahligen gefiederten Weichkorallenpolypen entsprechend der Gruppe.',
}
def metrics(path):
 raw=path.read_bytes();length=struct.unpack_from('<I',raw,12)[0];doc=json.loads(raw[20:20+length]);return {'bytes':len(raw),'vertices':sum(doc['accessors'][p['attributes']['POSITION']]['count']for m in doc['meshes']for p in m['primitives']),'triangles':sum(doc['accessors'][p['indices']]['count']//3 for m in doc['meshes']for p in m['primitives']),'meshPrimitives':sum(len(m['primitives'])for m in doc['meshes'])}
def build(run):
 manifest=json.loads((ROOT/'assets/species/manifest.json').read_text());catalog=json.loads((ROOT/'assets/catalog/manifest.json').read_text());old={r['id']:r for r in json.loads((ROOT/'docs/realism/catalog-inventory.json').read_text())};items=json.loads((ROOT/'assets/catalog/items.json').read_text());audits={r['id']:r for r in json.loads((run/'model-audit-ipad.json').read_text())}
 assert len(items)==181 and len(manifest)==127 and len(audits)==144
 rows=[]
 for item in items:
  id=item['id'];previous=old[id];native=id in manifest
  row={'id':id,'name':item['name'],'category':item['category'],'newGLB':native,'photorealisticAccepted':False,'priorStatus':previous['status'],'source':catalog[id]['provenance'],'catalogRevision':catalog[id]['renderRevision'],'ipadAudit':audits.get(id),'features':(item.get('anatomy')or{}).get('features',[])}
  if native:
   row.update(status='Neue GLB; optische Arbeit bleibt offen',change=CHANGES[item['category']],remainingWork=GAPS[item['category']],desktop=metrics(ROOT/manifest[id]['desktop']),mobile=metrics(ROOT/manifest[id]['mobile']))
   if id in ['guppy','platy','zebra','cory']:row['change']+=' Erzeugte Texturvorlage mit separat projizierten Flossen; keine Referenzfotografie.'
  else:row.update(status='Hochwertiger Bestand erhalten'if id in ['neon','molly','clown','betta','nana','vallis']else'Bestandsmodell dieses Auftrags unverändert',change=previous['change'],remainingWork=previous['remainingWork'])
  rows.append(row)
 OUT.mkdir(parents=True,exist_ok=True);(OUT/'model-status.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
 total=sum(r.get(lod,{}).get('bytes',0)for r in rows for lod in ['desktop','mobile'])
 text=f'''# Tatsächlicher Modellstand nach diesem Auftrag

**127 neue selbst erstellte Organismenmodelle, jeweils zwei LODs = 254 GLBs ({total/1e6:.1f} MB). 0 neue Modelle sind vollständig nach dem angeforderten Fotorealismusmaßstab abgenommen.** Das sind unterschiedliche Aussagen: ein exportiertes Modell und mehr Details sind noch kein Nachweis hochwertiger naturgetreuer Grafik.

54 Fische, 30 Pflanzen, 19 Wirbellose und 24 Korallen besitzen neue Dateien. Neon, Molly, Ocellaris, Betta, Nana und Vallisnerie bleiben erhalten. Die 11 bereits neu modellierten Dekorationen und 37 Technik-/Produktmodelle dieses Auftrags bleiben auf dem zusammengeführten Bestand. Von den zuvor 61 deutlich vereinfachten Einträgen erhalten 43 Wirbellosen-/Koralleneinträge neue Geometrie; 18 Becken-/Verbrauchsproduktmodelle bleiben unverändert vereinfacht.

Die vier zusätzlich mit erzeugten Texturen bearbeiteten Arten sind Guppy, Platy, Zebrabärbling und Bronze-Panzerwels. Guppy zeigt besonders deutlich mehr Oberflächendetail. Glatte Partien, schmale Strahlen, vereinfachte Wangen/Mäuler und gleichförmige Gewebe bleiben sichtbar. Pflanzen, Wirbellose und Korallen erreichen die vorhandenen besten Foto-/Künstlermodelle noch nicht durchgehend. **Keine Art wird hier als vollständig von jeder Comic-Optik befreit zertifiziert.**

Alle 181 Katalogansichten stammen aus dem tatsächlichen Modell-/Produktpfad; neue Modelle sind durch die Revision `species-glb-1` kenntlich. 144 Organismen-/Dekorationspfade wurden im Browser einzeln geladen und vermessen. Kontaktbögen sind Katalogrenderings, keine ersatzweise erfundenen Live-Screenshots. Gesonderte Live-Nahansichten und Aquariumsszenen stehen im Prüfbericht. Keine unabhängige Fotoabnahme jeder Art: der externe Referenzabruf war teilweise blockiert; vorhandene Artmetadaten und Quellen wurden genutzt, ohne deren vollständige erneute Prüfung vorzutäuschen.

Die technischen Ursachen der offenen Qualität sind die weiterhin gemeinsamen parametrischen Körper-/Gewebegerüste, fehlende unabhängig geprüfte artspezifische Scan-/Fototexturen und fehlende vollständige manuelle Anatomiearbeit. Mehr Tessellation und PBR beheben das nicht. Kostenfreie nächste Schritte sind manuelle Blender-Sculpts anhand geklärter Referenzen, individuell gemalte Haut-/Blattkarten und Sichtabnahmen pro Art. Keine zusätzlichen Konten oder Bezahldienste sind dafür vorgesehen.

Die [JSON-Matrix](model-status.json) enthält LOD-Größen, echte Browser-Messungen, bisherige Einstufung, Quellen und offenen Bedarf für jeden Eintrag.

| Eintrag | Gruppe | Tatsächlicher Stand | Offen |
| --- | --- | --- | --- |
'''
 for r in rows:
  esc=lambda x:str(x).replace('|','\\|').replace('\n',' ')
  text+='| '+' | '.join(map(esc,[r['id']+' · '+r['name'],r['category'],r['status']+'; '+r['change'],r['remainingWork']]))+' |\n'
 (OUT/'MODEL_STATUS.md').write_text(text)
 for name,categories in {'fish':['fish'],'plants':['plant'],'invertebrates-corals':['invert','coral'],'products-hardscape':['decor','tank','filter','light','equipment','substrate','food','additive']}.items():
  subset=[r for r in rows if r['category']in categories];w,h,cols=230,178,6;sheet=Image.new('RGB',(w*cols,h*((len(subset)+cols-1)//cols)),'#faf9f3');draw=ImageDraw.Draw(sheet)
  for n,r in enumerate(subset):
   x=n%cols*w;y=n//cols*h;im=Image.open(ROOT/catalog[r['id']]['src']).convert('RGB');im.thumbnail((220,135));sheet.paste(im,(x+(w-im.width)//2,y));draw.text((x+6,y+137),r['id'],fill='#24392f');draw.text((x+6,y+153),'Neue GLB - Abnahme offen'if r['newGLB']else'Bestand erhalten',fill='#5b665a')
  sheet.save(OUT/f'catalog-{name}.jpg',quality=85)
 print('Reviewed',len(rows),'entries;',len(manifest),'new species;',total,'bytes')
if __name__=='__main__':build(Path(sys.argv[1]))
