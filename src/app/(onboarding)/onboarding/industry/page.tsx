import { requireTenant } from "@/lib/tenant/require-tenant";
import { getIndustryTemplates } from "@/lib/onboarding/persistence";
import { IndustrySelector } from "../components/IndustrySelector";

export default async function IndustryOnboardingPage() {
  await requireTenant();
  const templates = await getIndustryTemplates();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-blue-600">STEP 2 OF 5</p>
        <h1 className="mt-2 text-3xl font-bold">What kind of work do you do?</h1>
        <p className="mt-2 text-gray-500">Start with a template or create a completely custom industry.</p>
        <IndustrySelector templates={templates} />
      </div>
    </main>
  );
}
