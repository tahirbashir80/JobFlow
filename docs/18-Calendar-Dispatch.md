# JobFlow v1.3 — Calendar & Dispatch

## Calendar
Weekly calendar shows jobs whose scheduled interval intersects the selected week. Selecting a job opens its Job Detail page.

## Dispatch
The dispatch board shows scheduled work for a selected date in three operational columns:
- Unassigned
- Assigned
- In Progress

Technicians are limited to active staff in the current tenant.

## Assignment safety
Before assigning a technician, JobFlow checks for another primary assignment for the same technician whose scheduled interval overlaps the target job. Cancelled and declined assignments are excluded from the conflict check.

## Scope
This release does not yet include drag-and-drop scheduling, technician availability rules, travel-time routing, maps, or route optimization. Those require a separate scheduling/field-operations layer.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

Do not run migration or seed for this checkpoint.
