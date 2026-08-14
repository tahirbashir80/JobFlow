import { BusinessForm } from "../components/BusinessForm";

export default function BusinessOnboardingPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-blue-600">STEP 1 OF 5</p>
        <h1 className="mt-2 text-3xl font-bold">Tell us about your business</h1>
        <p className="mt-2 text-gray-500">These details will appear across your JobFlow workspace and service reports.</p>
        <BusinessForm />
      </div>
    </main>
  );
}
