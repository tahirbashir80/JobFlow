# JobFlow v0.7 — Persistent Business Onboarding

## Goal

Turn onboarding from UI scaffolding into a server-side persistence workflow.

## Security boundary

Every mutation resolves the tenant through `requireTenant()`. The action does not accept a client-provided businessId as an authorization mechanism.

## Persistence

- Business profile → Business
- Industry selection → BusinessIndustry / Industry
- Custom service → Service
- Staff → Staff
- Completion → Business.onboardingCompletedAt

## Validation

All onboarding inputs pass through Zod schemas before reaching Prisma.

## Important implementation note

The current project schema is the source of truth. If a model/field differs from the expected onboarding shape, the schema must be reconciled before migration rather than silently changing application assumptions.

## Verification

After installing the v0.7 checkpoint:

```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

If all pass, use the existing database migration state; do not reset the database.

The v0.7 checkpoint does not introduce a destructive migration.
