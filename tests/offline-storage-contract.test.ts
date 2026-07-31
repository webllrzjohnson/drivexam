import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const storagePath = path.join(process.cwd(), "src", "lib", "learner", "offline-storage.ts");

describe("offline browser storage contract", () => {
  it("uses versioned IndexedDB stores for one pack and queued attempts", async () => {
    const source = await fs.readFile(storagePath, "utf8");

    assert.match(source, /indexedDB\.open\(OFFLINE_DB_NAME, OFFLINE_DB_VERSION\)/);
    assert.match(source, /createObjectStore\(PACK_STORE/);
    assert.match(source, /createObjectStore\(ATTEMPT_STORE/);
    assert.match(source, /createIndex\("status", "status"/);
    assert.doesNotMatch(source, /localStorage|sessionStorage/);
  });

  it("supports loading, replacing, and clearing the pack plus attempt status updates", async () => {
    const source = await fs.readFile(storagePath, "utf8");

    for (const functionName of ["getOfflinePack", "putOfflinePack", "clearOfflinePack", "getOfflineAttempts", "putOfflineAttempt", "updateOfflineAttemptStatus"]) {
      assert.match(source, new RegExp(`export (?:async )?function ${functionName}`));
    }
  });
});
