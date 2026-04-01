"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    setShowNav(!pathname.startsWith("/assesment/"));
  }, [pathname]);

  return (
    <>
      {showNav && <Navbar />}
      <main className={`min-h-screen ${
        showNav ? "pt-16 lg:pt-0 lg:ml-64" : ""
      } flex flex-col`}>
        <div className="w-full flex-1">
          {children}
        </div>
      </main>
    </>
  );
}

export default ClientLayout;
