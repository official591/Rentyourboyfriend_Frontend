// COMPANION PWA Service Worker — Browser Cache & Fast Static Asset Delivery
const CACHE_NAME = "companion-static-v1";
const IMAGE_CACHE = "companion-images-v1";

const PRECACHE_ASSETS = [
  "/",
  "/peeps/all-peeps.png",
  "/images/hero-genz-vibe.jpg",
  "/images/portrait-maya.jpg",
  "/images/portrait-arjun.jpg",
  "/images/portrait-priya.jpg",
  "/images/portrait-rohan.jpg",
  "/images/portrait-ananya.jpg",
  "/images/portrait-vikram.jpg",
];

// Install: pre-cache primary visual assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(IMAGE_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS).catch((err) => console.warn("Pre-cache warning:", err)))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== IMAGE_CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: smart caching strategies
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never intercept non-GET, internal dev-server HMR, or critical API routes (payments, verify, auth)
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api/verify-payment") ||
    url.pathname.startsWith("/api/create-order") ||
    url.pathname.startsWith("/api/webhooks") ||
    url.pathname.includes("/_next/webpack-hmr")
  ) {
    return;
  }

  // 1. Cache-first strategy for static images and illustrations
  if (
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/peeps/") ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return cachedResponse || new Response("Image not available offline", { status: 503 });
        }
      })
    );
    return;
  }

  // 2. Stale-While-Revalidate for Next.js static script/css chunks
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: network-first with cache fallback for navigation
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        return cached || (await cache.match("/"));
      })
    );
  }
});

