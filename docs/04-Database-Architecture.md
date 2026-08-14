# JobFlow — Database Foundation v0.2

## Status

Migration-ready database foundation for the first implementation milestone.

## Decisions locked in v0.2

### 1. Custom Service Fields

Every business service can define its own fields through `ServiceFieldDefinition`.

A Job stores values in `JobFieldValue`.

Example:

Pest Control:
- Pest Type
- Chemical Used
- Area Treated
- Infestation Level

Tree Cutting:
- Tree Type
- Tree Height
- Branches Removed
- Waste Disposal

This avoids schema changes when a new industry or service needs a different operational form.

### 2. Archiving / Soft Delete

Operational records use `archivedAt` where appropriate.

Archiving means:
- record remains in database
- normal application queries exclude archived records
- historical relationships remain available
- restoration is possible
- destructive deletion is reserved for controlled platform/data-retention operations

Status fields remain useful for business state. `archivedAt` is specifically for record lifecycle.

### 3. Tenant Isolation

Business is the tenant/workspace.

Every tenant-owned operational record is directly or transitively associated with `Business`.

Application data-access functions must always scope tenant-owned reads/writes by the authenticated business ID.

### 4. Subscription and Usage

Plan, Subscription, FeatureEntitlement, PlanEntitlement, SubscriptionEvent and UsageRecord are platform entities.

Plan limits and feature access are data-driven rather than hard-coded throughout UI components.

### 5. Historical Integrity

Job, completion, report, invoice and payment history should survive ordinary archive operations.

Foreign keys use restrictive behavior where deleting a parent would otherwise destroy important historical meaning.

## Important implementation rule

Do not expose Prisma directly to client components. Tenant scoping and authorization belong in server-side data-access/action/service layers.
