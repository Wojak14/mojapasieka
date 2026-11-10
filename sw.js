const CACHE_NAME = "pasieka-finalboss-v12";
const APP_SCOPE = self.registration.scope;

const APP_FILES = [
  new URL("./", APP_SCOPE).href,
  new URL("index.html", APP_SCOPE).href,
  new URL("manifest.json", APP_SCOPE).href
];

// ========================================
// INSTALL
// ========================================
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    for (const url of APP_FILES) {
      try {
        const response = await fetch(url, {
          cache: "reload"
        });

        if (response.ok) {
          await cache.put(url, response);
        } else {
          console.warn("Nie zapisano:", url, response.status);
        }
      } catch (error) {
        console.warn("Błąd zapisu do cache:", url, error);
      }
    }

    self.skipWaiting();
  })());
});

// ========================================
// ACTIVATE
// ========================================
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys.map(key => {
        if (key.startsWith("pasieka-finalboss-") &&
            key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    );

    await self.clients.claim();
  })());
});

// ========================================
// FETCH
// ========================================
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Zewnętrzne API pogody
  if (url.hostname.includes("open-meteo.com")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Nie przechwytuj innych domen
  if (url.origin !== self.location.origin) return;

  // Strona HTML
  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  // Pozostałe pliki aplikacji
  event.respondWith(cacheFirst(request));
});

// ========================================
// CACHE FIRST
// ========================================
async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) return cached;

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Nie zwracaj HTML zamiast JS, CSS lub obrazka.
    return new Response("Brak połączenia i pliku w pamięci podręcznej.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }
}

// ========================================
// STRONA GŁÓWNA - NETWORK FIRST
// ========================================
async function networkFirstPage(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);

    if (cached) return cached;

    const indexUrl = new URL("index.html", APP_SCOPE);
    const savedIndex = await caches.match(indexUrl.href);

    if (savedIndex) return savedIndex;

    return new Response(
      "Kalendarz nie został jeszcze zapisany do pracy offline. Otwórz go ponownie przy dostępie do internetu.",
      {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8"
        }
      }
    );
  }
}

// ========================================
// NETWORK FIRST - API POGODY
// ========================================
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await caches.match(request);

    if (cached) return cached;

    return new Response(
      JSON.stringify({
        error: "offline",
        message: "Brak internetu. Pogoda niedostępna."
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}