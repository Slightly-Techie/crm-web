"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NotFound() {
  const router = useRouter();
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">
            explore_off
          </span>
        </div>

        <p className="text-sm font-semibold text-primary mb-2">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface mb-4 font-headline">
          Page not found
        </h1>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={isSignedIn ? "/" : "/login"}
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-xl">
              {isSignedIn ? "dashboard" : "login"}
            </span>
            {isSignedIn ? "Back to dashboard" : "Go to login"}
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface py-3 px-6 rounded-xl font-semibold hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}
