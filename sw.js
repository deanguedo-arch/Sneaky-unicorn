/* Sneaky Unicorn v15. Only this app's cache is managed here. */
const VERSION='15.0.0';
const ROOT=new URL(self.registration.scope);
const PREFIX='sneaky-unicorn-scope-'+encodeURIComponent(ROOT.pathname)+'-';
const CACHE=PREFIX+VERSION;
const INDEX=new URL('index.html',ROOT).href;
const APP=['index.html','manifest.webmanifest','icons/apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&(k.startsWith(PREFIX)||/^sneaky-unicorn-v[1-9]$/.test(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);if(req.mode==='navigate'){try{const response=await fetch(req);if(response.ok){await cache.put(INDEX,response.clone());return response;}}catch(_){}return await cache.match(INDEX)||new Response('Open this game once while online to prepare it for offline play.',{status:503,headers:{'Content-Type':'text/plain'}});}const cached=await cache.match(req);if(cached)return cached;try{const response=await fetch(req);if(response.ok&&APP.includes(url.href))await cache.put(req,response.clone());return response;}catch(_){return new Response('',{status:503});}})());});
self.addEventListener('message',event=>{if(event.data?.type!=='APP_STATUS')return;event.waitUntil(caches.open(CACHE).then(cache=>cache.match(INDEX)).then(cached=>event.ports[0]?.postMessage({version:VERSION,cached:!!cached})));});
