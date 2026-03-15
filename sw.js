const CACHE_NAME = "pasieka-2026-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png",
  "./style.css",
  "./app.js",
  "./script-weather.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;

  if(req.url.includes("api.open-meteo.com")){
    e.respondWith(
      fetch(req).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => caches.match("./index.html")))
  );
});