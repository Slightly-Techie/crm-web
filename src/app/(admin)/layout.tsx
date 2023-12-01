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
    <main className="w-full min-h-screen bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light ">
      <div className="max-w-screen-2xl grid grid-cols-[20vw_auto] w-full mx-auto">
        <Navbar />
        <section className=" w-full ">{children}</section>
      </div>
    </main>
  );
}
