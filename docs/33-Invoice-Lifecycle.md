# JobFlow v1.13.0 — Invoice Lifecycle

Lifecycle:
DRAFT → SENT → PARTIALLY_PAID → PAID

An outstanding SENT invoice can become OVERDUE after its due date when status is refreshed.

Payment entry is permitted only for SENT, PARTIALLY_PAID and OVERDUE invoices.

Cheque payments remain PENDING until cleared. Clearing recalculates invoice paid/balance/status. Bounced cheques do not reduce the invoice balance.

Void/cancel protections:
- An invoice with cleared payments cannot be voided/cancelled.
- Paid, void and cancelled invoices cannot be voided/cancelled again.
- Draft/sent invoices can be cancelled.
- Sent/overdue invoices can be voided when no payment has been recorded.
