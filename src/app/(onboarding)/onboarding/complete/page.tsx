import { requireTenant } from "@/lib/tenant/require-tenant";
import { CompleteOnboardingButton } from "../components/CompleteOnboardingButton";

export default async function OnboardingCompletePage() {
  await requireTenant();

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 px-6 py-12">
      <section className="w-full max-w-xl rounded-2xl border bg-white p-9 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50 text-2xl text-green-700">✓</div>
        <p className="mt-6 text-sm font-semibold text-blue-600">SETUP COMPLETE</p>
        <h1 className="mt-2 text-3xl font-bold">Your JobFlow workspace is ready</h1>
        <p className="mt-3 text-gray-500">Your business configuration is ready for customers, jobs, assignments and reporting.</p>
        <CompleteOnboardingButton />
      </section>
    </main>
  );
}
