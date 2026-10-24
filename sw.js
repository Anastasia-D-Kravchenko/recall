// Recall offline worker: the app shell is cached so the site opens without a connection.
// Pages are fetched fresh when online; Neon calls are never cached (the app keeps its own data in IndexedDB).
const CACHE = "recall-v6";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  const fonts = url.host.endsWith("gstatic.com") || url.host.endsWith("googleapis.com") || url.host === "cdnjs.cloudflare.com";
  if (e.request.method !== "GET" || (url.origin !== location.origin && !fonts)) return;
  if (url.origin === location.origin && (url.pathname.endsWith("/") || url.pathname.endsWith(".html"))) {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })));
});
