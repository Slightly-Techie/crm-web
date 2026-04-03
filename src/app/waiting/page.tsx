"use client";

import { useSession } from "next-auth/react";
import { getStatusMessage } from "@/lib/auth-guard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WaitingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => {
    // If user becomes accepted, redirect to dashboard
    if (user?.status === "ACCEPTED" && user?.is_active) {
      router.push("/");
    }
  }, [user?.status, user?.is_active, router]);

  const statusInfo = user ? getStatusMessage(user.status) : null;

  if (!statusInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-surface-container-lowest border border-outline rounded-2xl p-8 md:p-12 text-center shadow-sm">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">{statusInfo.icon}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-4 font-headline">
          {statusInfo.title}
        </h1>

        {/* Message */}
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          {statusInfo.message}
        </p>

        {/* Info Box */}
        <div className="bg-surface-container border border-outline rounded-xl p-6 mb-6 text-left">
          <h2 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help</span>
            What can you do?
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-on-surface-variant">
            <li>Check your email regularly for updates from our team</li>
            <li>Make sure info@slightlytechie.com is not in your spam folder</li>
            <li>You'll be notified once there's an update on your application</li>
            <li>Feel free to reach out if you have any questions</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="pt-6 border-t border-outline">
          <p className="text-sm text-on-surface-variant mb-4">
            Have questions or need assistance?
          </p>
          <a
            href="mailto:info@slightlytechie.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-lg font-semibold transition-colors"
          >
            <span className="material-symbols-outlined">email</span>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
