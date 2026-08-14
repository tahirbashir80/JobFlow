import { isSupportedCurrency } from "@/lib/currency";
import { z } from "zod";

export const onboardingBusinessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.url().optional().or(z.literal("")),
  address: z.string().trim().max(250).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(30).optional().or(z.literal("")),
  country: z.string().trim().max(100).default("United States"),
  currency: z.string().length(3).transform(v => v.toUpperCase()).refine(isSupportedCurrency, "Unsupported ISO 4217 currency code.").default("USD"),
  timezone: z.string().min(1).default("UTC"),
});

export const onboardingIndustrySchema = z.object({
  industryId: z.string().min(1).optional(),
  customIndustryName: z.string().trim().min(2).max(100).optional(),
}).refine(
  (value) => Boolean(value.industryId || value.customIndustryName),
  "Select an industry or enter a custom industry.",
);

export const onboardingServiceSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  pricingType: z.enum([
    "FIXED",
    "HOURLY",
    "DAILY",
    "QUANTITY",
    "AREA",
    "PER_ITEM",
    "CUSTOM",
    "QUOTE_REQUIRED",
  ]),
  basePrice: z.coerce.number().min(0).optional(),
  estimatedMinutes: z.coerce.number().int().positive().optional(),
});

export const onboardingStaffSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  roleTitle: z.string().trim().max(100).optional().or(z.literal("")),
});

export type OnboardingBusinessInput = z.infer<typeof onboardingBusinessSchema>;
export type OnboardingIndustryInput = z.infer<typeof onboardingIndustrySchema>;
export type OnboardingServiceInput = z.infer<typeof onboardingServiceSchema>;
export type OnboardingStaffInput = z.infer<typeof onboardingStaffSchema>;
