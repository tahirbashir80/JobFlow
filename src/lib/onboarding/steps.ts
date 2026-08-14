export const ONBOARDING_STEPS = [
  { id: "business", label: "Business Profile" },
  { id: "industry", label: "Industry" },
  { id: "services", label: "Services" },
  { id: "staff", label: "Staff" },
  { id: "complete", label: "Finish" },
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
