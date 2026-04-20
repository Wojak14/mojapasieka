const CACHE_NAME = "pasieka-v2";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json"
];

// INSTALL
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

// FETCH
self.addEventListener("fetch", e => {
  const req = e.request;

  // 🔥 API (pogoda + lokalizacja)
  if (req.url.includes("api.open-meteo.com") || req.url.includes("nominatim")) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 🔥 RESZTA
  e.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req).catch(() => caches.match("/index.html"));
    })
  );
});