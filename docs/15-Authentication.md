# JobFlow v0.8 — Authentication

Implemented a provider-free, database-backed local authentication foundation:

- Sign up creates Business, Owner role, User and Professional 14-day trial subscription in one transaction.
- Passwords are hashed with Node.js scrypt; plaintext passwords are never stored.
- Sign in verifies the password and issues an HMAC-signed, HttpOnly session cookie.
- Server-side `getSession()` verifies the cookie and reloads the user from PostgreSQL.
- Existing `requireTenant()` now receives a real authenticated tenant context.
- Sign out destroys the session cookie.

## Required environment variable

Add to `.env`:

`SESSION_SECRET="a-random-secret-at-least-32-characters"`

No database migration is required.
