"use server";

import { revalidatePath } from "next/cache";
import { requireTenant } from "@/lib/tenant/require-tenant";
import {
  saveBusinessProfile,
  selectIndustry,
  createService,
  createStaff,
  completeOnboarding,
  getIndustryTemplates,
  getBusinessIndustries,
  getServices,
  getStaff,
} from "@/lib/onboarding/persistence";

export async function saveBusinessAction(
  input: Parameters<typeof saveBusinessProfile>[1],
) {
  const context = await requireTenant();
  const result = await saveBusinessProfile(context.businessId, input);
  revalidatePath("/onboarding");
  return result;
}

export async function selectIndustryAction(
  input: Parameters<typeof selectIndustry>[1],
) {
  const context = await requireTenant();
  const result = await selectIndustry(context.businessId, input);
  revalidatePath("/onboarding");
  return result;
}

export async function createServiceAction(
  industryId: string,
  input: Parameters<typeof createService>[2],
) {
  const context = await requireTenant();
  const result = await createService(context.businessId, industryId, input);
  revalidatePath("/onboarding");
  return result;
}

export async function createStaffAction(
  input: Parameters<typeof createStaff>[1],
) {
  const context = await requireTenant();
  const result = await createStaff(context.businessId, input);
  revalidatePath("/onboarding");
  return result;
}

export async function completeOnboardingAction() {
  const context = await requireTenant();
  const result = await completeOnboarding(context.businessId);
  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  return result;
}


export async function getIndustryTemplatesAction() {
  const context = await requireTenant();
  return getIndustryTemplates();
}

export async function getBusinessIndustriesAction() {
  const context = await requireTenant();
  return getBusinessIndustries(context.businessId);
}

export async function getServicesAction(industryId?: string) {
  const context = await requireTenant();
  return getServices(context.businessId, industryId);
}

export async function getStaffAction() {
  const context = await requireTenant();
  return getStaff(context.businessId);
}
