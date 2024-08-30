"use client"; // Indicate that this is a client-side component

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Client-side hook to get the current path
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    // Update the showNav state based on the pathname
    setShowNav(!pathname.startsWith("/assesment/"));
  }, [pathname]); // Depend on pathname to update when it changes

  // Apply dynamic className based on whether the Navbar is being shown or not
  const mainClassName = `w-full min-h-screen max-w-screen-2xl grid ${
    showNav ? "lg:grid-cols-[20vw_auto]" : "lg:grid-cols-[auto]"
  } text-primary-dark dark:bg-primary-dark dark:text-primary-light`;

  return (
    <main className={mainClassName}>
      {showNav && <Navbar />}
      <section className="w-full h-full">
        <section className="pt-[7vh] lg:pt-0 w-full border-r dark:border-r-neutral-700 h-screen overflow-y-auto">
          {children}
        </section>
      </section>
    </main>
  );
}

export default ClientLayout;
