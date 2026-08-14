export type AuthenticatedUser = {
  id: string;
  email: string;
  businessId: string;
  roleId: string | null;
  platformRole: "USER" | "SUPER_ADMIN" | "SUPPORT_ADMIN";
};

export type SessionContext = {
  user: AuthenticatedUser;
};
