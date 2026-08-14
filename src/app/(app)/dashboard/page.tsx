import { requireTenant } from "@/lib/tenant/require-tenant";
import { getDashboardMetrics } from "@/lib/dashboard/persistence";
import CorporateDashboard from "@/components/dashboard/CorporateDashboard";

export default async function DashboardPage() {
  const context = await requireTenant();
  const data = await getDashboardMetrics(context.businessId);

  return <CorporateDashboard data={data} />;
}
