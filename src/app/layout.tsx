import type { Metadata } from "next";
import "./globals.css";
import "./jobflow-refinement.css";
import { ThemeProviderMount } from "@/components/theme/ThemeProviderMount";
import { DOEROS_BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: DOEROS_BRAND.productName,
  description: DOEROS_BRAND.positioning,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><ThemeProviderMount>{children}</ThemeProviderMount></body>
    </html>
  );
}
