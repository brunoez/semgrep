const CACHE_NAME = 'semgrep-visualizer-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/auth.md',
  '/index.md'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests and unsupported protocols (e.g. chrome-extension://, moz-extension://)
  if (event.request.method !== 'GET') {
    return;
  }

  let requestUrl;
  try {
    requestUrl = new URL(event.request.url);
  } catch {
    return;
  }

  if (!requestUrl.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache valid same-origin 200 responses
        if (response && response.status === 200 && response.type === 'basic' && requestUrl.origin === self.location.origin) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          }).catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) {
            return indexFallback;
          }
        }
        return new Response('Service Unavailable (Offline)', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
