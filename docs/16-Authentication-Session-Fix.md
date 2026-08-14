# JobFlow v0.8.1 — Authentication Session Fix

## Problem
The signup transaction created the account successfully, but `/api/auth/session` returned `authenticated: false`.

## Root cause
The session cookie was being mutated through the `cookies()` store inside a nested authentication service while the API route returned a separate `NextResponse`. The robust route-handler pattern is to create the signed token in the service and attach the cookie directly to the `NextResponse` returned by the route.

## Fix
- `registerOwner()` returns a signed session token.
- `authenticate()` returns a signed session token.
- Sign-up and sign-in route handlers set `jobflow_session` directly on their `NextResponse`.
- Sign-out clears the cookie directly on its `NextResponse`.
- Session verification continues to read the HttpOnly cookie and load the user from PostgreSQL.

## Verification
1. Restart the dev server.
2. Use a fresh test email on `/sign-up` or sign in with an existing test account.
3. Open `/api/auth/session`.
4. Expected HTTP 200 response includes `authenticated: true`.
5. Then verify `/onboarding/business` is accessible.

No Prisma schema change, migration, or seed is required.
