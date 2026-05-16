// Self-destruct service worker.
// The site no longer uses a service worker. This kill switch retires any
// worker still installed in returning visitors' browsers: it wipes all
// caches, unregisters itself, and reloads open tabs from the network.
// Do NOT re-add a registration script for this file.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => client.navigate(client.url));
    })()
  );
});
