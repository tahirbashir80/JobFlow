import { notFound } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getContract, getContractFormData } from "@/lib/contracts/persistence";
import { ContractForm } from "../../ContractForm";

export default async function EditContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const context = await requireTenant();
  const { id } = await params;
  const [initial, data] = await Promise.all([
    getContract(context.businessId, id),
    getContractFormData(context.businessId),
  ]);

  if (!initial) notFound();

  return (
    <main className="min-h-screen">
      <div data-page-width className="py-5 lg:py-6">
        <ContractForm
          {...data}
          initial={{ ...initial, notes: initial.notes ?? "" }}
        />
      </div>
    </main>
  );
}
