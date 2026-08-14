-- CreateEnum
CREATE TYPE "AccountTransactionType" AS ENUM ('INVOICE', 'PAYMENT', 'CREDIT', 'REFUND', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "reversalReason" TEXT,
ADD COLUMN     "reversedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CustomerAccountTransaction" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "paymentId" TEXT,
    "type" "AccountTransactionType" NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "reference" TEXT,
    "runningBalance" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerAccountTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomerAccountTransaction_businessId_customerId_transactio_idx" ON "CustomerAccountTransaction"("businessId", "customerId", "transactionDate");

-- CreateIndex
CREATE INDEX "CustomerAccountTransaction_businessId_customerId_currency_idx" ON "CustomerAccountTransaction"("businessId", "customerId", "currency");

-- CreateIndex
CREATE INDEX "CustomerAccountTransaction_businessId_invoiceId_idx" ON "CustomerAccountTransaction"("businessId", "invoiceId");

-- CreateIndex
CREATE INDEX "CustomerAccountTransaction_businessId_paymentId_idx" ON "CustomerAccountTransaction"("businessId", "paymentId");

-- AddForeignKey
ALTER TABLE "CustomerAccountTransaction" ADD CONSTRAINT "CustomerAccountTransaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccountTransaction" ADD CONSTRAINT "CustomerAccountTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccountTransaction" ADD CONSTRAINT "CustomerAccountTransaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccountTransaction" ADD CONSTRAINT "CustomerAccountTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
