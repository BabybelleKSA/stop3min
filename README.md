# Stop the $3 Minimum

Consumer justice web app to report illegal debit card minimums. Built with Next.js 14 (App Router), TypeScript, Tailwind, and Prisma (SQLite by default).

## Project structure
- `app/` – App Router routes (public pages, docs, admin, APIs)
- `components/` – Shared UI
- `lib/` – Prisma client, auth helpers, validation schemas
- `prisma/` – Prisma schema

## Prerequisites
- Node.js 18+
- npm or pnpm

## Setup
1) Install dependencies  
```bash
npm install
```

2) Create `.env` with at least:  
```
DATABASE_URL="file:./prisma/dev.db"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="supersecret"
# Optional: ADMIN_SESSION_SECRET="long-random-string"
```

3) Generate Prisma client and create the dev database  
```bash
npx prisma migrate dev --name init
```

4) Run the dev server  
```bash
npm run dev
```

Visit http://localhost:3000.

## Admin access
- Login at `/admin/login` using `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
- Simple session cookie is issued after successful login (signed with `ADMIN_SESSION_SECRET` or the password).

## Key features
- Public landing page with live stats from `/api/stats`
- Report submission form at `/report` (client-side + server validation)
- Static docs under `/docs/*`
- Thank you flow at `/thanks`
- Admin dashboard `/admin` with filters, pagination, status updates, and CSV export
- APIs:
  - `/api/reports` POST create report, GET paginated list (admin)
  - `/api/reports/[id]` GET/PATCH (admin)
  - `/api/reports/export` CSV export (admin)
  - `/api/stats` public stats
  - `/api/admin/login` admin session

## Deployment notes
- SQLite is fine for local/dev; switch `DATABASE_URL` to Postgres for production, then run `prisma migrate deploy`.
- The project is Vercel-friendly. Ensure env vars are set in your host.
