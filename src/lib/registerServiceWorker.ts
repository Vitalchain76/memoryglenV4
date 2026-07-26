/**
 * Registers the service worker in production only.
 *
 * Kept out of development deliberately: a service worker caching assets during
 * development is a reliable way to spend an afternoon debugging a change that
 * already shipped.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Registration failing must never affect the site. Offline support is a
      // bonus; the memorial working is not.
    });
  });
}
