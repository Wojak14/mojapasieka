const CACHE_NAME = "pasieka-finalboss-v11";

// ========================================
// CACHE FILES
// ========================================
const STATIC_ASSETS = [

  "./",
  "./index.html",
  "./manifest.json",

  "./app.js",

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

                if(!response.ok){
                  throw new Error(asset);
                }

                return cache.put(asset, response);
              })

              .catch(err => {

                console.log(
                  "CACHE FAIL:",
                  asset,
                  err
                );
              });

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

  if(event.request.method !== "GET"){
    return;
  }

  // OPEN METEO
  if(
    event.request.url.includes(
      "open-meteo.com"
    )
  ){

    event.respondWith(

      networkFirst(event.request)
    );

    return;
  }

  // HTML
  if(
    event.request.headers
      .get("accept")
      ?.includes("text/html")
  ){

    event.respondWith(

      staleWhileRevalidate(
        event.request
      )
    );

    return;
  }

  // STATIC
  event.respondWith(

    cacheFirst(event.request)
  );
});

// ========================================
// CACHE FIRST
// ========================================
async function cacheFirst(request){

  const cached =
    await caches.match(request);

  if(cached){
    return cached;
  }

  try{

    const response =
      await fetch(request);

    const cache =
      await caches.open(CACHE_NAME);

    cache.put(
      request,
      response.clone()
    );

    return response;

  }catch(e){

    return caches.match("./index.html");
  }
}

// ========================================
// NETWORK FIRST
// ========================================
async function networkFirst(request){

  try{

    const response =
      await fetch(request);

    const cache =
      await caches.open(CACHE_NAME);

    cache.put(
      request,
      response.clone()
    );

    return response;

  }catch(e){

    const cached =
      await caches.match(request);

    return cached ||
      caches.match("./index.html");
  }
}

// ========================================
// STALE
// ========================================
async function staleWhileRevalidate(request){

  const cache =
    await caches.open(CACHE_NAME);

  const cached =
    await cache.match(request);

  const networkFetch = fetch(request)

    .then(response => {

      cache.put(
        request,
        response.clone()
      );

      return response;
    })

    .catch(() => null);

  return cached ||
         networkFetch ||
         caches.match("./index.html");
}