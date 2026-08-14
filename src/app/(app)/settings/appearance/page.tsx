import Link from "next/link";
import { AppearanceControls } from "./AppearanceControls";

export default function AppearancePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8" data-page-width>
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm font-medium text-[var(--primary)]">
          ← Dashboard
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Appearance</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Personalize JobFlow's theme, navigation, density, motion and display preferences.
          Changes apply immediately to this browser.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm md:p-8">
        <AppearanceControls />
      </div>
    </main>
  );
}
