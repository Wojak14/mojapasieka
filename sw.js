const CACHE_NAME = "pasieka-2026-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png"
];

// Instalacja
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktywacja + czyszczenie starego cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() =>
        caches.match("./index.html")
      );
    })
  );
});