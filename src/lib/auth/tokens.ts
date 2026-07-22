import crypto from "node:crypto";

export function createSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getExpiryDate(minutesFromNow: number) {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}
