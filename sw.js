/* sw.js -- Service Worker for Surayt Learn PWA */
var CACHE_NAME = 'surayt-v1';
var STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/main.css',
  'css/version-a.css',
  'css/exercises.css',
  'css/version-b.css',
  'css/recorder.css',
  'css/grammar-chat.css',
  'css/script-tab.css',
  'js/api.js',
  'js/data.js',
  'js/data-alphabet.js',
  'js/data-phrases.js',
  'js/data-loader.js',
  'js/vfx.js',
  'js/exercise-types.js',
  'js/version-a.js',
  'js/version-b.js',
  'js/grammar.js',
  'js/conv-data.js',
  'js/conversations.js',
  'js/recorder-ui.js',
  'js/recorder.js',
  'js/script-tab.js',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; })
          .map(function (n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  // Network-first for API calls
  if (url.hostname === 'run8n.xyz') {
    e.respondWith(
      fetch(e.request).then(function (res) {
        var clone = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(e.request, clone); });
        return res;
      }).catch(function () {
        return caches.match(e.request);
      })
    );
    return;
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request);
    })
  );
});
