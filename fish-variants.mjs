/** Real aquarium colour forms. The separate teaching loci are explicitly models. */
export const GENETICS_DISCLAIMER = 'Vereinfachtes Vererbungsmodell: In der Natur können mehrere Gene, Kopplung, Geschlecht und Umwelt an der Farbgebung beteiligt sein. Unsere Modellallele sind keine gemessenen DNA-Befunde.';
const form = (id, name, body, fins, pattern = 'plain', extra = {}) => ({ id, name, body, fins, pattern, ...extra });
export const FISH_VARIANTS = {
  clown: [form('natural','Klassische Ocellaris-Farbform','#cf7a3a','#b26337','original'),form('black-darwin','Schwarze Darwin-Farbform','#252d2a','#28322c','clown-black')],
  molly: [form('silver','Silber','#b8b9a2','#9c9c88','original'),form('black','Black Molly','#252825','#292d27'),form('gold','Goldmolly','#d4ad45','#c6a24e'),form('dalmatian','Dalmatinermolly','#d8d6c3','#bdbdab','dalmatian')],
  guppy: [form('multicolor','Mehrfarbig · Delta','#84a5a1','#e2a34f','original'),form('red','Full Red','#b45036','#bd4433','fine'),form('blue','Blaue Zuchtform','#4e8d9d','#527da1','mosaic'),form('tuxedo','Tuxedo','#a9a489','#7994a5','tuxedo')],
  platy: [form('red','Roter Platy','#c9683d','#c88957'),form('gold','Goldplaty','#d5b35d','#cdbd87'),form('red-wagtail','Roter Wagtail','#c9683d','#252d29','wagtail'),form('gold-wagtail','Goldener Wagtail','#d5b35d','#252d29','wagtail')],
  swordtail: [form('natural','Grüne Wildform','#7f9279','#b3a67d','original'),form('red','Rote Zuchtform','#bc5b3c','#ba653e'),form('koi','Koi-Zuchtform','#dbd3b5','#d8bd91','koi')],
  zebra: [form('natural','Gestreifte Wildform','#b9ad79','#bdb597','original'),form('golden','Golden','#d3ba75','#d3c38c','golden'),form('leopard','Leopard-Zuchtform','#baa875','#c5b98b','leopard')],
  betta: [form('multicolor','Mehrfarbige Zuchtform','#538f9e','#c5894d','original'),form('red','Rote Zuchtform','#a73a32','#b2463f','iridescent'),form('blue','Blaue Zuchtform','#3c679c','#446d9f','iridescent'),form('white','Weiße Zuchtform','#d5d9cf','#d4dcd4','iridescent')],
  angelfish: [form('silver','Silber-Skalar','#c0bba4','#b8b39b','original'),form('black','Schwarzer Skalar','#303731','#313c33'),form('gold','Gold-Skalar','#cfb56e','#d2c698'),form('koi','Koi-Skalar','#ddd7bc','#b9bdab','koi')],
  discus: [form('red-turquoise','Rot-Türkis','#b96b4f','#9f8d69','original'),form('blue-turquoise','Blau-Türkis','#6ba5ad','#669da6','maze'),form('pigeon-blood','Pigeon Blood','#d6ba8a','#c8846e','reticulate')],
  goldfish: [form('orange','Orange · Einfachschwanz','#d49b3e','#d2a25c','original'),form('white','Weiß · Einfachschwanz','#d8d8c9','#cccfbf'),form('sarasa','Sarasa · Rot-Weiß','#ded8bf','#c8bfa2','koi')],
  tiger: [form('natural','Gebänderte Wildform','#bfa563','#b48a54','original'),form('green','Moosgrüne Zuchtform','#415c48','#9f7554','green'),form('albino','Albino-Zuchtform','#d7bd91','#cfab78','albino',{redEyes:true})],
  cory: [form('bronze','Bronzeform','#9f9673','#9e9b7c','original'),form('albino','Albinoform','#d7c4ad','#cdb8a4','albino',{redEyes:true})],
  ancistrus: [form('brown','Braune Zuchtform','#665b43','#766b4d','original'),form('albino','Albino-Zuchtform','#d2b577','#ccb075','albino',{redEyes:true}),form('red','Rote Zuchtform','#b97b44','#b48a50','fine')],
  ram: [form('natural','Naturfarbene Zuchtform','#c8af65','#ada17b','original'),form('gold','Goldene Zuchtform','#d2bb67','#c5b579'),form('electric-blue','Electric Blue','#62b1ba','#73b5bd','iridescent')],
  whitecloud: [form('natural','Wildfarbene Form','#aaa68a','#b99e75','original'),form('gold','Goldene Zuchtform','#d0ba72','#c5aa79','golden')],
  blackskirt: [form('natural','Wildfarbene Form','#747b72','#81897a','original'),form('white','Weiße Zuchtform','#d4d5c7','#c5ccbe','leucistic')],
};
export const VARIANT_REFERENCES = {
  livebearers: ['Dawes, J. (1991): Livebearing Fishes, Blandford. Zuchtformen und ihre komplexe Vererbung.', 'https://www.fishbase.se/summary/Poecilia-sphenops.html','https://www.fishbase.se/summary/Xiphophorus-maculatus.html'],
  zebrafish: ['Lamason et al. (2005): SLC24A5, a putative cation exchanger, affects pigmentation in zebrafish and humans. Science 310, 1782–1786. DOI:10.1126/science.1116238','https://zfin.org/'],
  cultivated: ['Die Farbformen sind aquaristische Zuchtformen, keine neuen Arten. Die Liste ist keine Behauptung eines einfachen tatsächlichen Erbgangs.','https://www.fishbase.se/summary/Betta-splendens.html','https://www.fishbase.se/summary/Carassius-auratus.html'],
};
const NATURAL = [{ id:'natural',name:'Bestehende Natur-/Zuchtform',pattern:'original' }];
export function variantsFor(species) { return FISH_VARIANTS[species] || NATURAL; }
export function variantFor(species,id) { return variantsFor(species).find(v=>v.id===id) || variantsFor(species)[0]; }
export function modelFor(species,variant) {
  if (species==='molly' && ['black','gold'].includes(variant)) return 'molly-mono';
  if (species==='platy') return 'platy-independent';
  if (species==='zebra' && ['natural','golden'].includes(variant)) return 'zebra-golden';
  return null;
}
export function lociFor(model) { return model==='platy-independent'?['A','B']:model?['A']:[]; }
export function normalizePair(pair,locus='A') {
  const lower=locus.toLowerCase();if(!Array.isArray(pair)||pair.length!==2||pair.some(a=>a!==locus&&a!==lower))return null;
  return [...pair].sort();
}
export function phenotypeFor(model,genotype) {
  const dominant=locus=>genotype[locus]?.includes(locus);
  if(model==='molly-mono')return dominant('A')?'black':'gold';
  if(model==='zebra-golden')return dominant('A')?'natural':'golden';
  if(model==='platy-independent')return (dominant('A')?'red':'gold')+(dominant('B')?'-wagtail':'');
  return null;
}
export function genotypeOptions(species,variant) {
  const model=modelFor(species,variant);if(!model)return [];
  const all=model==='platy-independent'?['AABB','AABb','AaBB','AaBb','AAbb','Aabb','aaBB','aaBb','aabb']:['AA','Aa','aa'];
  return all.filter(value=>phenotypeFor(model,parseGenotype(value,model))===variant);
}
export function parseGenotype(value,model) {
  if(typeof value!=='string')return null;const loci=lociFor(model);if(value.length!==loci.length*2)return null;
  const result={};for(let i=0;i<loci.length;i++){const pair=normalizePair(value.slice(i*2,i*2+2).split(''),loci[i]);if(!pair)return null;result[loci[i]]=pair}return result;
}
export function genotypeText(genotype) { return genotype?Object.keys(genotype).sort().map(k=>genotype[k].join('')).join(''):'nicht modelliert'; }
