# JobFlow v1.9.0 — Multi-Currency Architecture

## Currency hierarchy
- Business `currency` = base/reporting/default currency for the business.
- Invoice `currency` = transaction currency, captured when the invoice is created and preserved historically.
- Payment `currency` = currency actually received.
- Payment `exchangeRateToInvoice` = immutable FX snapshot used to convert a payment into invoice currency.
- Payment `amountInInvoiceCurrency` = converted amount used for invoice settlement.

## Important accounting rule
Business currency may change for future activity, but an issued invoice's currency does not change.

## Mixed-currency payments
The schema supports a payment currency different from the invoice currency through FX fields. The current v1.9 application payment workflow intentionally accepts payments in the invoice currency only and records an FX rate of 1.0. Cross-currency payment entry should be enabled only when a trusted FX-rate source and explicit conversion workflow are added.

## Reporting
Do not sum invoices of different currencies directly. The invoice list therefore shows per-invoice currency and avoids presenting an invalid mixed-currency grand total.

## Supported currencies
JobFlow includes a practical international ISO 4217 catalog covering USD, EUR, GBP, CAD, AUD, NZD, CHF, JPY, CNY, INR, PKR, AED, SAR, QAR, KWD, BHD, OMR, SGD, HKD, ZAR, BRL, MXN, SEK, NOK, DKK, PLN, TRY, IDR, MYR and THB. The catalog can be expanded without changing financial table schemas.

## Migration
After Prisma generates the migration, run `prisma/multi-currency-backfill.sql` once so existing invoices inherit the Business currency and existing payment conversion fields are initialized.
