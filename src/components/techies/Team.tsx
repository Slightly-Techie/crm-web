import { useEffect, useMemo, useState } from "react";
import Member from "./Member";
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "../loadingSpinner";
import { useSession } from "next-auth/react";
import FilterSelect, { SelectOption } from "./FilterSelect";

const EXPERIENCE_LEVELS: { value: string; label: string }[] = [
  { value: "entry", label: "Entry (0–2 yrs)" },
  { value: "intermediate", label: "Intermediate (3–5 yrs)" },
  { value: "expert", label: "Expert (6+ yrs)" },
];

function Team() {
  const { getTechiesList, searchTechie, getStacks, getAllTags, getSkills } =
    useEndpoints();
  const { status: sessionStatus } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStack, setSelectedStack] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [openToProjects, setOpenToProjects] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

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

  // Fetch all tags for the multi-select filter
  const { data: tagsData } = useQuery({
    queryKey: ["all-tags"],
    queryFn: () => getAllTags().then((res) => res.data.tags),
    refetchOnWindowFocus: false,
    enabled: sessionStatus === "authenticated",
  });
  const tagOptions: SelectOption[] = Array.isArray(tagsData)
    ? tagsData.map((tag) => ({ value: tag.name, label: tag.name }))
    : [];

  // Fetch the full skills pool for the multi-select filter.
  // GET /skills/all returns a plain array; tolerate a paginated { items } shape too.
  const { data: skillsData, isFetching: isLoadingSkills } = useQuery({
    queryKey: ["all-skills"],
    queryFn: () =>
      getSkills().then((res) => {
        const d: any = res.data;
        return Array.isArray(d) ? d : d?.items ?? [];
      }),
    refetchOnWindowFocus: false,
    enabled: sessionStatus === "authenticated",
  });
  const skillOptions: SelectOption[] = Array.isArray(skillsData)
    ? skillsData.map((skill: any) => ({ value: skill.name, label: skill.name }))
    : [];

  // Translate UI state into backend filter params
  const filters = useMemo(() => {
    const stackName =
      selectedStack === "all"
        ? undefined
        : stacks.find((s) => String(s.id) === selectedStack)?.name;
    return {
      stack: stackName,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      experienceLevels: selectedLevels.length > 0 ? selectedLevels : undefined,
      openToProjects: openToProjects ? true : undefined,
    };
  }, [selectedStack, selectedTags, selectedSkills, selectedLevels, openToProjects, stacks]);

  const {
    data: TechiesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["techies", currentPage, debouncedSearch, filters],
    queryFn: async () => {
      if (debouncedSearch) {
        return await searchTechie(debouncedSearch, filters, currentPage);
      }
      return await getTechiesList({ page: currentPage, filters });
    },
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: sessionStatus === "authenticated",
    keepPreviousData: true,
  });

  // Whole-directory count of members open to projects (independent of page/filters).
  // Reads the server-side pagination `total` rather than counting the current page.
  const { data: availableForProjectsCount = 0 } = useQuery({
    queryKey: ["available-for-projects-count"],
    queryFn: () =>
      getTechiesList({ page: 1, size: 1, filters: { openToProjects: true } }).then(
        (res) => res.total || 0
      ),
    refetchOnWindowFocus: false,
    enabled: sessionStatus === "authenticated",
  });

  // Stable per-mount cutoff (day granularity) so the query key doesn't churn.
  const oneWeekAgoIso = useMemo(
    () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    []
  );
  const { data: newThisWeekCount = 0 } = useQuery({
    queryKey: ["new-this-week-count", oneWeekAgoIso.slice(0, 10)],
    queryFn: () =>
      getTechiesList({ page: 1, size: 1, filters: { createdAfter: oneWeekAgoIso } }).then(
        (res) => res.total || 0
      ),
    refetchOnWindowFocus: false,
    enabled: sessionStatus === "authenticated",
  });

  const hasActiveFilters =
    selectedStack !== "all" ||
    selectedTags.length > 0 ||
    selectedSkills.length > 0 ||
    selectedLevels.length > 0 ||
    openToProjects;

  const clearAllFilters = () => {
    setSelectedStack("all");
    setSelectedTags([]);
    setSelectedSkills([]);
    setSelectedLevels([]);
    setOpenToProjects(false);
    setCurrentPage(1);
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const paginationDetails = {
    total: TechiesData?.total || 0,
    size: TechiesData?.size || 0,
    pages: TechiesData?.pages || 0,
    page: TechiesData?.page || currentPage,
  };


  const techies = useMemo(() => {
    // Stack, tags, experience and availability are all filtered server-side now.
    // Keep the ACCEPTED + is_active guard as defence in depth — the Directory
    // must never surface applicants regardless of backend behaviour.
    return (TechiesData?.items || []).filter(
      (techie) => techie.status === "ACCEPTED" && techie.is_active === true
    );
  }, [TechiesData?.items]);

  return (
    <div className="w-full h-full">
      <div className="p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Directory Header */}
          <section>
            <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
              <span>Network</span>
              <span>/</span>
              <span className="text-primary">Directory</span>
            </nav>
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-headline tracking-tighter">
              Directory
            </h2>
            <p className="text-on-surface-variant mt-3 text-lg max-w-2xl">
              Meet the talented builders in the ST network. Search and connect with team members across the organization.
            </p>
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

          {/* Filter Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-4 md:p-5 space-y-4">
            {/* Skills + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="directory-skills-input" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Skills
                </label>
                <FilterSelect
                  instanceId="directory-skills"
                  options={skillOptions}
                  value={selectedSkills}
                  onChange={(v) => {
                    setSelectedSkills(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Search skills..."
                  isLoading={isLoadingSkills}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="directory-tags-input" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Tags
                </label>
                <FilterSelect
                  instanceId="directory-tags"
                  creatable
                  options={tagOptions}
                  value={selectedTags}
                  onChange={(v) => {
                    setSelectedTags(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Type a tag, e.g. Daddy…"
                />
              </div>
            </div>

            {/* Stack + Experience + Availability + Clear */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-x-8 gap-y-4">
              {/* Stack */}
              <div className="flex flex-col gap-1.5 min-w-[160px]">
                <label htmlFor="team-stack-filter" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1">
                  Stack
                </label>
                <div className="relative">
                  <select
                    id="team-stack-filter"
                    value={selectedStack}
                    onChange={(e) => {
                      setSelectedStack(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-surface-container-high border-none rounded-lg py-2.5 pl-3 pr-9 text-sm focus:ring-2 focus:ring-primary/20 appearance-none text-on-surface cursor-pointer"
                  >
                    <option value="all">All Stacks</option>
                    {stacks.map((stack: any) => (
                      <option key={stack.id} value={stack.id}>
                        {stack.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Experience levels (Upwork-style, multi-select) */}
              <fieldset className="flex flex-col gap-1.5">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-1.5">
                  Experience level
                </legend>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer text-sm text-on-surface">
                      <input
                        type="checkbox"
                        checked={selectedLevels.includes(level.value)}
                        onChange={() => toggleLevel(level.value)}
                        className="h-4 w-4 rounded border-outline/40 accent-primary cursor-pointer"
                      />
                      {level.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Availability */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-1.5">
                  Availability
                </span>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-on-surface">
                  <input
                    type="checkbox"
                    checked={openToProjects}
                    onChange={() => {
                      setOpenToProjects((prev) => !prev);
                      setCurrentPage(1);
                    }}
                    className="h-4 w-4 rounded border-outline/40 accent-primary cursor-pointer"
                  />
                  Open to projects
                </label>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="sm:ml-auto flex items-center gap-1 self-start sm:self-end text-sm font-semibold text-primary hover:underline py-2"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Clear all
                </button>
              )}
            </div>
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
            <div className="flex justify-center items-center py-32">
              <LoadingSpinner fullScreen={false} />
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
            <div className="flex justify-center items-center py-32">
              <LoadingSpinner fullScreen={false} />
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
