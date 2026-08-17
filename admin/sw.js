/* MazingiraKenya Admin — service worker.
   Network-first for navigations (an internal tool should always load the latest deploy),
   cache-first for static assets, offline fallback to the app shell. Bump CACHE to force update. */
const CACHE = "admin-v13";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).catch(function(){}).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(e){
  var req=e.request; if(req.method!=="GET") return;
  var url=new URL(req.url);
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).then(function(r){ var copy=r.clone(); caches.open(CACHE).then(function(c){ c.put("./index.html", copy); }); return r; })
      .catch(function(){ return caches.match("./index.html"); }));
    return;
  }
  if(url.origin===self.location.origin){
    e.respondWith(caches.match(req).then(function(cached){
      return cached || fetch(req).then(function(resp){ if(resp&&resp.ok){ var copy=resp.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); } return resp; }).catch(function(){ return cached; });
    }));
  }
});
