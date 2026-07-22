import crypto from "node:crypto";
export function createSecureToken(bytes = 32) { return crypto.randomBytes(bytes).toString("hex"); }
export function getExpiryDate(minutesFromNow: number) { return new Date(Date.now() + minutesFromNow * 60 * 1000); }
