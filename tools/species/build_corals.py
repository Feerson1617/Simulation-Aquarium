"""Species-aware coral colonies: corallites, octocorals and fleshy LPS polyps.
All remain authored reconstructions rather than validated specimen scans.
"""
import math,random
from organism_common import *
from build_fish import ellipsoid

def surface(name,center,radius,height,mat,color,lod,mode='disc'):
 rows,cols=(28,96)if lod=='desktop'else(16,48);verts=[];faces=[];uv=[]
 for j in range(rows+1):
  r=j/rows
  for k in range(cols+1):
   a=k/cols*2*math.pi;x=center[0]+math.cos(a)*r*radius;z=center[2]+math.sin(a)*r*radius*.86
   if mode=='brain':fold=(math.sin(x*47+math.sin(z*32)*2)+math.sin(z*46+x*13))**2;y=center[1]+height*(1-r*r)+.014*fold
   elif mode=='plate':y=center[1]+height*r*r+.012*math.sin(a*7+r*15)*r
   else:y=center[1]+height*(1-r*r)+.008*math.sin(a*13)*r**3
   verts.append((x,y,z));uv.append((.5+math.cos(a)*r*.5,.5+math.sin(a)*r*.5))
  if j:
   for k in range(cols):q=(j-1)*(cols+1)+k;faces.append((q,q+1,q+cols+2,q+cols+1))
 obj=mesh(name,verts,faces,mat,uv,'polyp-tissue');paint(obj,color,.14);return obj

def polyp(position,size,mat,color,lod,tentacles=8,pinnate=False,shape='ordinary'):
 tube('polyp-column',[(position[0],position[1]-.025,position[2]),position],[size*.28,size*.34],mat,8)
 for k in range(tentacles):
  angle=k/tentacles*2*math.pi;points=[]
  for j in range(9 if lod=='desktop'else 6):
   t=j/(8 if lod=='desktop'else 5);reach=size*(.18+.85*t);points.append((position[0]+math.cos(angle)*reach,position[1]+size*.65*math.sin(t*math.pi*.85),position[2]+math.sin(angle)*reach))
  tube('octocoral-tentacle'if pinnate else'polyp-tentacle',points,[size*.075*(1-j/(len(points)+1))for j in range(len(points))],mat,6 if lod=='desktop'else 4)
  if pinnate:
   for j in range(2,len(points)-1,2):
    p=points[j]
    for side in [-1,1]:tube('pinnule',[p,(p[0]+math.cos(angle+side*1.1)*size*.22,p[1]+size*.04,p[2]+math.sin(angle+side*1.1)*size*.22)],[size*.022,size*.008],mat,4)

def branch_colony(item,lod,soft=False):
 id=item['id'];color=item['species']['color'];rng=random.Random(id);mat=vertex_material('fleshy-branch'if soft else'skeleton-tissue',color,.52);count=13 if id!='birdsnest'else 22;tips=[]
 for k in range(count):
  angle=k*2.399;r=.03+math.sqrt(k/count)*.22;h=.27+rng.random()*.34;start=(math.cos(angle)*r*.4,.015,math.sin(angle)*r*.4);end=(math.cos(angle)*r,h,math.sin(angle)*r);points=[];radii=[]
  for j in range(22 if lod=='desktop'else 12):
   t=j/(21 if lod=='desktop'else 11);points.append((start[0]+(end[0]-start[0])*t+math.sin(t*4+k)*.012*t,h*t,start[2]+(end[2]-start[2])*t+math.cos(t*3+k)*.012*t));base=.028 if id in ['stylo','pocillo','sinularia']else.012 if id=='birdsnest'else.020;radii.append(base*(1-.58*t)+.0015*math.sin(t*17)**2)
  obj=tube('branch',points,radii,mat,14 if lod=='desktop'else 8);paint(obj,color,.13);tips.append(end)
  for fork in range(2):
   p=points[len(points)//2+fork*2];direction=angle+(fork-.5)*1.3;target=(p[0]+math.cos(direction)*.09,p[1]+.13,p[2]+math.sin(direction)*.09);obj=tube('lateral-branch',[p,tuple(Vector(p).lerp(Vector(target),.5)),target],[radii[len(radii)//2]*.75,.012,.006],mat,12 if lod=='desktop'else 7);paint(obj,color,.12)
  if not soft:
   for n in range(14 if lod=='desktop'else 6):
    t=.2+n/(14 if lod=='desktop'else 6)*.7;p=points[min(len(points)-1,int(t*(len(points)-1)))];a=n*2.4;direction=Vector((math.cos(a),.3,math.sin(a))).normalized();base=Vector(p)+direction*radii[min(len(radii)-1,int(t*(len(radii)-1)))];endc=base+direction*.007;obj=tube('radial-corallite',[tuple(base),tuple(endc)],[.004,.003],mat,7 if lod=='desktop'else 5);paint(obj,color,.07)
   if id=='acropora':tube('axial-corallite',[end,(end[0],end[1]+.018,end[2])],[.007,.005],mat,10)
 if soft:
  for end in tips:polyp(end,.033,mat,color,lod,8,True)


def build(item,lod):
 id=item['id'];color=item['species']['color'];rng=random.Random(id);tissue=vertex_material('living-polyp',color,.43);skeleton=material('calcareous-skeleton','#a9a492',.86);mouth=material('oral-opening','#5d6551',.58)
 if id in ['acropora','pocillo','stylo','birdsnest','montidigi','sinularia','kenya']:
  branch_colony(item,lod,id in ['sinularia','kenya']);return
 if id=='softleather':
  obj=tube('leather-stalk',[(0,0,0),(.02,.20,0),(-.01,.42,0)],[.085,.075,.12],tissue,22 if lod=='desktop'else 12);paint(obj,color,.15);surface('folded-cap',(0,.42,0),.31,.08,tissue,color,lod)
  for k in range(34 if lod=='desktop'else 16):
   a=k*2.399;r=math.sqrt((k+.5)/(34 if lod=='desktop'else 16))*.28;polyp((math.cos(a)*r,.45+.08*(1-r*r/.10),math.sin(a)*r*.86),.025,tissue,color,lod,8,True)
 elif id=='xenia':
  for k in range(13):
   a=k*2.399;r=.06+math.sqrt(k/13)*.18;h=.23+rng.random()*.17;base=(math.cos(a)*r,0,math.sin(a)*r);end=(base[0]+.02,h,base[2]);obj=tube('xenia-stalk',[base,end],[.02,.011],tissue,10);paint(obj,color,.13);polyp(end,.075,tissue,color,lod,8,True)
 elif id in ['greenstar','zoa']:
  surface('encrusting-mat',(0,.01,0),.32,.02,tissue,color,lod)
  for k in range(25 if lod=='desktop'else 15):
   a=k*2.399;r=math.sqrt((k+.5)/(25 if lod=='desktop'else 15))*.28;p=(math.cos(a)*r,.045+(.04 if id=='zoa'else 0),math.sin(a)*r*.86);polyp(p,.055 if id=='greenstar'else.043,tissue,color,lod,8 if id=='greenstar'else 24,id=='greenstar')
   if id=='zoa':surface('oral-disc',p,.031,.004,tissue,color,lod);tube('slit-mouth',[(p[0]-.007,p[1]+.007,p[2]),(p[0]+.007,p[1]+.007,p[2])],[.0018,.0018],mouth,5)
 elif id in ['mushroom','ricordea']:
  for k in range(4):
   a=k*2.4;center=(math.cos(a)*.14,.035+k*.012,math.sin(a)*.13);surface('oral-disc',center,.16,.035,tissue,color,lod)
   if id=='ricordea':
    for j in range(65 if lod=='desktop'else 30):
     aa=j*2.399;r=math.sqrt((j+.5)/(65 if lod=='desktop'else 30))*.14;p=(center[0]+math.cos(aa)*r,center[1]+.035*(1-r*r/.025),center[2]+math.sin(aa)*r*.86);obj=ellipsoid('vesicle',p,(.012,.018,.012),tissue,10 if lod=='desktop'else 6,6);paint(obj,color,.15)
   tube('central-mouth',[(center[0]-.013,center[1]+.037,center[2]),(center[0]+.013,center[1]+.037,center[2])],[.003,.003],mouth,6)
 elif id in ['hammer','frogspawn','torch','duncan','candy']:
  for k in range(6):
   angle=k*2.399;r=.06+math.sqrt(k/6)*.18;base=(0,0,0);top=(math.cos(angle)*r,.20+rng.random()*.12,math.sin(angle)*r);tube('branching-corallum',[base,(top[0]*.7,.13,top[2]*.7),top],[.025,.022,.035],skeleton,14 if lod=='desktop'else 8)
   count=26 if lod=='desktop'else 14
   for n in range(count):
    a=n*2.399;r=.015+math.sqrt(n/count)*.09;end=(top[0]+math.cos(a)*r,top[1]+.12+math.sin(n)*.03,top[2]+math.sin(a)*r);points=[top,(top[0]+math.cos(a)*r*.6,top[1]+.075,top[2]+math.sin(a)*r*.6),end];obj=tube('fleshy-tentacle',points,[.009,.012,.013],tissue,8 if lod=='desktop'else 5);obj['surfaceRole']='polyp-tissue';paint(obj,color,.11)
    if id in ['hammer','frogspawn']:
     for side in [-1,1]if id=='hammer'else[-1,0,1]:
      p=(end[0]+side*.016,end[1]+.005,end[2]+(side%2)*.008);obj=ellipsoid('hammer-tip'if id=='hammer'else'forked-tip',p,(.016,.012,.011),tissue,10 if lod=='desktop'else 6,6);obj['surfaceRole']='polyp-tissue';paint(obj,color,.08)
   if id in ['candy','duncan']:surface('fleshy-corallite',top,.065,.025,tissue,color,lod);tube('oral-mouth',[(top[0]-.013,top[1]+.027,top[2]),(top[0]+.013,top[1]+.027,top[2])],[.003,.003],mouth,6)
 elif id in ['brain','favites','acanth']:
  if id=='brain':surface('meandering-corallites',(0,.03,0),.34,.17,tissue,color,lod,'brain')
  else:
   for k in range(12):
    a=k*2.399;r=math.sqrt(k/12)*.25;p=(math.cos(a)*r,.03+.07*(1-r/.3),math.sin(a)*r);surface('inflated-corallite',p,.10 if id=='acanth'else.08,.055,tissue,color,lod,'brain');tube('oral-mouth',[(p[0]-.015,p[1]+.06,p[2]),(p[0]+.015,p[1]+.06,p[2])],[.003,.003],mouth,6)
 else:
  for k in range(3 if id=='montiplate'else 2):
   center=(math.sin(k*2.4)*.08,.035+k*.13,math.cos(k*2.4)*.07);surface('foliate-plate',center,.32-k*.035,.075,tissue,color,lod,'plate')
   for j in range(35 if lod=='desktop'else 12):
    a=j*2.399;r=math.sqrt((j+.5)/(35 if lod=='desktop'else 12))*(.28-k*.035);p=(center[0]+math.cos(a)*r,center[1]+.075*(r/(.32-k*.035))**2,center[2]+math.sin(a)*r*.86);tube('surface-corallite',[p,(p[0],p[1]+.009,p[2])],[.005,.0035],tissue,6)
