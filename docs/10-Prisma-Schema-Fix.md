# JobFlow v0.6.2 — Prisma Schema Fix

## Reported error

Prisma 7.9.1 reported P1012:

`The relation field business uses the scalar fields businessId. At least one of those fields is optional. Hence the relation field must be optional as well.`

## Cause

`AuditLog.businessId` was declared as `String?`, while `AuditLog.business` was declared as a required `Business` relation.

Prisma requires the relation field to be optional when its foreign-key scalar is optional.

## Fix

Changed:

`business Business @relation(...)`

to:

`business Business? @relation(...)`

The `performedBy` relation was already optional and required no change.

## Next local verification

After replacing the project with v0.6.2:

```powershell
npm run db:format
npm run db:validate
npm run db:generate
```

Do not run migration or seed until these three commands succeed.
