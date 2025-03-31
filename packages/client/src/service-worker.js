// Minimal service worker to enable PWA installation
self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", () => {
  clients.claim()
})

// Minimal fetch handler - just to have the required service worker functionality
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request))
})
