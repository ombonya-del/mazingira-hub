/* MazingiraKenya · Raia — service worker
   Offline-first for a low-bandwidth public audience. Bump CACHE to force an update.
   Note: privacy.html is a real static page — it is served directly, never via
   the app shell (see the navigate handler's denylist). */
const CACHE = "raia-v17";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-192.png", "./icon-512.png"
];
const DENYLIST = [/privacy\.html$/];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL.filter(Boolean)); })
      .catch(function(){})
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

  /* Static pages that must bypass the SPA shell (privacy, viewers) go to the network. */
  if(DENYLIST.some(function(re){ return re.test(url.pathname); })) return;

  /* App navigations: cache-first on the shell so it opens instantly and works offline,
     then refresh in the background. */
  if(req.mode === "navigate"){
    e.respondWith(
      caches.match("./index.html").then(function(cached){
        var net = fetch(req).then(function(r){
          var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put("./index.html", copy); });
          return r;
        }).catch(function(){ return cached; });
        return cached || net;
      })
    );
    return;
  }

  /* Same-origin assets: cache-first, then network. */
  if(url.origin === self.location.origin){
    e.respondWith(
      caches.match(req).then(function(cached){
        return cached || fetch(req).then(function(resp){
          if(resp && resp.ok){ var copy=resp.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
          return resp;
        }).catch(function(){ return cached; });
      })
    );
  }
  /* Cross-origin (Google Fonts) go straight to the network. */
});
