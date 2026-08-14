import { db } from "@/lib/db/prisma";
import type { TenantContext } from "@/lib/tenant/context";
import type { PermissionCode } from "./permissions";

export async function hasPermission(
  context: TenantContext,
  permissionCode: PermissionCode,
): Promise<boolean> {
  const user = await db.user.findFirst({
    where: {
      id: context.userId,
      businessId: context.businessId,
      archivedAt: null,
      status: "ACTIVE",
    },
    select: {
      platformRole: true,
      role: {
        select: {
          permissions: {
            where: {
              permission: {
                code: permissionCode,
              },
            },
            select: { id: true },
          },
        },
      },
    },
  });

  if (!user) return false;

  if (
    user.platformRole === "SUPER_ADMIN" ||
    user.platformRole === "SUPPORT_ADMIN"
  ) {
    return true;
  }

  return user.role?.permissions.length === 1;
}

export async function requirePermission(
  context: TenantContext,
  permissionCode: PermissionCode,
): Promise<void> {
  if (!(await hasPermission(context, permissionCode))) {
    throw new Error("FORBIDDEN");
  }
}
