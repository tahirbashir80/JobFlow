import { db } from "@/lib/db/prisma";

export async function createInAppNotification(input: {
  businessId: string;
  userId?: string | null;
  subject: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  return db.notification.create({
    data: {
      businessId: input.businessId,
      userId: input.userId ?? null,
      channel: "IN_APP",
      subject: input.subject,
      message: input.message,
      status: "SENT",
      sentAt: new Date(),
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
    },
  });
}

export async function listNotifications(businessId: string, userId: string) {
  const rows = await db.notification.findMany({
    where: { businessId, userId, channel: "IN_APP" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map(n => ({
    id: n.id,
    subject: n.subject ?? "Notification",
    message: n.message,
    status: n.status,
    read: Boolean(n.readAt) || n.status === "READ",
    createdAt: n.createdAt.toISOString(),
    metadata: n.metadata,
  }));
}

export async function getUnreadNotificationCount(businessId: string, userId: string) {
  return db.notification.count({
    where: { businessId, userId, channel: "IN_APP", readAt: null, status: { not: "READ" } },
  });
}

export async function markNotificationRead(businessId: string, userId: string, id: string) {
  const result = await db.notification.updateMany({
    where: { id, businessId, userId, channel: "IN_APP" },
    data: { readAt: new Date(), status: "READ" },
  });
  return result.count > 0;
}

export async function markAllNotificationsRead(businessId: string, userId: string) {
  const result = await db.notification.updateMany({
    where: { businessId, userId, channel: "IN_APP", readAt: null },
    data: { readAt: new Date(), status: "READ" },
  });
  return result.count;
}
