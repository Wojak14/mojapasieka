const CACHE_NAME = "pasieka-2026-final-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./app.js",
  "./style.css",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png"
];

// ================= INSTALL =================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ================= ACTIVATE =================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ================= FETCH =================
self.addEventListener("fetch", event => {
  const request = event.request;

  // 🔹 API pogody (cache + fallback)
  if (request.url.includes("api.open-meteo.com")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 🔹 Nawigacja SPA (offline fallback do index.html)
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html")
    );
    return;
  }

  // 🔹 Reszta plików (cache first)
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));

        return response;
      }).catch(() => {
        // fallback dla obrazów i ikon
        if (request.destination === "image") {
          return caches.match("./bee_icon_192x192.png");
        }
      });
    })
  );
});