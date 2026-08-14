import { requireTenant } from "@/lib/tenant/require-tenant";
import { CorporateShell } from "@/components/layout/CorporateShell";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireTenant();
  return <CorporateShell>{children}</CorporateShell>;
}
