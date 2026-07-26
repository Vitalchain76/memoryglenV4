/**
 * MemoryGlen service worker — offline shell only.
 *
 * Deliberately conservative. A memorial is not a news site: showing someone a
 * stale version of their mother's page, or a cached page that has since been
 * made private, would be worse than showing nothing. So:
 *
 *   - Navigations are NETWORK FIRST. The offline shell appears only when the
 *     network genuinely fails.
 *   - Static assets are cache-first, because hashed filenames make them safe.
 *   - Nothing from Supabase, no API responses, and no HTML for a specific
 *     memorial is cached beyond the current session.
 */
const VERSION = 'memoryglen-v1';
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll([OFFLINE_URL, '/icon-192.png'])),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache anything that could be private or user-specific.
  if (url.pathname.startsWith('/account') || url.pathname.startsWith('/signin')) return;

  // Navigations: network first, offline shell as the last resort.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r ?? Response.error()),
      ),
    );
    return;
  }

  // Hashed build assets and images: cache first, they cannot go stale.
  if (/\.(js|css|woff2?|png|jpe?g|svg|webp|mp3|ogg)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(ASSETS).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
  }
});
