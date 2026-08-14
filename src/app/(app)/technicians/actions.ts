"use server";

import { revalidatePath } from "next/cache";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { linkTechnicianUser } from "@/lib/technicians/persistence";

export async function linkTechnicianUserAction(staffId: string, userId: string | null) {
  const context = await requireTenant();
  await linkTechnicianUser(context.businessId, staffId, userId || null);
  revalidatePath(`/technicians/${staffId}`);
  revalidatePath("/technicians");
  revalidatePath("/dispatch");
}
