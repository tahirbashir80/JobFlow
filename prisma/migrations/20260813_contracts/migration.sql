CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'EXPIRED', 'CANCELLED');
CREATE TYPE "ContractBillingCycle" AS ENUM ('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL');
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "siteId" TEXT,
    "serviceId" TEXT,
    "contractNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "billingCycle" "ContractBillingCycle" NOT NULL DEFAULT 'ANNUAL',
    "contractValue" DECIMAL(12,2),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "renewalDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Contract_businessId_contractNumber_key" ON "Contract"("businessId", "contractNumber");
CREATE INDEX "Contract_businessId_status_idx" ON "Contract"("businessId", "status");
CREATE INDEX "Contract_businessId_customerId_idx" ON "Contract"("businessId", "customerId");
CREATE INDEX "Contract_businessId_endDate_idx" ON "Contract"("businessId", "endDate");
CREATE INDEX "Contract_businessId_renewalDate_idx" ON "Contract"("businessId", "renewalDate");
CREATE INDEX "Contract_businessId_archivedAt_idx" ON "Contract"("businessId", "archivedAt");
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
