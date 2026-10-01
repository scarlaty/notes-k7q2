/* Service worker : site disponible hors ligne */
const APP = 'app-v1', TILES = 'tiles-v1', EXT = 'ext-v1';
const APP_FILES = ['./', 'index.html', 'data.js', 'data2.js', 'app.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
const EXT_FILES = [
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    await (await caches.open(APP)).addAll(APP_FILES);
    const ext = await caches.open(EXT);
    await Promise.all(EXT_FILES.map(async u => { try { const r = await fetch(u, {mode: 'cors'}); if (r.ok) await ext.put(u, r); } catch (_) {} }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('app-') && k !== APP) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Ne met en cache que des réponses fiables (pas de portail Wi-Fi captif)
const good = r => r && r.ok && !r.redirected && (r.type === 'basic' || r.type === 'cors' || r.type === 'default');

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Tuiles de carte : cache d'abord
  if (url.hostname === 'tile.openstreetmap.org') {
    e.respondWith((async () => {
      const c = await caches.open(TILES);
      const hit = await c.match(req.url, {ignoreVary: true});
      if (hit) return hit;
      try { const r = await fetch(req); if (good(r)) c.put(req.url, r.clone()); return r; }
      catch (_) { return new Response('', {status: 504}); }
    })());
    return;
  }

  // Bibliothèques et polices : cache d'abord
  if (/(^|\.)cdnjs\.cloudflare\.com$|fonts\.googleapis\.com$|fonts\.gstatic\.com$/.test(url.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(EXT);
      const hit = await c.match(req.url, {ignoreVary: true});
      if (hit) return hit;
      try { const r = await fetch(req); if (good(r)) c.put(req.url, r.clone()); return r; }
      catch (_) { return new Response('', {status: 504}); }
    })());
    return;
  }

  // Fichiers du site : réponse immédiate depuis le cache, mise à jour en arrière-plan
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(APP);
      const key = req.mode === 'navigate' ? 'index.html' : req;
      const hit = await c.match(key, {ignoreSearch: true});
      const net = fetch(req).then(r => { if (good(r)) c.put(key, r.clone()); return r; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      return (await net) || new Response('Hors ligne', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    })());
  }
});
