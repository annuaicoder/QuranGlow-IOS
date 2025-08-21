// Service Worker for QuranGlow PWA
const CACHE_NAME = 'quranglow-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/quran.html',
  '/about.html',
  '/icon.png',
  '/splash.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Reminder from QuranGlow',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'QuranGlow',
      options
    )
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
