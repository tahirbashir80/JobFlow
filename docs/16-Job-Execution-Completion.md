# JobFlow v1.1 — Job Execution & Completion

## Operational flow
Scheduled/Assigned → In Progress → Completed

The job execution panel is tenant-protected through `requireTenant()`. Starting a job records actual start time and primary assignment timing. Completing a job creates one `JobCompletion`, updates the Job to `COMPLETED`, records actual end time, completes the primary assignment, and appends status history.

## Completion fields
- Work performed (required)
- Findings
- Recommendations
- Customer comments
- Internal notes
- Customer approved/acknowledged

## Scheduling hardening
If the selected end clock time is earlier than or equal to the start clock time on the same selected date, the client treats it as an overnight job and places the end on the following calendar day.

## Database
No schema changes. Existing `JobCompletion`, `JobAssignment`, `JobStatusHistory`, `JobMaterial`, `Attachment`, `JobNote` and related models are used.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

Do not run migration or seed for this checkpoint.
