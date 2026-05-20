const CACHE_NAME = "pasieka-finalboss-v10";

// ========================================
// STATIC FILES
// ========================================
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",

  "./style.css",
  "./app.js",
  "./script.js",

  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ========================================
// INSTALL
// ========================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );

  self.skipWaiting();
});

// ========================================
// ACTIVATE
// ========================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ========================================
// FETCH
// ========================================
self.addEventListener("fetch", (event) => {

  // tylko GET
  if (event.request.method !== "GET") return;

  const requestURL = new URL(event.request.url);

  // ========================================
  // OPEN-METEO API
  // ========================================
  if (requestURL.hostname.includes("open-meteo.com")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // ========================================
  // HTML
  // ========================================
  if (event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // ========================================
  // CSS / JS / IMG
  // ========================================
  event.respondWith(cacheFirst(event.request));
});

// ========================================
// CACHE FIRST
// ========================================
async function cacheFirst(request) {

  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {

    const response = await fetch(request);

    if (
      response &&
      response.status === 200 &&
      response.type === "basic"
    ) {

      const cache = await caches.open(CACHE_NAME);

      cache.put(request, response.clone());
    }

    return response;

  } catch (error) {

    // fallback offline
    return caches.match("./index.html");
  }
}

// ========================================
// NETWORK FIRST
// ========================================
async function networkFirst(request) {

  try {

    const response = await fetch(request);

    const cache = await caches.open(CACHE_NAME);

    cache.put(request, response.clone());

    return response;

  } catch (error) {

    const cached = await caches.match(request);

    return cached;
  }
}

// ========================================
// STALE WHILE REVALIDATE
// ========================================
async function staleWhileRevalidate(request) {

  const cache = await caches.open(CACHE_NAME);

  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {

      if (
        response &&
        response.status === 200
      ) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => {});

  return cached || networkFetch;
}