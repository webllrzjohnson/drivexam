import { auth } from "@/auth";
import type { Session } from "next-auth";

type AuthReader = () => Promise<Session | null>;

function isJwtSessionError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.name === "JWTSessionError" || error.message.includes("JWTSessionError") || error.message.includes("errors.authjs.dev#jwtsessionerror");
}

export async function getOptionalSession(readSession: AuthReader = auth) {
  try {
    return await readSession();
  } catch (error) {
    if (isJwtSessionError(error)) return null;
    throw error;
  }
}
