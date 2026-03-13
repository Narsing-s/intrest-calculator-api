/* Simple App-Shell service worker */
const CACHE_NAME = "interest-calculator-v1";
const APP_SHELL = [
  "/",                       // root
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
  // If you later move CSS/JS to separate files, list them here too (e.g., /style.css, /app.js)
];

// On install: pre-cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// On activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Strategy:
// - For navigation & static shell → cache-first (fast/offline)
// - For API calls (/api/*) → network-first, fallback to cache (if any)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // API: network-first to keep results fresh
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Navigation & static: cache-first
  if (req.mode === "navigate" || APP_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          return res;
        })
      )
    );
    return;
  }
});
