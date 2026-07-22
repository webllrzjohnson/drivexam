import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";
async function main() { const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase(); const name = process.env.SEED_ADMIN_NAME || "drivexam Admin"; const password = process.env.SEED_ADMIN_PASSWORD; if (!email || !password) { console.info("Seed skipped: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin."); return; } await db.user.upsert({ where: { email }, update: { name, role: "ADMIN", emailVerified: new Date(), deletedAt: null }, create: { email, name, role: "ADMIN", emailVerified: new Date(), passwordHash: await hashPassword(password) } }); console.info(`Seeded admin user: ${email}`); }
main().finally(async () => db.$disconnect());
