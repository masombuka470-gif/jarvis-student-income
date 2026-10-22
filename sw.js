const CACHE_NAME = "jarvis-student-income-v1";

const APP_FILES = [
"./",
"./index.html",
"./manifest.json",
"./icon.svg"
];

// Install: save essential app files for offline use.
self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(APP_FILES);
})
);

self.skipWaiting();
});

// Activate: remove old JARVIS caches.
self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames
.filter((name) => name.startsWith("jarvis-student-income-") && name !== CACHE_NAME)
.map((name) => caches.delete(name))
);
})
);

self.clients.claim();
});

// Fetch: use cached files when offline.
self.addEventListener("fetch", (event) => {
if (event.request.method !== "GET") return;

const url = new URL(event.request.url);

if (url.origin !== self.location.origin) return;

event.respondWith(
caches.match(event.request).then((cachedResponse) => {
if (cachedResponse) {
return cachedResponse;
}

  return fetch(event.request).then((response) => {
    if (response.ok && response.type === "basic") {
      const responseToCache = response.clone();

      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, responseToCache);
      });
    }

    return response;
  });
})

);
});
