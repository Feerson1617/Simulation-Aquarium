import test from 'node:test';
import assert from 'node:assert/strict';
import {createStandaloneShell} from '../standalone-navigation.mjs';
import {gameURL} from '../game-route.mjs';
test('standalone source survives JSON/script boundaries exactly and preserves direct routes',()=>{
 const application='<!doctype html><html><head></head><body>Grüße & <script>const s="</script>"; 1 < 2;</script></body></html>';
 const shell=createStandaloneShell(application),payload=shell.match(/<script id="aquarium-source" type="application\/json">([\s\S]*?)<\/script>/)[1];
 assert.equal(JSON.parse(payload),application);assert(!payload.includes('</script>'));
 const original=globalThis.__aquariumStandaloneRoute;
 try{
  for(const base of ['https://example.test/Simulation-Aquarium/Aquarium.html','file:///tmp/Aquarium.html']){
   globalThis.__aquariumStandaloneRoute=base+'?mission=m3-hidden-inheritance';const u=gameURL();assert.equal(u.searchParams.get('mission'),'m3-hidden-inheritance');assert.equal(u.pathname,new URL(base).pathname);
  }
 }finally{if(original===undefined)delete globalThis.__aquariumStandaloneRoute;else globalThis.__aquariumStandaloneRoute=original;}
});
