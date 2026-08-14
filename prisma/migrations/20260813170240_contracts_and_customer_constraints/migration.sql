/*
  Warnings:

  - A unique constraint covering the columns `[businessId,registrationCountryCode,tradeLicenseNo]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessId,registrationCountryCode,vatNumber]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CustomerGroup" AS ENUM ('ONE_TIME', 'VIP', 'PREMIUM', 'REGULAR');

-- CreateEnum
CREATE TYPE "CustomerLeadSource" AS ENUM ('GOOGLE', 'SOCIAL_MEDIA', 'REFERRAL', 'FLYER_BROCHURE', 'WALK_IN', 'OTHER');

-- CreateEnum
CREATE TYPE "PreferredContactMethod" AS ENUM ('PHONE', 'EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "BestTimeToContact" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'ANY_TIME');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('DUE_ON_RECEIPT', 'NET_15', 'NET_30', 'NET_45', 'NET_60');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "alternateCountryCode" VARCHAR(8),
ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "bestTimeToContact" "BestTimeToContact",
ADD COLUMN     "countryCode" VARCHAR(8),
ADD COLUMN     "preferredContactMethod" "PreferredContactMethod",
ADD COLUMN     "whatsappCountryCode" VARCHAR(8),
ADD COLUMN     "whatsappPhone" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "industryId" TEXT,
ADD COLUMN     "registrationCountryCode" VARCHAR(2),
ADD COLUMN     "tradeLicenseNo" VARCHAR(80),
ADD COLUMN     "vatNumber" VARCHAR(80),
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "GeoCountry" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "phoneCode" VARCHAR(8),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoState" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "code" VARCHAR(20),
    "name" VARCHAR(120) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoCity" (
    "id" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerBillingProfile" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "billingName" VARCHAR(160),
    "currency" VARCHAR(3) NOT NULL,
    "paymentTerms" "PaymentTerms" NOT NULL DEFAULT 'NET_30',
    "creditLimit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "creditLimitCurrency" VARCHAR(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerBillingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" VARCHAR(80) NOT NULL DEFAULT 'Primary',
    "addressLine1" VARCHAR(250),
    "addressLine2" VARCHAR(250),
    "countryId" TEXT,
    "stateId" TEXT,
    "cityId" TEXT,
    "area" VARCHAR(120),
    "postalCode" VARCHAR(30),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "googlePlaceId" VARCHAR(255),
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerMetadata" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerGroup" "CustomerGroup" NOT NULL DEFAULT 'REGULAR',
    "leadSource" "CustomerLeadSource",
    "leadSourceOther" VARCHAR(160),
    "referralSource" VARCHAR(160),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GeoCountry_code_idx" ON "GeoCountry"("code");

-- CreateIndex
CREATE INDEX "GeoCountry_isActive_idx" ON "GeoCountry"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "GeoCountry_code_key" ON "GeoCountry"("code");

-- CreateIndex
CREATE INDEX "GeoState_countryId_isActive_idx" ON "GeoState"("countryId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "GeoState_countryId_name_key" ON "GeoState"("countryId", "name");

-- CreateIndex
CREATE INDEX "GeoCity_stateId_isActive_idx" ON "GeoCity"("stateId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "GeoCity_stateId_name_key" ON "GeoCity"("stateId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerBillingProfile_customerId_key" ON "CustomerBillingProfile"("customerId");

-- CreateIndex
CREATE INDEX "CustomerBillingProfile_currency_idx" ON "CustomerBillingProfile"("currency");

-- CreateIndex
CREATE INDEX "CustomerAddress_businessId_customerId_idx" ON "CustomerAddress"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "CustomerAddress_countryId_stateId_cityId_idx" ON "CustomerAddress"("countryId", "stateId", "cityId");

-- CreateIndex
CREATE INDEX "CustomerAddress_latitude_longitude_idx" ON "CustomerAddress"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerMetadata_customerId_key" ON "CustomerMetadata"("customerId");

-- CreateIndex
CREATE INDEX "CustomerMetadata_customerGroup_idx" ON "CustomerMetadata"("customerGroup");

-- CreateIndex
CREATE INDEX "CustomerMetadata_leadSource_idx" ON "CustomerMetadata"("leadSource");

-- CreateIndex
CREATE INDEX "Customer_businessId_email_idx" ON "Customer"("businessId", "email");

-- CreateIndex
CREATE INDEX "Customer_businessId_phone_idx" ON "Customer"("businessId", "phone");

-- CreateIndex
CREATE INDEX "Customer_businessId_industryId_idx" ON "Customer"("businessId", "industryId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_businessId_registrationCountryCode_tradeLicenseNo_key" ON "Customer"("businessId", "registrationCountryCode", "tradeLicenseNo");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_businessId_registrationCountryCode_vatNumber_key" ON "Customer"("businessId", "registrationCountryCode", "vatNumber");

-- AddForeignKey
ALTER TABLE "GeoState" ADD CONSTRAINT "GeoState_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeoCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoCity" ADD CONSTRAINT "GeoCity_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "GeoState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerBillingProfile" ADD CONSTRAINT "CustomerBillingProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeoCountry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "GeoState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "GeoCity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMetadata" ADD CONSTRAINT "CustomerMetadata_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "BusinessIndustry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
