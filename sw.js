const CACHE_NAME = "pasieka-finalboss-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"
];

// Instalacja
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktywacja
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch (NAJWAŻNIEJSZE)
self.addEventListener("fetch", e => {
  const req = e.request;

  // API (pogoda)
  if (req.url.includes("api.open-meteo.com")) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // STRONY (offline fallback)
  e.respondWith(
    fetch(req)
      .then(res => res)
      .catch(() => caches.match(req).then(r => r || caches.match("/index.html")))
  );
});