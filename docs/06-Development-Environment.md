# JobFlow — Development Environment v0.4

## Local prerequisites

Install:
- Node.js LTS
- PostgreSQL
- Git
- VS Code (recommended)

## First setup

1. Copy `.env.local.example` to `.env.local`.
2. Set `DATABASE_URL` to the local PostgreSQL database.
3. Install packages with `npm install`.
4. Run `npm run db:format`.
5. Run `npm run db:validate`.
6. Run `npm run db:generate`.
7. Create the first development migration with `npm run db:migrate`.
8. Seed platform data with `npm run db:seed`.
9. Start the app with `npm run dev`.

## Seeded baseline

The seed creates:
- Starter, Professional and Business plans
- Feature entitlements
- Plan-to-feature mappings
- Initial industry templates
- Initial service templates

## Important

The first migration should be generated against a real local PostgreSQL database. The ZIP does not contain a fake migration pretending to have been executed.
