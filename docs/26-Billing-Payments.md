# JobFlow v1.8 — Billing & Payments

## Scope
- Create an Invoice directly from a completed Job.
- Prevent duplicate active invoices for the same Job.
- Auto-create a single service line item from the Job.
- Track subtotal, tax, discount, total, amount paid and balance due.
- Mark Draft invoices as Sent.
- Record partial or full payments using Cash, Card, Bank Transfer, Online or Other.
- Automatically transition invoice status to PARTIALLY_PAID or PAID.
- View invoice and payment history.

## Routes
- `/invoices` — invoice list and financial summary.
- `/invoices/[id]` — invoice detail and payment recording.
- Completed Job detail — `Create Invoice` / `View INV-xxxxxx`.

## Database
Invoice, InvoiceItem and Payment models already existed in the Prisma schema. No schema change, migration or seed is required for v1.8.

## Financial rule
Payments cannot exceed the current balance due. Payment status is recorded as SUCCEEDED for this in-app manual payment workflow.

## Future
PDF invoice rendering, email delivery, online payment provider integration, automated overdue processing, credit notes and refunds are future work.
