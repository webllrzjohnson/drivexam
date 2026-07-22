import nodemailer from "nodemailer";
import type { SendEmailInput, SendEmailResult } from "./types";
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    if (process.env.NODE_ENV !== "production") { console.info("Email skipped because SMTP env vars are not configured", { to: input.to, subject: input.subject }); return { skipped: true }; }
    throw new Error("SMTP is not configured");
  }
  const transporter = nodemailer.createTransport({ host, port: Number(process.env.SMTP_PORT ?? 587), secure: Number(process.env.SMTP_PORT ?? 587) === 465, auth: { user, pass } });
  const info = await transporter.sendMail({ from: process.env.EMAIL_FROM ?? user, to: input.to, subject: input.subject, text: input.text, html: input.html });
  return { id: info.messageId };
}
