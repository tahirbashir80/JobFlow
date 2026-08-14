export const PERMISSIONS = {
  BUSINESS_VIEW: "business.view",
  BUSINESS_EDIT: "business.edit",
  STAFF_VIEW: "staff.view",
  STAFF_MANAGE: "staff.manage",
  CUSTOMER_VIEW: "customer.view",
  CUSTOMER_MANAGE: "customer.manage",
  SERVICE_VIEW: "service.view",
  SERVICE_MANAGE: "service.manage",
  JOB_VIEW: "job.view",
  JOB_CREATE: "job.create",
  JOB_ASSIGN: "job.assign",
  JOB_COMPLETE: "job.complete",
  REPORT_VIEW: "report.view",
  BILLING_VIEW: "billing.view",
  BILLING_MANAGE: "billing.manage",
} as const;

export type PermissionCode =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
