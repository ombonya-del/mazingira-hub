/* MazingiraKenya Communications Hub — service worker
   App-shell caching for offline + fast loads. Bump CACHE to force an update. */
const CACHE = "mazingira-hub-v57";
const SHELL = [
  "/", "/index.html", "/manifest.webmanifest",
  "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; })
        .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);

  /* Navigations: network-first so reviewers always get the latest deploy,
     fall back to the cached shell when offline. */
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(function(r){
        var copy = r.clone();
        caches.open(CACHE).then(function(c){ c.put("/index.html", copy); });
        return r;
      }).catch(function(){ return caches.match("/index.html"); })
    );
    return;
  }

  /* Same-origin assets (icons, manifest, any local data JSON): cache-first,
     then network, caching successful responses for next time. */
  if(url.origin === self.location.origin){
    e.respondWith(
      caches.match(req).then(function(cached){
        return cached || fetch(req).then(function(resp){
          if(resp && resp.ok){ var copy = resp.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
          return resp;
        }).catch(function(){ return cached; });
      })
    );
  }
  /* Cross-origin (fonts, social embeds) go straight to the network. */
});
