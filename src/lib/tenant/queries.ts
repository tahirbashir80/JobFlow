import { Prisma } from "@/generated/prisma/client";

/**
 * Centralize tenant scoping here.
 * Feature data-access functions should receive businessId from the
 * authenticated server-side context and never trust a client-supplied tenant ID.
 */
export function businessWhere(businessId: string): Prisma.BusinessWhereInput {
  return { id: businessId, archivedAt: null };
}
