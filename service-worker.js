/* BEE ASSISTANT PRO / Kalendarz Pszczelarski 2027 - cache offline */
const CACHE_NAME = 'bee-assistant-pro-2027-v2';
const APP_FILE = './index.html';
const LOCAL_ASSETS = [
  './',
  APP_FILE,
  './manifest.json',
  './bee_icon_192x192.png',
  './bee_icon_512x512.png'
];
const QR_LIBRARY = 'https://cdn.jsdelivr.net/npm/davidshimjs-qrcodejs@0.0.2/qrcode.min.js';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(LOCAL_ASSETS);
    // Biblioteka QR jest pobierana podczas instalacji, aby generator działał
    // również bez internetu po pierwszym uruchomieniu online.
    try {
      const response = await fetch(QR_LIBRARY, { mode: 'no-cors', cache: 'reload' });
      if (response && (response.ok || response.type === 'opaque')) {
        await cache.put(QR_LIBRARY, response);
      }
    } catch (_) {
      // Nie blokuj instalacji aplikacji, jeśli CDN jest chwilowo niedostępny.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Dokument aplikacji: najpierw sieć, a bez internetu ostatnia zapisana wersja.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(APP_FILE, fresh.clone()).catch(() => {});
        return fresh;
      } catch (_) {
        return (await caches.match(request)) || (await caches.match(APP_FILE)) || Response.error();
      }
    })());
    return;
  }

  // Cache-first dla zasobów lokalnych i bibliotek zewnętrznych (QR/Leaflet).
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
