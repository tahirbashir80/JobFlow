# JobFlow v1.11.0 — AR Aging

Aging is calculated from the invoice due date and remaining balance.

Buckets:
- Current: due today/future or no due date.
- 1–30 days: 1 to 30 calendar days overdue.
- 31–60 days: 31 to 60 days overdue.
- 61–90 days: 61 to 90 days overdue.
- 90+ days: more than 90 days overdue.

Paid, void and cancelled invoices do not contribute to aging.

Amounts are calculated separately per invoice currency.
