"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import ApplicantDetailModal from "@/components/modals/ApplicantDetailModal";

const STATUS_LABELS: Record<string, { label: string; color: string; dot: string }> = {
  "TO CONTACT":     { label: "To Contact",  color: "bg-blue-100 text-blue-700",                          dot: "bg-blue-500" },
  "IN REVIEW":      { label: "In Review",   color: "bg-yellow-100 text-yellow-700",                      dot: "bg-yellow-500" },
  "INTERVIEWED":    { label: "Interviewed", color: "bg-purple-100 text-purple-700",                      dot: "bg-purple-500" },
  "ACCEPTED":       { label: "Accepted",    color: "bg-secondary-container text-on-secondary-container", dot: "bg-secondary" },
  "NO SHOW":        { label: "No Show",     color: "bg-orange-100 text-orange-700",                      dot: "bg-orange-500" },
  "REJECTED":       { label: "Rejected",    color: "bg-error/10 text-error",                             dot: "bg-error" },
  "TO BE ONBOARDED":{ label: "Onboarding",  color: "bg-tertiary/10 text-tertiary",                       dot: "bg-tertiary" },
  "CONTACTED":      { label: "Contacted",   color: "bg-primary/10 text-primary",                         dot: "bg-primary" },
  "PENDING":        { label: "Pending",     color: "bg-surface-container-high text-on-surface-variant",  dot: "bg-outline" },
};

const APPLICANT_STATUS_OPTIONS = [
  "TO CONTACT", "IN REVIEW", "CONTACTED", "INTERVIEWED",
  "NO SHOW", "TO BE ONBOARDED", "ACCEPTED", "REJECTED",
] as const;

function StatusBadge({ status }: Readonly<{ status?: string }>) {
  const s = STATUS_LABELS[status || "PENDING"] || STATUS_LABELS.PENDING;
  return (
    <span className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide ${s.color}`}>
      {s.label}
    </span>
  );
}

type Applicant = {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  email?: string;
  phone_number?: string;
  years_of_experience?: number | null;
  profile_pic_url?: string | null | undefined;
  user_status?: string;
  status?: string;
};

function isAlreadyActiveError(error: any): boolean {
  const detail = error?.response?.data?.detail;
  if (typeof detail === "string") return detail.toLowerCase().includes("already active");
  if (Array.isArray(detail)) return detail.some((d: any) => String(d).toLowerCase().includes("already active"));
  return false;
}

export default function Applicants() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [statusPanelPosition, setStatusPanelPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBatchActions, setShowBatchActions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusPanelRef = useRef<HTMLDivElement>(null);
  const { searchApplicant, updateApplicantStatus, activateUser, batchUpdateApplicantStatus } = useEndpoints();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number; status: string }) => {
      // Update status first
      await updateApplicantStatus(userId, status);
      // If status is ACCEPTED, also activate the user
      if (status === "ACCEPTED") {
        try {
          await activateUser(userId);
        } catch (error: any) {
          // Ignore "already active" — user may have been activated previously
          if (!isAlreadyActiveError(error)) throw error;
        }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      const message = variables.status === "ACCEPTED"
        ? "Applicant accepted and activated"
        : "Applicant status updated";
      toast.success(message);
    },
    onError: () => {
      toast.error("Unable to update applicant status");
    },
  });

  const batchUpdateMutation = useMutation({
    mutationFn: ({ userIds, status }: { userIds: number[]; status: string }) =>
      batchUpdateApplicantStatus(userIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants"] });
      setSelectedIds(new Set());
      setShowBatchActions(false);
      toast.success("Batch status update completed");
    },
    onError: () => {
      toast.error("Failed to update some applicants");
    },
  });

  const closeAllMenus = useCallback(() => {
    setActiveMenuId(null);
    setMenuPosition(null);
    setStatusPanelPosition(null);
  }, []);

  useEffect(() => {
    if (!activeMenuId) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest("[data-applicant-menu-trigger='true']") ||
        menuRef.current?.contains(target) ||
        statusPanelRef.current?.contains(target)
      ) return;
      closeAllMenus();
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("scroll", closeAllMenus, true);
    window.addEventListener("resize", closeAllMenus);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("scroll", closeAllMenus, true);
      window.removeEventListener("resize", closeAllMenus);
    };
  }, [activeMenuId, closeAllMenus]);

  const handleMenuToggle = (applicantId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (activeMenuId === applicantId) {
      closeAllMenus();
      return;
    }

    const triggerRect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 176;
    const estimatedMenuHeight = 150;
    const gap = 8;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const openUp = spaceBelow < estimatedMenuHeight && spaceAbove > estimatedMenuHeight;

    const top = openUp
      ? Math.max(gap, triggerRect.top - estimatedMenuHeight - gap)
      : Math.min(window.innerHeight - estimatedMenuHeight - gap, triggerRect.bottom + gap);

    const left = Math.max(
      gap,
      Math.min(window.innerWidth - menuWidth - gap, triggerRect.right - menuWidth)
    );

    setMenuPosition({ top, left });
    setStatusPanelPosition(null);
    setActiveMenuId(applicantId);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const { data: applicantsData, isLoading, isError } = useQuery({
    queryKey: ["applicants", currentPage, debouncedSearch, statusFilter],
    queryFn: () => searchApplicant(debouncedSearch, currentPage, statusFilter),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  // Fetch all applicants for stats (no search, no status filter)
  const { data: allApplicantsData } = useQuery({
    queryKey: ["applicants", "all-stats"],
    queryFn: () => searchApplicant("", 1),
    refetchOnWindowFocus: false,
  });

  const applicants = applicantsData?.items || [];
  const allApplicants = allApplicantsData?.items || [];
  const paginationDetails = {
    total: applicantsData?.total || 0,
    pages: applicantsData?.pages || 0,
    page: applicantsData?.page || 1,
  };

  const filteredApplicants = applicants;

  let activeApplicant: Applicant | null = null;
  if (activeMenuId !== null) {
    activeApplicant =
      filteredApplicants.find((applicant: Applicant) => applicant.id === activeMenuId) ?? null;
  }

  const handleStatusChange = (status: string) => {
    if (!activeApplicant) {
      return;
    }

    updateStatusMutation.mutate({ userId: activeApplicant.id, status });
    closeAllMenus();
  };

  const handleBatchStatusChange = (status: string) => {
    const userIds = Array.from(selectedIds);
    if (userIds.length === 0) {
      toast.error("Please select at least one applicant");
      return;
    }
    batchUpdateMutation.mutate({ userIds, status });
  };

  const toggleSelectApplicant = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplicants.length) {
      setSelectedIds(new Set());
    } else {
      const allIds = filteredApplicants.map((a: Applicant) => a.id);
      setSelectedIds(new Set(allIds));
    }
  };

  const statsTotal = applicantsData?.total || 0;
  const statsToContact = allApplicants.filter((a: any) => (a.user_status || a.status) === "TO CONTACT").length;
  const statsInterviewing = allApplicants.filter((a: any) => (a.user_status || a.status) === "INTERVIEWED").length;
  const statsContacted = allApplicants.filter((a: any) => (a.user_status || a.status) === "CONTACTED").length;

  const stats = [
    { label: "Total Applicants", value: statsTotal, icon: "people", color: "text-primary", bg: "bg-primary/10" },
    { label: "To Contact", value: statsToContact, icon: "mark_email_unread", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Interviewing", value: statsInterviewing, icon: "record_voice_over", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Contacted", value: statsContacted, icon: "how_to_reg", color: "text-secondary", bg: "bg-secondary-container/50" },
  ];

  return (
    <div className="w-full h-full">
      <main className="p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <section>
            <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
              <span>Admin</span>
              <span>/</span>
              <span className="text-primary">Applicants</span>
            </nav>
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline tracking-tight text-on-surface">
              Recruitment Pipeline
            </h2>
            <p className="text-on-surface-variant mt-1 font-body">
              Review and manage all membership applications
            </p>
          </section>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-5 space-y-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-xl ${stat.color}`}>{stat.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-extrabold font-headline text-on-surface">{stat.value}</p>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filter bar + Batch Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline/50 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Search by name or email..."
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                  search
                </span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 bg-surface-container-lowest border border-outline rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
              >
                <option value="">All Statuses</option>
                {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {selectedIds.size > 0 && (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-on-surface">
                    {selectedIds.size} applicant{selectedIds.size === 1 ? "" : "s"} selected
                  </span>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBatchActions(!showBatchActions)}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">sync_alt</span>
                    <span>Change Status</span>
                  </button>
                </div>
              </div>
            )}

            {showBatchActions && selectedIds.size > 0 && (
              <div className="bg-surface-container-lowest shadow-sm rounded-xl p-4">
                <p className="text-sm font-semibold text-on-surface mb-3">
                  Update {selectedIds.size} applicant{selectedIds.size === 1 ? "" : "s"} to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {APPLICANT_STATUS_OPTIONS.map((statusOption) => {
                    const { label, dot } = STATUS_LABELS[statusOption];
                    return (
                      <button
                        key={statusOption}
                        onClick={() => handleBatchStatusChange(statusOption)}
                        disabled={batchUpdateMutation.status === "loading"}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container rounded-lg text-sm font-medium text-on-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-outline/20 hover:border-outline/40"
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center items-center py-32">
              <LoadingSpinner fullScreen={false} />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="bg-error-container border border-error rounded-xl p-4 text-center">
              <p className="text-on-error-container font-medium">Error loading applicants. Please try again.</p>
            </div>
          )}

          {/* Table */}
          {!isLoading && !isError && (
            <>
              {filteredApplicants.length === 0 ? (
                <div className="bg-surface-container-lowest shadow-sm rounded-xl p-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">person_search</span>
                  <p className="text-on-surface-variant font-medium">No applicants found</p>
                </div>
              ) : (
                <div className="bg-surface-container-lowest shadow-sm rounded-xl overflow-visible">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface-container-high border-b border-outline/20">
                          <th className="px-4 py-4 w-12">
                            <input
                              type="checkbox"
                              checked={selectedIds.size === filteredApplicants.length && filteredApplicants.length > 0}
                              onChange={toggleSelectAll}
                              className="w-4 h-4 rounded border-outline-variant cursor-pointer accent-primary"
                            />
                          </th>
                          <th className="px-3 md:px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Name
                          </th>
                          <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Email
                          </th>
                          <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Phone
                          </th>
                          <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Experience
                          </th>
                          <th className="px-2 md:px-6 py-4 text-left text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Status
                          </th>
                          <th className="px-2 md:px-6 py-4 text-left text-[10px] md:text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline/15">
                        {filteredApplicants.map((applicant: Applicant) => {
                          const hasExperience =
                            applicant.years_of_experience !== null &&
                            applicant.years_of_experience !== undefined;
                          const experienceSuffix = applicant.years_of_experience === 1 ? "" : "s";
                          const isSelected = selectedIds.has(applicant.id);

                          return (
                          <tr key={applicant.id} className={`hover:bg-surface-container transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectApplicant(applicant.id)}
                                className="w-4 h-4 rounded border-outline-variant cursor-pointer accent-primary"
                              />
                            </td>
                            <td className="px-3 md:px-6 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2 md:gap-3">
                                <Image
                                  className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-secondary-container"
                                  width={32}
                                  height={32}
                                  src={
                                    applicant.profile_pic_url ||
                                    `https://api.dicebear.com/7.x/initials/jpg?seed=${applicant.first_name} ${applicant.last_name}`
                                  }
                                  alt={`${applicant.first_name} ${applicant.last_name}`}
                                />
                                <div className="min-w-0">
                                  <p className="text-xs md:text-sm font-semibold text-on-surface truncate">
                                    {applicant.first_name} {applicant.last_name}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-on-surface-variant truncate">
                                    @{applicant.username || applicant.email?.split("@")[0]}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="hidden lg:table-cell px-6 py-3 whitespace-nowrap">
                              <p className="text-xs text-on-surface-variant">{applicant.email}</p>
                            </td>
                            <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap text-xs text-on-surface-variant">
                              {applicant.phone_number || "-"}
                            </td>
                            <td className="hidden md:table-cell px-6 py-3 whitespace-nowrap">
                              {hasExperience ? (
                                <div>
                                  <span className="font-semibold text-on-surface">{applicant.years_of_experience}</span>
                                  <span className="text-on-surface-variant text-xs ml-1">yr{experienceSuffix}</span>
                                </div>
                              ) : (
                                <span className="text-on-surface-variant text-xs">—</span>
                              )}
                            </td>
                            <td className="px-2 md:px-6 py-3 md:py-4 whitespace-nowrap">
                              <StatusBadge status={applicant.user_status || applicant.status} />
                            </td>
                            <td className="px-2 md:px-6 py-3 whitespace-nowrap">
                              <div className="relative inline-block">
                                <button
                                  onClick={(event) => handleMenuToggle(applicant.id, event)}
                                  data-applicant-menu-trigger="true"
                                  className="p-1.5 md:p-2 hover:bg-surface-container-high rounded-lg transition-colors"
                                  title="More actions"
                                >
                                  <BsThreeDotsVertical className="text-xs md:text-sm text-on-surface-variant" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeApplicant && menuPosition &&
                createPortal(
                  <div
                    ref={menuRef}
                    className="fixed w-44 rounded-xl bg-surface-container-lowest shadow-xl z-[1000] py-1 ring-1 ring-outline/10"
                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                  >
                    <button
                      onClick={() => { setSelectedApplicant(activeApplicant); closeAllMenus(); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface"
                    >
                      View details
                    </button>
                    <a
                      href={`mailto:${activeApplicant.email}`}
                      className="block w-full px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface"
                      onClick={closeAllMenus}
                    >
                      Send email
                    </a>
                    <div className="my-1 border-t border-outline/20" />
                    <button
                      onClick={() => {
                        if (statusPanelPosition) { setStatusPanelPosition(null); return; }
                        if (!menuPosition) return;
                        const panelW = 192;
                        const gap = 6;
                        const menuW = 176;
                        const spaceRight = window.innerWidth - (menuPosition.left + menuW + gap + panelW);
                        const left = spaceRight >= 0
                          ? menuPosition.left + menuW + gap
                          : menuPosition.left - panelW - gap;
                        setStatusPanelPosition({ top: menuPosition.top, left: Math.max(gap, left) });
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-surface-container-high text-on-surface flex items-center justify-between"
                    >
                      <span>Change status</span>
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>,
                  document.body
                )}

              {activeApplicant && statusPanelPosition &&
                createPortal(
                  <div
                    ref={statusPanelRef}
                    className="fixed z-[1001] bg-surface-container-lowest rounded-xl shadow-xl ring-1 ring-outline/10 py-1 w-48"
                    style={{ top: `${statusPanelPosition.top}px`, left: `${statusPanelPosition.left}px` }}
                  >
                    <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline/15">
                      Set status
                    </p>
                    {APPLICANT_STATUS_OPTIONS.map((statusOption) => {
                      const { label, dot } = STATUS_LABELS[statusOption];
                      const isCurrent = (activeApplicant?.user_status || activeApplicant?.status) === statusOption;
                      return (
                        <button
                          key={statusOption}
                          onClick={() => handleStatusChange(statusOption)}
                          disabled={isCurrent || updateStatusMutation.status === "loading"}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-surface-container-high text-on-surface flex items-center gap-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                          <span className="flex-1">{label}</span>
                          {isCurrent && <span className="material-symbols-outlined text-xs text-primary">check</span>}
                        </button>
                      );
                    })}
                  </div>,
                  document.body
                )}

              {/* Pagination */}
              {paginationDetails.pages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-on-surface-variant">
                    Showing page {currentPage} of {paginationDetails.pages} · {paginationDetails.total} total
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline/40 hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all text-on-surface font-semibold text-sm"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
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
                            className={`min-w-[40px] h-10 rounded-lg font-semibold text-sm transition-all ${
                              currentPage === pageNum
                                ? "bg-primary text-on-primary shadow-sm"
                                : "bg-surface-container-lowest border border-outline hover:bg-surface-container-high text-on-surface"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(paginationDetails.pages, p + 1))}
                      disabled={currentPage === paginationDetails.pages}
                      className="px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline/40 hover:bg-surface-container-high disabled:opacity-40 disabled:cursor-not-allowed transition-all text-on-surface font-semibold text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedApplicant && (
            <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Close applicant details"
                onClick={() => setSelectedApplicant(null)}
              />
              <div className="relative w-full max-w-lg rounded-2xl shadow-xl bg-surface-container-lowest p-6">
                <div className="flex items-start gap-4">
                  <Image
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary-container"
                    width={56}
                    height={56}
                    src={
                      selectedApplicant.profile_pic_url ||
                      `https://api.dicebear.com/7.x/initials/jpg?seed=${selectedApplicant.first_name} ${selectedApplicant.last_name}`
                    }
                    alt={`${selectedApplicant.first_name} ${selectedApplicant.last_name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-on-surface">
                      {selectedApplicant.first_name} {selectedApplicant.last_name}
                    </h3>
                    <p className="text-sm text-on-surface-variant">@{selectedApplicant.username}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="p-2 rounded-lg hover:bg-surface-container-high"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">close</span>
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-surface-container-high p-3">
                    <p className="text-xs text-on-surface-variant uppercase">Email</p>
                    <p className="text-on-surface break-all">{selectedApplicant.email || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-surface-container-high p-3">
                    <p className="text-xs text-on-surface-variant uppercase">Phone</p>
                    <p className="text-on-surface">{selectedApplicant.phone_number || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-surface-container-high p-3">
                    <p className="text-xs text-on-surface-variant uppercase">Experience</p>
                    <p className="text-on-surface">{(() => {
                      const years = selectedApplicant.years_of_experience;
                      if (years === null || years === undefined) return "-";
                      return `${years} year${years === 1 ? "" : "s"}`;
                    })()}</p>
                  </div>
                  <div className="rounded-xl bg-surface-container-high p-3">
                    <p className="text-xs text-on-surface-variant uppercase">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedApplicant.user_status || selectedApplicant.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="px-4 py-2 rounded-lg border border-outline text-sm text-on-surface hover:bg-surface-container-high"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Applicant Detail Modal */}
      <ApplicantDetailModal
        applicant={selectedApplicant}
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
      />
    </div>
  );
}
