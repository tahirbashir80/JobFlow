# JobFlow — Application Architecture v0.3

## Runtime

- Next.js App Router
- React
- TypeScript
- Prisma
- PostgreSQL
- Zod

## Server/client boundary

Database access and tenant authorization remain server-side.

Client components should receive only the data and actions they need.

## Tenant context

Authenticated requests must resolve:

- userId
- businessId
- role/permissions

A client must never be allowed to choose an arbitrary businessId for a tenant-owned operation.

## Initial route groups

- `/` — product landing
- `/sign-in` — authentication entry
- `/dashboard` — owner/manager dashboard
- `/setup` — business configuration
- `/customers` — CRM
- `/jobs` — job operations
- `/staff` — staff management

These are scaffolds only in v0.3.

## Next implementation priority

1. Development environment
2. Database migration
3. Seed data
4. Authentication
5. Tenant session resolution
6. Protected application shell
7. Setup module
