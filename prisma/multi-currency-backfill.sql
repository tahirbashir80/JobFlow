-- Run after Prisma creates the v1.9 migration adding Invoice.currency and Payment.amountInInvoiceCurrency.
-- Existing invoices inherit their business base currency rather than blindly remaining USD.
UPDATE "Invoice" i
SET "currency" = b."currency"
FROM "Business" b
WHERE i."businessId" = b."id";

UPDATE "Payment" p
SET "amountInInvoiceCurrency" = p."amount",
    "exchangeRateToInvoice" = 1
WHERE p."invoiceId" IS NOT NULL
  AND "amountInInvoiceCurrency" = 0;
