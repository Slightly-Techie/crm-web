"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useRef } from "react";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const backListenerRef = useRef(false);

  // Determine if we should show navigation
  const isAssessmentRoute = pathname.startsWith("/assesment/") || pathname === "/task-submission";
  const isContactedUser = user?.status === "CONTACTED";
  const showNav = !isAssessmentRoute && !isContactedUser;

  // Trap back button for CONTACTED users on task-submission
  useEffect(() => {
    if (status === "authenticated" && isContactedUser && pathname === "/task-submission") {
      if (!backListenerRef.current) {
        // Push state to enable back button
        window.history.pushState({ isolated: true }, "");
        backListenerRef.current = true;

        const handlePopState = async () => {
          // Prevent actually going back - push forward to stay on current page
          window.history.forward();
          // User clicked back - log them out and go to login
          await signOut({ redirect: true, callbackUrl: "/login" });
        };

        window.addEventListener("popstate", handlePopState);

        // Cleanup: remove listener when leaving the page
        return () => {
          window.removeEventListener("popstate", handlePopState);
          backListenerRef.current = false;
        };
      }
    } else {
      // Reset when not on task-submission page
      backListenerRef.current = false;
    }
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
