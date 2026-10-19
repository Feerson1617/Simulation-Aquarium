/** Anatomical contour refinement over the catalog's species-specific proportions. */
export function fishRadiusProfile(anatomy,t){
 const blunt=Math.max(0,Math.min(1,anatomy.headBluntness??.3)),eel=anatomy.bodyShape==='eel',flat=['catfish','sucker','goby','blenny'].includes(anatomy.bodyShape);
 const points=eel?[[0,.12+blunt*.15],[.10,.66],[.28,.92],[.52,1],[.76,.75],[.92,.33],[1,.11]]:[[0,.08+blunt*.25],[.08,.40+blunt*.14],[.22,flat?.91:.80],[.40,1],[.58,.88],[.76,.54],[.91,.20],[1,.13]];
 t=Math.max(0,Math.min(1,t));let index=0;while(index<points.length-2&&t>points[index+1][0])index++;
 const a=points[index],b=points[index+1],u=(t-a[0])/(b[0]-a[0]),before=points[Math.max(0,index-1)],after=points[Math.min(points.length-1,index+2)],m0=(b[1]-before[1])/(b[0]-before[0]),m1=(after[1]-a[1])/(after[0]-a[0]),span=b[0]-a[0];
 return Math.max(.03,Math.min(1.02,(2*u**3-3*u*u+1)*a[1]+(u**3-2*u*u+u)*span*m0+(-2*u**3+3*u*u)*b[1]+(u**3-u*u)*span*m1));
}
