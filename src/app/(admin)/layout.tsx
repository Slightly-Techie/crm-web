import Navbar from "@/components/layout/Navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
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
