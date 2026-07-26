# drivexam

Ontario-only G1, G2, and full G driving exam study companion.

## Stack

- Next.js 15 App Router
- React + TypeScript
- Tailwind CSS + shadcn-style components
- Prisma + Postgres
- Auth.js/NextAuth
- Gmail/SMTP-first email abstraction
- Installable PWA basics

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment example:

```bash
cp .env.example .env
```

3. Fill in `DATABASE_URL`, `AUTH_SECRET`/`NEXTAUTH_SECRET`, Google OAuth, and SMTP values as needed.

For Google OAuth, create a Google Cloud OAuth client with this authorized redirect URI:

```bash
http://localhost:3000/api/auth/callback/google
```

For production, replace the host with the deployed app URL and set:

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="https://your-domain.example"
AUTH_URL="https://your-domain.example"
```

If `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` is missing, the app keeps email/password sign-in available and disables the Google button.

For SMTP/Gmail delivery, set:

```bash
EMAIL_FROM="Drivexam <no-reply@example.com>"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-user@example.com"
SMTP_PASS="your-app-password"
EMAIL_SMOKE_TO="your-test-recipient@example.com"
```

Then verify delivery without printing secrets:

```bash
npm run email:smoke
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. When a local Postgres database is available, run migrations:

```bash
npm run db:migrate
```

6. Start development server:

```bash
npm run dev
```

## Verification

```bash
npm run lint
npm run build
npm run prisma:validate
```

## Deployment

No deployment host is configured in this repo yet. Push to GitHub and deploy only after Louie approves.

Use the production handoff before launching:

- [Production readiness and launch handoff](docs/production-readiness.md)

Production database migrations should use Prisma's deploy command from the deployed app environment:

```bash
npx prisma migrate deploy
```

Then seed the bundled Ontario content/admin bootstrap if needed:

```bash
npm run db:seed
```
