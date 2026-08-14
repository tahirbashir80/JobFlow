# JobFlow v0.6.3 — Seed Environment Fix

## Problem

`npm run db:seed` failed with:

`Error: DATABASE_URL is not configured.`

The Prisma CLI was able to load `DATABASE_URL` through `prisma.config.ts`, but the standalone `tsx prisma/seed.ts` process did not automatically load the `.env` file.

## Fix

The seed script now imports `dotenv/config` before reading `process.env.DATABASE_URL`.

## Local action

No dependency reinstall is required for this fix.

Ensure `D:\JF\JobFlow\.env` exists and contains a valid `DATABASE_URL`.

Then run:

```powershell
npm run db:seed
```

Do not expose or send the database password.

## Node note

The current terminal reports Node.js 25.9.0. JobFlow should use a supported Node LTS release for the project toolchain. Prefer Node 24 LTS (or the exact version documented by the installed Prisma release) rather than Node 25 for the development environment.
