import { useMemo, useState } from "react";
import Member from "./Member";
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "../loadingSpinner";
import { useSession } from "next-auth/react";

function Team() {
  const { getTechiesList, getStacks } = useEndpoints();
  const { status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStack, setSelectedStack] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch stacks for filter
  const { data: stacksData } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks().then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: sessionStatus === "authenticated",
  });

  let stacks: any[] = [];
  if (Array.isArray(stacksData)) {
    stacks = stacksData;
  } else {
    const stackPayload = (stacksData as { data?: unknown[] } | undefined)?.data;
    if (Array.isArray(stackPayload)) {
      stacks = stackPayload;
    }
  }

  const {
    data: TechiesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["techies", currentPage, selectedStack],
    queryFn: async () => {
      return await getTechiesList({ page: currentPage });
    },
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: sessionStatus === "authenticated",
  });

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const paginationDetails = {
    total: TechiesData?.total || 0,
    size: TechiesData?.size || 0,
    pages: TechiesData?.pages || 0,
    page: TechiesData?.page || currentPage,
  };

  const membersOnCurrentPage = TechiesData?.items || [];
  const availableForProjectsCount = membersOnCurrentPage.filter((member) => member.is_active).length;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeekCount = membersOnCurrentPage.filter((member) => {
    if (!member.created_at) return false;
    const createdTime = new Date(member.created_at).getTime();
    return !Number.isNaN(createdTime) && createdTime >= oneWeekAgo;
  }).length;

  const techies = useMemo(() => {
    let filtered = TechiesData?.items || [];

    // Filter by search keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (techie) =>
          techie.first_name.toLowerCase().includes(keyword) ||
          techie.last_name.toLowerCase().includes(keyword)
      );
    }

    // Filter by stack
    if (selectedStack && selectedStack !== "all") {
      filtered = filtered.filter(
        (techie) => techie.stack?.id === Number.parseInt(selectedStack)
      );
    }

    return filtered;
  }, [TechiesData?.items, searchKeyword, selectedStack]);

  return (
    <div className="w-full h-full">
      <div className="p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Directory Header & Filters */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
                <span>Network</span>
                <span>/</span>
                <span className="text-primary">Directory</span>
              </nav>
              <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-headline tracking-tighter">
                Directory
              </h2>
              <p className="text-on-surface-variant mt-3 text-lg">
                Meet the talented builders in the ST network. Search and connect with team members across the organization.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:gap-0 md:flex-wrap md:flex-row md:items-end">
              {/* Stack Filter */}
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <label htmlFor="team-stack-filter" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Stack
                </label>
                <select
                  id="team-stack-filter"
                  value={selectedStack}
                  onChange={(e) => {
                    setSelectedStack(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-surface-container-high border-none rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-primary/20 appearance-none"
                >
                  <option value="all">All Stacks</option>
                  {stacks.map((stack: any) => (
                    <option key={stack.id} value={stack.id}>
                      {stack.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Search Bar */}
          <div className="flex items-center gap-3 border border-outline rounded-lg px-4 py-3 bg-surface-container-lowest">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent focus:outline-none text-sm text-on-surface placeholder-on-surface-variant w-full"
            />
          </div>

          {/* Stats Bar */}
          <div className="flex gap-8 py-4 border-y border-stone-100 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold text-on-surface">
                {paginationDetails.total}
              </span>
              <span className="text-sm text-on-surface-variant">Total Members</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold text-on-surface">
                {availableForProjectsCount}
              </span>
              <span className="text-sm text-on-surface-variant">Available for Projects</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm font-bold text-on-surface">
                {newThisWeekCount}
              </span>
              <span className="text-sm text-on-surface-variant">New this week</span>
            </div>
          </div>

          {/* Authentication Loading State */}
          {sessionStatus === "loading" && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {/* Authentication Check */}
          {sessionStatus === "unauthenticated" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-yellow-700 text-2xl">
                  info
                </span>
                <div>
                  <p className="font-semibold text-yellow-900">Authentication Required</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Please log in to view the directory of team members.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {sessionStatus === "authenticated" && isLoading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {sessionStatus === "authenticated" && isError && (
            <div className="bg-error-container border border-error rounded-xl p-6">
              <p className="text-on-error-container font-medium">
                Error loading techies: {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <p className="text-on-error-container text-sm mt-2">
                Please check your connection and try refreshing the page.
              </p>
              <button
                onClick={() => globalThis.location.reload()}
                className="mt-4 px-4 py-2 bg-on-error-container text-error-container rounded-lg text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {sessionStatus === "authenticated" && !isLoading && !isError && (!techies || techies.length === 0) && (
            <div className="bg-surface-container-low rounded-xl p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">
                people
              </span>
              <p className="text-on-surface-variant font-medium">
                No team members found
              </p>
            </div>
          )}

          {/* Techies Bento Grid */}
          {sessionStatus === "authenticated" && !isLoading && !isError && techies && techies.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {techies.map((user) => (
                  <Member key={user.id} data={user} />
                ))}
              </div>

              {/* Pagination */}
              {paginationDetails.pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all text-on-surface font-semibold text-sm"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(paginationDetails.pages, 5) }, (_, i) => {
                      let pageNum: number;
                      if (paginationDetails.pages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= paginationDetails.pages - 2) {
                        pageNum = paginationDetails.pages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[44px] h-11 rounded-lg font-semibold text-sm transition-all ${
                            currentPage === pageNum
                              ? "bg-primary text-on-primary shadow-md"
                              : "bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high text-on-surface"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(paginationDetails.pages, prev + 1))
                    }
                    disabled={currentPage === paginationDetails.pages}
                    className="px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all text-on-surface font-semibold text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Fallback - This should never show if logic is correct */}
          {!((sessionStatus === "loading") ||
            (sessionStatus === "unauthenticated") ||
            (sessionStatus === "authenticated" && isLoading) ||
            (sessionStatus === "authenticated" && isError) ||
            (sessionStatus === "authenticated" && !isLoading && !isError && (!techies || techies.length === 0)) ||
            (sessionStatus === "authenticated" && !isLoading && !isError && techies && techies.length > 0)) && (
            <div className="bg-surface-container rounded-xl p-8 text-center">
              <p className="text-on-surface-variant font-medium">
                Status: {sessionStatus} | Loading: {isLoading ? "yes" : "no"} | Error: {isError ? "yes" : "no"}
              </p>
              <p className="text-on-surface-variant text-sm mt-2">
                Please refresh the page or contact support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Team;
