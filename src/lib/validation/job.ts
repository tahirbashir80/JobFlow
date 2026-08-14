import { z } from "zod";

export const jobSchema = z.object({
  customerId: z.string().min(1),
  siteId: z.string().min(1).optional().or(z.literal("")),
  serviceId: z.string().min(1),
  contractId: z.string().min(1).optional().or(z.literal("")),
  scheduledStart: z.string().min(1),
  scheduledEnd: z.string().min(1),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  price: z.coerce.number().min(0).optional(),
  title: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  customerNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  internalNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  staffId: z.string().min(1).optional().or(z.literal("")),
}).superRefine((value, ctx) => {
  const start = new Date(value.scheduledStart);
  const end = new Date(value.scheduledEnd);
  if (Number.isNaN(start.getTime())) {
    ctx.addIssue({ code: "custom", path: ["scheduledStart"], message: "Invalid start date/time." });
  }
  if (Number.isNaN(end.getTime())) {
    ctx.addIssue({ code: "custom", path: ["scheduledEnd"], message: "Invalid end date/time." });
  }
  if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
    ctx.addIssue({ code: "custom", path: ["scheduledEnd"], message: "End time must be after start time." });
  }
});

export type JobInput = z.infer<typeof jobSchema>;
