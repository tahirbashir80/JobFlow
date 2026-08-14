# JobFlow

Configurable Job Management CRM / Field Service Management platform for small service businesses.

## Current checkpoint

v0.6.2 — Prisma Schema Validation Fix

## Included

- v0.5 authentication/tenant architecture
- Business onboarding route group
- Business profile onboarding UI
- Industry selection UI
- Custom industry option
- Service configuration UI
- Custom service option
- Staff onboarding UI
- Completion screen
- Onboarding validation schemas
- Onboarding step definitions
- Onboarding architecture documentation

## Important

The v0.6 screens are the UX/application foundation. The next pass must connect these screens to authenticated server actions and Prisma transactions so onboarding creates real Business, BusinessIndustry, Service, Staff and related records.

This checkpoint fixes the dependency installation issue from v0.6.

Next milestone:
v0.7 — Persistent Onboarding + Setup Module

## v0.7 implementation

Onboarding now has server-side persistence boundaries using authenticated tenant context, Zod validation and Prisma. The database remains the source of truth.

Next milestone:
v0.8 — Setup / Configuration Module
