const generated=new Set(['guppy','platy','zebra','cory']);
export function speciesProvenance(id){
 if(id==='anubias')return {kind:'authored-glb',author:'Eigene Blender-Geometrie; Fototextur: Abhik.Mazumdar.73',license:'CC-BY-4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',source:'https://commons.wikimedia.org/wiki/File:Anubias_barteri_var._nana.jpg',title:'Fotobasierte Blattoberfläche auf eigener botanischer Geometrie',visualStatus:'Sichtbar überarbeitet; vollständiger Fotorealismus bleibt offen',documentation:'./assets/species/ATTRIBUTION.md'};
 const usesGeneratedArtwork=generated.has(id);
 return {
  kind:'authored-glb',author:'Eigene Projektgrafik · Blender/Python',
  source:'https://github.com/Feerson1617/Simulation-Aquarium/tree/feature/species-variants-genetics/tools/species',
  license:usesGeneratedArtwork?'Eigene Projektgrafik; erzeugte Vorlage gemäß OpenAI-Nutzungsbedingungen':'CC0-1.0',
  title:usesGeneratedArtwork?'Artspezifische Originalgeometrie mit erzeugter Texturvorlage (keine Fotografie)':'Artspezifische Originalgeometrie und prozedurale Oberfläche',
  visualStatus:'Überarbeitet; Fotorealismus nicht vollständig abgenommen',
  documentation:'./assets/species/ATTRIBUTION.md',
 };
}
