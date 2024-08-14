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
    <main className="w-full min-h-screen max-w-screen-2xl grid lg:grid-cols-[20vw_auto] text-primary-dark dark:bg-primary-dark dark:text-primary-light ">
      <Navbar />
      <section className="w-full h-full">
        <section className=" pt-[7vh] lg:pt-0 w-full border-r dark:border-r-neutral-700 h-screen overflow-y-auto">
          {children}
        </section>
      </section>
    </main>
  );
}
