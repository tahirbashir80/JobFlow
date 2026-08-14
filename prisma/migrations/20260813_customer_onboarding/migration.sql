-- JobFlow Customer Onboarding normalization

CREATE TYPE "CustomerGroup" AS ENUM ('ONE_TIME', 'VIP', 'PREMIUM', 'REGULAR');
CREATE TYPE "CustomerLeadSource" AS ENUM ('GOOGLE', 'SOCIAL_MEDIA', 'REFERRAL', 'FLYER_BROCHURE', 'WALK_IN', 'OTHER');
CREATE TYPE "PreferredContactMethod" AS ENUM ('PHONE', 'EMAIL', 'WHATSAPP');
CREATE TYPE "BestTimeToContact" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'ANY_TIME');
CREATE TYPE "PaymentTerms" AS ENUM ('DUE_ON_RECEIPT', 'NET_15', 'NET_30', 'NET_45', 'NET_60');

ALTER TABLE "Customer"
  ADD COLUMN "website" TEXT,
  ADD COLUMN "industryId" TEXT,
  ADD COLUMN "registrationCountryCode" VARCHAR(2),
  ADD COLUMN "tradeLicenseNo" VARCHAR(80),
  ADD COLUMN "vatNumber" VARCHAR(80),
  ADD COLUMN "createdById" TEXT;

ALTER TABLE "Contact"
  ADD COLUMN "countryCode" VARCHAR(8),
  ADD COLUMN "alternateCountryCode" VARCHAR(8),
  ADD COLUMN "alternatePhone" TEXT,
  ADD COLUMN "whatsappCountryCode" VARCHAR(8),
  ADD COLUMN "whatsappPhone" TEXT,
  ADD COLUMN "preferredContactMethod" "PreferredContactMethod",
  ADD COLUMN "bestTimeToContact" "BestTimeToContact";

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

CREATE TABLE "GeoCity" (
  "id" TEXT NOT NULL,
  "stateId" TEXT NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GeoCity_pkey" PRIMARY KEY ("id")
);

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

CREATE UNIQUE INDEX "GeoCountry_code_key" ON "GeoCountry"("code");
CREATE INDEX "GeoCountry_isActive_idx" ON "GeoCountry"("isActive");
CREATE UNIQUE INDEX "GeoState_countryId_name_key" ON "GeoState"("countryId", "name");
CREATE INDEX "GeoState_countryId_isActive_idx" ON "GeoState"("countryId", "isActive");
CREATE UNIQUE INDEX "GeoCity_stateId_name_key" ON "GeoCity"("stateId", "name");
CREATE INDEX "GeoCity_stateId_isActive_idx" ON "GeoCity"("stateId", "isActive");
CREATE UNIQUE INDEX "CustomerBillingProfile_customerId_key" ON "CustomerBillingProfile"("customerId");
CREATE INDEX "CustomerBillingProfile_currency_idx" ON "CustomerBillingProfile"("currency");
CREATE INDEX "CustomerAddress_businessId_customerId_idx" ON "CustomerAddress"("businessId", "customerId");
CREATE INDEX "CustomerAddress_countryId_stateId_cityId_idx" ON "CustomerAddress"("countryId", "stateId", "cityId");
CREATE INDEX "CustomerAddress_latitude_longitude_idx" ON "CustomerAddress"("latitude", "longitude");
CREATE UNIQUE INDEX "CustomerMetadata_customerId_key" ON "CustomerMetadata"("customerId");
CREATE INDEX "CustomerMetadata_customerGroup_idx" ON "CustomerMetadata"("customerGroup");
CREATE INDEX "CustomerMetadata_leadSource_idx" ON "CustomerMetadata"("leadSource");
CREATE UNIQUE INDEX "Customer_businessId_registrationCountryCode_tradeLicenseNo_key" ON "Customer"("businessId", "registrationCountryCode", "tradeLicenseNo");
CREATE UNIQUE INDEX "Customer_businessId_registrationCountryCode_vatNumber_key" ON "Customer"("businessId", "registrationCountryCode", "vatNumber");
CREATE INDEX "Customer_businessId_email_idx" ON "Customer"("businessId", "email");
CREATE INDEX "Customer_businessId_phone_idx" ON "Customer"("businessId", "phone");
CREATE INDEX "Customer_businessId_industryId_idx" ON "Customer"("businessId", "industryId");

ALTER TABLE "Customer" ADD CONSTRAINT "Customer_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "BusinessIndustry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GeoState" ADD CONSTRAINT "GeoState_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeoCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GeoCity" ADD CONSTRAINT "GeoCity_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "GeoState"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerBillingProfile" ADD CONSTRAINT "CustomerBillingProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeoCountry"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "GeoState"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "GeoCity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CustomerMetadata" ADD CONSTRAINT "CustomerMetadata_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
