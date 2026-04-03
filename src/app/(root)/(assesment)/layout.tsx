import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getRouteForUserStatus } from "@/lib/auth-guard";

export default async function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  // Only CONTACTED users should access task submission
  if (user.status !== "CONTACTED") {
    const redirectPath = getRouteForUserStatus(user, "/task-submission");
    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  // Render without navbar/layout - clean, isolated view
  return (
    <div className="min-h-screen bg-surface">
      {children}
    </div>
  );
}
