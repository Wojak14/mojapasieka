/**
 * 🐝 FINAL BOSS SERVICE WORKER v14 (STABLE OFFLINE FIX)
 */

const CACHE_NAME = "pasieka-finalboss-v14";

/* =========================
   📦 STATIC FILES
========================= */

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",

  "./core/main.js",
  "./core/orchestrator.js",
  "./core/calendar-generator.js",
  "./core/bee-data.js",
  "./core/dashboard.js",
  "./core/quickPanel.js",

  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/* =========================
   🚀 INSTALL
========================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      for (const asset of STATIC_ASSETS) {
        try {
          const res = await fetch(asset, { cache: "reload" });

          if (res && res.ok) {
            await cache.put(asset, res.clone());
          }
        } catch (e) {
          console.warn("❌ CACHE MISS:", asset);
        }
      }

      await self.skipWaiting();
    })()
  );
});

/* =========================
   🔁 ACTIVATE (CLEAN OLD CACHE)
========================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith("pasieka-finalboss")) {
            return caches.delete(key);
          }
        })
      );

      await self.clients.claim();
    })()
  );
});

/* =========================
   🌐 FETCH STRATEGY
========================= */

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = event.request.url;

  // ❌ NIE CACHEUJ API (pogoda, GPS, itp.)
  if (url.includes("open-meteo") || url.includes("nominatim")) {
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);

        // cache tylko poprawnych odpowiedzi
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }

        return response;
      } catch (err) {
        // OFFLINE FALLBACK (HTML)
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("OFFLINE", { status: 503 });
      }
    })()
  );
});