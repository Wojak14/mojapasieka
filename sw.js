const CACHE_NAME = "pasieka-v2";

// 📦 pliki do cache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",

  // 🔥 IKONY
  "/icons/icon-128.png",
  "/icons/icon-192.png",
  "/icons/icon-256.png",
  "/icons/icon-512.png"
];

// =========================
// 📦 INSTALL
// =========================
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// =========================
// 🚀 ACTIVATE
// =========================
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

// =========================
// 🌐 FETCH (OFFLINE + API)
// =========================
self.addEventListener("fetch", e => {

  const req = e.request;

  // 🔥 API (Open-Meteo) — network first + cache
  if (req.url.includes("api.open-meteo.com")) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 🔥 NORMALNE PLIKI — cache first
  e.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req).catch(() => caches.match("/index.html"));
    })
  );
});