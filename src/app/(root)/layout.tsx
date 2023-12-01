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
    <main className="w-full min-h-screen bg-primary-dark text-primary-light">
      <Navbar />
      <section className="w-full h-full">
        <section className="lg:pl-[25vw] xl:pl-[20vw] pt-[7vh] lg:pt-0 w-full">
          {children}
        </section>
      </section>
    </main>
  );
}
