const CACHE_NAME = "pasieka-finalboss-v7";

// 🔥 pliki do cache (DODAJ SWOJE jeśli masz więcej)
const urlsToCache = [
  "/",
  "index.html",
  "manifest.json",
  "bee_icon_192x192.png",
  "bee_icon_512x512.png"
];

// =========================
// 📦 INSTALL
// =========================
self.addEventListener("install", event => {
  self.skipWaiting(); // 🔥 natychmiastowa aktywacja

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// =========================
// 🔄 ACTIVATE
// =========================
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

  self.clients.claim(); // 🔥 przejmij kontrolę od razu
});

// =========================
// 🌐 FETCH (OFFLINE FIRST)
// =========================
self.addEventListener("fetch", event => {

  // 🔥 ignoruj API pogody (żeby nie blokowało offline)
  if (event.request.url.includes("open-meteo.com")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({
          current_weather: {
            temperature: 0,
            windspeed: 0,
            weathercode: 0
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {

      // 🔥 jeśli jest w cache → bierz
      if (cached) return cached;

      // 🔥 jeśli nie → pobierz i zapisz
      return fetch(event.request)
        .then(response => {

          // klon do cache
          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clone));

          return response;
        })
        .catch(() => {
          // 🔥 offline fallback
          return caches.match("index.html");
        });
    })
  );
});