import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getGoogleOAuthCallbackUrl,
  getGoogleOAuthConfig,
  hasGoogleOAuthConfig,
} from "../src/lib/auth/google-oauth";

describe("Google OAuth configuration", () => {
  it("detects missing Google OAuth credentials without exposing secrets", () => {
    assert.equal(hasGoogleOAuthConfig({ GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "" }), false);
    assert.equal(hasGoogleOAuthConfig({ GOOGLE_CLIENT_ID: "google-client-id", GOOGLE_CLIENT_SECRET: "" }), false);
    assert.equal(hasGoogleOAuthConfig({ GOOGLE_CLIENT_ID: "google-client-id", GOOGLE_CLIENT_SECRET: "google-client-secret" }), true);
  });

  it("returns trimmed provider config only when both credentials are present", () => {
    assert.equal(getGoogleOAuthConfig({ GOOGLE_CLIENT_ID: "google-client-id", GOOGLE_CLIENT_SECRET: "" }), null);
    assert.deepEqual(getGoogleOAuthConfig({ GOOGLE_CLIENT_ID: " google-client-id ", GOOGLE_CLIENT_SECRET: " google-client-secret " }), {
      clientId: "google-client-id",
      clientSecret: "google-client-secret",
    });
  });

  it("builds the Google console callback URL from the app URL", () => {
    assert.equal(getGoogleOAuthCallbackUrl({ NEXTAUTH_URL: "https://drivexam.example.com" }), "https://drivexam.example.com/api/auth/callback/google");
    assert.equal(getGoogleOAuthCallbackUrl({ AUTH_URL: "https://auth.drivexam.example.com/" }), "https://auth.drivexam.example.com/api/auth/callback/google");
  });

  it("uses localhost as the safe callback default for local setup", () => {
    assert.equal(getGoogleOAuthCallbackUrl({}), "http://localhost:3000/api/auth/callback/google");
  });
});
