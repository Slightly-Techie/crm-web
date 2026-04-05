"use client";

import { OrgChartNode, SubordinateResponse } from "@/types";
import useEndpoints from "@/services";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface BulkAssignModalProps {
  manager: OrgChartNode;
  onClose: () => void;
}

function getAvatarUrl(user: { profile_pic_url?: string | null; first_name: string; last_name: string }) {
  if (user.profile_pic_url && user.profile_pic_url !== "string") return user.profile_pic_url;
  return `https://api.dicebear.com/7.x/initials/jpg?seed=${user.first_name} ${user.last_name}`;
}

export default function BulkAssignModal({ manager, onClose }: BulkAssignModalProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Track pending changes in local state
  const [pendingRemovals, setPendingRemovals] = useState<Set<number>>(new Set());
  const [pendingAdditions, setPendingAdditions] = useState<SubordinateResponse[]>([]);

  const { searchTechie, getUserSubordinates, bulkAssignSubordinates, updateUserManager } = useEndpoints();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Load current subordinates
  const { data: currentTeamData, isLoading: isLoadingTeam } = useQuery({
    queryKey: ["subordinates", manager.id],
    queryFn: () => getUserSubordinates(manager.id).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const currentTeam: SubordinateResponse[] = currentTeamData ?? [];

  // IDs to exclude from search: the manager, current subordinates, and pending additions
  const excludedIds = new Set([
    manager.id,
    ...currentTeam.map((s) => s.id),
    ...pendingAdditions.map((a) => a.id),
  ]);

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["manageTeamSearch", debouncedSearch],
    queryFn: () => searchTechie(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
    refetchOnWindowFocus: false,
  });

  const availableResults = ((searchResults as any)?.items ?? []).filter(
    (u: any) => !excludedIds.has(u.id)
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const toRemove = currentTeam.filter((s) => pendingRemovals.has(s.id));
    const toAdd = pendingAdditions;

    if (toRemove.length === 0 && toAdd.length === 0) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      // Remove: set each person's manager to null
      if (toRemove.length > 0) {
        const removalResults = await Promise.allSettled(
          toRemove.map((s) => updateUserManager(s.id, { manager_id: null }))
        );
        const failedRemovals = removalResults.filter((result) => result.status === "rejected");

        if (failedRemovals.length > 0) {
          throw new Error(
            `Failed to remove ${failedRemovals.length} member${
              failedRemovals.length !== 1 ? "s" : ""
            }.`
          );
        }
      }

      // Add: bulk assign
      if (toAdd.length > 0) {
        await bulkAssignSubordinates(manager.id, { user_ids: toAdd.map((u) => u.id) });
      }

      const parts: string[] = [];
      if (toAdd.length > 0) parts.push(`${toAdd.length} member${toAdd.length !== 1 ? "s" : ""} added`);
      if (toRemove.length > 0) parts.push(`${toRemove.length} member${toRemove.length !== 1 ? "s" : ""} removed`);
      toast.success(parts.join(", "));

      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      queryClient.invalidateQueries({ queryKey: ["subordinates", manager.id] });
      onClose();
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, "Failed to update team."));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRemoval = (id: number) => {
    setPendingRemovals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addPending = (user: any) => {
    setPendingAdditions((prev) => [...prev, user]);
    setSearch("");
  };

  const removePendingAddition = (id: number) => {
    setPendingAdditions((prev) => prev.filter((u) => u.id !== id));
  };

  const hasChanges = pendingRemovals.size > 0 || pendingAdditions.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-lg border border-outline flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline shrink-0">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Manage Team</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              for{" "}
              <span className="font-semibold text-primary">
                {manager.first_name} {manager.last_name}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Current Team */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
              Current Team ({currentTeam.length})
            </h3>
            {isLoadingTeam ? (
              <div className="flex justify-center py-6">
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : currentTeam.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4 bg-surface-container rounded-xl">
                No team members yet
              </p>
            ) : (
              <div className="space-y-1.5">
                {currentTeam.map((member) => {
                  const markedForRemoval = pendingRemovals.has(member.id);
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                        markedForRemoval
                          ? "bg-error/10 border border-error/30"
                          : "bg-surface-container"
                      }`}
                    >
                      <Image
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                        width={32}
                        height={32}
                        src={getAvatarUrl(member)}
                        alt={`${member.first_name} ${member.last_name}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${markedForRemoval ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">
                          @{member.username}
                          {member.stack?.name && ` · ${member.stack.name}`}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleRemoval(member.id)}
                        title={markedForRemoval ? "Undo remove" : "Remove from team"}
                        className={`p-1.5 rounded-lg transition-colors text-xs font-semibold shrink-0 ${
                          markedForRemoval
                            ? "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                            : "text-error hover:bg-error/10"
                        }`}
                      >
                        {markedForRemoval ? (
                          <span className="material-symbols-outlined text-base">undo</span>
                        ) : (
                          <span className="material-symbols-outlined text-base">person_remove</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Pending Additions */}
          {pendingAdditions.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                To Add ({pendingAdditions.length})
              </h3>
              <div className="space-y-1.5">
                {pendingAdditions.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/30"
                  >
                    <Image
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      width={32}
                      height={32}
                      src={getAvatarUrl(member)}
                      alt={`${member.first_name} ${member.last_name}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        @{member.username}
                        {(member as any).stack?.name && ` · ${(member as any).stack.name}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removePendingAddition(member.id)}
                      className="p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-colors shrink-0"
                      title="Cancel add"
                    >
                      <AiOutlineClose size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Search to Add */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
              Add Members
            </h3>
            <div className="flex items-center gap-2 border border-outline rounded-lg px-3 py-2.5 bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
              <input
                type="text"
                placeholder="Search by name, username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm text-on-surface placeholder-on-surface-variant"
              />
              {isFetching && (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
              )}
            </div>

            <div className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
              {debouncedSearch.length < 2 && (
                <p className="text-sm text-on-surface-variant text-center py-4">
                  Type at least 2 characters to search
                </p>
              )}
              {!isFetching && debouncedSearch.length >= 2 && availableResults.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-4">No members found</p>
              )}
              {availableResults.map((user: any) => (
                <button
                  key={user.id}
                  onClick={() => addPending(user)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-container-high border border-transparent transition-colors text-left w-full"
                >
                  <Image
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    width={36}
                    height={36}
                    src={getAvatarUrl(user)}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      @{user.username}
                      {user.stack?.name && ` · ${user.stack.name}`}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-base shrink-0">person_add</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline flex justify-between items-center gap-3 shrink-0">
          {hasChanges ? (
            <p className="text-xs text-on-surface-variant">
              {pendingAdditions.length > 0 && `+${pendingAdditions.length} to add`}
              {pendingAdditions.length > 0 && pendingRemovals.size > 0 && "  "}
              {pendingRemovals.size > 0 && `−${pendingRemovals.size} to remove`}
            </p>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-sm rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : hasChanges ? (
                "Save Changes"
              ) : (
                "Done"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
