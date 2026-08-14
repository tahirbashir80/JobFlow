# JobFlow v1.4 — Technician Management

## Technician directory
Tenant-scoped staff records are displayed with active job count, service skill count and assigned service names.

## Skills
`StaffServiceSkill` is used to map technicians to services with a 1–5 proficiency level. Staff and service ownership is checked against the current business before a skill is written.

## Availability
`StaffAvailability` stores one normal availability window per day of week. The current release provides management UI; dispatch conflict detection remains based on overlapping job assignments.

## Dispatch integration
The Dispatch board receives technician skills and filters its technician selector to service-qualified staff where skills are configured.

## Scope
This release does not yet enforce availability windows during assignment, perform travel-time calculations, or implement drag-and-drop dispatch.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

Do not run migration or seed for this checkpoint.
