import { requireTenant } from "@/lib/tenant/require-tenant";
import { listRecurringServices, getRecurringFormData } from "@/lib/recurring/persistence";
import { RecurringManager } from "./RecurringManager";

export default async function RecurringPage() {
  const context=await requireTenant();
  const [initial,form]=await Promise.all([listRecurringServices(context.businessId),getRecurringFormData(context.businessId)]);
  return <main className="p-8"><div className="mx-auto max-w-7xl">
    <p className="text-sm font-semibold text-blue-600">AUTOMATION</p>
    <h1 className="mt-1 text-3xl font-bold">Recurring Jobs</h1>
    <p className="mt-2 text-gray-500">Schedule repeat services and generate future Jobs automatically.</p>
    <div className="mt-7"><RecurringManager initial={initial} customers={form.customers} services={form.services}/></div>
  </div></main>;
}
