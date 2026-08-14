import { requireTenant } from "@/lib/tenant/require-tenant";
import { getContractFormData } from "@/lib/contracts/persistence";
import { ContractForm } from "../ContractForm";

export default async function NewContractPage() {
  const context = await requireTenant();
  const data = await getContractFormData(context.businessId);

  return (
    <main className="min-h-screen">
      <div data-page-width className="py-5 lg:py-6">
        <ContractForm {...data} />
      </div>
    </main>
  );
}
