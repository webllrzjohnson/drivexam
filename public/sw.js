const CACHE_VERSION = "drivexam-pwa-v1";
const OFFLINE_URL = "/offline";
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
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

function isProtectedPath(pathname) {
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix.replace(/\/$/, "") || pathname.startsWith(prefix));
}

function isStaticAsset(pathname) {
  return STATIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) && STATIC_FILE_PATTERN.test(pathname);
}

async function networkNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    return (await caches.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirstStaticAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cacheControl = response.headers.get("cache-control") || "";
  if (response.ok && response.type === "basic" && !/private|no-store/i.test(cacheControl)) {
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