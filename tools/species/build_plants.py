"""Original species-aware botanical geometry; no scanned-plant claim."""
import math,random
from organism_common import *
# height, blade length, width, leaves; actual distinguishing anatomy below.
PARAMS={
'anubias':(.6,.31,.17,9),'javafern':(.95,.57,.075,12),'trident':(.8,.43,.065,11),
'javamoss':(.32,.017,.004,9),'christmas':(.35,.017,.004,9),'vallisgiant':(1.25,1.15,.025,10),
'swordplant':(1.1,.66,.18,12),'redflame':(.9,.55,.15,11),'crypt':(.55,.37,.09,13),'cryptparva':(.24,.18,.027,13),
'waterweed':(.95,.075,.018,6),'hornwort':(1.05,.085,.005,6),'hygro':(.85,.12,.038,5),'corymbosa':(1,.21,.09,5),
'limno':(.9,.08,.004,6),'rotala':(.85,.075,.025,7),'ludwigia':(.8,.11,.05,5),'bacopa':(.7,.09,.045,5),
'cabomba':(.9,.11,.005,5),'alternanthera':(.75,.13,.04,5),'pearlweed':(.65,.04,.014,9),
'montecarlo':(.13,.055,.05,16),'hairgrass':(.48,.45,.003,32),'stauro':(.38,.14,.055,7),'buce':(.36,.21,.055,10),
'lotus':(.85,.34,.28,7),'frogbit':(.05,.16,.12,6),'salvinia':(.04,.11,.075,10),'waterlettuce':(.12,.24,.12,12),'aponogeton':(1.0,.68,.16,9),
}

def build(item,lod):
 id=item['id'];s=item['species'];height,length,width,count=PARAMS[id];rng=random.Random(id);color=s['color'];leafmat=vertex_material('living-leaf',color,.53);stemmat=material('stem','#647c42',.7);rootmat=material('root','#8b876a',.8);shape=s['shape']
 if id in ['javamoss','christmas']:
  for k in range(count):
   angle=k*2.399;base=(math.cos(angle)*.20,0,math.sin(angle)*.18);points=[(base[0]+t*math.cos(angle)*.18,height*t,base[2]+t*math.sin(angle)*.11)for t in[j/12 for j in range(13)]];tube('moss-axis',points,[.002]*13,stemmat,6)
   for j in range(1,11):
    t=j/12;p=points[j]
    for side in [-1,1]:
     reach=.09*(1-t)if id=='christmas'else.045+rng.random()*.035;end=(p[0]+side*reach,p[1]+.015,p[2]+.02*math.sin(k));tube('moss-branch',[p,end],[.0013,.0004],stemmat,5)
     for n in range(6):leaf('moss-leaf',(p[0]+(end[0]-p[0])*n/6,p[1]+.015*n/6,p[2]),length,width,angle+side*.7,.01,leafmat,color,lod)
 elif id in ['waterweed','hornwort','hygro','corymbosa','limno','rotala','ludwigia','bacopa','cabomba','alternanthera','pearlweed']:
  for k in range(count):
   angle=k*2.399;bx=math.cos(angle)*(.08+k*.008);bz=math.sin(angle)*(.08+k*.008);h=height*(.75+rng.random()*.25);points=[(bx+math.sin(t*2+k)*.035*t,h*t,bz+math.cos(t*3+k)*.03*t)for t in[j/18 for j in range(19)]];tube('branching-stem',points,[.0035*(1-j/25)for j in range(19)],stemmat,7)
   for j in range(2,17):
    p=points[j];whorls=5 if id=='waterweed'else 10 if id in ['hornwort','limno']else 2
    for n in range(whorls):
     a=j*math.pi/2+n*2*math.pi/whorls+k
     if id in ['hornwort','limno','cabomba']:
      rays=7 if id=='cabomba'else 3
      for ray in range(rays):
       fan=a+(ray/(rays-1)-.5)*1.4;end=(p[0]+math.cos(fan)*length,p[1]+.02,p[2]+math.sin(fan)*length);tube('dissected-leaf-ray',[p,end],[.0013,.0004],leafmat,5)
       if id!='hornwort':
        for branch in [-1,1]:tube('pinnule',[end,(end[0]+math.cos(fan+branch*.7)*length*.28,end[1]+.007,end[2]+math.sin(fan+branch*.7)*length*.28)],[.0006,.00015],leafmat,4)
     else:leaf('opposite-leaf',p,length,width,a,.025,leafmat,color,lod,'oval'if id in ['bacopa','rotala']else'lance')
 elif shape=='floating':
  for k in range(count):
   angle=k*2.399;base=(math.cos(angle)*.05,.005,math.sin(angle)*.05);leaf('floating-leaf',base,length,width,angle,.025 if id!='waterlettuce'else.07,leafmat,color,lod,'oval',.08 if id=='waterlettuce'else 0)
  for k in range(18):
   angle=k*2.399;depth=.35+rng.random()*.4;points=[(math.cos(angle)*.045+math.sin(t*6+k)*.016,-depth*t,math.sin(angle)*.045+math.cos(t*5+k)*.012)for t in[j/20 for j in range(21)]];tube('hanging-root',points,[.0013*(1-j/22)for j in range(21)],rootmat,5)
 elif id=='montecarlo':
  for k in range(count):
   angle=k*2.399;distance=.04+math.sqrt(k/count)*.22;base=(math.cos(angle)*distance,.01,math.sin(angle)*distance);tube('creeping-stolon',[(0,.01,0),base],[.002,.0015],stemmat,5)
   for j in range(3):leaf('round-carpet-leaf',base,length,width,angle+j*2.1,.025,leafmat,color,lod,'heart')
 else:
  for k in range(count):
   angle=k*2.399;r=.015+math.sqrt(k/count)*.075;petiole=.03 if id in ['cryptparva','hairgrass','vallisgiant']else height*.28;start=(math.cos(angle)*r,0,math.sin(angle)*r);tip=(start[0]+math.cos(angle)*.045,petiole*(.7+rng.random()*.5),start[2]+math.sin(angle)*.045);tube('petiole',[start,tip],[.003,.0018],stemmat,6)
   kind='lace'if id=='aponogeton'else'heart'if id=='lotus'else'oval'if id in ['anubias','stauro','buce']else'lance';ruffle=.13 if id in ['crypt','buce']else.03
   if id=='trident':
    leaf('fern-lower-blade',tip,length*.65,width,angle,height*.26,leafmat,color,lod)
    split=(tip[0]+math.cos(angle)*length*.65,tip[1]+height*.26,tip[2]+math.sin(angle)*length*.65)
    for side in [-1,0,1]:leaf('trident-lobe',split,length*.43,width*.43,angle+side*.50,height*.14,leafmat,color,lod)
   else:leaf('blade',tip,length,width,angle,height-petiole-length*.12,leafmat,color,lod,kind,ruffle)
  if id in ['anubias','javafern','trident','buce']:
   tube('creeping-rhizome',[(-.12,.018,0),(-.04,.026,.01),(.07,.025,-.01),(.14,.018,0)],[.018,.022,.02,.01],stemmat,10)
 if id!='hornwort'and shape!='floating':
  for k in range(12):
   angle=k*2.399;points=[(0,.005,0),(math.cos(angle)*.05,-.015,math.sin(angle)*.05),(math.cos(angle)*.13,-.035,math.sin(angle)*.12)];tube('anchoring-root',points,[.0025,.0015,.0003],rootmat,5)
 # Blade extent is tied to the previous placement footprint, not silently enlarged.
 objects=[o for o in bpy.context.scene.objects if o.type=='MESH'];maxr=max((max(abs(v.co.x),abs(v.co.y))for o in objects for v in o.data.vertices),default=.3)
 if maxr>.38:
  factor=.38/maxr
  for obj in objects:
   for vertex in obj.data.vertices:vertex.co.x*=factor;vertex.co.y*=factor
