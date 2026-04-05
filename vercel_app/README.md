# Apartment Booking System (TypeScript / Next.js)

This folder contains a full TypeScript rewrite of the Laravel Apartment Booking System for Vercel deployment.

Stack:
- Next.js (App Router, TypeScript)
- Prisma (PostgreSQL)
- NextAuth (credentials)
- Tailwind CSS

## Features

- User register/login/logout
- Apartment listing with search/filter/pagination
- Apartment detail page
- Booking creation with availability check
- Booking cancellation (owner/admin)
- Admin dashboard and apartment management
- Seeded demo users and sample apartments

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment

```bash
cp .env.example .env
```

Set a PostgreSQL `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET`.

3. Run migrations and seed

```bash
npm run db:migrate
npm run db:seed
```

4. Start app

```bash
npm run dev
```

## Vercel Deployment (2026)

1. Push this repository to GitHub.
2. In Vercel: `New Project` -> import repository.
3. Set Root Directory to:

```bash
vercel_app
```

4. Add environment variables in Vercel project settings:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret
```

5. Add a managed PostgreSQL database (Neon/Supabase/Vercel Postgres) and point `DATABASE_URL` to it.
6. Deploy.
7. Run production migration once:

```bash
npx prisma migrate deploy
npm run db:seed
```

Demo accounts after seed:
- Admin: `admin@example.com` / `password`
- User: `student@example.com` / `password`
