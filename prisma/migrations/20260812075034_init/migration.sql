-- CreateEnum
CREATE TYPE "PlatformRole" AS ENUM ('USER', 'SUPER_ADMIN', 'SUPPORT_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELING', 'CANCELED', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'PAUSED', 'CANCELED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "PlanCode" AS ENUM ('STARTER', 'PROFESSIONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'CORPORATE', 'PROPERTY_MANAGER', 'OTHER');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FIXED', 'HOURLY', 'DAILY', 'QUANTITY', 'AREA', 'PER_ITEM', 'CUSTOM', 'QUOTE_REQUIRED');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'NEW', 'SCHEDULED', 'ASSIGNED', 'DISPATCHED', 'EN_ROUTE', 'ON_SITE', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'FAILED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'ACCEPTED', 'DECLINED', 'EN_ROUTE', 'ON_SITE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ChecklistItemType" AS ENUM ('BOOLEAN', 'TEXT', 'NUMBER', 'SELECT', 'PHOTO', 'SIGNATURE');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('TEXT', 'LONG_TEXT', 'NUMBER', 'DECIMAL', 'DATE', 'DATETIME', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'CURRENCY');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('BEFORE', 'DURING', 'AFTER', 'DOCUMENT', 'REPORT', 'SIGNATURE', 'OTHER');

-- CreateEnum
CREATE TYPE "SignatureType" AS ENUM ('CUSTOMER', 'TECHNICIAN', 'AUTHORIZED_PERSON');

-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "UsageMetricType" AS ENUM ('USERS', 'STAFF', 'CUSTOMERS', 'JOBS', 'STORAGE', 'SMS', 'API_CALLS', 'REPORTS');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ARCHIVE', 'RESTORE', 'LOGIN', 'LOGOUT', 'EXPORT', 'ASSIGN', 'COMPLETE', 'CANCEL', 'PAYMENT', 'SUBSCRIPTION', 'OTHER');

-- CreateEnum
CREATE TYPE "ServiceReportStatus" AS ENUM ('DRAFT', 'GENERATED', 'SENT', 'VIEWED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "code" "PlanCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "monthlyPrice" DECIMAL(12,2) NOT NULL,
    "annualPrice" DECIMAL(12,2) NOT NULL,
    "maxUsers" INTEGER,
    "maxStaff" INTEGER,
    "maxCustomers" INTEGER,
    "maxJobsPerMonth" INTEGER,
    "maxStorageMb" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureEntitlement" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanEntitlement" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "entitlementId" TEXT NOT NULL,

    CONSTRAINT "PlanEntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "billingInterval" "BillingInterval" NOT NULL DEFAULT 'MONTHLY',
    "trialStartsAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "canceledAt" TIMESTAMP(3),
    "provider" TEXT,
    "providerCustomerId" TEXT,
    "providerSubscriptionId" TEXT,
    "providerPriceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionEvent" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "metric" "UsageMetricType" NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "status" "BusinessStatus" NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" TIMESTAMP(3),
    "storageUsedMb" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessSetting" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "platformRole" "PlatformRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystemRole" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "module" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "photoUrl" TEXT,
    "roleTitle" TEXT,
    "status" "StaffStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffServiceSkill" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "proficiency" INTEGER,

    CONSTRAINT "StaffServiceSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAvailability" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StaffAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTemplate" (
    "id" TEXT NOT NULL,
    "industryTemplateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "pricingType" "PricingType" NOT NULL DEFAULT 'FIXED',
    "suggestedPrice" DECIMAL(12,2),
    "estimatedMinutes" INTEGER,
    "configuration" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessIndustry" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "templateId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessIndustry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "templateId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE',
    "pricingType" "PricingType" NOT NULL DEFAULT 'FIXED',
    "basePrice" DECIMAL(12,2),
    "estimatedMinutes" INTEGER,
    "requiredStaffCount" INTEGER NOT NULL DEFAULT 1,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePricing" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricingType" "PricingType" NOT NULL,
    "basePrice" DECIMAL(12,2),
    "unitName" TEXT,
    "unitPrice" DECIMAL(12,2),
    "minimumCharge" DECIMAL(12,2),
    "taxRate" DECIMAL(6,3),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3),
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "ServicePricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceChecklist" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceChecklistItem" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" "ChecklistItemType" NOT NULL DEFAULT 'BOOLEAN',
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ServiceChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceFieldDefinition" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" "CustomFieldType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "options" JSONB,
    "validation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceFieldDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobFieldValue" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "fieldDefinitionId" TEXT NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerNumber" TEXT NOT NULL,
    "type" "CustomerType" NOT NULL DEFAULT 'RESIDENTIAL',
    "firstName" TEXT,
    "lastName" TEXT,
    "companyName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "designation" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "contactName" TEXT,
    "contactPhone" TEXT,
    "accessInstructions" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "siteId" TEXT,
    "serviceId" TEXT NOT NULL,
    "createdById" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'NEW',
    "priority" "JobPriority" NOT NULL DEFAULT 'NORMAL',
    "title" TEXT,
    "description" TEXT,
    "scheduledStart" TIMESTAMP(3),
    "scheduledEnd" TIMESTAMP(3),
    "actualStart" TIMESTAMP(3),
    "actualEnd" TIMESTAMP(3),
    "price" DECIMAL(12,2),
    "taxAmount" DECIMAL(12,2),
    "discountAmount" DECIMAL(12,2),
    "totalAmount" DECIMAL(12,2),
    "customerNotes" TEXT,
    "internalNotes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAssignment" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "JobAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobChecklistItem" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "serviceChecklistItemId" TEXT,
    "label" TEXT NOT NULL,
    "type" "ChecklistItemType" NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "JobChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobMaterial" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit" TEXT,
    "unitCost" DECIMAL(12,2),
    "totalCost" DECIMAL(12,2),
    "notes" TEXT,

    CONSTRAINT "JobMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobNote" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "authorId" TEXT,
    "content" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "JobNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobStatusHistory" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "fromStatus" "JobStatus",
    "toStatus" "JobStatus" NOT NULL,
    "changedById" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCompletion" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "completedById" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workPerformed" TEXT,
    "findings" TEXT,
    "recommendations" TEXT,
    "customerComments" TEXT,
    "internalNotes" TEXT,
    "customerApproved" BOOLEAN NOT NULL DEFAULT false,
    "customerApprovedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSignature" (
    "id" TEXT NOT NULL,
    "completionId" TEXT NOT NULL,
    "type" "SignatureType" NOT NULL,
    "signerName" TEXT,
    "signatureUrl" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceReport" (
    "id" TEXT NOT NULL,
    "completionId" TEXT NOT NULL,
    "reportNumber" TEXT NOT NULL,
    "status" "ServiceReportStatus" NOT NULL DEFAULT 'DRAFT',
    "fileUrl" TEXT,
    "generatedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "jobId" TEXT,
    "uploadedById" TEXT,
    "type" "AttachmentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileSizeBytes" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringService" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recurrenceType" "RecurrenceType" NOT NULL,
    "intervalValue" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(12,2),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "RecurringService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobId" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "serviceId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "providerPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    "recipient" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    "jobId" TEXT,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "businessId" TEXT,
    "performedById" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_code_key" ON "Plan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureEntitlement_code_key" ON "FeatureEntitlement"("code");

-- CreateIndex
CREATE INDEX "PlanEntitlement_entitlementId_idx" ON "PlanEntitlement"("entitlementId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanEntitlement_planId_entitlementId_key" ON "PlanEntitlement"("planId", "entitlementId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_businessId_key" ON "Subscription"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_providerCustomerId_key" ON "Subscription"("providerCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_providerSubscriptionId_key" ON "Subscription"("providerSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Subscription_planId_idx" ON "Subscription"("planId");

-- CreateIndex
CREATE INDEX "Subscription_currentPeriodEnd_idx" ON "Subscription"("currentPeriodEnd");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_subscriptionId_createdAt_idx" ON "SubscriptionEvent"("subscriptionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionEvent_provider_providerEventId_key" ON "SubscriptionEvent"("provider", "providerEventId");

-- CreateIndex
CREATE INDEX "UsageRecord_businessId_metric_idx" ON "UsageRecord"("businessId", "metric");

-- CreateIndex
CREATE UNIQUE INDEX "UsageRecord_businessId_metric_periodStart_periodEnd_key" ON "UsageRecord"("businessId", "metric", "periodStart", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_status_idx" ON "Business"("status");

-- CreateIndex
CREATE INDEX "Business_archivedAt_idx" ON "Business"("archivedAt");

-- CreateIndex
CREATE INDEX "Business_createdAt_idx" ON "Business"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSetting_businessId_key_key" ON "BusinessSetting"("businessId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_businessId_idx" ON "User"("businessId");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_archivedAt_idx" ON "User"("archivedAt");

-- CreateIndex
CREATE INDEX "Role_businessId_archivedAt_idx" ON "Role"("businessId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_businessId_name_key" ON "Role"("businessId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE INDEX "Staff_businessId_status_idx" ON "Staff"("businessId", "status");

-- CreateIndex
CREATE INDEX "Staff_businessId_archivedAt_idx" ON "Staff"("businessId", "archivedAt");

-- CreateIndex
CREATE INDEX "StaffServiceSkill_businessId_serviceId_idx" ON "StaffServiceSkill"("businessId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffServiceSkill_staffId_serviceId_key" ON "StaffServiceSkill"("staffId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffAvailability_staffId_dayOfWeek_key" ON "StaffAvailability"("staffId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryTemplate_slug_key" ON "IndustryTemplate"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTemplate_industryTemplateId_slug_key" ON "ServiceTemplate"("industryTemplateId", "slug");

-- CreateIndex
CREATE INDEX "BusinessIndustry_businessId_isActive_idx" ON "BusinessIndustry"("businessId", "isActive");

-- CreateIndex
CREATE INDEX "BusinessIndustry_businessId_archivedAt_idx" ON "BusinessIndustry"("businessId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessIndustry_businessId_name_key" ON "BusinessIndustry"("businessId", "name");

-- CreateIndex
CREATE INDEX "Service_businessId_industryId_idx" ON "Service"("businessId", "industryId");

-- CreateIndex
CREATE INDEX "Service_businessId_status_idx" ON "Service"("businessId", "status");

-- CreateIndex
CREATE INDEX "Service_businessId_archivedAt_idx" ON "Service"("businessId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Service_businessId_code_key" ON "Service"("businessId", "code");

-- CreateIndex
CREATE INDEX "ServicePricing_serviceId_isActive_idx" ON "ServicePricing"("serviceId", "isActive");

-- CreateIndex
CREATE INDEX "ServicePricing_serviceId_archivedAt_idx" ON "ServicePricing"("serviceId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceChecklist_serviceId_key" ON "ServiceChecklist"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceChecklistItem_checklistId_sortOrder_idx" ON "ServiceChecklistItem"("checklistId", "sortOrder");

-- CreateIndex
CREATE INDEX "ServiceFieldDefinition_serviceId_sortOrder_idx" ON "ServiceFieldDefinition"("serviceId", "sortOrder");

-- CreateIndex
CREATE INDEX "ServiceFieldDefinition_serviceId_archivedAt_idx" ON "ServiceFieldDefinition"("serviceId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceFieldDefinition_serviceId_key_key" ON "ServiceFieldDefinition"("serviceId", "key");

-- CreateIndex
CREATE INDEX "JobFieldValue_fieldDefinitionId_idx" ON "JobFieldValue"("fieldDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "JobFieldValue_jobId_fieldDefinitionId_key" ON "JobFieldValue"("jobId", "fieldDefinitionId");

-- CreateIndex
CREATE INDEX "Customer_businessId_type_idx" ON "Customer"("businessId", "type");

-- CreateIndex
CREATE INDEX "Customer_businessId_isActive_idx" ON "Customer"("businessId", "isActive");

-- CreateIndex
CREATE INDEX "Customer_businessId_archivedAt_idx" ON "Customer"("businessId", "archivedAt");

-- CreateIndex
CREATE INDEX "Customer_businessId_companyName_idx" ON "Customer"("businessId", "companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_businessId_customerNumber_key" ON "Customer"("businessId", "customerNumber");

-- CreateIndex
CREATE INDEX "Contact_customerId_archivedAt_idx" ON "Contact"("customerId", "archivedAt");

-- CreateIndex
CREATE INDEX "Site_businessId_customerId_idx" ON "Site"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "Site_businessId_city_idx" ON "Site"("businessId", "city");

-- CreateIndex
CREATE INDEX "Site_businessId_archivedAt_idx" ON "Site"("businessId", "archivedAt");

-- CreateIndex
CREATE INDEX "Job_businessId_status_idx" ON "Job"("businessId", "status");

-- CreateIndex
CREATE INDEX "Job_businessId_scheduledStart_idx" ON "Job"("businessId", "scheduledStart");

-- CreateIndex
CREATE INDEX "Job_businessId_customerId_idx" ON "Job"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "Job_businessId_serviceId_idx" ON "Job"("businessId", "serviceId");

-- CreateIndex
CREATE INDEX "Job_businessId_priority_idx" ON "Job"("businessId", "priority");

-- CreateIndex
CREATE INDEX "Job_businessId_archivedAt_idx" ON "Job"("businessId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Job_businessId_jobNumber_key" ON "Job"("businessId", "jobNumber");

-- CreateIndex
CREATE INDEX "JobAssignment_businessId_staffId_idx" ON "JobAssignment"("businessId", "staffId");

-- CreateIndex
CREATE INDEX "JobAssignment_businessId_jobId_idx" ON "JobAssignment"("businessId", "jobId");

-- CreateIndex
CREATE UNIQUE INDEX "JobAssignment_jobId_staffId_key" ON "JobAssignment"("jobId", "staffId");

-- CreateIndex
CREATE INDEX "JobChecklistItem_jobId_sortOrder_idx" ON "JobChecklistItem"("jobId", "sortOrder");

-- CreateIndex
CREATE INDEX "JobMaterial_jobId_idx" ON "JobMaterial"("jobId");

-- CreateIndex
CREATE INDEX "JobNote_jobId_createdAt_idx" ON "JobNote"("jobId", "createdAt");

-- CreateIndex
CREATE INDEX "JobStatusHistory_jobId_createdAt_idx" ON "JobStatusHistory"("jobId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobCompletion_jobId_key" ON "JobCompletion"("jobId");

-- CreateIndex
CREATE INDEX "JobSignature_completionId_idx" ON "JobSignature"("completionId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceReport_completionId_reportNumber_key" ON "ServiceReport"("completionId", "reportNumber");

-- CreateIndex
CREATE INDEX "Attachment_businessId_jobId_idx" ON "Attachment"("businessId", "jobId");

-- CreateIndex
CREATE INDEX "Attachment_businessId_archivedAt_idx" ON "Attachment"("businessId", "archivedAt");

-- CreateIndex
CREATE INDEX "RecurringService_businessId_nextRunAt_idx" ON "RecurringService"("businessId", "nextRunAt");

-- CreateIndex
CREATE INDEX "RecurringService_businessId_isActive_idx" ON "RecurringService"("businessId", "isActive");

-- CreateIndex
CREATE INDEX "RecurringService_businessId_archivedAt_idx" ON "RecurringService"("businessId", "archivedAt");

-- CreateIndex
CREATE INDEX "Invoice_businessId_status_idx" ON "Invoice"("businessId", "status");

-- CreateIndex
CREATE INDEX "Invoice_businessId_customerId_idx" ON "Invoice"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "Invoice_businessId_dueDate_idx" ON "Invoice"("businessId", "dueDate");

-- CreateIndex
CREATE INDEX "Invoice_businessId_archivedAt_idx" ON "Invoice"("businessId", "archivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_businessId_invoiceNumber_key" ON "Invoice"("businessId", "invoiceNumber");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceItem_serviceId_idx" ON "InvoiceItem"("serviceId");

-- CreateIndex
CREATE INDEX "Payment_businessId_status_idx" ON "Payment"("businessId", "status");

-- CreateIndex
CREATE INDEX "Payment_businessId_customerId_idx" ON "Payment"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "Payment_businessId_invoiceId_idx" ON "Payment"("businessId", "invoiceId");

-- CreateIndex
CREATE INDEX "Notification_businessId_status_idx" ON "Notification"("businessId", "status");

-- CreateIndex
CREATE INDEX "Notification_businessId_createdAt_idx" ON "Notification"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_businessId_createdAt_idx" ON "ActivityLog"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_businessId_jobId_idx" ON "ActivityLog"("businessId", "jobId");

-- CreateIndex
CREATE INDEX "AuditLog_businessId_createdAt_idx" ON "AuditLog"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "PlanEntitlement" ADD CONSTRAINT "PlanEntitlement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanEntitlement" ADD CONSTRAINT "PlanEntitlement_entitlementId_fkey" FOREIGN KEY ("entitlementId") REFERENCES "FeatureEntitlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionEvent" ADD CONSTRAINT "SubscriptionEvent_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessSetting" ADD CONSTRAINT "BusinessSetting_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffServiceSkill" ADD CONSTRAINT "StaffServiceSkill_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffServiceSkill" ADD CONSTRAINT "StaffServiceSkill_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffServiceSkill" ADD CONSTRAINT "StaffServiceSkill_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAvailability" ADD CONSTRAINT "StaffAvailability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceTemplate" ADD CONSTRAINT "ServiceTemplate_industryTemplateId_fkey" FOREIGN KEY ("industryTemplateId") REFERENCES "IndustryTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessIndustry" ADD CONSTRAINT "BusinessIndustry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessIndustry" ADD CONSTRAINT "BusinessIndustry_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "IndustryTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "BusinessIndustry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ServiceTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePricing" ADD CONSTRAINT "ServicePricing_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceChecklist" ADD CONSTRAINT "ServiceChecklist_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceChecklistItem" ADD CONSTRAINT "ServiceChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "ServiceChecklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceFieldDefinition" ADD CONSTRAINT "ServiceFieldDefinition_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobFieldValue" ADD CONSTRAINT "JobFieldValue_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobFieldValue" ADD CONSTRAINT "JobFieldValue_fieldDefinitionId_fkey" FOREIGN KEY ("fieldDefinitionId") REFERENCES "ServiceFieldDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAssignment" ADD CONSTRAINT "JobAssignment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAssignment" ADD CONSTRAINT "JobAssignment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAssignment" ADD CONSTRAINT "JobAssignment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobChecklistItem" ADD CONSTRAINT "JobChecklistItem_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobChecklistItem" ADD CONSTRAINT "JobChecklistItem_serviceChecklistItemId_fkey" FOREIGN KEY ("serviceChecklistItemId") REFERENCES "ServiceChecklistItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMaterial" ADD CONSTRAINT "JobMaterial_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobNote" ADD CONSTRAINT "JobNote_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobStatusHistory" ADD CONSTRAINT "JobStatusHistory_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCompletion" ADD CONSTRAINT "JobCompletion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCompletion" ADD CONSTRAINT "JobCompletion_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSignature" ADD CONSTRAINT "JobSignature_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "JobCompletion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_completionId_fkey" FOREIGN KEY ("completionId") REFERENCES "JobCompletion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringService" ADD CONSTRAINT "RecurringService_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringService" ADD CONSTRAINT "RecurringService_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringService" ADD CONSTRAINT "RecurringService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
