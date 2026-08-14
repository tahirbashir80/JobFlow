# JobFlow v1.2 — Service Reports

## Purpose
Turn a completed JobCompletion record into a customer-facing service report.

## Flow
Completed Job → Generate Service Report → View → Print / Save as PDF

## Persistence
The existing `ServiceReport` model is used. A report is created once per completed job and receives a deterministic report number such as `SR-JOB-000001`.

## Security
Report creation and retrieval first validate the Job against the current tenant's `businessId`. The report itself does not need a businessId because its ownership is derived through `ServiceReport → JobCompletion → Job → Business`.

## Scope
This release does not add email/SMS delivery, cloud file storage, digital signatures, or photo embedding. Those remain later enhancements.

## Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

Do not run migration or seed for this checkpoint.
