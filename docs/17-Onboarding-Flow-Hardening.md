# JobFlow v0.8.2 — Onboarding Flow Hardening

- Service creation now receives the authenticated business's selected industry ID from the server-rendered page; users no longer type database IDs into the UI.
- Onboarding completion is no longer executed as a side effect during server rendering. It runs only after the user clicks **Enter JobFlow**.
- No database migration or seed change is introduced.

Verify with:

```powershell
npm run db:format
npm run db:validate
npm run db:generate
npm run typecheck
```
