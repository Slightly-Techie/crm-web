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
    <main className="font-tt-hoves bg-black overflow-clip h-screen">
      <Navbar />
      <div className="p-8 overflow-y-scroll h-full">{children}</div>
    </main>
  );
}
