# JobFlow v1.5 — Dashboard & Analytics

## Data source
Dashboard metrics are computed from the current tenant's PostgreSQL data through Prisma. No hard-coded business metrics are used.

## KPI cards
- Today's Jobs
- Active Now
- Completed
- Unassigned

## Operational panels
- Today's schedule
- Weekly completion trend
- Jobs by service
- Technician workload
- Cumulative completed job value
- Recent customers

## Tenant isolation
Every dashboard query is scoped with the authenticated tenant's `businessId`.

## Scope
This checkpoint focuses on operational analytics. Financial reporting, date-range reporting, export, advanced charting and role-specific dashboards remain later enhancements.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

Do not run migration or seed for this checkpoint.
