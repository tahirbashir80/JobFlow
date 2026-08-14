import { db } from "@/lib/db/prisma";

export async function listTechnicians(businessId: string) {
  return db.staff.findMany({
    where: { businessId, archivedAt: null },
    orderBy: [{ status: "asc" }, { firstName: "asc" }, { lastName: "asc" }],
    include: {
      skills: { include: { service: true } },
      availability: { orderBy: { dayOfWeek: "asc" } },
      assignments: {
        where: { job: { archivedAt: null } },
        include: { job: { include: { service: true, customer: true } } },
        orderBy: { assignedAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function getTechnician(businessId: string, staffId: string) {
  return db.staff.findFirst({
    where: { id: staffId, businessId, archivedAt: null },
    include: {
      skills: { include: { service: true } },
      availability: { orderBy: { dayOfWeek: "asc" } },
      assignments: {
        where: { job: { archivedAt: null } },
        include: { job: { include: { service: true, customer: true, site: true } } },
        orderBy: { assignedAt: "desc" },
        take: 50,
      },
    },
  });
}

export async function listBusinessServices(businessId: string) {
  return db.service.findMany({
    where: { businessId, archivedAt: null, status: "ACTIVE" },
    orderBy: { name: "asc" },
  });
}

export async function upsertTechnicianSkill(
  businessId: string,
  staffId: string,
  serviceId: string,
  proficiency?: number | null,
) {
  const [staff, service] = await Promise.all([
    db.staff.findFirst({ where: { id: staffId, businessId, archivedAt: null } }),
    db.service.findFirst({ where: { id: serviceId, businessId, archivedAt: null, status: "ACTIVE" } }),
  ]);
  if (!staff || !service) throw new Error("Technician or service does not belong to this business.");

  return db.staffServiceSkill.upsert({
    where: { staffId_serviceId: { staffId, serviceId } },
    update: { businessId, proficiency: proficiency ?? null },
    create: { businessId, staffId, serviceId, proficiency: proficiency ?? null },
  });
}

export async function removeTechnicianSkill(businessId: string, staffId: string, serviceId: string) {
  const result = await db.staffServiceSkill.deleteMany({ where: { businessId, staffId, serviceId } });
  return result.count > 0;
}

export async function saveTechnicianAvailability(
  businessId: string,
  staffId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  isAvailable: boolean,
) {
  const staff = await db.staff.findFirst({ where: { id: staffId, businessId, archivedAt: null } });
  if (!staff) throw new Error("Technician not found.");

  if (dayOfWeek < 0 || dayOfWeek > 6) throw new Error("Invalid day of week.");
  if (startTime >= endTime) throw new Error("Availability end time must be after start time.");

  return db.staffAvailability.upsert({
    where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
    update: { startTime, endTime, isAvailable },
    create: { staffId, dayOfWeek, startTime, endTime, isAvailable },
  });
}


export async function listTechnicianUserOptions(businessId: string, staffId: string) {
  return db.user.findMany({
    where: {
      businessId,
      archivedAt: null,
      OR: [{ staff: null }, { staff: { id: staffId } }],
    },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      staff: { select: { id: true } },
    },
  });
}

export async function linkTechnicianUser(
  businessId: string,
  staffId: string,
  userId: string | null,
) {
  const staff = await db.staff.findFirst({
    where: { id: staffId, businessId, archivedAt: null },
  });
  if (!staff) throw new Error("Technician not found.");

  if (userId) {
    const user = await db.user.findFirst({
      where: { id: userId, businessId, archivedAt: null },
      include: { staff: { select: { id: true } } },
    });
    if (!user) throw new Error("User does not belong to this business.");
    if (user.staff && user.staff.id !== staffId) {
      throw new Error("That user account is already linked to another technician.");
    }
  }

  return db.staff.update({
    where: { id: staffId },
    data: { userId },
    select: { id: true, userId: true },
  });
}
