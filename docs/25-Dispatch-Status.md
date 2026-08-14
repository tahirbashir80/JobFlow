# JobFlow v1.7.6 — Dispatch Status

The Prisma `JobStatus` enum uses `DISPATCHED`, not `ACCEPTED`.

Dispatch operational buckets:
- UNASSIGNED: NEW / SCHEDULED with no active primary assignment
- ASSIGNED: ASSIGNED / DISPATCHED with an active primary assignment
- IN PROGRESS: EN_ROUTE / ON_SITE / IN_PROGRESS

No migration is required.
