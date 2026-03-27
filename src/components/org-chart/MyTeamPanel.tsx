"use client";

import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MyTeamPanel() {
  const { getMyManager, getMySubordinates } = useEndpoints();
  const session = useSession();

  const { data: manager, isLoading: managerLoading } = useQuery({
    queryKey: ["myManager"],
    queryFn: () => getMyManager().then((res) => res.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
  });

  const { data: subordinates, isLoading: subsLoading } = useQuery({
    queryKey: ["mySubordinates"],
    queryFn: () => getMySubordinates().then((res) => res.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
  });

  const isLoading = managerLoading || subsLoading;
  const hasManager = manager !== null && manager !== undefined;
  const hasSubordinates = subordinates && subordinates.length > 0;

  // Don't render if there's nothing to show
  if (!isLoading && !hasManager && !hasSubordinates) return null;

  return (
    <div className="mt-4 px-2">
      <h2 className="font-bold text-sm text-gray-900 dark:text-white mb-3">
        My Team
      </h2>

      {isLoading ? (
        <p className="text-xs text-gray-400">Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Manager Section */}
          {hasManager && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">
                My Manager
              </p>
              <PersonCard person={manager} />
            </div>
          )}
          {!hasManager && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase font-semibold">
                My Manager
              </p>
              <p className="text-xs text-gray-400">No manager assigned</p>
            </div>
          )}

          {/* Subordinates Section */}
          {hasSubordinates && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase font-semibold">
                My Direct Reports ({subordinates.length})
              </p>
              <div className="flex flex-col gap-1">
                {subordinates.map((sub) => (
                  <PersonCard key={sub.id} person={sub} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PersonCard({
  person,
}: {
  person: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    profile_pic_url: string | null;
    stack?: { id: number; name: string } | null;
  };
}) {
  const picUrl =
    person.profile_pic_url && person.profile_pic_url !== "string"
      ? person.profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${person.first_name} ${person.last_name}`;

  return (
    <Link
      href={`/techies/${person.id}`}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <Image
        className="w-8 h-8 rounded-full object-cover shrink-0"
        width={32}
        height={32}
        src={picUrl}
        alt={`${person.first_name} ${person.last_name}`}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {person.first_name} {person.last_name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          @{person.username}
          {person.stack?.name && ` · ${person.stack.name}`}
        </p>
      </div>
    </Link>
  );
}
