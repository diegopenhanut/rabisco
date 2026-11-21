const C="rabisco-v1";
const CORE=["./","index.html","manifest.webmanifest","icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  const cacheable=u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)||/(esm\.run|cdn\.jsdelivr\.net)$/.test(u.hostname);
  if(!cacheable)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==="navigate"?caches.match("index.html"):Response.error()))));
});
