const CACHE_VERSION = "drivexam-pwa-v2";
const OFFLINE_URL = "/offline";
const OFFLINE_PRACTICE_URL = "/offline-practice";
const MAX_OFFLINE_RESOURCE_URLS = 300;
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon.svg",
];
const PROTECTED_PATH_PREFIXES = ["/api/", "/admin", "/account", "/dashboard", "/sign-in", "/sign-up"];
const STATIC_PATH_PREFIXES = ["/_next/static/", "/icons/", "/uploads/"];
const STATIC_FILE_PATTERN = /\.(?:css|js|woff2?|png|jpe?g|webp|svg|ico)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("drivexam-pwa-") && key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  if (event.data?.type === "CACHE_OFFLINE_RESOURCES") {
    event.waitUntil(
      cacheOfflineResources(event.data.urls).then((result) => event.ports[0]?.postMessage(result)),
    );
  }
});

function isProtectedPath(pathname) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix.replace(/\/$/, "") || pathname.startsWith(prefix));
}

function isStaticAsset(pathname) {
  return STATIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && STATIC_FILE_PATTERN.test(pathname);
}

function isOfflineResource(url) {
  return url.origin === self.location.origin && (url.pathname === OFFLINE_PRACTICE_URL || isStaticAsset(url.pathname));
}

function canCacheResponse(response) {
  const cacheControl = response.headers.get("cache-control") || "";
  return response.ok && response.type === "basic" && !/private|no-store/i.test(cacheControl);
}

async function cacheOfflineResources(rawUrls) {
  const urls = Array.isArray(rawUrls) ? rawUrls.slice(0, MAX_OFFLINE_RESOURCE_URLS) : [];
  const cache = await caches.open(CACHE_VERSION);
  let cachedCount = 0;
  let failedCount = 0;

  await Promise.all(urls.map(async (rawUrl) => {
    try {
      const url = new URL(rawUrl, self.location.origin);
      if (!isOfflineResource(url)) {
        failedCount += 1;
        return;
      }
      const request = new Request(url.href, { credentials: "same-origin" });
      const response = await fetch(request);
      if (!canCacheResponse(response)) {
        failedCount += 1;
        return;
      }
      const cacheKey = url.pathname === OFFLINE_PRACTICE_URL ? OFFLINE_PRACTICE_URL : request;
      await cache.put(cacheKey, response.clone());
      cachedCount += 1;
    } catch {
      failedCount += 1;
    }
  }));

  return { cachedCount, failedCount };
}

async function networkNavigation(request) {
  const url = new URL(request.url);
  try {
    const response = await fetch(request);
    if (url.pathname === OFFLINE_PRACTICE_URL && canCacheResponse(response)) {
      const cache = await caches.open(CACHE_VERSION);
      await cache.put(OFFLINE_PRACTICE_URL, response.clone());
    }
    return response;
  } catch {
    if (url.pathname === OFFLINE_PRACTICE_URL) {
      const offlinePractice = await caches.match(OFFLINE_PRACTICE_URL);
      if (offlinePractice) return offlinePractice;
    }
    return (await caches.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirstStaticAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (canCacheResponse(response)) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isProtectedPath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkNavigation(request));
    return;
  }

  if (isStaticAsset(url.pathname)) event.respondWith(cacheFirstStaticAsset(request));
});