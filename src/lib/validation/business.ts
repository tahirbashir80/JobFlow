import { isSupportedCurrency } from "@/lib/currency";
import { z } from "zod";

export const businessProfileSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.url().optional().or(z.literal("")),
  address: z.string().trim().max(250).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(30).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  currency: z.string().length(3).transform(v => v.toUpperCase()).refine(isSupportedCurrency, "Unsupported ISO 4217 currency code.").default("USD"),
  timezone: z.string().min(1).default("UTC"),
});

export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
