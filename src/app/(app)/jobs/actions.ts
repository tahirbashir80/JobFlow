"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireTenant } from "@/lib/tenant/require-tenant";
import {
  createJob,
  updateJobStatus,
  startJob,
  completeJob,
  type OperationalJobStatus,
  getOrCreateServiceReport,
} from "@/lib/jobs/persistence";
import type { JobInput } from "@/lib/validation/job";

export async function createJobAction(input: JobInput) {
  const context = await requireTenant();
  const job = await createJob(context.businessId, context.userId, input);
  revalidatePath("/jobs");
  redirect(`/jobs/${job.id}`);
}

export async function updateJobStatusAction(jobId: string, status: OperationalJobStatus) {
  const context = await requireTenant();
  await updateJobStatus(context.businessId, context.userId, jobId, status);
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
}

export async function startJobAction(jobId: string) {
  const context = await requireTenant();
  await startJob(context.businessId, context.userId, jobId);
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
}

export async function completeJobAction(
  jobId: string,
  input: {
    workPerformed: string;
    findings?: string;
    recommendations?: string;
    customerComments?: string;
    internalNotes?: string;
    customerApproved?: boolean;
  },
) {
  const context = await requireTenant();
  await completeJob(context.businessId, context.userId, jobId, input);
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  redirect(`/jobs/${jobId}`);
}


export async function createServiceReportAction(jobId: string) {
  const context = await requireTenant();
  await getOrCreateServiceReport(context.businessId, context.userId, jobId);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/jobs/${jobId}/report`);
  redirect(`/jobs/${jobId}/report`);
}


import { assignJob, unassignJob } from "@/lib/dispatch/persistence";

export async function assignJobAction(jobId: string, staffId: string) {
  const context = await requireTenant();
  await assignJob(context.businessId, jobId, staffId);
  revalidatePath("/dispatch");
  revalidatePath("/calendar");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
}

export async function unassignJobAction(jobId: string) {
  const context = await requireTenant();
  await unassignJob(context.businessId, jobId);
  revalidatePath("/dispatch");
  revalidatePath("/calendar");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
}


import { upsertTechnicianSkill, removeTechnicianSkill, saveTechnicianAvailability } from "@/lib/technicians/persistence";

export async function assignTechnicianSkillAction(staffId: string, serviceId: string, proficiency?: number) {
  const context = await requireTenant();
  await upsertTechnicianSkill(context.businessId, staffId, serviceId, proficiency);
  revalidatePath(`/technicians/${staffId}`);
  revalidatePath("/technicians");
  revalidatePath("/dispatch");
}

export async function removeTechnicianSkillAction(staffId: string, serviceId: string) {
  const context = await requireTenant();
  await removeTechnicianSkill(context.businessId, staffId, serviceId);
  revalidatePath(`/technicians/${staffId}`);
  revalidatePath("/technicians");
  revalidatePath("/dispatch");
}

export async function saveTechnicianAvailabilityAction(
  staffId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  isAvailable: boolean,
) {
  const context = await requireTenant();
  await saveTechnicianAvailability(context.businessId, staffId, dayOfWeek, startTime, endTime, isAvailable);
  revalidatePath(`/technicians/${staffId}`);
  revalidatePath("/technicians");
  revalidatePath("/dispatch");
}


import { createRecurringService, setRecurringActive, generateDueRecurringJobs } from "@/lib/recurring/persistence";
import { RecurrenceType } from "@/generated/prisma/client";

export async function createRecurringServiceAction(input: {
  customerId: string; serviceId: string; name: string; recurrenceType: RecurrenceType;
  intervalValue: number; startDate: string; endDate?: string; price?: number; notes?: string;
}) {
  const context = await requireTenant();
  await createRecurringService(context.businessId, input);
  revalidatePath("/recurring");
}

export async function toggleRecurringServiceAction(id: string, isActive: boolean) {
  const context = await requireTenant();
  await setRecurringActive(context.businessId, id, isActive);
  revalidatePath("/recurring");
}

export async function generateDueRecurringJobsAction() {
  const context = await requireTenant();
  const result = await generateDueRecurringJobs(context.businessId, context.userId, new Date());
  revalidatePath("/recurring");
  revalidatePath("/jobs");
  revalidatePath("/calendar");
  revalidatePath("/dispatch");
  revalidatePath("/dashboard");
  return result.generated;
}


import { markNotificationRead, markAllNotificationsRead } from "@/lib/notifications/persistence";

export async function markNotificationReadAction(id: string) {
  const context = await requireTenant();
  await markNotificationRead(context.businessId, context.userId, id);
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction() {
  const context = await requireTenant();
  await markAllNotificationsRead(context.businessId, context.userId);
  revalidatePath("/notifications");
}
