"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Accent = "blue" | "indigo" | "emerald" | "violet" | "orange" | "teal" | "red";
export type NavigationLayout = "sidebar" | "top";
export type Density = "comfortable" | "standard" | "compact";
export type MotionMode = "full" | "reduced" | "off";
export type PageWidth = "standard" | "wide" | "full";
export type CurrencyDisplay = "symbol" | "code" | "symbol-code";
export type TextSize = "small" | "standard" | "large";

export type AppearanceSettings = {
  theme: ThemeMode;
  accent: Accent;
  navigation: NavigationLayout;
  sidebarMode: "remember" | "expanded" | "collapsed";
  density: Density;
  motion: MotionMode;
  pageWidth: PageWidth;
  tableDensity: Density;
  currencyDisplay: CurrencyDisplay;
  textSize: TextSize;
  highContrast: boolean;
};

const defaults: AppearanceSettings = {
  theme: "system",
  accent: "teal",
  navigation: "sidebar",
  sidebarMode: "remember",
  density: "standard",
  motion: "full",
  pageWidth: "standard",
  tableDensity: "standard",
  currencyDisplay: "symbol-code",
  textSize: "standard",
  highContrast: false,
};

const AppearanceContext = createContext<{
  settings: AppearanceSettings;
  update: <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => void;
  reset: () => void;
} | null>(null);

const STORAGE_KEY = "jobflow.appearance.v1";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(defaults);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved) setSettings({ ...defaults, ...saved });
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const resolved = settings.theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : settings.theme;

    root.dataset.theme = resolved;
    root.dataset.accent = settings.accent;
    root.dataset.density = settings.density;
    root.dataset.motion = settings.motion;
    root.dataset.pageWidth = settings.pageWidth;
    root.dataset.tableDensity = settings.tableDensity;
    root.dataset.textSize = settings.textSize;
    root.dataset.highContrast = String(settings.highContrast);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      document.documentElement.dataset.theme = media.matches ? "dark" : "light";
    };
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, [settings.theme]);

  const value = useMemo(() => ({
    settings,
    update: <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) =>
      setSettings(prev => ({ ...prev, [key]: value })),
    reset: () => setSettings(defaults),
  }), [settings]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error("useAppearance must be used inside ThemeProvider");
  return value;
}
