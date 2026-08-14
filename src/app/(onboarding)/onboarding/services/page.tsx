import { requireTenant } from "@/lib/tenant/require-tenant";
import { getBusinessIndustries, getServices } from "@/lib/onboarding/persistence";
import { ServiceCreator } from "../components/ServiceCreator";

export default async function ServicesOnboardingPage() {
  const context = await requireTenant();
  const industries = await getBusinessIndustries(context.businessId);
  const firstIndustry = industries[0];
  const services = firstIndustry
    ? await getServices(context.businessId, firstIndustry.id)
    : [];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-blue-600">STEP 3 OF 5</p>
        <h1 className="mt-2 text-3xl font-bold">Configure your services</h1>
        <p className="mt-2 text-gray-500">Services are stored against your business and selected industry.</p>

        {industries.length > 0 && (
          <div className="mt-6 rounded-xl border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Selected industry</p>
            <p className="mt-1 font-semibold">{firstIndustry?.name}</p>
            <p className="mt-1 text-xs text-gray-400">{firstIndustry?.id}</p>
          </div>
        )}

        {services.length > 0 && (
          <div className="mt-5 rounded-2xl border bg-white shadow-sm">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between border-b p-5 last:border-b-0">
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{service.pricingType}</p>
                </div>
                <p className="font-semibold">
                  {service.basePrice == null ? "Quote" : String(service.basePrice)}
                </p>
              </div>
            ))}
          </div>
        )}

        {firstIndustry ? <ServiceCreator industryId={firstIndustry.id} /> : null}
      </div>
    </main>
  );
}
