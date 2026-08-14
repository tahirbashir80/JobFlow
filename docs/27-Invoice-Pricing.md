# JobFlow v1.8.2 — Invoice Pricing

## Calculation
Subtotal
- Discount
+ Adjustment
= Adjusted taxable base
+ Tax
= Invoice Total

The taxable base is clamped at zero.

## Discount
- FIXED: discountRate is an amount.
- PERCENT: discountRate is a percentage from 0 to 100.

## Tax
- FIXED: taxRate is an amount.
- PERCENT: taxRate is a percentage from 0 to 100.

## Adjustment
`adjustmentAmount` is signed. Positive values increase the invoice; negative values reduce it. `adjustmentReason` stores the audit explanation.

## Safety
A recalculation cannot reduce the invoice total below already-cleared/succeeded payments.

## Editing
Pricing can be edited while an invoice is DRAFT, SENT or PARTIALLY_PAID. PAID, VOID and CANCELLED invoices are locked.
