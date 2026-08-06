const CACHE_NAME = 'zaktech-erp-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // RÉSEAU D'ABORD : toujours essayer de récupérer la dernière version en ligne.
  // Le cache ne sert que de secours si l'appareil est hors connexion.
  event.respondWith(
    fetch(event.request).then((res) => {
      if (event.request.url.startsWith(self.location.origin)) {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
      }
      return res;
    }).catch(() => caches.match(event.request))
  );
});
