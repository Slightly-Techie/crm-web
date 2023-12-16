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
    <main className="w-full min-h-screen  text-primary-dark dark:bg-primary-dark dark:text-primary-light ">
      <div className="max-w-screen-2xl grid grid-cols-[20vw_auto] w-full mx-auto">
        <Navbar />
        <section className=" w-full border-r dark:border-r-neutral-700 h-screen overflow-y-auto">{children}</section>
      </div>
    </main>
  );
}
