/*
  Warnings:

  - Added the required column `amountInInvoiceCurrency` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceDiscountType" AS ENUM ('FIXED', 'PERCENT');

-- CreateEnum
CREATE TYPE "InvoiceTaxType" AS ENUM ('FIXED', 'PERCENT');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'CHEQUE';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "adjustmentAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "adjustmentReason" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "discountRate" DECIMAL(12,4) NOT NULL DEFAULT 0,
ADD COLUMN     "discountType" "InvoiceDiscountType" NOT NULL DEFAULT 'FIXED',
ADD COLUMN     "taxRate" DECIMAL(12,4) NOT NULL DEFAULT 0,
ADD COLUMN     "taxType" "InvoiceTaxType" NOT NULL DEFAULT 'FIXED';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amountInInvoiceCurrency" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "chequeBank" TEXT,
ADD COLUMN     "chequeDate" TIMESTAMP(3),
ADD COLUMN     "chequeNumber" TEXT,
ADD COLUMN     "clearedAt" TIMESTAMP(3),
ADD COLUMN     "exchangeRateToInvoice" DECIMAL(18,8) NOT NULL DEFAULT 1;
