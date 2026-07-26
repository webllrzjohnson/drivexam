import "dotenv/config";

import { sendEmail } from "../src/lib/email/send-email";

async function main() {
  const to = process.env.EMAIL_SMOKE_TO?.trim();
  if (!to) throw new Error("Set EMAIL_SMOKE_TO to the recipient address before running email:smoke.");

  const result = await sendEmail({
    to,
    subject: "drivexam SMTP smoke test",
    text: "This is a drivexam SMTP smoke test. If you received this, email delivery is configured.",
    html: "<p>This is a drivexam SMTP smoke test.</p><p>If you received this, email delivery is configured.</p>",
  });

  if (result.skipped) throw new Error("SMTP env vars are not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM.");

  console.log("SMTP smoke email sent.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "SMTP smoke email failed.");
  process.exit(1);
});
