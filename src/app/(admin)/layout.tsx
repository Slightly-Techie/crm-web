import Navbar from "@/components/layout/Navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { canAccessAdmin, getRouteForUserStatus } from "@/lib/auth-guard";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  // Admin routes require active + accepted + admin role
  if (!canAccessAdmin(user)) {
    // Redirect to appropriate page based on status
    const redirectPath = getRouteForUserStatus(user, "/admin");
    if (redirectPath) {
      redirect(redirectPath);
    }
    // If they're accepted but not admin, redirect to dashboard
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 lg:pt-0 lg:ml-64 min-h-screen flex flex-col">
        <div className="w-full flex-1">
          {children}
        </div>
      </main>
    </>
  );
}
