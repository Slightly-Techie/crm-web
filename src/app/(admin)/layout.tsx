import Navbar from "@/components/layout/Navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="font-tt-hoves bg-st-bg dark:bg-st-bgDark ">
      <Navbar />
      <div className="p-8 min-h-screen max-w-screen-2xl mx-auto  ">
        {children}
      </div>
    </main>
  );
}
