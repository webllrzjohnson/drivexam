import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");
const manifestPath = path.join(publicDir, "manifest.webmanifest");

type WebManifest = {
  name?: string;
  short_name?: string;
  description?: string;
  start_url?: string;
  scope?: string;
  display?: string;
  background_color?: string;
  theme_color?: string;
  icons?: Array<{ src?: string; sizes?: string; type?: string; purpose?: string }>;
};

async function readManifest() {
  return JSON.parse(await readFile(manifestPath, "utf8")) as WebManifest;
}

describe("PWA install manifest", () => {
  it("ships a public manifest with installable app basics", async () => {
    const manifest = await readManifest();

    assert.equal(manifest.name, "drivexam");
    assert.equal(manifest.short_name, "drivexam");
    assert.equal(manifest.start_url, "/");
    assert.equal(manifest.scope, "/");
    assert.equal(manifest.display, "standalone");
    assert.equal(manifest.background_color, "#ffffff");
    assert.equal(manifest.theme_color, "#14532d");
    assert.match(manifest.description ?? "", /Ontario/i);
  });

  it("declares required install icons that exist under public", async () => {
    const manifest = await readManifest();
    const icons = manifest.icons ?? [];

    for (const size of ["192x192", "512x512"]) {
      const icon = icons.find((entry) => entry.sizes === size && entry.type === "image/png");
      assert.ok(icon?.src, `Expected ${size} PNG icon in manifest`);
      assert.equal(existsSync(path.join(publicDir, icon.src.replace(/^\//, ""))), true, `${icon.src} should exist`);
    }
  });

  it("includes a maskable icon for Android install surfaces", async () => {
    const manifest = await readManifest();

    assert.ok((manifest.icons ?? []).some((icon) => icon.sizes === "512x512" && icon.purpose?.includes("maskable")));
  });
});
