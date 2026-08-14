"use client";

import { useAppearance, type AppearanceSettings } from "@/components/theme/ThemeProvider";

const choices = {
  theme: [["light","Light"],["dark","Dark"],["system","System"]] as const,
  accent: [["blue","Blue"],["indigo","Indigo"],["emerald","Emerald"],["violet","Violet"],["orange","Orange"],["teal","Teal"],["red","Red"]] as const,
  navigation: [["sidebar","Sidebar"],["top","Top navigation"]] as const,
  sidebarMode: [["remember","Remember last state"],["expanded","Always expanded"],["collapsed","Always collapsed"]] as const,
  density: [["comfortable","Comfortable"],["standard","Standard"],["compact","Compact"]] as const,
  tableDensity: [["comfortable","Comfortable"],["standard","Standard"],["compact","Compact"]] as const,
  motion: [["full","Full"],["reduced","Reduced"],["off","Off"]] as const,
  pageWidth: [["standard","Standard"],["wide","Wide"],["full","Full width"]] as const,
  currencyDisplay: [["symbol","Symbol"],["code","Code"],["symbol-code","Symbol + code"]] as const,
  textSize: [["small","Small"],["standard","Standard"],["large","Large"]] as const,
};

function ChoiceGroup<K extends keyof AppearanceSettings>({ label, value, options, onChange }: { label: string; value: AppearanceSettings[K]; options: readonly (readonly [string,string])[]; onChange: (v: string) => void }) {
  return <div><h3 className="text-sm font-semibold">{label}</h3><div className="mt-2 flex flex-wrap gap-2">{options.map(([v,name]) => <button key={v} type="button" onClick={() => onChange(v)} className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${value === v ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]" : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"}`}>{name}</button>)}</div></div>;
}

export function AppearanceControls() {
  const { settings, update, reset } = useAppearance();
  return <div className="space-y-8">
    <section><ChoiceGroup label="Theme" value={settings.theme} options={choices.theme} onChange={v => update("theme", v as AppearanceSettings["theme"])} /></section>
    <section><ChoiceGroup label="Accent color" value={settings.accent} options={choices.accent} onChange={v => update("accent", v as AppearanceSettings["accent"])} /></section>
    <section className="grid gap-8 md:grid-cols-2">
      <ChoiceGroup label="Navigation layout" value={settings.navigation} options={choices.navigation} onChange={v => update("navigation", v as AppearanceSettings["navigation"])} />
      <ChoiceGroup label="Sidebar behavior" value={settings.sidebarMode} options={choices.sidebarMode} onChange={v => update("sidebarMode", v as AppearanceSettings["sidebarMode"])} />
    </section>
    <section className="grid gap-8 md:grid-cols-2">
      <ChoiceGroup label="Interface density" value={settings.density} options={choices.density} onChange={v => update("density", v as AppearanceSettings["density"])} />
      <ChoiceGroup label="Motion" value={settings.motion} options={choices.motion} onChange={v => update("motion", v as AppearanceSettings["motion"])} />
    </section>
    <section className="grid gap-8 md:grid-cols-2">
      <ChoiceGroup label="Page width" value={settings.pageWidth} options={choices.pageWidth} onChange={v => update("pageWidth", v as AppearanceSettings["pageWidth"])} />
      <ChoiceGroup label="Table density" value={settings.tableDensity} options={choices.tableDensity} onChange={v => update("tableDensity", v as AppearanceSettings["tableDensity"])} />
    </section>
    <section className="grid gap-8 md:grid-cols-2">
      <ChoiceGroup label="Currency display" value={settings.currencyDisplay} options={choices.currencyDisplay} onChange={v => update("currencyDisplay", v as AppearanceSettings["currencyDisplay"])} />
      <ChoiceGroup label="Text size" value={settings.textSize} options={choices.textSize} onChange={v => update("textSize", v as AppearanceSettings["textSize"])} />
    </section>
    <section className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div><h3 className="font-semibold">High contrast</h3><p className="mt-1 text-sm text-[var(--muted)]">Increase border and text contrast for accessibility.</p></div>
      <button type="button" onClick={() => update("highContrast", !settings.highContrast)} aria-pressed={settings.highContrast} className={`rounded-full px-4 py-2 text-sm font-semibold ${settings.highContrast ? "bg-[var(--primary)] text-white" : "border border-[var(--border)]"}`}>{settings.highContrast ? "On" : "Off"}</button>
    </section>
    <div className="flex justify-end"><button type="button" onClick={reset} className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold">Reset to defaults</button></div>
  </div>;
}
