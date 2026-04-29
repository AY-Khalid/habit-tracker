// Name our cache — change version to force update
const CACHE_NAME = 'habit-tracker-v1';

// Files to cache on install
const APP_SHELL = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/manifest.json',
];

// ── Install Event ─────────────────────────────
// Runs when service worker is first installed
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      // Add all files to cache
      // Use individual try/catch so one failure 
      // doesn't break everything
      return Promise.allSettled(
        APP_SHELL.map((url) => cache.add(url).catch((err) => {
          console.warn('[SW] Failed to cache:', url, err);
        }))
      );
    })
  );
  // Take control immediately
  self.skipWaiting();
});

// ── Activate Event ────────────────────────────
// Runs when service worker takes over
// Clean up old caches here
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// ── Fetch Event ───────────────────────────────
// Runs on every network request
// Cache-first strategy: serve from cache,
// fall back to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Serve from cache
        return cached;
      }

      // Not in cache — try network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the new response for next time
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed — return offline fallback
          // for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});