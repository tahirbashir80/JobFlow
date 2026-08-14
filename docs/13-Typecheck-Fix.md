# JobFlow v0.7.1 — Typecheck Fix

The v0.7 persistence layer was written against assumptions that did not match the actual `schema.prisma`.

The current schema uses:
- `IndustryTemplate`
- `BusinessIndustry` with `businessId`, `templateId`, `name`
- `Service.industryId` referencing `BusinessIndustry`
- `BusinessSetting` for arbitrary business configuration

The implementation has been corrected to follow those actual models.

No database schema change is introduced by v0.7.1.

Verify:

```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```

No migration or seed is required for this fix.
