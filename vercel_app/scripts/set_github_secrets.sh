#!/usr/bin/env bash
# Helper: set GitHub repository secrets using the gh CLI.
# Usage: ./set_github_secrets.sh OWNER/REPO

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 OWNER/REPO"
  exit 2
fi

REPO="$1"

read -rp "DATABASE_URL: " DATABASE_URL
read -rp "NEXTAUTH_SECRET: " NEXTAUTH_SECRET
read -rp "APP_ADMIN_EMAIL (optional): " APP_ADMIN_EMAIL

echo "Setting secrets on $REPO..."
gh repo secret set DATABASE_URL --body "$DATABASE_URL" --repo "$REPO"
gh repo secret set NEXTAUTH_SECRET --body "$NEXTAUTH_SECRET" --repo "$REPO"
if [ -n "$APP_ADMIN_EMAIL" ]; then
  gh repo secret set APP_ADMIN_EMAIL --body "$APP_ADMIN_EMAIL" --repo "$REPO"
fi

echo "Secrets set. You can now run the workflow with:"
echo "  gh workflow run vercel_prisma_migrate.yml --repo $REPO"

#!/usr/bin/env bash
# Helper: set GitHub repository secrets using the gh CLI.
# Usage: ./set_github_secrets.sh OWNER/REPO

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 OWNER/REPO"
  exit 2
fi

REPO="$1"

read -rp "DATABASE_URL: " DATABASE_URL
read -rp "NEXTAUTH_SECRET: " NEXTAUTH_SECRET
read -rp "APP_ADMIN_EMAIL (optional): " APP_ADMIN_EMAIL

echo "Setting secrets on $REPO..."
gh repo secret set DATABASE_URL --body "$DATABASE_URL" --repo "$REPO"
gh repo secret set NEXTAUTH_SECRET --body "$NEXTAUTH_SECRET" --repo "$REPO"
if [ -n "$APP_ADMIN_EMAIL" ]; then
  gh repo secret set APP_ADMIN_EMAIL --body "$APP_ADMIN_EMAIL" --repo "$REPO"
fi

echo "Secrets set. You can now run the workflow with:"
echo "  gh workflow run vercel_prisma_migrate.yml --repo $REPO"
