# JobFlow v2.3.0 — Corporate Dashboard

The Dashboard is now a production-oriented reference screen for JobFlow.

## Data rules

- Operational counts come from live job/assignment data.
- Completed job value uses completed Job `totalAmount`.
- Financial metrics are aggregated only for invoices matching the Business currency.
- Outstanding AR uses invoice `balanceDue`.
- Overdue AR uses invoices past their due date with a positive balance and active receivable statuses.
- No cross-currency arithmetic is performed.

## Component structure

`src/components/dashboard/CorporateDashboard.tsx` contains reusable dashboard presentation components and motion behavior. `src/app/(app)/dashboard/page.tsx` remains responsible for tenant access and server-side data shaping.

## UX direction

The dashboard uses a restrained corporate visual language: clear hierarchy, semantic status colors, compact data density, subtle borders/shadows, contextual actions and motion that communicates state rather than decoration.
