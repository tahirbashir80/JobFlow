"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { archiveCustomer, archiveSite, createCustomer, createSite, updateCustomer, updateCustomerProfile } from "@/lib/customers/persistence";
import type { CustomerInput, SiteInput } from "@/lib/validation/customer";

export async function createCustomerAction(input: CustomerInput) {
  const context = await requireTenant();
  const customer = await createCustomer(context.businessId, input, context.userId);
  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomerAction(customerId: string, input: CustomerInput) {
  const context = await requireTenant();
  await updateCustomer(context.businessId, customerId, input);
  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/customers");
}

export async function updateCustomerProfileAction(
  customerId: string,
  input: {
    type: "RESIDENTIAL" | "COMMERCIAL" | "CORPORATE" | "PROPERTY_MANAGER" | "OTHER";
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    email: string;
    notes: string;
  },
) {
  const context = await requireTenant();
  await updateCustomerProfile(context.businessId, customerId, input);
  revalidatePath(`/customers/${customerId}`);
  revalidatePath(`/customers/${customerId}/edit`);
  revalidatePath("/customers");
  redirect(`/customers/${customerId}`);
}

export async function archiveCustomerAction(customerId: string) {
  const context = await requireTenant();
  await archiveCustomer(context.businessId, customerId);
  revalidatePath("/customers");
  redirect("/customers");
}

export async function createSiteAction(customerId: string, input: SiteInput) {
  const context = await requireTenant();
  await createSite(context.businessId, customerId, input);
  revalidatePath(`/customers/${customerId}`);
  redirect(`/customers/${customerId}`);
}

export async function archiveSiteAction(siteId: string, customerId: string) {
  const context = await requireTenant();
  await archiveSite(context.businessId, siteId);
  revalidatePath(`/customers/${customerId}`);
}
