# JobFlow v0.7.2 — Onboarding UI Wiring

The onboarding UI now calls server-side actions instead of being static navigation.

## Flow

Business Profile
→ Industry
→ Services
→ Staff
→ Complete

## Data path

Client form
→ Server Action
→ `requireTenant()`
→ Zod validation
→ Prisma
→ PostgreSQL

## Security

The client never supplies the tenant/business ID to the server action. The action derives it from the authenticated server-side tenant context.

## Current authentication dependency

The project still has a provider-neutral authentication scaffold. `getSession()` currently returns `null` until a real authentication provider/session store is implemented.

Therefore the wired onboarding screens will correctly enforce authentication, but they cannot be exercised end-to-end until v0.8 authentication is connected.

## Verification

```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

No migration or seed is required.
