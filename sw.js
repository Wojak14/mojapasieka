const CACHE_NAME = "pasieka-finalboss-v13";

// ========================================
// PLIKI OFFLINE
// ========================================

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",

  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// ========================================
// INSTALL
// ========================================

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return Promise.all(

          STATIC_ASSETS.map(asset => {

            return fetch(asset)
              .then(response => {

   if(response.ok){

  return cache.put(
    asset,
    response.clone()
  );
})
              .catch(() => {});
          })
        );
      })
  );

  self.skipWaiting();
});

// ========================================
// ACTIVATE
// ========================================

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys.map(key => {

          if(key !== CACHE_NAME){
            return caches.delete(key);
          }

        })
      );
    })
  );

  self.clients.claim();
});

// ========================================
// FETCH
// ========================================

self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request)

      .then(cached => {

        if(cached){
          return cached;
        }

        return fetch(event.request)

          .then(response => {

            if(
              !response ||
              response.status !== 200
            ){
              return response;
            }

            const responseClone =
              response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {

                cache.put(
                  event.request,
                  responseClone
                );

              });

            return response;

          })

          .catch(() => {

            // OFFLINE FALLBACK
            if(
              event.request.headers
              .get("accept")
              ?.includes("text/html")
            ){

            return caches.match("/index.html")
  || caches.match("./index.html")
  || caches.match("/");
            }

          });

      })
  );

});