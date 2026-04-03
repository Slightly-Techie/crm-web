"use client";

import { useSession } from "next-auth/react";
import { getStatusMessage } from "@/lib/auth-guard";

export default function ApplicationStatusPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const statusInfo = user ? getStatusMessage(user.status) : null;

  if (!statusInfo) {
    return null;
  }

  const isRejected = user?.status === "REJECTED";
  const isNoShow = user?.status === "NO_SHOW";

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-surface-container-lowest border border-outline rounded-2xl p-8 md:p-12 text-center shadow-sm">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-on-surface/10 rounded-full mb-6">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">
            {statusInfo.icon}
          </span>
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
        {isNoShow && (
          <div className="bg-surface-container border border-outline rounded-xl p-6 mb-6 text-left">
            <h2 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Want to Reschedule?
            </h2>
            <p className="text-sm text-on-surface-variant mb-4">
              If you had an emergency or technical difficulty that prevented you from attending,
              we understand. Please reach out to discuss rescheduling options.
            </p>
            <a
              href="mailto:info@slightlytechie.com?subject=Reschedule Interview Request"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-sm font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-base">email</span>
              Request Reschedule
            </a>
          </div>
        )}

        {isRejected && (
          <div className="bg-surface-container border border-outline rounded-xl p-4 mb-4 text-left">
            <h2 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tips_and_updates</span>
              What's Next?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-on-surface-variant">
              <li>Keep building your skills and working on projects</li>
              <li>You can reapply in the future</li>
              <li>Follow us on social media for future opportunities</li>
            </ul>
          </div>
        )}

        {/* Feedback */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-on-surface mb-2 flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-primary">feedback</span>
            We Value Your Feedback
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Your feedback helps us improve our process. We'd love to hear about your experience.
          </p>
          <a
            href="mailto:info@slightlytechie.com?subject=Application Feedback"
            className="text-primary hover:underline text-sm font-medium"
          >
            Share Your Feedback
          </a>
        </div>

        {/* Stay Connected */}
        <div className="pt-6 border-t border-outline">
          <h3 className="font-semibold text-on-surface mb-4">Stay Connected</h3>
          <div className="flex justify-center gap-4">
            <a
              href="https://x.com/_slightlyTechie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline rounded-lg text-sm font-medium text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-base">tag</span>
              Twitter
            </a>
            <a
              href="https://linkedin.com/company/slightlytechie-network"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-outline rounded-lg text-sm font-medium text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-base">work</span>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 pt-6 border-t border-outline">
          <p className="text-xs text-on-surface-variant">
            Questions? Email us at{" "}
            <a
              href="mailto:info@slightlytechie.com"
              className="text-primary hover:underline font-medium"
            >
              info@slightlytechie.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
