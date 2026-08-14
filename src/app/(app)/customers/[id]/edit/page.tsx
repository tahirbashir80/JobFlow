import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CustomerForm } from "../../components/CustomerForm";
import { customerName, getCustomer } from "@/lib/customers/persistence";
import { requireTenant } from "@/lib/tenant/require-tenant";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await requireTenant();
  const { id } = await params;
  const customer = await getCustomer(context.businessId, id);
  if (!customer) notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-3.5 py-5 lg:px-4">
        <Link href={`/customers/${customer.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--primary)]">
          <ArrowLeft size={13} /> Customer
        </Link>
        <h1 className="jf-page-title mt-4">Edit Customer</h1>
        <p className="jf-page-subtitle mt-1.5">Update the core customer profile for {customerName(customer)}.</p>
        <CustomerForm
          mode="edit"
          customerId={customer.id}
          initial={{
            type: customer.type,
            firstName: customer.firstName ?? "",
            lastName: customer.lastName ?? "",
            companyName: customer.companyName ?? "",
            phone: customer.phone ?? "",
            email: customer.email ?? "",
            notes: customer.notes ?? "",
          }}
        />
      </div>
    </main>
  );
}
