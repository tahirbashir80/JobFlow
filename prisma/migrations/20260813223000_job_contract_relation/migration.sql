-- Add optional Contract linkage to Job.
ALTER TABLE "Job" ADD COLUMN "contractId" TEXT;

CREATE INDEX "Job_businessId_contractId_idx" ON "Job"("businessId", "contractId");

ALTER TABLE "Job"
  ADD CONSTRAINT "Job_contractId_fkey"
  FOREIGN KEY ("contractId") REFERENCES "Contract"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
