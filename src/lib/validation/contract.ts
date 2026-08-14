import { z } from "zod";

export const contractSchema = z.object({
  customerId: z.string().min(1, "Customer is required."),
  siteId: z.string().optional(),
  serviceId: z.string().optional(),
  title: z.string().trim().min(2, "Contract title is required.").max(120),
  status: z.enum(["DRAFT", "ACTIVE", "EXPIRED", "CANCELLED"]),
  billingCycle: z.enum(["ONE_TIME", "MONTHLY", "QUARTERLY", "SEMI_ANNUAL", "ANNUAL"]),
  contractValue: z.coerce.number().min(0).optional(),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().optional(),
  renewalDate: z.string().optional(),
  autoRenew: z.boolean().default(false),
  notes: z.string().max(5000).optional(),
}).superRefine((data, ctx) => {
  const start = new Date(data.startDate);
  const end = data.endDate ? new Date(data.endDate) : null;
  const renewal = data.renewalDate ? new Date(data.renewalDate) : null;
  if (end && end < start) ctx.addIssue({ code: "custom", path: ["endDate"], message: "End date must be on or after the start date." });
  if (renewal && renewal < start) ctx.addIssue({ code: "custom", path: ["renewalDate"], message: "Renewal date must be on or after the start date." });
});

export type ContractInput = z.infer<typeof contractSchema>;
