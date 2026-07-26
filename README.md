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

No deployment is configured yet. Push to GitHub and deploy only after Louie approves.
