import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { normalizeEmail, validatePassword, isValidPasswordReset } from "../src/lib/auth/inputs";

describe("auth input helpers", () => {
  it("normalizes emails", () => {
    assert.equal(normalizeEmail("  SHUAI.JAN28@GMAIL.COM  "), "shuai.jan28@gmail.com");
  });

  it("requires practical account passwords", () => {
    assert.equal(validatePassword("short").ok, false);
    assert.equal(validatePassword("longbutnodigit").ok, false);
    assert.equal(validatePassword("DriveExam2026").ok, true);
  });

  it("requires matching reset passwords", () => {
    assert.equal(isValidPasswordReset("DriveExam2026", "DriveExam2026"), true);
    assert.equal(isValidPasswordReset("DriveExam2026", "DriveExam2027"), false);
  });
});
