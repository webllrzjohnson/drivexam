import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in", verifyRequest: "/verify-email" },
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, allowDangerousEmailAccountLinking: false }),
    Credentials({
      name: "Email and password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user?.passwordHash || user.deletedAt) return null;
        if (!(await verifyPassword(parsed.data.password, user.passwordHash))) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role, emailVerified: user.emailVerified };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return true;
      const existingUser = await db.user.findUnique({ where: { email: user.email } });
      return !existingUser?.deletedAt;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as typeof user & { role?: string }).role ?? "USER";
        token.emailVerified = (user as typeof user & { emailVerified?: Date | null }).emailVerified ?? null;
      }
      if (token.email) {
        const dbUser = await db.user.findUnique({ where: { email: token.email }, select: { id: true, role: true, emailVerified: true, deletedAt: true } });
        if (dbUser && !dbUser.deletedAt) { token.id = dbUser.id; token.role = dbUser.role; token.emailVerified = dbUser.emailVerified; }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id as string; session.user.role = (token.role as "USER" | "AUTHOR" | "ADMIN") ?? "USER"; session.user.emailVerified = token.emailVerified as Date | null; }
      return session;
    },
  },
});
