export type DoerOSNavigationMode = "fixed" | "collapsible" | "sliding";
export type DoerOSThemeMode = "light" | "dark" | "system";
export type DoerOSDensity = "comfortable" | "standard" | "compact";
export type DoerOSPageWidth = "standard" | "wide" | "full";

export type DoerOSBrandConfig = {
  displayName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
};

export type DoerOSWorkspaceConfig = {
  navigationMode?: DoerOSNavigationMode;
  defaultSidebarCollapsed?: boolean;
  dashboardLayoutId?: string;
  allowUserDashboardCustomization?: boolean;
  allowUserNavigationCustomization?: boolean;
};

export type DoerOSRegionalConfig = {
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
};

export type DoerOSTenantConfig = {
  version: 1;
  brand?: DoerOSBrandConfig;
  appearance?: {
    theme?: DoerOSThemeMode;
    density?: DoerOSDensity;
    pageWidth?: DoerOSPageWidth;
    highContrast?: boolean;
  };
  workspace?: DoerOSWorkspaceConfig;
  regional?: DoerOSRegionalConfig;
};

export const DEFAULT_DOEROS_TENANT_CONFIG: DoerOSTenantConfig = {
  version: 1,
  brand: {
    displayName: "DoerOS",
    primaryColor: "#2468F2",
    accentColor: "#14B8A6",
    fontFamily: "Inter",
  },
  appearance: {
    theme: "system",
    density: "standard",
    pageWidth: "standard",
    highContrast: false,
  },
  workspace: {
    navigationMode: "collapsible",
    defaultSidebarCollapsed: false,
    allowUserDashboardCustomization: true,
    allowUserNavigationCustomization: true,
  },
  regional: {
    timezone: "UTC",
    currency: "USD",
    timeFormat: "12h",
  },
};
