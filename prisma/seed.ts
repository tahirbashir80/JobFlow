import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  PlanCode,
  PricingType,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured.");

const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

const entitlements = [
  ["customers", "Customers", "Core CRM"],
  ["sites", "Sites", "Core CRM"],
  ["jobs", "Jobs", "Core operations"],
  ["staff", "Staff Management", "Core operations"],
  ["service_catalog", "Service Catalog", "Setup"],
  ["job_scheduling", "Job Scheduling", "Core operations"],
  ["job_completion", "Job Completion", "Core operations"],
  ["service_reports", "Service Reports", "Reporting"],
  ["recurring_jobs", "Recurring Jobs", "Advanced"],
  ["advanced_analytics", "Advanced Analytics", "Advanced"],
  ["sms_notifications", "SMS Notifications", "Advanced"],
  ["gps_verification", "GPS Verification", "Advanced"],
  ["staff_performance", "Staff Performance", "Advanced"],
  ["api_access", "API Access", "Premium"],
  ["custom_branding", "Custom Branding", "Premium"],
  ["advanced_permissions", "Advanced Permissions", "Premium"],
  ["data_export", "Full Data Export", "Premium"],
];

const plans = [
  {
    code: PlanCode.STARTER,
    name: "Starter",
    monthlyPrice: "29.00",
    annualPrice: "290.00",
    maxUsers: 1,
    maxStaff: 2,
    maxCustomers: 100,
    maxJobsPerMonth: 50,
    maxStorageMb: 1024,
  },
  {
    code: PlanCode.PROFESSIONAL,
    name: "Professional",
    monthlyPrice: "59.00",
    annualPrice: "590.00",
    maxUsers: 1,
    maxStaff: 10,
    maxCustomers: 1000,
    maxJobsPerMonth: 500,
    maxStorageMb: 10240,
  },
  {
    code: PlanCode.BUSINESS,
    name: "Business",
    monthlyPrice: "99.00",
    annualPrice: "990.00",
    maxUsers: 5,
    maxStaff: null,
    maxCustomers: null,
    maxJobsPerMonth: null,
    maxStorageMb: 51200,
  },
];

const templateIndustries = [
  {
    name: "Pest Control",
    slug: "pest-control",
    category: "Property Services",
    services: [
      ["General Pest Control", "general-pest-control", PricingType.FIXED],
      ["Termite Treatment", "termite-treatment", PricingType.FIXED],
      ["Rodent Control", "rodent-control", PricingType.FIXED],
    ],
  },
  {
    name: "Tank Cleaning",
    slug: "tank-cleaning",
    category: "Cleaning Services",
    services: [
      ["Water Tank Cleaning", "water-tank-cleaning", PricingType.FIXED],
      ["Tank Inspection", "tank-inspection", PricingType.FIXED],
    ],
  },
  {
    name: "Lawn Care",
    slug: "lawn-care",
    category: "Outdoor Services",
    services: [
      ["Lawn Mowing", "lawn-mowing", PricingType.AREA],
      ["Lawn Maintenance", "lawn-maintenance", PricingType.FIXED],
    ],
  },
  {
    name: "Tree Services",
    slug: "tree-services",
    category: "Outdoor Services",
    services: [
      ["Tree Cutting", "tree-cutting", PricingType.QUOTE_REQUIRED],
      ["Tree Trimming", "tree-trimming", PricingType.QUOTE_REQUIRED],
    ],
  },
];

async function main() {
  const entitlementMap = new Map<string, string>();

  for (const [code, name, category] of entitlements) {
    const item = await db.featureEntitlement.upsert({
      where: { code },
      update: { name, category },
      create: { code, name, category },
    });
    entitlementMap.set(code, item.id);
  }

  for (const planData of plans) {
    const plan = await db.plan.upsert({
      where: { code: planData.code },
      update: planData,
      create: planData,
    });

    const allowed =
      planData.code === PlanCode.STARTER
        ? [
            "customers", "sites", "jobs", "staff", "service_catalog",
            "job_scheduling", "job_completion", "service_reports",
          ]
        : planData.code === PlanCode.PROFESSIONAL
        ? [
            "customers", "sites", "jobs", "staff", "service_catalog",
            "job_scheduling", "job_completion", "service_reports",
            "recurring_jobs", "advanced_analytics", "sms_notifications",
            "gps_verification", "staff_performance",
          ]
        : entitlements.map(([code]) => code);

    for (const code of allowed) {
      const entitlementId = entitlementMap.get(code)!;
      await db.planEntitlement.upsert({
        where: {
          planId_entitlementId: {
            planId: plan.id,
            entitlementId,
          },
        },
        update: {},
        create: { planId: plan.id, entitlementId },
      });
    }
  }

  for (const industry of templateIndustries) {
    const template = await db.industryTemplate.upsert({
      where: { slug: industry.slug },
      update: {
        name: industry.name,
        category: industry.category,
        isActive: true,
      },
      create: {
        name: industry.name,
        slug: industry.slug,
        category: industry.category,
      },
    });

    for (const [name, slug, pricingType] of industry.services) {
      await db.serviceTemplate.upsert({
        where: {
          industryTemplateId_slug: {
            industryTemplateId: template.id,
            slug,
          },
        },
        update: { name, pricingType, isActive: true },
        create: {
          industryTemplateId: template.id,
          name,
          slug,
          pricingType,
          isActive: true,
        },
      });
    }
  }

  console.log("JobFlow seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
