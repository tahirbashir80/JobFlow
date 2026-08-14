# JobFlow v1.7 — Notifications & Alerts

## Notification Center
The `/notifications` page displays the latest 50 in-app notifications for the authenticated user and current tenant.

## Notification types
- `JOB_ASSIGNED`: created when a primary Job assignment is made for a technician that has a linked User account.
- `RECURRING_JOBS_GENERATED`: created for the user who manually generates due recurring Jobs.

## Read state
Notifications are marked read by the authenticated user. Mark-all-as-read is tenant/user scoped.

## Existing schema
This release uses the existing `Notification` model and `IN_APP` channel. No Prisma migration is required.

## Scope
Email, SMS, push delivery, notification preferences, scheduled reminder workers, and automated background generation remain future work.
