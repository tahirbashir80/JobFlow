import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import type { TenantContext } from "./context";
import { assertTenantContext } from "./context";

export async function requireTenant(): Promise<TenantContext> {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return assertTenantContext({
    businessId: session.user.businessId,
    userId: session.user.id,
    roleId: session.user.roleId,
  });
}
