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
    <main className="font-tt-hoves bg-primary-light dark:bg-[#141414] text-primary-dark dark:text-primary-light ">
      <Navbar />
      <div className=" min-h-screen lg:pl-[25vw] xl:pl-[20vw]  w-full max-w-screen-2xl bg-primary-light dark:bg-primary-dark ">
        {children}
      </div>
    </main>
  );
}
