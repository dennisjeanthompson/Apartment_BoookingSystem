Vercel Deployment Checklist
--------------------------

Required environment variables (add these in Vercel or GitHub secrets):

- `DATABASE_URL` — full Postgres connection string (e.g. postgres://user:pass@host:port/dbname)
- `NEXTAUTH_SECRET` — secure random string for NextAuth
- `NEXTAUTH_URL` — your deployed app URL, e.g. https://your-app.vercel.app
- `APP_ADMIN_EMAIL` (optional) — admin account email used by `prisma/seed.ts`

Recommended steps

1. Provision a Postgres database (Neon, Supabase, Railway, etc.) and set `DATABASE_URL`.
2. In Vercel, set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` under Project Settings → Environment Variables.
3. Deploy the `vercel_app` branch to Vercel (Vercel will run `npm run build`).
4. After the first deployment, run migrations and seed the database. You can:
   - Use the GitHub Actions workflow provided at `.github/workflows/vercel_prisma_migrate.yml` (recommended), or
   - Run migrations locally or via CI using the following commands:

```bash
cd vercel_app
npm ci
npm run db:migrate      # runs `prisma migrate deploy`
npm run db:seed         # runs the TypeScript seed script
```
Using GitHub CLI to set secrets and trigger the workflow

If you have the `gh` CLI configured with access to this repository, you can set secrets and trigger the migration workflow from your terminal:

Set repository secrets:

```bash
# replace OWNER/REPO with your GitHub repo (dennisjeanthompson/Apartment_BoookingSystem)
gh repo secret set DATABASE_URL --body "${DATABASE_URL}" --repo OWNER/REPO
gh repo secret set NEXTAUTH_SECRET --body "${NEXTAUTH_SECRET}" --repo OWNER/REPO
gh repo secret set APP_ADMIN_EMAIL --body "${APP_ADMIN_EMAIL}" --repo OWNER/REPO
```

Trigger the migration workflow manually:

```bash
# runs the workflow defined in .github/workflows/vercel_prisma_migrate.yml
gh workflow run vercel_prisma_migrate.yml --repo OWNER/REPO
```

Or dispatch via the GitHub UI: go to Actions → "Run workflow" on the workflow page and select the `main` branch.

Notes
- The project uses Prisma (see `prisma/schema.prisma`). The action deploys migrations with `prisma migrate deploy` which applies SQL migrations to an existing database.
- The seed script is `prisma/seed.ts` and is executed via `npm run db:seed`.
- Keep `DATABASE_URL` secret and restricted to the deployment environment.

Troubleshooting
- If migrations fail, verify the `DATABASE_URL` permissions and network access.
- To run the seed script manually in production, use a secure runner (GitHub Actions or a one-off server shell) with the same `DATABASE_URL`.
