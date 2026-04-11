const CACHE_NAME = "pasieka-2026-final-v2";

// pliki do cache (tylko najważniejsze!)
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png"
];

// =======================
// 📦 INSTALL
// =======================
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// =======================
// 🔄 ACTIVATE
// =======================
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// =======================
// 🌐 FETCH (FINAL FIX)
// =======================
self.addEventListener("fetch", e => {

  const url = e.request.url;

  // 🔥 1. NIE CACHE API (GPS + POGODA MUSZĄ DZIAŁAĆ NA ŻYWO)
  if (url.includes("api.open-meteo.com")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // 🔥 2. NAVIGATION (offline fallback)
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // 🔥 3. RESZTA (cache + fallback)
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(response => {

        // tylko poprawne odpowiedzi
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));

        return response;

      }).catch(() => caches.match("./index.html"));
    })
  );

});