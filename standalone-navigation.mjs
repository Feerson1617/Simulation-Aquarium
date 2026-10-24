/** Only the generated single file gets a local document host. The website stays unchanged. */
export function createStandaloneShell(applicationHTML) {
  function frameRuntime() {
    const intervals=new Set(),timeouts=new Set(),animations=new Set(),listeners=[],contexts=new Set();
    let disposed=false;
    const native={setInterval:window.setInterval.bind(window),clearInterval:window.clearInterval.bind(window),setTimeout:window.setTimeout.bind(window),clearTimeout:window.clearTimeout.bind(window),raf:window.requestAnimationFrame.bind(window),caf:window.cancelAnimationFrame.bind(window),add:EventTarget.prototype.addEventListener,remove:EventTarget.prototype.removeEventListener,getContext:HTMLCanvasElement.prototype.getContext};
    window.setInterval=(fn,delay,...args)=>{const id=native.setInterval(fn,delay,...args);intervals.add(id);return id;};
    window.clearInterval=id=>{intervals.delete(id);native.clearInterval(id);};
    window.setTimeout=(fn,delay,...args)=>{let id;id=native.setTimeout(typeof fn==='function'?()=>{timeouts.delete(id);if(!disposed)fn(...args);}:fn,delay,...args);timeouts.add(id);return id;};
    window.clearTimeout=id=>{timeouts.delete(id);native.clearTimeout(id);};
    window.requestAnimationFrame=fn=>{let id;id=native.raf(time=>{animations.delete(id);if(!disposed)fn(time);});animations.add(id);return id;};
    window.cancelAnimationFrame=id=>{animations.delete(id);native.caf(id);};
    const capture=options=>typeof options==='boolean'?options:!!options?.capture;
    EventTarget.prototype.addEventListener=function(type,fn,options){
      native.add.call(this,type,fn,options);
      if(fn&&!listeners.some(r=>r.target===this&&r.type===type&&r.fn===fn&&r.capture===capture(options)))listeners.push({target:this,type,fn,capture:capture(options)});
    };
    EventTarget.prototype.removeEventListener=function(type,fn,options){
      native.remove.call(this,type,fn,options);const i=listeners.findIndex(r=>r.target===this&&r.type===type&&r.fn===fn&&r.capture===capture(options));if(i>=0)listeners.splice(i,1);
    };
    HTMLCanvasElement.prototype.getContext=function(...args){const gl=native.getContext.apply(this,args);if(gl&&/^webgl2?$/.test(args[0]))contexts.add(gl);return gl;};
    const snapshot=()=>({intervals:intervals.size,timeouts:timeouts.size,animationCallbacks:animations.size,registeredListeners:listeners.length,webglContexts:[...contexts].filter(gl=>!gl.isContextLost()).length,disposed});
    window.aquariumStandaloneLifecycle={snapshot,stop(){
      disposed=true;for(const id of intervals)native.clearInterval(id);for(const id of timeouts)native.clearTimeout(id);for(const id of animations)native.caf(id);intervals.clear();timeouts.clear();animations.clear();
      for(const r of listeners)native.remove.call(r.target,r.type,r.fn,r.capture);listeners.length=0;
      window.aquariumDisposeResources?.();
      for(const gl of contexts)gl.getExtension('WEBGL_lose_context')?.loseContext();contexts.clear();return snapshot();
    }};
    document.addEventListener('click',event=>{
      const target=event.target.closest?.('a,button');if(!target||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      if(target.matches('[data-act="download-html"]')){event.preventDefault();event.stopImmediatePropagation();parent.aquariumStandaloneDownload();return;}
      if(target.tagName!=='A'||target.hasAttribute('download')||target.target&&target.target!=='_self')return;
      const current=new URL(window.__aquariumStandaloneRoute),next=new URL(target.getAttribute('href'),current);
      if(next.origin!==current.origin||next.pathname!==current.pathname)return;
      event.preventDefault();event.stopImmediatePropagation();parent.aquariumStandaloneNavigate(next.href);
    },true);
  }
  function boot(application,wire,download) {
    let current=null,route=null,switching=false;const retired=[];
    const base=new URL(location.href);base.hash='';
    const decodeRoute=()=>{const u=new URL(location.href);if(u.hash.startsWith('#aquarium=')){u.search=decodeURIComponent(u.hash.slice(10));u.hash='';}return u;};
    const escape=value=>value.replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));
    function writeURL(url,replace=false){
      try{history[replace?'replaceState':'pushState']({aquariumRoute:url.href},'',url.href);}
      catch{const fallback=new URL(base);fallback.hash='aquarium='+encodeURIComponent(url.search);history[replace?'replaceState':'pushState']({aquariumRoute:url.href},'',fallback.href);}
    }
    function show(url,fromHistory=false){
      if(switching||route===url.href)return true;
      if(url.origin!==base.origin||url.pathname!==base.pathname)return false;
      switching=true;
      try{
        if(current){
          const win=current.contentWindow;
          if(!win.aquariumPrepareNavigation||win.aquariumPrepareNavigation()===false){if(fromHistory)writeURL(new URL(route),true);return false;}
          const result=win.aquariumStandaloneLifecycle.stop();retired.push({route,...result});if(retired.length>30)retired.shift();current.remove();current=null;
        }
        if(!fromHistory)writeURL(url,route===null);
        route=url.href;
        const frame=document.createElement('iframe');frame.id='aquarium-view';frame.title='Aquariumsimulation';
        const routeJSON=JSON.stringify(route).replace(/</g,'\\u003c');
        const setup='<base href="'+escape(route)+'"><script>window.__aquariumStandaloneRoute='+routeJSON+';('+wire+')();</scr'+'ipt>';
        // srcdoc would also retain/send the entire large asset bundle as an
        // iframe attribute/history entry. Parse directly in the fresh blank
        // document instead; it has the same origin and needs no document fetch.
        current=frame;document.body.append(frame);
        const doc=frame.contentDocument;doc.open();doc.write(application.replace(/<head([^>]*)>/i,match=>match+setup));doc.close();return true;
      }finally{switching=false;}
    }
    // Finish the child click before discarding its document. Otherwise Chromium
    // can ignore document.write while the calling child is being unloaded.
    window.aquariumStandaloneNavigate=href=>{const next=new URL(href,route||base);setTimeout(()=>show(next),0);};
    // Keep the already loaded file. Re-serializing its large application while
    // a scene is active can exhaust Chromium's parser/serialization zone.
    window.aquariumStandaloneDownload=()=>{const url=URL.createObjectURL(download),a=document.createElement('a');a.href=url;a.download='Aquarium.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
    window.aquariumStandaloneSnapshot=()=>({route,frames:document.querySelectorAll('#aquarium-view').length,resources:current?.contentWindow.aquariumStandaloneLifecycle?.snapshot(),retired:retired.map(r=>({...r}))});
    const historyNavigation=event=>show(new URL(event.state?.aquariumRoute||decodeRoute()),true);
    addEventListener('popstate',historyNavigation);addEventListener('hashchange',historyNavigation);
    show(decodeRoute());
  }
  const source=JSON.stringify(applicationHTML).replace(/</g,'\\u003c');
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aquarium</title><link rel="icon" href="data:,"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#173a3d}#aquarium-view{display:block;border:0;width:100%;height:100%}</style></head><body><script id="aquarium-source" type="application/json">'+source+'</scr'+'ipt><script>const download=new Blob(["<!doctype html>",document.documentElement.outerHTML],{type:"text/html"});const source=document.getElementById("aquarium-source");const application=JSON.parse(source.textContent);source.textContent="";source.remove();('+boot.toString()+')(application,'+JSON.stringify(frameRuntime.toString()).replace(/</g,'\\u003c')+',download);</scr'+'ipt></body></html>';
}
