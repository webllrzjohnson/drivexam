import nodemailer from "nodemailer";

import type { SendEmailInput, SendEmailResult } from "./types";

type EmailEnv = NodeJS.ProcessEnv & Partial<Record<"EMAIL_FROM" | "SMTP_HOST" | "SMTP_PORT" | "SMTP_USER" | "SMTP_PASS" | "NODE_ENV", string>>;

export function hasSmtpConfig(env: EmailEnv = process.env) {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

export function getSmtpConfig(env: EmailEnv = process.env) {
  if (!hasSmtpConfig(env)) return null;
  const port = Number(env.SMTP_PORT ?? 587);

  return {
    host: env.SMTP_HOST as string,
    port,
    secure: port === 465,
    auth: {
      user: env.SMTP_USER as string,
      pass: env.SMTP_PASS as string,
    },
  };
}

export function buildEmailMessage(env: EmailEnv = process.env, input: SendEmailInput) {
  return {
    from: env.EMAIL_FROM || env.SMTP_USER,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    if (process.env.NODE_ENV !== "production") {
      console.info("Email skipped because SMTP env vars are not configured", { subject: input.subject });
      return { skipped: true };
    }

    throw new Error("SMTP is not configured");
  }

  const transporter = nodemailer.createTransport(smtpConfig);
  const info = await transporter.sendMail(buildEmailMessage(process.env, input));
  return { id: info.messageId };
}
