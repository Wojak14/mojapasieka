const CACHE_NAME = "pasieka-2026-v7";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",

  // 🔥 CORE APP
  "./app.js",
  "./script.js",
  "./style.css",

  // 🔥 IKONY (minimum + stabilność Android)
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// =========================
// INSTALL
// =========================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  // 🔥 natychmiastowa aktywacja (ważne dla Android)
  self.skipWaiting();
});

// =========================
// ACTIVATE (clean old cache)
// =========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  // 🔥 przejęcie kontroli bez restartu
  self.clients.claim();
});

// =========================
// FETCH STRATEGY
// =========================
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // =========================
  // 🌦 OPEN-METEO (network first)
  // =========================
  if (url.includes("open-meteo.com")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // =========================
  // 📦 APP FILES (cache first)
  // =========================
  event.respondWith(cacheFirst(event.request));
});

// =========================
// CACHE FIRST (UI offline)
// =========================
async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) return cached;

  try {
    const response = await fetch(request);

    // 🔥 tylko poprawne response cache’ujemy
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (e) {
    return caches.match("./index.html");
  }
}

// =========================
// NETWORK FIRST (API)
// =========================
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());

    return response;
  } catch (e) {
    return caches.match(request);
  }
}