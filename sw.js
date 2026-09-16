/* Sub Intel service worker — deliberately small.

   It caches the app shell only: one HTML document and the icons, about
   250KB once. That is what makes the tool installable and what makes it
   open instantly on a bad connection.

   It does NOT cache map tiles. Caching the areas a crew works would run
   to tens of megabytes on the phone, so tiles go straight to the network
   every time and the map needs signal. Everything else — the library,
   the requirements, the coordinates — is local and works without it.

   Bump VERSION on every deploy; that is what retires the old cache. */
const VERSION = 'v2.1.0';
const SHELL = 'sub-intel-shell-' + VERSION;

const SHELL_FILES = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // addAll fails the whole install if one file 404s; take them one at a time
    await Promise.all(SHELL_FILES.map(f => c.add(f).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k.startsWith('sub-intel-shell-') && k !== SHELL)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // The document: network first, so a deploy lands as soon as there is a
  // network; the cached copy is the fallback when there isn't one.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        (await caches.open(SHELL)).put('./index.html', fresh.clone());
        return fresh;
      } catch (err) {
        return (await caches.match('./index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Our own files: cache first. Tiles, fonts and anything else third-party
  // are left alone — they are never intercepted and never stored.
  if (new URL(req.url).origin === location.origin) {
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) (await caches.open(SHELL)).put(req, res.clone());
        return res;
      } catch (err) {
        return Response.error();
      }
    })());
  }
});
