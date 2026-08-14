# JobFlow v1.8.1 — Mixed Payments & Cheques

## Mixed payments
An invoice may have any number of Payment records. Different methods can be combined, e.g. cash + card + cheque.

## Partial payments
Each successful payment reduces the invoice balance. The invoice is `PARTIALLY_PAID` until cleared payments equal the invoice total.

## Cheques
A cheque is created as `PENDING` and does not reduce the invoice's paid balance until it is cleared. It stores cheque number, bank and cheque date. Clearing changes it to `SUCCEEDED`; bouncing changes it to `FAILED` and the invoice balance is recalculated.

## Example
Invoice: PKR 100,000
- Cash: 30,000 — succeeded
- Card: 40,000 — succeeded
- Cheque: 30,000 — pending

Cleared paid: PKR 70,000
Pending cheque: PKR 30,000
Invoice remains partially paid until the cheque clears.

## Database
This release adds `CHEQUE` to `PaymentMethod` and cheque metadata fields to `Payment`. Run `prisma migrate dev` after reviewing the migration.
