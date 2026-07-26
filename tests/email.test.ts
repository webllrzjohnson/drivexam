import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildEmailMessage,
  getSmtpConfig,
  hasSmtpConfig,
} from "../src/lib/email/send-email";
import { passwordResetEmailTemplate } from "../src/lib/email/templates/password-reset-email";
import { verificationEmailTemplate } from "../src/lib/email/templates/verification-email";

describe("SMTP email configuration", () => {
  it("detects missing SMTP credentials without reading secrets", () => {
    assert.equal(hasSmtpConfig({ SMTP_HOST: "smtp.gmail.com", SMTP_USER: "", SMTP_PASS: "" }), false);
    assert.equal(hasSmtpConfig({ SMTP_HOST: "smtp.gmail.com", SMTP_USER: "sender@example.com", SMTP_PASS: "secret" }), true);
  });

  it("builds a nodemailer SMTP config with safe defaults", () => {
    assert.deepEqual(
      getSmtpConfig({ SMTP_HOST: "smtp.gmail.com", SMTP_USER: "sender@example.com", SMTP_PASS: "secret" }),
      {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: { user: "sender@example.com", pass: "secret" },
      },
    );
  });

  it("uses secure transport for port 465", () => {
    assert.equal(getSmtpConfig({ SMTP_HOST: "smtp.gmail.com", SMTP_PORT: "465", SMTP_USER: "sender@example.com", SMTP_PASS: "secret" })?.secure, true);
  });

  it("builds an email message with explicit from fallback", () => {
    assert.deepEqual(
      buildEmailMessage(
        { EMAIL_FROM: "Drivexam <no-reply@example.com>", SMTP_USER: "sender@example.com" },
        { to: "driver@example.com", subject: "Verify", text: "Text body", html: "<p>Html body</p>" },
      ),
      { from: "Drivexam <no-reply@example.com>", to: "driver@example.com", subject: "Verify", text: "Text body", html: "<p>Html body</p>" },
    );
  });
});

describe("auth email templates", () => {
  it("includes the verification URL in text and html bodies", () => {
    const email = verificationEmailTemplate("https://drivexam.test/verify-email?token=abc");
    assert.equal(email.subject, "Verify your drivexam email");
    assert.match(email.text, /https:\/\/drivexam\.test\/verify-email\?token=abc/);
    assert.match(email.html ?? "", /Verify your email/);
    assert.match(email.html ?? "", /https:\/\/drivexam\.test\/verify-email\?token=abc/);
  });

  it("includes the password reset URL in text and html bodies", () => {
    const email = passwordResetEmailTemplate("https://drivexam.test/reset-password?token=abc");
    assert.equal(email.subject, "Reset your drivexam password");
    assert.match(email.text, /https:\/\/drivexam\.test\/reset-password\?token=abc/);
    assert.match(email.html ?? "", /Reset password/);
    assert.match(email.html ?? "", /https:\/\/drivexam\.test\/reset-password\?token=abc/);
  });
});
