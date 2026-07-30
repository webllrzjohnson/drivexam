import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function readProjectFile(relativePath: string) {
  return readFile(path.join(root, relativePath), "utf8");
}

describe("PWA service worker", () => {
  it("registers a root-scoped service worker from the application layout", async () => {
    const [layout, manager] = await Promise.all([
      readProjectFile("src/app/layout.tsx"),
      readProjectFile("src/components/pwa/pwa-manager.tsx"),
    ]);

    assert.match(layout, /<PwaManager\s*\/>/);
    assert.match(manager, /process\.env\.NODE_ENV !== "production"/);
    assert.match(manager, /navigator\.serviceWorker\.register\("\/sw\.js",\s*\{\s*scope:\s*"\/"/);
    assert.match(manager, /Update available/i);
    assert.match(manager, /if \(!updateRequested\.current\) return/);
    assert.match(manager, /updateRequested\.current = true/);
  });

  it("ships an offline fallback and precaches only the minimal public shell", async () => {
    const [worker, offlinePage] = await Promise.all([
      readProjectFile("public/sw.js"),
      readProjectFile("src/app/offline/page.tsx"),
    ]);

    assert.match(worker, /"\/offline"/);
    assert.match(worker, /"\/manifest\.webmanifest"/);
    assert.match(worker, /"\/icons\/icon-192\.png"/);
    assert.match(worker, /"\/icons\/icon-512\.png"/);
    assert.match(offlinePage, /You’re offline/i);
  });

  it("never caches mutations, authentication, API, admin, account, or dashboard requests", async () => {
    const worker = await readProjectFile("public/sw.js");

    assert.match(worker, /request\.method !== "GET"/);
    for (const protectedPrefix of ["/api/", "/admin", "/account", "/dashboard", "/sign-in", "/sign-up"]) {
      assert.ok(worker.includes(`"${protectedPrefix}"`), `Expected ${protectedPrefix} to bypass the service worker cache`);
    }
  });

  it("uses network-first navigation with an offline fallback and caches only same-origin static assets", async () => {
    const worker = await readProjectFile("public/sw.js");

    assert.match(worker, /request\.mode === "navigate"/);
    assert.match(worker, /fetch\(request\)[\s\S]*caches\.match\(OFFLINE_URL\)/);
    assert.match(worker, /url\.origin !== self\.location\.origin/);
    assert.match(worker, /STATIC_PATH_PREFIXES/);
    assert.match(worker, /STATIC_FILE_PATTERN/);
  });
});