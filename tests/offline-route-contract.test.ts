import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();

describe("offline practice route contracts", () => {
  it("stores a user-scoped client attempt ID for idempotent synchronization", async () => {
    const schema = await fs.readFile(path.join(root, "prisma", "schema.prisma"), "utf8");
    assert.match(schema, /clientAttemptId\s+String\?/);
    assert.match(schema, /@@unique\(\[userId, clientAttemptId\]\)/);
    assert.match(schema, /publicId\s+String\s+@unique\s+@default\(cuid\(\)\)/);
    assert.match(schema, /questionId\s+String\?/);
    assert.match(schema, /question\s+Question\?\s+@relation\([^\n]+onDelete:\s*SetNull\)/);
  });

  it("ships separate public-pack and authenticated-sync handlers", async () => {
    const packRoute = await fs.readFile(path.join(root, "src", "app", "api", "offline-pack", "route.ts"), "utf8");
    const syncRoute = await fs.readFile(path.join(root, "src", "app", "api", "offline-attempts", "route.ts"), "utf8");

    assert.match(packRoute, /status:\s*"PUBLISHED"/);
    assert.match(syncRoute, /getCurrentUser/);
    assert.match(syncRoute, /status:\s*401/);
    assert.match(syncRoute, /emailVerified/);
    assert.match(syncRoute, /synchronizeOfflineAttempts/);
  });
});
