# JobFlow v0.6.1 — Dependency Fix

## Why v0.6 failed

The previous package requested:

`next-auth@^5.0.0`

That is not a published stable npm version in the current registry, so npm correctly returned `ETARGET`.

JobFlow v0.6 did not actually use NextAuth yet; authentication was only a server-side architecture boundary. Therefore the incorrect dependency has been removed rather than pinning the project to an unsuitable beta.

## Prisma 7 alignment

The project also now follows Prisma 7's generated-client architecture:
- `prisma-client` generator
- generated output under `src/generated/prisma`
- `@prisma/adapter-pg`
- `pg`
- `dotenv`
- Prisma client imported from the generated output

## Clean reinstall

From `D:\JF\JobFlow`:

```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npm run db:format
npm run db:validate
```

Do not run migrations until PostgreSQL and DATABASE_URL are configured.

## Node

Prisma 7 requires a supported modern Node version. Use Node.js 20.19+ (or a current Node 22/24 LTS release).
