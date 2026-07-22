# drivexam Phase 1 Foundation Implementation Plan

> **For Hermes:** This is an implementation plan only. Do not execute until Louie explicitly says to start building.

**Goal:** Establish the drivexam technical foundation: Next.js 15 app, Tailwind/shadcn UI, Prisma/Postgres, Auth.js/NextAuth, email verification/password reset scaffolding, role model, local uploads foundation, and PWA basics.

**Architecture:** Use a monolithic Next.js 15 App Router application with Prisma-managed Postgres schema, Auth.js for session/login flows, server actions/API routes for mutations, and role-based authorization for future admin features. Keep the foundation small but production-oriented so later CMS, study engine, and dashboard phases can build on it without rewrites.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Prisma, Postgres, Auth.js/NextAuth, Gmail/SMTP email adapter abstraction, PWA manifest/service worker basics.

---

## Phase Guardrails

- Do not deploy.
- Do not push to GitHub until Louie approves.
- Keep `main` as the default branch.
- Use repo: `https://github.com/webllrzjohnson/drivexam.git`.
- Local path: `D:\Factory\drivexam`.
- Use standard/best-practice defaults unless a better solution is clearly worth explaining.
- No Supabase runtime.
- No payments, AI tutor, AdSense, or analytics in Phase 1.

---

## Expected Phase 1 Outcome

By the end of Phase 1, the repo should have:

- A working Next.js 15 app.
- Tailwind/shadcn configured.
- Prisma configured for Postgres.
- Initial schema for users, accounts, sessions, verification tokens, roles, site settings, uploads, and audit-friendly timestamps.
- Auth.js/NextAuth login foundation with:
  - Google provider placeholder configuration.
  - Credentials/email-password flow foundation.
  - Verified-email gating model.
  - Password reset token model.
- Email service abstraction prepared for Gmail first, Resend/Postmark later.
- Basic role authorization helpers.
- App shell/layout and simple placeholder pages.
- PWA manifest and install-ready metadata basics.
- Local uploads directory conventions.
- Environment variable example file.
- Working verification commands.

---

## Task 1: Initialize or Reconcile Repository

**Objective:** Ensure `D:\Factory\drivexam` is a Git repo connected to the GitHub remote without overwriting existing files.

**Files:**
- Verify existing: `D:\Factory\drivexam\.hermes.md`
- Verify existing: `D:\Factory\drivexam\.hermes\plans\2026-07-22_003609-drivexam-product-plan.md`
- Create/modify only if needed: `.gitignore`

**Steps:**

1. Check current folder contents.
2. Check whether `.git` exists.
3. If not a repo, initialize Git.
4. Add remote `origin` only if missing:
   - `https://github.com/webllrzjohnson/drivexam.git`
5. Fetch remote safely before scaffolding if network/auth allows.
6. If remote contains existing files, report before merging/scaffolding.

**Verification:**

Run:

```bash
git status --short && git remote -v
```

Expected:

- Working tree state is understood.
- `origin` points to `https://github.com/webllrzjohnson/drivexam.git`.

---

## Task 2: Scaffold Next.js 15 App

**Objective:** Create the base Next.js app without destroying existing planning files.

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/utils.ts`
- Create: `.eslintrc.json` or modern ESLint config depending on scaffold default
- Create/modify: `.gitignore`

**Recommended command:**

Use `create-next-app` in a temporary directory or with safe flags, then merge into the project folder carefully so `.hermes.md` and `.hermes/plans` remain intact.

Recommended stack selections:

- TypeScript: yes
- ESLint: yes
- Tailwind: yes
- `src/` directory: yes
- App Router: yes
- Turbopack: acceptable if default, but verify build still works
- Import alias: `@/*`

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- Lint passes.
- Build passes.

---

## Task 3: Configure shadcn/ui

**Objective:** Add shadcn/ui foundation for consistent UI components.

**Files:**
- Create: `components.json`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/label.tsx`
- Create: `src/components/ui/alert.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts` or equivalent if generated
- Verify: `src/lib/utils.ts`

**Steps:**

1. Initialize shadcn/ui.
2. Add only foundational components needed for auth/layout placeholders.
3. Do not build the full UI library yet.

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- shadcn components import successfully.
- Build passes.

---

## Task 4: Add Prisma and Postgres Foundation

**Objective:** Add Prisma with an initial relational schema that supports Auth.js and future drivexam features.

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Modify: `package.json`
- Create/modify: `.env.example`

**Initial schema should include:**

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `PasswordResetToken`
- `Role` enum or string enum equivalent
- `SiteSetting`
- `UploadAsset`

**Recommended user fields:**

- `id`
- `name`
- `email`
- `emailVerified`
- `image`
- `passwordHash`
- `role`
- `currentStage`
- `targetTestDate`
- `createdAt`
- `updatedAt`
- `deletedAt`

**Recommended enums:**

- `Role`: `USER`, `AUTHOR`, `ADMIN`
- `LicenseStage`: `G1`, `G2`, `G`
- `UploadAssetType`: `LOGO`, `FAVICON`, `ROAD_SIGN`, `BLOG_IMAGE`, `CONTENT_IMAGE`, `OTHER`

**Verification:**

Run:

```bash
npx prisma validate
```

Expected:

- Prisma schema validates.

If a local `DATABASE_URL` is available, also run:

```bash
npx prisma migrate dev --name init_foundation
```

If no database is available, skip migration and report that only schema validation was run.

---

## Task 5: Add Environment Configuration

**Objective:** Document all required environment variables without committing secrets.

**Files:**
- Create/modify: `.env.example`
- Ensure ignored: `.env`

**Variables to include:**

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/drivexam?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-generated-secret"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EMAIL_FROM="Drivexam <no-reply@example.com>"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
UPLOAD_DIR="./uploads"
```

**Verification:**

Run:

```bash
git status --short
```

Expected:

- `.env.example` is tracked.
- `.env` is ignored if present.

---

## Task 6: Add Auth.js/NextAuth Foundation

**Objective:** Set up Auth.js/NextAuth with Prisma adapter and provider structure.

**Files:**
- Create: `src/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/lib/auth/permissions.ts`
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/tokens.ts`
- Modify: `middleware.ts` if needed for route protection
- Modify: `prisma/schema.prisma` if Auth.js adapter fields need adjustment

**Auth requirements:**

- Google provider configured from env.
- Credentials provider foundation for email/password.
- Password hashing utility.
- Verified-email model.
- Role loaded into session/JWT.
- Soft-deleted users blocked from login.

**Authorization helpers:**

Create helpers such as:

- `isAdmin(user)`
- `isAuthorOrAdmin(user)`
- `requireVerifiedUser()`
- `requireAdmin()`

**Verification:**

Run:

```bash
npm run lint
npm run build
npx prisma validate
```

Expected:

- Auth routes compile.
- Prisma validates.
- Build passes.

---

## Task 7: Add Email Service Abstraction

**Objective:** Prepare verification/password reset emails using Gmail first while keeping provider swappable later.

**Files:**
- Create: `src/lib/email/types.ts`
- Create: `src/lib/email/send-email.ts`
- Create: `src/lib/email/templates/verification-email.ts`
- Create: `src/lib/email/templates/password-reset-email.ts`

**Design:**

- `sendEmail({ to, subject, text, html })` as the main app interface.
- Gmail/SMTP implementation behind the interface.
- Keep later Resend/Postmark migration easy.
- Do not send real emails during tests/build.

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- Email code compiles.
- No real email is sent during build.

---

## Task 8: Add Basic Auth Pages

**Objective:** Add minimal pages for sign in, sign up, verify email notice, forgot password, reset password, and account deletion placeholder.

**Files:**
- Create: `src/app/(auth)/sign-in/page.tsx`
- Create: `src/app/(auth)/sign-up/page.tsx`
- Create: `src/app/(auth)/verify-email/page.tsx`
- Create: `src/app/(auth)/forgot-password/page.tsx`
- Create: `src/app/(auth)/reset-password/page.tsx`
- Create: `src/app/(account)/account/page.tsx`
- Create: `src/app/(account)/account/delete/page.tsx`

**V1 foundation only:**

These can be clean working forms or safe placeholders depending on time, but should establish routes and design direction.

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- All pages compile.

---

## Task 9: Add App Shell and Public Placeholder Pages

**Objective:** Establish navigation and the trustworthy public structure without building full content yet.

**Files:**
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/app/(public)/blog/page.tsx`
- Create: `src/app/(public)/news/page.tsx`
- Create: `src/app/(public)/faq/page.tsx`
- Create: `src/app/(public)/terms/page.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/(public)/disclaimer/page.tsx`
- Create: `src/app/(public)/contact/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Homepage should communicate:**

- Ontario G1 → G2 → G study path.
- Practice questions.
- Daily plan.
- Road-test prep.
- Readiness tracking.
- Free start with registration perks.

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- Public routes compile.
- Homepage renders without auth/database dependency failures.

---

## Task 10: Add Admin Route Shell and Role Guard

**Objective:** Create the future admin area shell with strict role protection from the start.

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/admin-nav.tsx`
- Modify/use: `src/lib/auth/permissions.ts`

**Requirements:**

- Admin route requires `ADMIN` role.
- Authors should not access admin shell unless route allows author later.
- Unverified users cannot access admin.
- Unauthorized users are redirected or shown a clear access denied page.

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- Admin route compiles.
- Role guard code compiles.

---

## Task 11: Add Dashboard Route Shell and Verification Gate

**Objective:** Create the registered-user dashboard shell with email verification requirement.

**Files:**
- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/dashboard-shell.tsx`
- Modify/use: `src/lib/auth/permissions.ts`

**Requirements:**

- Dashboard requires login.
- Email/password users require verified email.
- Google users are treated as verified.
- Placeholder sections:
  - daily goal
  - readiness score
  - weak areas
  - next action
  - streak

**Verification:**

Run:

```bash
npm run lint
npm run build
```

Expected:

- Dashboard route compiles.
- Verification gate logic compiles.

---

## Task 12: Add PWA Basics

**Objective:** Make the app installable/PWA-ready without full offline quiz support.

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/icons/icon-192.png` placeholder if needed
- Create: `public/icons/icon-512.png` placeholder if needed
- Modify: `src/app/layout.tsx`
- Add service worker only if using a stable Next.js-compatible setup; otherwise document as Phase 1.5.

**Requirements:**

- App has manifest metadata.
- Installable shell direction is set.
- No full offline quiz/progress support in V1 foundation.

**Verification:**

Run:

```bash
npm run build
```

Expected:

- Manifest is included.
- Build passes.

Manual later:

- Browser installability check once dev server runs.

---

## Task 13: Add Local Upload Foundation

**Objective:** Establish safe conventions for local server uploads before CMS features are built.

**Files:**
- Create: `uploads/.gitkeep`
- Create: `src/lib/uploads/paths.ts`
- Create: `src/lib/uploads/validation.ts`
- Modify: `.gitignore`

**Requirements:**

- `uploads/` directory exists but uploaded files are ignored.
- `.gitkeep` keeps folder structure.
- Upload type constants align with Prisma `UploadAssetType`.
- Basic validation helpers define allowed image MIME types/extensions and max size constants.

**Verification:**

Run:

```bash
npm run lint
npm run build
git status --short
```

Expected:

- Upload helper code compiles.
- Uploaded binary files would be ignored.
- `.gitkeep` can be tracked.

---

## Task 14: Add Seed Script for Initial Admin Placeholder

**Objective:** Prepare a safe seed path for creating the first admin user later.

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`

**Requirements:**

- Seed script should support creating/updating a first admin from env variables.
- Do not hardcode real passwords/secrets.
- Use env variables such as:
  - `SEED_ADMIN_EMAIL`
  - `SEED_ADMIN_NAME`
  - `SEED_ADMIN_PASSWORD`
- If env vars are missing, seed should skip admin creation with a clear message.

**Verification:**

Run:

```bash
npx prisma validate
npm run build
```

If database is available:

```bash
npx prisma db seed
```

Expected:

- Seed does not fail when admin env vars are absent.
- If env vars are present, admin user is created/updated.

---

## Task 15: Add Project Documentation

**Objective:** Document local setup and Phase 1 decisions.

**Files:**
- Create/modify: `README.md`
- Modify: `.hermes.md` if the project-specific rules need stack details added

**README should include:**

- Project purpose.
- Tech stack.
- Local setup steps.
- Environment variables.
- Database setup command.
- Development command.
- Verification commands.
- Note: no deployment yet.

**Verification:**

Read back README and ensure commands are exact.

---

## Task 16: Final Phase 1 Verification

**Objective:** Prove the foundation is working before reporting complete.

**Commands:**

```bash
npm run lint
npm run build
npx prisma validate
git status --short
```

If a local Postgres `DATABASE_URL` is available:

```bash
npx prisma migrate dev
```

Optional browser verification:

```bash
npm run dev
```

Then visit:

- `/`
- `/sign-in`
- `/sign-up`
- `/dashboard`
- `/admin`

Expected:

- Build passes.
- Prisma validates.
- Public pages load.
- Protected pages do not expose private/admin content to anonymous users.

---

## Files Likely to Change in Phase 1

- `.gitignore`
- `.env.example`
- `README.md`
- `package.json`
- `next.config.ts`
- `tsconfig.json`
- `components.json`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/auth.ts`
- `src/lib/db.ts`
- `src/lib/utils.ts`
- `src/lib/auth/*`
- `src/lib/email/*`
- `src/lib/uploads/*`
- `src/components/ui/*`
- `src/components/layout/*`
- `src/components/admin/*`
- `src/components/dashboard/*`
- `public/manifest.webmanifest`
- `public/icons/*`
- `uploads/.gitkeep`

---

## Risks and Tradeoffs

1. **Auth.js + Credentials:** Credentials login requires careful password hashing, verification gating, and reset-token handling. Keep the implementation conservative.
2. **Gmail SMTP:** Good for early use but should stay behind an abstraction to switch to Resend/Postmark later.
3. **Local uploads:** Simple for V1, but deployment must persist the upload directory later.
4. **PWA service worker:** Avoid overcomplicating offline behavior in Phase 1. Installability and manifest are enough unless the setup is straightforward.
5. **Prisma migration:** Requires a working `DATABASE_URL`. If unavailable, validate schema and defer migration.
6. **Admin bootstrapping:** First admin creation must be secure and not hardcoded.

---

## Definition of Done

Phase 1 is complete when:

- App scaffolding exists and builds.
- Prisma schema validates.
- Auth foundation compiles.
- Email abstraction exists.
- Public/auth/dashboard/admin route shells exist.
- Role and verification helper structure exists.
- PWA manifest exists.
- Upload conventions exist.
- README documents setup.
- Verification commands have been run and results reported.
- No deploy was performed.
- No GitHub push was performed unless Louie explicitly approved it.
