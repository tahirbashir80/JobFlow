"use client";
import { ThemeProvider } from "./ThemeProvider";
export function ThemeProviderMount({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
