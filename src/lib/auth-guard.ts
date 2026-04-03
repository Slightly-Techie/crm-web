/**
 * Auth Guard - Status-based routing logic
 *
 * This module defines where users should be redirected based on their
 * authentication status, is_active flag, and user_status.
 */

export type UserStatus =
  | "TO CONTACT"
  | "CONTACTED"
  | "INTERVIEWED"
  | "IN REVIEW"
  | "TO BE ONBOARDED"
  | "ACCEPTED"
  | "REJECTED"
  | "NO SHOW";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  status: UserStatus;
  role?: {
    id: number;
    name: string;
  };
}

/**
 * Determines the appropriate route for a user based on their status
 */
export function getRouteForUserStatus(user: AuthUser, currentPath: string): string | null {
  // PRIORITY 1: ACCEPTED + is_active users have full access - NEVER redirect them
  if (user.status === "ACCEPTED" && user.is_active) {
    return null; // Full access to all routes
  }

  // PRIORITY 2: ACCEPTED but NOT active - waiting for activation
  if (user.status === "ACCEPTED" && !user.is_active) {
    if (currentPath !== "/waiting") {
      return "/waiting";
    }
    return null;
  }

  // PRIORITY 3: CONTACTED users should only access task submission page
  if (user.status === "CONTACTED") {
    if (currentPath === "/task-submission") {
      return null; // Stay on this page
    }
    return "/task-submission";
  }

  // PRIORITY 4: INTERVIEWED, IN_REVIEW, TO_BE_ONBOARDED - show waiting message
  if (["INTERVIEWED", "IN REVIEW", "TO BE ONBOARDED"].includes(user.status)) {
    if (currentPath !== "/waiting") {
      return "/waiting";
    }
    return null;
  }

  // PRIORITY 5: REJECTED, NO_SHOW - show rejection message
  if (["REJECTED", "NO_SHOW"].includes(user.status)) {
    if (currentPath !== "/application-status") {
      return "/application-status";
    }
    return null;
  }

  // PRIORITY 6: TO_CONTACT - show post-signup/waiting page
  if (user.status === "TO CONTACT") {
    if (currentPath !== "/application-received") {
      return "/application-received";
    }
    return null;
  }

  // Fallback: unknown status - send to waiting page
  if (currentPath !== "/waiting") {
    return "/waiting";
  }
  return null;
}

/**
 * Check if user can access admin routes
 */
export function canAccessAdmin(user: AuthUser): boolean {
  // Check all required conditions
  if (!user.is_active || user.status !== "ACCEPTED") {
    return false;
  }

  // Check role - handle both object and string formats
  if (!user.role) {
    return false;
  }

  const roleName = typeof user.role === "string"
    ? user.role
    : user.role.name;

  return roleName?.toLowerCase() === "admin";
}

/**
 * Check if user can access protected routes (dashboard, feed, etc.)
 */
export function canAccessProtected(user: AuthUser): boolean {
  return user.is_active && user.status === "ACCEPTED";
}

/**
 * Get user-friendly status message for waiting states
 */
export function getStatusMessage(status: UserStatus): {
  title: string;
  message: string;
  icon: string;
} {
  // Status can come with spaces or underscores - normalize to spaces
  const normalizedStatus = (status as string)?.replace(/_/g, " ")?.toUpperCase()?.trim() as UserStatus;

  // Debug: log the status
  if (typeof window !== "undefined") {
    console.log("getStatusMessage called with status:", status, "normalized:", normalizedStatus);
  }

  switch (normalizedStatus) {
    case "INTERVIEWED":
      return {
        title: "Interview Complete",
        message: "Thank you for interviewing with us! Your application is being reviewed. We'll notify you of the outcome soon.",
        icon: "schedule",
      };
    case "IN REVIEW":
      return {
        title: "Application Under Review",
        message: "Your application is currently being reviewed by our team. We appreciate your patience and will get back to you shortly.",
        icon: "rate_review",
      };
    case "TO BE ONBOARDED":
      return {
        title: "Onboarding Pending",
        message: "Congratulations! You've been selected for onboarding. Our team will contact you with next steps.",
        icon: "celebration",
      };
    case "REJECTED":
      return {
        title: "Application Update",
        message: "Thank you for your interest in joining Slightly Techie. Unfortunately, we are unable to move forward with your application at this time. We encourage you to apply again in the future.",
        icon: "info",
      };
    case "NO SHOW":
      return {
        title: "Missed Interview",
        message: "We noticed you were unable to attend your scheduled interview. If you'd like to discuss rescheduling, please contact us at info@slightlytechie.com.",
        icon: "event_busy",
      };
    case "TO CONTACT":
      return {
        title: "Application Received",
        message: "Your application has been received and is pending review.",
        icon: "mail",
      };
    default:
      return {
        title: "Application Status",
        message: "Please contact an administrator for more information.",
        icon: "help",
      };
  }
}
