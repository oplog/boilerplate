// Service Worker - PWA offline ve cache desteği
// Bu dosya uygulamanın mobilde "kurulabilir" olmasını ve hızlı açılmasını sağlar

const CACHE_NAME = "oplog-app-v2";

// Cache'lenecek temel dosyalar
const PRECACHE_URLS = [
  "/",
  "/OPLOG.png",
  "/fonts/UberMoveText-Regular.woff2",
  "/fonts/UberMoveText-Medium.woff2",
  "/fonts/UberMoveText-Bold.woff2",
];

// Service Worker kurulumu - temel dosyaları cache'le
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Hemen aktif ol, bekleme
  self.skipWaiting();
});

// Aktivasyon - eski cache'leri temizle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Tüm sekmelerde hemen aktif ol
  self.clients.claim();
});

// Fetch - Network-first stratejisi (önce ağ, başarısızsa cache)
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // API çağrılarını cache'leme, her zaman ağdan al
  if (request.url.includes("/api/")) {
    return;
  }

  // Sadece GET isteklerini cache'le
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Başarılı yanıtı cache'e kaydet
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Ağ başarısızsa cache'den sun
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Navigasyon isteklerinde ana sayfaya yönlendir (SPA)
          if (request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
