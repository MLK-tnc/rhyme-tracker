const V='rt-v2',FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='rt-share').map(k=>caches.delete(k)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
const u=new URL(e.request.url);
if(e.request.method==='POST'&&u.pathname.endsWith('/share-target')){
e.respondWith((async()=>{
try{const fd=await e.request.formData();const f=fd.get('chat');let text='',name='';
if(f&&f.text){text=await f.text();name=f.name||''}else{text=String(fd.get('text')||'');name=String(fd.get('title')||'')}
const c=await caches.open('rt-share');
await c.put(new URL('shared-latest',self.registration.scope).href,new Response(text,{headers:{'X-Name':encodeURIComponent(name)}}));
}catch(err){}
return Response.redirect(new URL('./?shared=1',self.registration.scope).href,303)})());return}
if(e.request.method==='GET')e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
