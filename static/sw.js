// Service worker with automatic version checking and updates
const BASE_PATH = '/draix-garden';
const CACHE_PREFIX = 'garden-tracker-v';
let CURRENT_VERSION = null;

// Immediately take control of all clients
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new version');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new version');
  event.waitUntil(
    (async () => {
      // Take control of all clients immediately
      await self.clients.claim();
      
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name.startsWith(CACHE_PREFIX) && name !== getCacheName())
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
      
      console.log('[SW] Activation complete');
    })()
  );
});

// Fetch the current version
async function getCurrentVersion() {
  if (CURRENT_VERSION) return CURRENT_VERSION;
  
  try {
    const response = await fetch(`${BASE_PATH}/_app/version.json`, {
      cache: 'no-cache'
    });
    const data = await response.json();
    CURRENT_VERSION = data.version;
    console.log('[SW] Current version:', CURRENT_VERSION);
    return CURRENT_VERSION;
  } catch (error) {
    console.error('[SW] Failed to fetch version:', error);
    return Date.now().toString();
  }
}

function getCacheName() {
  return `${CACHE_PREFIX}${CURRENT_VERSION || 'unknown'}`;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Always bypass cache for API calls
  if (url.hostname.includes('api.openai.com') || url.pathname.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Network-first strategy for HTML pages and app resources
  // This ensures we always get the latest version when online
  if (request.method === 'GET') {
    event.respondWith(
      (async () => {
        try {
          // Check version before serving any request
          await getCurrentVersion();
          
          // Try network first
          const networkResponse = await fetch(request, {
            cache: 'no-cache'
          });
          
          // Cache the response if successful
          if (networkResponse.ok) {
            const cache = await caches.open(getCacheName());
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // If network fails, try cache
          console.log('[SW] Network failed, trying cache:', request.url);
          const cachedResponse = await caches.match(request);
          
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If no cache, return error response
          return new Response('Offline and no cached version available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
      })()
    );
  }
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_VERSION') {
    console.log('[SW] Checking for new version');
    event.waitUntil(
      (async () => {
        const version = await getCurrentVersion();
        event.ports[0].postMessage({ version });
      })()
    );
  }
});

