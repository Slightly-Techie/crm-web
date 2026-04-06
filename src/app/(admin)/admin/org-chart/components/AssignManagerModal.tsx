"use client";

import { OrgChartNode } from "@/types";
import useEndpoints from "@/services";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface AssignManagerModalProps {
  node: OrgChartNode;
  currentManager: OrgChartNode | null;
  onClose: () => void;
}

function getAvatarUrl(user: { profile_pic_url?: string | null; first_name: string; last_name: string }) {
  if (user.profile_pic_url && user.profile_pic_url !== "string") return user.profile_pic_url;
  return `https://api.dicebear.com/7.x/initials/jpg?seed=${user.first_name} ${user.last_name}`;
}

export default function AssignManagerModal({
  node,
  currentManager,
  onClose,
}: Readonly<AssignManagerModalProps>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { searchTechie, updateUserManager } = useEndpoints();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["assignManagerSearch", debouncedSearch],
    queryFn: () => searchTechie(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
    refetchOnWindowFocus: false,
  });

  const assignMutation = useMutation({
    mutationFn: (managerId: number) =>
      updateUserManager(node.id, { manager_id: managerId }),
    onSuccess: () => {
      toast.success(`Manager assigned for ${node.first_name} ${node.last_name}`);
      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to assign manager."));
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => updateUserManager(node.id, { manager_id: null }),
    onSuccess: () => {
      toast.success(`${node.first_name} ${node.last_name} removed from hierarchy`);
      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to remove manager."));
    },
  });

  const isBusy = assignMutation.isLoading || removeMutation.isLoading;

  const users = (searchResults as any)?.items ?? [];
  // Filter out the node itself and their current manager (already assigned)
  const filteredUsers = users.filter(
    (u: any) => u.id !== node.id && u.id !== node.manager_id
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md mx-4 border border-outline-variant/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Assign Manager</h2>
            <p className="text-sm text-on-surface-variant">
              for {node.first_name} {node.last_name}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isBusy}
            className="p-1.5 rounded-lg hover:bg-surface-container disabled:opacity-50"
          >
            <AiOutlineClose size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Current Manager */}
          {node.manager_id && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Current Manager
              </h3>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-outline-variant/30">
                <div className="flex items-center gap-3 min-w-0">
                  {currentManager ? (
                    <Image
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      width={32}
                      height={32}
                      src={getAvatarUrl(currentManager)}
                      alt={`${currentManager.first_name} ${currentManager.last_name}`}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-base">person</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    {currentManager ? (
                      <>
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {currentManager.first_name} {currentManager.last_name}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">
                          @{currentManager.username}
                          {currentManager.stack?.name && ` · ${currentManager.stack.name}`}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-on-surface">Assigned</p>
                        <p className="text-xs text-on-surface-variant">ID #{node.manager_id}</p>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeMutation.mutate()}
                  disabled={isBusy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  {removeMutation.isLoading ? (
                    <span className="w-3 h-3 border-2 border-error border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-sm">person_remove</span>
                  )}
                  Remove
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                Search below to reassign to a different manager.
              </p>
            </section>
          )}

          {/* Search */}
          <section>
            {!node.manager_id && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                Select Manager
              </h3>
            )}
            <div className="flex items-center gap-2 border border-outline rounded-md px-3 py-2.5 bg-surface-container-low focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <AiOutlineSearch size={18} className="text-on-surface-variant shrink-0" />
              <input
                type="text"
                placeholder="Search by name or username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant"
                autoFocus
              />
              {isFetching && (
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
              )}
            </div>

            <div className="mt-2 max-h-[280px] overflow-y-auto space-y-1">
              {debouncedSearch.length < 2 && (
                <p className="text-sm text-on-surface-variant text-center py-4">
                  Type at least 2 characters to search
                </p>
              )}
              {!isFetching && debouncedSearch.length >= 2 && filteredUsers.length === 0 && (
                <p className="text-sm text-on-surface-variant text-center py-4">No users found</p>
              )}
              {filteredUsers.map((user: any) => (
                <button
                  key={user.id}
                  onClick={() => assignMutation.mutate(user.id)}
                  disabled={isBusy}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container transition-colors text-left w-full disabled:opacity-50"
                >
                  <Image
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    width={32}
                    height={32}
                    src={getAvatarUrl(user)}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      @{user.username}
                      {user.stack?.name && ` · ${user.stack.name}`}
                    </p>
                  </div>
                  {assignMutation.isLoading ? (
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-base shrink-0">
                      {node.manager_id ? "swap_horiz" : "person_add"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
