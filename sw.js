const CACHE_NAME = "pasieka-2026-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png"
];

// ================= INSTALL =================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
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

  // ===== API POGODY =====
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

  // ===== NAWIGACJA (PWA FIX) =====
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // ===== RESZTA =====
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request).then(response => {

        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));

        return response;
      });
    })
  );
});