import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientLayout from "./clientLayout";
import { canAccessProtected } from "@/lib/auth-guard";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  // PRIORITY 1: ACCEPTED + is_active users have full access
  if (canAccessProtected(user)) {
    return <ClientLayout>{children}</ClientLayout>;
  }

  // PRIORITY 2: CONTACTED users - let client layout handle routing to avoid infinite loops
  // The assessment layout will ensure they can only access /task-submission
  if (user.status === "CONTACTED") {
    return <ClientLayout>{children}</ClientLayout>;
  }

  // PRIORITY 3: REJECTED or NO_SHOW - go to application status
  if (user.status === "REJECTED" || user.status === "NO_SHOW") {
    redirect("/application-status");
  }

  // PRIORITY 4: TO_CONTACT - go to application received
  if (user.status === "TO_CONTACT") {
    redirect("/application-received");
  }

  // PRIORITY 5: INTERVIEWED, IN_REVIEW, TO_BE_ONBOARDED - go to waiting
  if (["INTERVIEWED", "IN_REVIEW", "TO_BE_ONBOARDED"].includes(user.status)) {
    redirect("/waiting");
  }

  // PRIORITY 6: ACCEPTED but NOT is_active - go to waiting
  if (user.status === "ACCEPTED" && !user.is_active) {
    redirect("/waiting");
  }

  // Fallback: unknown status - send to waiting page
  redirect("/waiting");
}
