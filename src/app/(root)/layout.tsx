import Navbar from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  return (
    <main className="font-tt-hoves bg-black overflow-clip">
      <Navbar />
      {children}
    </main>
  );
}
