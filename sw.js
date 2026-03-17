onst CACHE_NAME = "pasieka-2026-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bee_icon_192x192.png",
  "./bee_icon_512x512.png",
  "./style.css",
  "./app.js",
  "./script-weather.js"
];


// ================= INSTALL =================
self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
      .catch(err => {
        console.log("Błąd cache install:", err);
      })
  );

  self.skipWaiting();

});


// ================= ACTIVATE =================
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );

    })

  );

  self.clients.claim();

});


// ================= FETCH =================
self.addEventListener("fetch", event => {

  const request = event.request;


  // ===== API pogody =====
  if (request.url.includes("api.open-meteo.com")) {

    event.respondWith(

      fetch(request)
        .then(response => {

          const clone = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, clone));

          return response;

        })
        .catch(() => caches.match(request))

    );

    return;
  }


  // ===== RESZTA PLIKÓW =====
  event.respondWith(

    caches.match(request)
      .then(cached => {

        if (cached) return cached;

        return fetch(request)
          .then(response => {

            if (!response || response.status !== 200 || response.type !== "basic") {
              return response;
            }

            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, clone));

            return response;

          });

      })
      .catch(() => caches.match("./index.html"))

  );

});