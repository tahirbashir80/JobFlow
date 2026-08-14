# JobFlow v1.6 — Recurring Jobs

## Existing model
This release uses the existing `RecurringService` Prisma model. No schema migration is required.

## Recurrence
Supported types:
- Daily
- Weekly
- Biweekly
- Monthly
- Quarterly
- Semi-annual
- Annual
- Custom interval

## Generation
A recurring service stores `nextRunAt`. The Generate Due Jobs action creates every due Job through the current time, advances `nextRunAt`, and pauses a schedule after its end date.

Generated Jobs use the recurring service's customer and service. If the customer has an active site, the oldest active site is selected because `RecurringService` does not currently store a siteId. This is an intentional limitation of the existing schema.

## Safety
All reads and writes are tenant-scoped by `businessId`. Job numbers are checked for uniqueness before creation.

## Scope
Technician assignment is not automatically generated; generated jobs enter the scheduled workflow and can be dispatched normally. Site selection, technician templates and advanced recurrence exceptions can be added later.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

Do not run migration or seed for this checkpoint.
