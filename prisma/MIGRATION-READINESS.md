# Migration Readiness Notes

Before the first migration:

1. Create a development PostgreSQL database.
2. Set DATABASE_URL in a local environment file.
3. Install project dependencies using the project's package manager.
4. Run Prisma formatting and validation.
5. Run the first development migration.
6. Seed system plans, entitlements, industry templates and service templates.
7. Verify tenant-scoped CRUD flows before building UI features.

Do not use production billing credentials in local development.

## Customer Onboarding v2.9.3

The customer onboarding schema introduces normalized billing, address, metadata and geographic reference tables. The migration is intentionally separate from application deployment so the database can be reviewed before execution.

Required deployment order:
1. `npm install`
2. `npm run db:generate`
3. `npm run db:validate`
4. Review `prisma/migrations/20260813_customer_onboarding/migration.sql`
5. `npm run db:migrate`

Google Maps is optional. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the interactive pin picker.
