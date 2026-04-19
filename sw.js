const CACHE_NAME = "pasieka-2026-v6";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",

  // 🔥 DODAJ SWOJE PLIKI
  "./app.js",
  "./script.js",
  "./style.css",

  // 🔥 IKONY
  "./icons/icon-128.png",
  "./icons/icon-192.png",
  "./icons/icon-256.png",
  "./icons/icon-512.png"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (OFFLINE)
self.addEventListener("fetch", event => {

  // 🔥 API OPEN-METEO
  if (event.request.url.includes("api.open-meteo.com")) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 🔥 NORMALNE PLIKI
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});