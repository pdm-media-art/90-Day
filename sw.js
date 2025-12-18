// sw.js – Service Worker für 90-Day PWA

const CACHE_NAME = "diabetes90-cache-v1";

// Alle wichtigen Dateien DEINER GitHub-Pages-URL cachen:
// https://pdm-media-art.github.io/90-Day/
const ASSETS = [
  "/90-Day/",
  "/90-Day/index.html",
  "/90-Day/manifest.json",
  // Falls du Icons hast – sonst nicht schlimm, sie werden einfach nicht gefunden
  "/90-Day/icons/icon-192.png",
  "/90-Day/icons/icon-512.png"
];

// Install: Assets in den Cache legen
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: alte Caches aufräumen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: zuerst Cache, dann Netzwerk
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Nur GET-Anfragen cachen
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).catch(() =>
        // Fallback: wenn offline und index fehlt, versuche Startseite
        caches.match("/90-Day/index.html")
      );
    })
  );
});
