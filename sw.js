const CACHE_NAME="pasieka-pro-v1";
const OFFLINE_URL="index.html";
const FILES_TO_CACHE=[
  "index.html","manifest.json","service-worker.js",
  "icons/icon-128.png","icons/icon-192.png","icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js"
];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES_TO_CACHE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim();});
self.addEventListener("fetch",e=>{const url=new URL(e.request.url);if(url.hostname.includes("api.open-meteo.com")){e.respondWith(fetch(e.request).then(r=>{caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request).then(r=>r||new Response("{}"))));return;}
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match(OFFLINE_URL