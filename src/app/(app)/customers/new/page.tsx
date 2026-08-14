import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireTenant } from "@/lib/tenant/require-tenant";
import { getBusinessIndustries } from "@/lib/onboarding/persistence";
import { getGeoCountries } from "@/lib/geo/persistence";
import { db } from "@/lib/db/prisma";
import { CustomerOnboardingForm } from "@/components/customers/CustomerOnboardingForm";

export default async function NewCustomerPage() {
  const context = await requireTenant();
  const [industries, countries] = await Promise.all([
    getBusinessIndustries(context.businessId),
    getGeoCountries(),
  ]);
  const countryMap = new Map(countries.map((country: { name: string; code: string }) => [country.name.toLowerCase(), country.code]));
  const business = await db.business.findUnique({ where: { id: context.businessId }, select: { country: true, currency: true } });
  const defaultCountryCode: string | undefined = business?.country ? countryMap.get(business.country.toLowerCase()) : undefined;

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-[1500px] px-3.5 py-5 lg:px-4 xl:px-5">
        <Link href="/customers" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--muted)] transition hover:text-[var(--primary)]">
          <ArrowLeft size={13} /> Customers
        </Link>
        <div className="mt-4 flex flex-col gap-2">
          <p className="jf-eyebrow">Customer Onboarding</p>
          <h1 className="jf-page-title">New Customer</h1>
          <p className="jf-page-subtitle">Create a complete customer profile once, then reuse it across sites, jobs, contracts and billing.</p>
        </div>
        <CustomerOnboardingForm countries={countries} industries={industries.map((industry: { id: string; name: string }) => ({ id: industry.id, name: industry.name }))} defaultCurrency={business?.currency || "USD"} defaultCountryCode={defaultCountryCode} />
      </div>
    </main>
  );
}
