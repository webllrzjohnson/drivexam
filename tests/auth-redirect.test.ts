import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPostSignInRedirect } from "../src/lib/auth/redirects";

describe("post sign-in redirect", () => {
  it("sends admins to admin", () => {
    assert.equal(getPostSignInRedirect("ADMIN"), "/admin");
  });

  it("sends authors and regular users to dashboard", () => {
    assert.equal(getPostSignInRedirect("AUTHOR"), "/dashboard");
    assert.equal(getPostSignInRedirect("USER"), "/dashboard");
  });

  it("keeps safe relative callback URLs", () => {
    assert.equal(getPostSignInRedirect("USER", "/dashboard?next=plan"), "/dashboard?next=plan");
  });

  it("rejects external callback URLs", () => {
    assert.equal(getPostSignInRedirect("ADMIN", "https://evil.example/admin"), "/admin");
    assert.equal(getPostSignInRedirect("USER", "//evil.example"), "/dashboard");
  });
});
