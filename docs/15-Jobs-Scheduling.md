# JobFlow v1.0 — Jobs & Scheduling

## Core workflow
Customer → Site → Service → Schedule → Assign Staff → Create Job

## Tenant security
All reads and writes derive `businessId` from `requireTenant()`. Customer, site, service and staff references are validated against that business before a job is created.

## Job lifecycle
The existing schema provides the full JobStatus enum. v1.0 exposes scheduling/assignment states and status history. Job execution, completion evidence, signatures, materials and service reports remain v1.1 scope.

## Database
No Prisma schema changes are introduced. Existing `Job`, `JobAssignment` and `JobStatusHistory` models are used.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```
Do not run migration or seed for this checkpoint.
