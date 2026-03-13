const CACHE_NAME = "pasieka-2026-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Instalacja SW i cache'owanie zasobów
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktywacja SW
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Obsługa fetch – najpierw cache, potem sieć, fallback do index.html
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() =>
        caches.match("./index.html")
      );
    })
  );
});