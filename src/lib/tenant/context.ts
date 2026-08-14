export type TenantContext = {
  businessId: string;
  userId: string;
  roleId?: string | null;
};

export function assertTenantContext(context: TenantContext): TenantContext {
  if (!context.businessId || !context.userId) {
    throw new Error("Missing tenant authentication context.");
  }

  return context;
}
