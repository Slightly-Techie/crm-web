"use client";

import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/loadingSpinner";

function MemberCard({ member, role, highlight = false }: { member: any; role?: string; highlight?: boolean }) {
  const src =
    member.profile_pic_url ||
    `https://api.dicebear.com/7.x/initials/jpg?seed=${member.first_name} ${member.last_name}`;

  return (
    <Link href={`/techies/${member.id}`}>
      <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer w-36 ${
        highlight
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
          : "border-outline bg-surface-container-lowest hover:border-primary/40"
      }`}>
        <div className={`relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ${highlight ? "ring-primary" : "ring-secondary-container"}`}>
          <Image className="w-full h-full object-cover" width={56} height={56} src={src} alt={member.first_name} />
        </div>
        <div className="text-center">
          <p className={`font-semibold text-xs leading-tight ${highlight ? "text-primary" : "text-on-surface"}`}>
            {member.first_name} {member.last_name}
          </p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">@{member.username}</p>
          {member.stack?.name && (
            <span className="text-[9px] px-1.5 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-medium mt-1 inline-block">
              {member.stack.name}
            </span>
          )}
        </div>
        {role && (
          <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold uppercase tracking-wider">
            {role}
          </span>
        )}
      </div>
    </Link>
  );
}

function Connector({ vertical = false }: { vertical?: boolean }) {
  return vertical ? (
    <div className="w-px h-8 bg-outline mx-auto" />
  ) : (
    <div className="h-px bg-outline flex-1" />
  );
}

export default function MyTeamPage() {
  const { getUserProfile, getMyManager, getMySubordinates } = useEndpoints();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: manager, isLoading: managerLoading } = useQuery({
    queryKey: ["myManager"],
    queryFn: () => getMyManager().then((res) => res.data),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: subordinates = [], isLoading: subLoading } = useQuery({
    queryKey: ["mySubordinates"],
    queryFn: () => getMySubordinates().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const isLoading = userLoading || managerLoading || subLoading;
  const subs: any[] = subordinates as any[];

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
            <span>Network</span>
            <span>/</span>
            <span className="text-primary">My Team</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface tracking-tight">
            My Org Circle
          </h1>
          <p className="text-on-surface-variant mt-2">
            Your manager, your position, and the people who report to you.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && user && (
          <div className="space-y-0">
            {/* Manager level */}
            {manager ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant" />
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Reports To</span>
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant" />
                </div>
                <MemberCard member={manager} role="Manager" />
                <Connector vertical />
              </div>
            ) : (
              <div className="flex flex-col items-center mb-4">
                <div className="px-4 py-2 rounded-lg border border-dashed border-outline text-xs text-on-surface-variant">
                  No manager assigned
                </div>
                <Connector vertical />
              </div>
            )}

            {/* Self */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">You</span>
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <MemberCard member={user} highlight />
            </div>

            {/* Subordinates level */}
            {subs.length > 0 && (
              <div className="flex flex-col items-center">
                <Connector vertical />
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant" />
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Direct Reports ({subs.length})
                  </span>
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant" />
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {subs.slice(0, 8).map((sub: any) => (
                    <div key={sub.id} className="flex flex-col items-center">
                      <div className="w-px h-4 bg-outline" />
                      <MemberCard member={sub} />
                    </div>
                  ))}
                  {subs.length > 8 && (
                    <div className="flex flex-col items-center">
                      <div className="w-px h-4 bg-outline" />
                      <div className="w-36 h-full flex items-center justify-center p-4 rounded-xl border-2 border-dashed border-outline text-xs text-on-surface-variant font-medium">
                        +{subs.length - 8} more
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {subs.length === 0 && (
              <div className="flex flex-col items-center mt-6">
                <Connector vertical />
                <div className="px-6 py-3 rounded-xl border border-dashed border-outline text-sm text-on-surface-variant">
                  No direct reports
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin link */}
        {user?.role?.name === "admin" && (
          <div className="pt-4 border-t border-outline">
            <Link
              href="/admin/org-chart"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">corporate_fare</span>
              View Full Organization Chart
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
