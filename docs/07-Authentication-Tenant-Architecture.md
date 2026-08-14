# JobFlow — Authentication & Tenant Architecture v0.5

## Goal

Establish the security boundary between:
- unauthenticated users
- authenticated users
- business tenants
- roles
- permissions

## Authentication

The application exposes:
- `/sign-in`
- `/sign-up`
- `/api/auth/session`

The provider/session implementation is isolated behind `src/lib/auth/session.ts`.

A production session must be server-validated. A client-supplied business ID is never an authorization mechanism.

## Tenant Resolution

Every protected application request must resolve:
- userId
- businessId
- roleId
- platformRole

`requireTenant()` is the intended server-side boundary.

## Authorization

Permission codes are centralized in `src/lib/permissions/permissions.ts`.

`requirePermission()` is the intended server-side authorization boundary.

## Super Admin

Platform roles remain distinct from tenant roles:
- USER
- SUPER_ADMIN
- SUPPORT_ADMIN

A Super Admin is not a normal business staff role.

## Current limitation

v0.5 is an architecture and application boundary checkpoint. It does not claim production-ready authentication.

Before production:
- wire the chosen authentication provider
- hash and verify passwords with a vetted password-hashing library if credentials auth is used
- add email verification
- add password reset
- add session persistence/rotation
- add CSRF/session protections as required by the selected provider
- add rate limiting and login abuse controls
- add onboarding transaction handling
- test tenant isolation and authorization

## v0.6.1 Dependency Note

Authentication remains provider-neutral. No authentication package is required by the current scaffold because the application has not yet implemented provider-specific sign-in/session behavior.
