# JobFlow v1.13.1 — Payment UX

## Payment type
- Full Payment: amount must equal the outstanding balance.
- Partial Payment: amount must be greater than zero and strictly less than the outstanding balance.

## Payment methods
- Cash
- Card
- Bank transfer
- Online
- Cheque
- Other

No method is selected by default.

## Cheques
Cheque fields appear only when Cheque is selected. A cheque number is required. Cheques are stored as PENDING and only reduce the invoice balance after clearing.

## Regression guard
AR aging must retain:
`Number(invoice.balanceDue) > 0`
because Prisma `Decimal` values cannot be compared directly with JavaScript numbers.
