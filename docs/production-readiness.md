# Production readiness and launch handoff

This checklist is for deploying `drivexam` from `main` to a production Next.js host with Postgres.

## Current app shape

- Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind, Prisma 7, Postgres, Auth.js/NextAuth.
- Database-backed features: Auth.js users/accounts/sessions, admin CMS, questions/categories/lessons, quiz attempts, question reports, contact submissions, and road-test checklist progress. The road-test page also includes a guest-usable mock-drive assessment that is intentionally not persisted.
- Seeded learner content:
  - 68 published G1 questions across 8 active G1 categories.
  - 40 published G2 road-test preparation scenarios across 3 active G2 categories.
  - 40 published full-G road-test preparation scenarios across 3 active G categories.
  - 8 G2 road-test checklist items.
  - 8 full-G road-test checklist items.
- PWA install assets are included under `public/manifest.webmanifest` and `public/icons/`.

## Required production environment variables

Set these as production secrets in the host. Do not commit real values.

| Variable | Required | Purpose | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string used by Prisma | Must point at the production database. |
| `AUTH_SECRET` | Yes | Auth.js session/encryption secret | Generate a long random value. |
| `NEXTAUTH_SECRET` | Recommended | Compatibility secret for Auth.js/NextAuth setups | Use the same value as `AUTH_SECRET` unless the host requires otherwise. |
| `AUTH_URL` | Yes | Canonical app URL for Auth.js | Example: `https://drivexam.example.com`. |
| `NEXTAUTH_URL` | Yes | Canonical app URL for NextAuth compatibility | Same origin as `AUTH_URL`. |
| `GOOGLE_CLIENT_ID` | Optional before launch, required for Google sign-in | Google OAuth client id | If missing, Google sign-in is disabled and email/password remains available. |
| `GOOGLE_CLIENT_SECRET` | Optional before launch, required for Google sign-in | Google OAuth secret | Store only as a secret. |
| `EMAIL_FROM` | Required for real email delivery | Sender identity | Example shape: `Drivexam <no-reply@example.com>`. |
| `SMTP_HOST` | Required for real email delivery | SMTP server host | Gmail example: `smtp.gmail.com`. |
| `SMTP_PORT` | Required for real email delivery | SMTP server port | Gmail TLS example: `587`; port `465` uses secure transport. |
| `SMTP_USER` | Required for real email delivery | SMTP username | Store only as a secret. |
| `SMTP_PASS` | Required for real email delivery | SMTP password/app password | Store only as a secret. |
| `UPLOAD_DIR` | Optional | Server-side upload root | Defaults can work locally; configure if production filesystem needs a specific persistent path. |
| `SEED_ADMIN_EMAIL` | One-time seed convenience | Creates/updates the first admin during `npm run db:seed` | Can be removed after initial admin exists. |
| `SEED_ADMIN_NAME` | Optional with admin seed | Admin display name | No secret. |
| `SEED_ADMIN_PASSWORD` | One-time seed convenience | Initial admin password | Store only as a secret; rotate/remove after first sign-in if desired. |
| `EMAIL_SMOKE_TO` | Smoke test only | Recipient for `npm run email:smoke` | Do not set unless running a delivery smoke test. |

## Google OAuth checklist

Create a Google Cloud OAuth Web client and add authorized redirect URIs for every deployed origin:

```text
https://YOUR_PRODUCTION_DOMAIN/api/auth/callback/google
```

For local testing only:

```text
http://localhost:3000/api/auth/callback/google
```

After setting `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_URL`, and `NEXTAUTH_URL`, verify `/sign-in` shows an enabled Google button and that Google returns to the app after authentication.

## Email checklist

1. Configure `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS`.
2. Set `EMAIL_SMOKE_TO` temporarily.
3. Run:

```bash
npm run email:smoke
```

Expected result: the command reports a non-secret successful send. Remove or leave blank `EMAIL_SMOKE_TO` after testing if the host supports temporary env changes.

## Database migration and seed order

Run from the deployed app environment, with production `DATABASE_URL` loaded.

1. Install/build the app through the host's normal deployment flow.
2. Apply migrations:

```bash
npx prisma migrate deploy
```

3. Seed baseline admin/content data:

```bash
npm run db:seed
```

Current migrations in order:

1. `20260722000000_init_foundation`
2. `20260722220500_phase2_admin_cms`
3. `20260724110848_add_quiz_attempts`
4. `20260726175437_add_road_test_checklist_progress`

Notes:

- The app currently has `npm run db:migrate` mapped to `prisma migrate dev`, which is appropriate for local development, not production.
- Use `npx prisma migrate deploy` in production until a production-specific npm script is added.
- `npm run db:seed` is idempotent for the bundled Ontario seed content. It also creates/updates the first admin only when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are set.
- Seed logs intentionally avoid printing the admin email/password.

## Pre-launch verification commands

Run locally and/or in CI before deploying:

```bash
npm run test
npm run lint
npm run build
npm run prisma:validate
```

Current expected local gate:

- `npm run test`, `npm run lint`, and `npm run build` pass without failures.
- 36 Next.js routes are generated.
- Prisma schema is valid.

## Live smoke-test routes

After deployment and migrations/seeding, test these routes on the production origin:

### Public learner routes

- `/`
- `/practice?stage=G1`
- `/practice?stage=G1&questionSet=2`
- `/practice?stage=G2`
- `/practice?stage=G`
- `/road-test?stage=G2`
- `/road-test?stage=G`
- `/contact`
- `/faq`
- `/terms`
- `/privacy`
- `/disclaimer`

### Auth and learner account flow

- `/sign-up`
- `/sign-in`
- `/forgot-password`
- `/reset-password`
- `/verify-email`
- `/dashboard`

Smoke checks:

1. Create or sign in as a verified learner.
2. Complete a practice quiz and save progress.
3. Toggle at least one road-test checklist item.
4. Complete a guest mock-drive assessment and confirm critical safety errors prevent a ready verdict.
5. Confirm `/dashboard` shows quiz and road-test progress.
6. Submit a contact message from a verified learner.

### Admin routes

- `/admin`
- `/admin/users`
- `/admin/settings`
- `/admin/assets`
- `/admin/categories`
- `/admin/questions`
- `/admin/lessons`
- `/admin/reports`
- `/admin/contact`
- `/admin/road-test`

Smoke checks:

1. Sign in as an admin seeded through `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` or promoted manually.
2. Verify seeded G1/G2/G categories and questions are visible.
3. Verify question reports and contact submissions queues load.
4. Create/edit/delete a temporary road-test checklist item, then remove it.

## PWA smoke checks

- Open `/manifest.webmanifest` and confirm valid JSON.
- Confirm `/icons/icon-192.png`, `/icons/icon-512.png`, and `/icons/icon.svg` return 200.
- On mobile Chrome/Edge, verify the app is installable or appears in the browser install menu.

## Known launch blockers to resolve before public release

- No production host/domain is recorded in this repo yet.
- No Dockerfile or platform-specific deployment config is currently committed.
- Real SMTP delivery has not been exercised unless production SMTP secrets are configured and `npm run email:smoke` passes.
- Real Google OAuth cannot be fully tested until production OAuth credentials and callback URI are configured.
- Production migrations should use `npx prisma migrate deploy`; do not run `prisma migrate dev` against production.

## Rollback notes

- Code rollback: redeploy the previous Git commit from `main` or the hosting provider's release history.
- Database rollback: Prisma migrations are forward-only by default. Take a database backup before first production migration and before future schema changes.
- Seed rollback: seeded Ontario content is ordinary database content; remove or edit via Admin CMS if necessary after launch.
