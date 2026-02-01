const CACHE_NAME = "money-manager-v1";
const ASSETS_TO_CACHE = ["/", "/index.html", "/manifest.json"];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.log("Cache addAll error:", err);
        // Don't let cache errors break the install
      });
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - network first with cache fallback
self.addEventListener("fetch", (event) => {
  // Don't cache POST requests or GraphQL queries
  if (event.request.method !== "GET") {
    return;
  }

  // Skip caching for dev server requests and source files
  const url = new URL(event.request.url);
  if (
    url.hostname === "localhost" &&
    (url.port === "5173" || // Vite dev server
      url.pathname.includes(".tsx") ||
      url.pathname.includes(".ts") ||
      url.pathname.includes("/src/") ||
      url.pathname.includes("/@"))
  ) {
    return;
  }

  // Skip caching API requests
  if (url.pathname.includes("/graphql")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Return cached version if network fails
        return caches.match(event.request).then((response) => {
          return response || new Response("Offline - page not cached");
        });
      }),
  );
});
