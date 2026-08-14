# JobFlow v1.12.0 — Customer Statements

## Statement rules
- Only posted/active invoices are included.
- Cleared/succeeded payments are included.
- Draft, void and cancelled invoices are excluded.
- Each currency has its own ledger and running balance.
- No cross-currency totals are produced.
- The current statement is all-time activity, so opening balance is zero. A date-range statement with calculated opening balance can be added as a later enhancement.

## PDF
The statement is print-optimized and uses the browser's Print / Save PDF flow, consistent with the existing Service Report approach.
