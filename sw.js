const CACHE_NAME = "pasieka-2026-final";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png"
];

// INSTALL
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", e => {

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  e.respondWith(
  self.addEventListener("fetch", e => {

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

if (e.request.url.includes("api.open-meteo.com")) {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
  return;
}

  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(response => {

        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));

        return response;
      });
    })
  );
});