# JobFlow v0.9 — Customers & Sites

## Scope

This milestone adds tenant-scoped Customer and Site management without changing the Prisma schema.

### Customer capabilities
- List and search active customers
- Create residential or commercial customers
- Generate business-scoped customer numbers
- View customer detail and service locations
- Archive customers rather than hard-delete them

### Site capabilities
- Add multiple sites to a customer
- Store address, contact, access instructions and notes
- Archive sites rather than hard-delete them

### Security
All reads and mutations derive `businessId` from `requireTenant()`. Client requests do not provide a tenant/business ID.

### Routes
- `/customers`
- `/customers/new`
- `/customers/[id]`
- `/customers/[id]/sites/new`

### Database
No migration is required. The existing `Customer` and `Site` Prisma models are used as-is.

### Verification
```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```
Do not run `db:migrate` or `db:seed` for this checkpoint.
