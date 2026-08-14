# JobFlow v1.10.0 — Customer Accounts & Accounts Receivable

## Account
Each customer has an accounts-receivable view at `/customers/[id]/account`.

## Currency safety
Invoiced, collected, outstanding and overdue amounts are calculated separately per currency. JobFlow never adds USD + EUR + GBP into a single number.

## Account history
The page lists invoices and payments, preserving transaction currency and status.

## Ledger
`CustomerAccountTransaction` provides an auditable ledger foundation with transaction type, invoice/payment reference, currency, amount and running balance. Current release adds the schema foundation; automatic ledger materialization for every historical transaction should be introduced in a controlled migration/service layer rather than inferred in the UI.

## Next AR features
- Aging buckets (Current, 1–30, 31–60, 61–90, 90+)
- Customer statement PDF
- Credit notes/refunds
- Payment reversals
- AR dashboard
