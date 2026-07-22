import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session { user: { id: string; role: "USER" | "AUTHOR" | "ADMIN"; emailVerified?: Date | null; } & DefaultSession["user"]; }
  interface User { role?: "USER" | "AUTHOR" | "ADMIN"; emailVerified?: Date | null; }
}
declare module "next-auth/jwt" { interface JWT { id?: string; role?: "USER" | "AUTHOR" | "ADMIN"; emailVerified?: Date | null; } }
