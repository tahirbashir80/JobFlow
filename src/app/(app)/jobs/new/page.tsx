import { requireTenant } from "@/lib/tenant/require-tenant";
import { getJobFormData } from "@/lib/jobs/persistence";
import { JobForm } from "../components/JobForm";

export default async function NewJobPage() {
  const context = await requireTenant();
  const { customers, services, staff, contracts } = await getJobFormData(context.businessId);
  const safeServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    basePrice: service.basePrice?.toString() ?? null,
    estimatedMinutes: service.estimatedMinutes,
  }));

  return (
    <main className="p-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-blue-600">JOBS</p>
        <h1 className="mt-1 text-3xl font-bold">Create New Job</h1>
        <p className="mt-2 text-gray-500">Create a scheduled piece of work for a customer and site.</p>
        <div className="mt-7">
          <JobForm customers={customers} services={safeServices} staff={staff} contracts={contracts.map((contract) => ({ ...contract, endDate: contract.endDate?.toISOString() ?? null }))} />
        </div>
      </div>
    </main>
  );
}
