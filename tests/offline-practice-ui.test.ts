import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

describe("offline practice UI", () => {
  it("keeps the cached route public and free of session-derived markup", async () => {
    const page = await fs.readFile(path.join(root, "src", "app", "offline-practice", "page.tsx"), "utf8");

    assert.match(page, /dynamic\s*=\s*"force-static"/);
    assert.match(page, /<OfflinePractice/);
    assert.doesNotMatch(page, /getOptionalSession|SiteHeader|cookies\(/);
  });

  it("requires an explicit pack download and exposes local storage controls", async () => {
    const component = await fs.readFile(path.join(root, "src", "components", "pwa", "offline-practice.tsx"), "utf8");

    assert.match(component, /Download offline pack/i);
    assert.match(component, /Remove downloaded pack/i);
    assert.match(component, /navigator\.storage\.persist/);
    assert.match(component, /CACHE_OFFLINE_RESOURCES/);
    assert.match(component, /getOfflinePack/);
    assert.match(component, /putOfflinePack/);
  });

  it("stores completed attempts locally and synchronizes pending work on reconnect", async () => {
    const component = await fs.readFile(path.join(root, "src", "components", "pwa", "offline-practice.tsx"), "utf8");

    assert.match(component, /putOfflineAttempt/);
    assert.match(component, /\/api\/offline-attempts/);
    assert.match(component, /addEventListener\("online"/);
    assert.match(component, /Pending sync/i);
    assert.match(component, /Saved on this device/i);
    assert.match(component, /Sign in/i);
  });

  it("keeps tested answers private from image alternatives and keyboard-reviewable after submission", async () => {
    const component = await fs.readFile(path.join(root, "src", "components", "pwa", "offline-practice.tsx"), "utf8");

    assert.doesNotMatch(component, /alt=\{title\}/);
    assert.match(component, /alt="Illustration for this question"/);
    assert.doesNotMatch(component, /<fieldset disabled=\{submitted\}/);
    assert.match(component, /aria-disabled=\{submitted\}/);
  });

  it("keeps road-sign meanings hidden until reveal and names confidence controls without leaking answers", async () => {
    const component = await fs.readFile(path.join(root, "src", "components", "road-signs", "road-sign-flashcards.tsx"), "utf8");

    assert.doesNotMatch(component, /alt=\{card\.title\}/);
    assert.doesNotMatch(component, /Reveal meaning for \$\{card\.title\}/);
    assert.match(component, /alt="Road sign to identify"/);
    assert.match(component, /aria-label=\{isFlipped \? undefined : `Reveal meaning for road sign \$\{index \+ 1\}`\}/);
    assert.match(component, /<span className="sr-only">Road sign \{index \+ 1\} meaning:<\/span>/);
    assert.match(component, /aria-pressed=\{knownPaths\.includes\(card\.path\)\}/);
    assert.match(component, /aria-pressed=\{reviewPaths\.includes\(card\.path\)\}/);
  });
});
