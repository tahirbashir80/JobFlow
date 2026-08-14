import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Job Management CRM
        </p>
        <h1 className="text-5xl font-bold tracking-tight">JobFlow</h1>
        <p className="mt-5 max-w-2xl text-lg text-gray-600">
          A configurable field-service platform for small businesses that
          manage customers, sites, staff, services and daily jobs.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Open Dashboard
          </Link>
          <Link
            href="/setup"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold"
          >
            Business Setup
          </Link>
        </div>
      </section>
    </main>
  );
}
