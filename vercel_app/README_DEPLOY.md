Deploying vercel_app
-------------------

Quick steps to deploy the Next.js `vercel_app` to Vercel and run Prisma migrations/seed:

1. Provision a Postgres database (Neon, Supabase, Railway, etc.).
2. In your Vercel project settings, set the following Environment Variables (Production scope):
   - `DATABASE_URL` — Postgres connection string
   - `NEXTAUTH_SECRET` — a secure random string
   - `NEXTAUTH_URL` — your app URL (https://your-app.vercel.app)
   - `APP_ADMIN_EMAIL` (optional) — admin email used by seed

3. Deploy the repository to Vercel (select the `main` branch).

4. After the first successful deployment, run migrations and seed the DB. Options:

   - Use the included GitHub Actions workflow `.github/workflows/vercel_prisma_migrate.yml`. Make sure `DATABASE_URL` and `APP_ADMIN_EMAIL` are added to GitHub Secrets.

   - Or run locally (requires network access to the production DB):

```bash
cd vercel_app
npm ci
npm run db:migrate    # prisma migrate deploy
npm run db:seed       # seed script (tsx prisma/seed.ts)
```

Notes
- Vercel will run `npm run build` during deployment. The project runs Prisma client generation in `postinstall`.
- Keep production DB credentials secret and rotate if exposed.
- If you prefer one-off migration runs, use a secure runner (GitHub Actions workflow_dispatch or SSH into a maintenance host).
