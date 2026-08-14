/*
  Warnings:

  - You are about to drop the column `alternateCountryCode` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `alternatePhone` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `bestTimeToContact` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `preferredContactMethod` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappCountryCode` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappPhone` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `industryId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `registrationCountryCode` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `tradeLicenseNo` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `vatNumber` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the `CustomerAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerBillingProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeoCity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeoCountry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeoState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_industryId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_businessId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_cityId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAddress" DROP CONSTRAINT "CustomerAddress_stateId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerBillingProfile" DROP CONSTRAINT "CustomerBillingProfile_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerMetadata" DROP CONSTRAINT "CustomerMetadata_customerId_fkey";

-- DropForeignKey
ALTER TABLE "GeoCity" DROP CONSTRAINT "GeoCity_stateId_fkey";

-- DropForeignKey
ALTER TABLE "GeoState" DROP CONSTRAINT "GeoState_countryId_fkey";

-- DropIndex
DROP INDEX "Customer_businessId_email_idx";

-- DropIndex
DROP INDEX "Customer_businessId_industryId_idx";

-- DropIndex
DROP INDEX "Customer_businessId_phone_idx";

-- DropIndex
DROP INDEX "Customer_businessId_registrationCountryCode_tradeLicenseNo_key";

-- DropIndex
DROP INDEX "Customer_businessId_registrationCountryCode_vatNumber_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "alternateCountryCode",
DROP COLUMN "alternatePhone",
DROP COLUMN "bestTimeToContact",
DROP COLUMN "countryCode",
DROP COLUMN "preferredContactMethod",
DROP COLUMN "whatsappCountryCode",
DROP COLUMN "whatsappPhone";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "createdById",
DROP COLUMN "industryId",
DROP COLUMN "registrationCountryCode",
DROP COLUMN "tradeLicenseNo",
DROP COLUMN "vatNumber",
DROP COLUMN "website";

-- DropTable
DROP TABLE "CustomerAddress";

-- DropTable
DROP TABLE "CustomerBillingProfile";

-- DropTable
DROP TABLE "CustomerMetadata";

-- DropTable
DROP TABLE "GeoCity";

-- DropTable
DROP TABLE "GeoCountry";

-- DropTable
DROP TABLE "GeoState";

-- DropEnum
DROP TYPE "BestTimeToContact";

-- DropEnum
DROP TYPE "CustomerGroup";

-- DropEnum
DROP TYPE "CustomerLeadSource";

-- DropEnum
DROP TYPE "PaymentTerms";

-- DropEnum
DROP TYPE "PreferredContactMethod";
