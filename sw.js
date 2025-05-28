const cacheName = 'viktor-portfolio-v1';
const cacheAssets = [
  '/',
  '/css/style.css',
  '/img/photo_me.webp',
  '/img/Screenshot 2024-08-25 at 12.38.01.webp',
  '/img/Screenshot 2024-02-19 at 22.59.46.webp',
  '/img/Screenshot 2021-06-09 at 19.33.24.webp',
  '/img/Screenshot 2020-10-12 at 21.17.34.webp',
  '/img/Screenshot 2020-09-12 at 12.01.31.webp',
  '/img/certificate-1.webp',
  '/img/certificate-2.webp',
  '/manifest.json'
];

// Call Install Event
self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
  
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event - Cache First Strategy
self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching');
  
  e.respondWith(
    caches
      .match(e.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(e.request);
      })
      .catch(() => {
        // Return offline page if both cache and network fail
        if (e.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});