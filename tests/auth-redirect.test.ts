import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPostSignInRedirect, isSafeRelativePath, shouldRequireLearnerOnboarding } from "../src/lib/auth/redirects";

describe("post sign-in redirect", () => {
  it("sends admins to admin", () => {
    assert.equal(getPostSignInRedirect("ADMIN"), "/admin");
  });

  it("sends authors and regular users to dashboard", () => {
    assert.equal(getPostSignInRedirect("AUTHOR"), "/dashboard");
    assert.equal(getPostSignInRedirect("USER"), "/dashboard");
  });

  it("sends first-time regular learners to guided setup", () => {
    assert.equal(getPostSignInRedirect("USER", "", true), "/onboarding");
    assert.equal(getPostSignInRedirect("USER", "", false), "/dashboard");
    assert.equal(getPostSignInRedirect("ADMIN", "", true), "/admin");
    assert.equal(getPostSignInRedirect("USER", "/practice", true), "/practice");
  });

  it("requires guided setup only for incomplete regular learners", () => {
    assert.equal(shouldRequireLearnerOnboarding("USER", null), true);
    assert.equal(shouldRequireLearnerOnboarding("USER", "G1"), false);
    assert.equal(shouldRequireLearnerOnboarding("AUTHOR", null), false);
    assert.equal(shouldRequireLearnerOnboarding("ADMIN", null), false);
  });

  it("keeps safe relative callback URLs", () => {
    assert.equal(getPostSignInRedirect("USER", "/dashboard?next=plan"), "/dashboard?next=plan");
  });

  it("rejects external callback URLs", () => {
    assert.equal(getPostSignInRedirect("ADMIN", "https://evil.example/admin"), "/admin");
    assert.equal(getPostSignInRedirect("USER", "//evil.example"), "/dashboard");
    assert.equal(isSafeRelativePath("/\\evil.example"), false);
    assert.equal(isSafeRelativePath("/%5cevil.example"), false);
    assert.equal(isSafeRelativePath("/%2f%2fevil.example"), false);
  });
});
