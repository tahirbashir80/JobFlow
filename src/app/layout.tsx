import type { Metadata } from "next";
import "./globals.css";
import { ThemeProviderMount } from "@/components/theme/ThemeProviderMount";

export const metadata: Metadata = {
  title: "JobFlow",
  description: "Configurable Job Management CRM for small service businesses",
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
