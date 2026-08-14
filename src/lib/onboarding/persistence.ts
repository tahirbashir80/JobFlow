import { db } from "@/lib/db/prisma";
import {
  onboardingBusinessSchema,
  onboardingIndustrySchema,
  onboardingServiceSchema,
  onboardingStaffSchema,
  type OnboardingBusinessInput,
  type OnboardingIndustryInput,
  type OnboardingServiceInput,
  type OnboardingStaffInput,
} from "@/lib/validation/onboarding";

export async function saveBusinessProfile(
  businessId: string,
  input: OnboardingBusinessInput,
) {
  const data = onboardingBusinessSchema.parse(input);

  return db.business.update({
    where: { id: businessId },
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      website: data.website || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      postalCode: data.postalCode || null,
      country: data.country,
      currency: data.currency,
      timezone: data.timezone,
    },
  });
}

export async function getIndustryTemplates() {
  return db.industryTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getBusinessIndustries(businessId: string) {
  return db.businessIndustry.findMany({
    where: {
      businessId,
      archivedAt: null,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getServices(businessId: string, industryId?: string) {
  return db.service.findMany({
    where: {
      businessId,
      archivedAt: null,
      ...(industryId ? { industryId } : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getStaff(businessId: string) {
  return db.staff.findMany({
    where: {
      businessId,
      archivedAt: null,
    },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
}

export async function selectIndustry(
  businessId: string,
  input: OnboardingIndustryInput,
) {
  const data = onboardingIndustrySchema.parse(input);

  if (data.industryId) {
    const template = await db.industryTemplate.findUnique({
      where: { id: data.industryId },
    });

    if (!template) {
      throw new Error("Industry template not found.");
    }

    return db.businessIndustry.upsert({
      where: {
        businessId_name: {
          businessId,
          name: template.name,
        },
      },
      create: {
        businessId,
        templateId: template.id,
        name: template.name,
        description: template.description,
        icon: template.icon,
      },
      update: {
        templateId: template.id,
        description: template.description,
        icon: template.icon,
        isActive: true,
        archivedAt: null,
      },
    });
  }

  if (data.customIndustryName) {
    return db.businessIndustry.create({
      data: {
        businessId,
        name: data.customIndustryName,
        isActive: true,
      },
    });
  }

  throw new Error("Industry selection is required.");
}

export async function createService(
  businessId: string,
  industryId: string,
  input: OnboardingServiceInput,
) {
  const data = onboardingServiceSchema.parse(input);

  const industry = await db.businessIndustry.findFirst({
    where: {
      id: industryId,
      businessId,
      archivedAt: null,
      isActive: true,
    },
    select: { id: true },
  });

  if (!industry) {
    throw new Error("Industry does not belong to this business.");
  }

  return db.service.create({
    data: {
      businessId,
      industryId: industry.id,
      name: data.name,
      description: data.description || null,
      pricingType: data.pricingType,
      basePrice: data.basePrice ?? null,
      estimatedMinutes: data.estimatedMinutes ?? null,
    },
  });
}

export async function createStaff(
  businessId: string,
  input: OnboardingStaffInput,
) {
  const data = onboardingStaffSchema.parse(input);

  return db.staff.create({
    data: {
      businessId,
      firstName: data.firstName,
      lastName: data.lastName || null,
      email: data.email || null,
      phone: data.phone || null,
      roleTitle: data.roleTitle || null,
    },
  });
}

export async function completeOnboarding(businessId: string) {
  const completedAt = new Date();

  await db.businessSetting.upsert({
    where: {
      businessId_key: {
        businessId,
        key: "onboardingCompletedAt",
      },
    },
    create: {
      businessId,
      key: "onboardingCompletedAt",
      value: completedAt.toISOString(),
    },
    update: {
      value: completedAt.toISOString(),
    },
  });

  return db.business.findUniqueOrThrow({
    where: { id: businessId },
  });
}
