import { z } from "zod";

export const customerSchema = z.object({
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "CORPORATE", "PROPERTY_MANAGER", "OTHER"]),
  firstName: z.string().trim().max(80).optional().or(z.literal("")),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  industryId: z.string().trim().max(80).optional().or(z.literal("")),
  tradeLicenseNo: z.string().trim().max(80).optional().or(z.literal("")),
  vatNumber: z.string().trim().max(80).optional().or(z.literal("")),
  registrationCountryCode: z.string().length(2).optional().or(z.literal("")),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.email().optional().or(z.literal("")),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),

  contact: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().max(80).optional().or(z.literal("")),
    designation: z.string().trim().max(120).optional().or(z.literal("")),
    countryCode: z.string().trim().max(8).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    alternateCountryCode: z.string().trim().max(8).optional().or(z.literal("")),
    alternatePhone: z.string().trim().max(40).optional().or(z.literal("")),
    whatsappCountryCode: z.string().trim().max(8).optional().or(z.literal("")),
    whatsappPhone: z.string().trim().max(40).optional().or(z.literal("")),
    email: z.email().optional().or(z.literal("")),
    preferredContactMethod: z.enum(["PHONE", "EMAIL", "WHATSAPP"]).optional(),
    bestTimeToContact: z.enum(["MORNING", "AFTERNOON", "EVENING", "ANY_TIME"]).optional(),
  }),

  billing: z.object({
    billingName: z.string().trim().max(160).optional().or(z.literal("")),
    currency: z.string().length(3).transform((v) => v.toUpperCase()),
    paymentTerms: z.enum(["DUE_ON_RECEIPT", "NET_15", "NET_30", "NET_45", "NET_60"]),
    creditLimit: z.coerce.number().min(0).max(999999999999),
    creditLimitCurrency: z.string().length(3).transform((v) => v.toUpperCase()),
  }),

  address: z.object({
    addressLine1: z.string().trim().max(250).optional().or(z.literal("")),
    addressLine2: z.string().trim().max(250).optional().or(z.literal("")),
    countryId: z.string().optional().or(z.literal("")),
    stateId: z.string().optional().or(z.literal("")),
    cityId: z.string().optional().or(z.literal("")),
    countryCode: z.string().length(2).optional().or(z.literal("")),
    stateCode: z.string().max(20).optional().or(z.literal("")),
    cityName: z.string().max(120).optional().or(z.literal("")),
    area: z.string().trim().max(120).optional().or(z.literal("")),
    postalCode: z.string().trim().max(30).optional().or(z.literal("")),
    latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
    longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
    googlePlaceId: z.string().max(255).optional().or(z.literal("")),
  }),

  metadata: z.object({
    customerGroup: z.enum(["ONE_TIME", "VIP", "PREMIUM", "REGULAR"]),
    leadSource: z.enum(["GOOGLE", "SOCIAL_MEDIA", "REFERRAL", "FLYER_BROCHURE", "WALK_IN", "OTHER"]).optional(),
    leadSourceOther: z.string().trim().max(160).optional().or(z.literal("")),
    referralSource: z.string().trim().max(160).optional().or(z.literal("")),
  }),
}).superRefine((value, ctx) => {
  if (value.type === "RESIDENTIAL" && !value.firstName?.trim()) {
    ctx.addIssue({ code: "custom", path: ["firstName"], message: "First name is required for residential customers." });
  }
  if (value.type !== "RESIDENTIAL" && !value.companyName?.trim()) {
    ctx.addIssue({ code: "custom", path: ["companyName"], message: "Company name is required for this customer type." });
  }
  if (value.metadata.leadSource === "OTHER" && !value.metadata.leadSourceOther?.trim()) {
    ctx.addIssue({ code: "custom", path: ["metadata", "leadSourceOther"], message: "Please specify the lead source." });
  }
  if (value.metadata.leadSource === "REFERRAL" && !value.metadata.referralSource?.trim()) {
    ctx.addIssue({ code: "custom", path: ["metadata", "referralSource"], message: "Please specify the referral source." });
  }
});

export const siteSchema = z.object({
  name: z.string().trim().min(2).max(160),
  address: z.string().trim().max(250).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(30).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  contactName: z.string().trim().max(120).optional().or(z.literal("")),
  contactPhone: z.string().trim().max(40).optional().or(z.literal("")),
  accessInstructions: z.string().trim().max(2000).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type SiteInput = z.infer<typeof siteSchema>;
