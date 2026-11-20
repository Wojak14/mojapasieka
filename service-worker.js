/* Pasieka PWA: bezpieczny cache plików lokalnych, bez usuwania danych użytkownika. */
const CACHE_NAME = 'bee-pasieka-offline-20261120-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './bee_icon_192x192.png', './bee_icon_512x512.png'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async url => {
      try { const response = await fetch(url, {cache:'reload'}); if(response.ok) await cache.put(url,response); }
      catch(e) { console.warn('Brak zasobu podczas instalacji:',url); }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('bee-pasieka-offline-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET') return;
  const url = new URL(request.url);
  if(url.origin !== self.location.origin) return; // API pogody, mapy i biblioteki CDN wymagają sieci
  if(request.mode === 'navigate') {
    event.respondWith((async () => {
      try { const response=await fetch(request); if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put('./index.html',response.clone());} return response; }
      catch(e) { return await caches.match('./index.html') || await caches.match('./') || Response.error(); }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached=await caches.match(request);
    if(cached) return cached;
    try { const response=await fetch(request); if(response.ok){const cache=await caches.open(CACHE_NAME);await cache.put(request,response.clone());} return response; }
    catch(e){return Response.error();}
  })());
});
