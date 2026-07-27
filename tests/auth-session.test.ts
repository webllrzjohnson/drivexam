import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getOptionalSession } from "../src/lib/auth/session";

describe("optional auth session helper", () => {
  it("returns a session when Auth.js resolves cleanly", async () => {
    const session = { user: { email: "learner@example.com" } };

    assert.equal(await getOptionalSession(async () => session), session);
  });

  it("treats Auth.js JWT session decode failures as a guest session", async () => {
    const error = new Error("JWTSessionError: Read more at https://errors.authjs.dev#jwtsessionerror");
    error.name = "JWTSessionError";

    const session = await getOptionalSession(async () => {
      throw error;
    });

    assert.equal(session, null);
  });

  it("does not hide unrelated auth failures", async () => {
    await assert.rejects(
      () => getOptionalSession(async () => {
        throw new Error("Database unavailable");
      }),
      /Database unavailable/,
    );
  });
});
