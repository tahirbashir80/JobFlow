import Link from "next/link";

const steps = [
  ["01", "Business Profile", "Tell JobFlow about your business."],
  ["02", "Industry", "Choose a ready-made industry or create your own."],
  ["03", "Services", "Select the work you provide and configure pricing."],
  ["04", "Staff", "Add the people who will perform your jobs."],
  ["05", "Finish", "Review your setup and enter the JobFlow workspace."],
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          JobFlow Setup
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Configure JobFlow around your business
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          You can start with our templates and customize everything later.
        </p>

        <div className="mt-10 grid gap-4">
          {steps.map(([number, title, description], index) => (
            <Link
              key={title}
              href={index === 0 ? "/onboarding/business" : "#"}
              className="flex items-center gap-5 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                {number}
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="mt-1 block text-sm text-gray-500">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="text-sm font-medium text-gray-500">
            Skip for now →
          </Link>
        </div>
      </div>
    </main>
  );
}
