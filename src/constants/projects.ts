// Team role options - must match backend enum values exactly
export const TEAM_ROLES = [
  { value: "TEAM LEAD", label: "Team Lead" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "DESIGNER", label: "Designer" },
  { value: "MOBILE", label: "Mobile" },
  { value: "FULL STACK", label: "Full Stack" },
] as const;

export type TeamRole = (typeof TEAM_ROLES)[number]["value"];

// Project type options
export const PROJECT_TYPES = [
  { value: "COMMUNITY", label: "Community Project" },
  { value: "PAID", label: "Paid Project" },
] as const;

export type ProjectTypeValue = (typeof PROJECT_TYPES)[number]["value"];

// Project priority options
export const PRIORITIES = [
  { value: "LOW PRIORITY", label: "Low" },
  { value: "MEDIUM PRIORITY", label: "Medium" },
  { value: "HIGH PRIORITY", label: "High" },
] as const;

export type PriorityValue = (typeof PRIORITIES)[number]["value"];

// Helper function to get label from value
export const getTeamRoleLabel = (value: string) => {
  return TEAM_ROLES.find((r) => r.value === value)?.label || value;
};

export const getProjectTypeLabel = (value: string) => {
  return PROJECT_TYPES.find((t) => t.value === value)?.label || value;
};

export const getPriorityLabel = (value: string) => {
  return PRIORITIES.find((p) => p.value === value)?.label || value;
};
