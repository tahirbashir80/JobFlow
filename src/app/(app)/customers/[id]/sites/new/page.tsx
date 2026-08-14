import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer, customerName } from "@/lib/customers/persistence";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { SiteForm } from "../../../components/SiteForm";

export default async function NewSitePage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant(); const { id } = await params; const customer = await getCustomer(context.businessId, id); if (!customer) notFound();
  return <main className="p-8"><div className="mx-auto max-w-3xl"><Link href={`/customers/${id}`} className="text-sm font-medium text-gray-500">← {customerName(customer)}</Link><h1 className="mt-3 text-3xl font-bold">New Site</h1><p className="mt-2 text-gray-500">Add a service location for this customer.</p><SiteForm customerId={id} /></div></main>;
}
