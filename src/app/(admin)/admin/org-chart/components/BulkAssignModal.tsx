"use client";

import { OrgChartNode } from "@/types";
import useEndpoints from "@/services";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface BulkAssignModalProps {
  manager: OrgChartNode;
  onClose: () => void;
}

export default function BulkAssignModal({ manager, onClose }: BulkAssignModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { searchTechie, bulkAssignSubordinates } = useEndpoints();
  const queryClient = useQueryClient();

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["searchTechie", search],
    queryFn: () => searchTechie(search),
    enabled: search.length >= 2,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: () => bulkAssignSubordinates(manager.id, { user_ids: selectedIds }),
    onSuccess: (res) => {
      const notFound = res.data.not_found;
      if (notFound?.length > 0) {
        toast.error(`${notFound.length} user(s) could not be found`);
      }
      toast.success(
        `${res.data.updated?.length ?? selectedIds.length} user(s) assigned to ${manager.first_name} ${manager.last_name}`
      );
      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to assign subordinates."));
    },
  });

  const toggleUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const users = (searchResults as any)?.items ?? [];
  const filteredUsers = users.filter((u: any) => u.id !== manager.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md border border-outline">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Manage Team</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Assign members to{" "}
              <span className="font-semibold text-primary">
                {manager.first_name} {manager.last_name}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center gap-2 border border-outline rounded-lg px-3 py-2.5 bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-on-surface-variant text-base">search</span>
            <input
              type="text"
              placeholder="Search accepted members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-sm text-on-surface placeholder-on-surface-variant"
              autoFocus
            />
            {isFetching && (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
            )}
          </div>
          {selectedIds.length > 0 && (
            <p className="text-xs text-primary font-semibold mt-2">
              {selectedIds.length} member{selectedIds.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Results list */}
        <div className="max-h-[280px] overflow-y-auto px-4 space-y-1 pb-2">
          {search.length < 2 && (
            <p className="text-sm text-on-surface-variant text-center py-6">
              Type at least 2 characters to search
            </p>
          )}
          {!isFetching && search.length >= 2 && filteredUsers.length === 0 && (
            <p className="text-sm text-on-surface-variant text-center py-6">No members found</p>
          )}
          {filteredUsers.map((user: any) => {
            const isSelected = selectedIds.includes(user.id);
            const picUrl =
              user.profile_pic_url && user.profile_pic_url !== "string"
                ? user.profile_pic_url
                : `https://api.dicebear.com/7.x/initials/jpg?seed=${user.first_name} ${user.last_name}`;
            return (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left w-full ${
                  isSelected
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-surface-container-high border border-transparent"
                }`}
              >
                <Image
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-secondary-container"
                  width={36}
                  height={36}
                  src={picUrl}
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
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <AiOutlineCheck size={12} className="text-on-primary" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={mutation.isLoading}
            className="px-4 py-2.5 text-sm rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={selectedIds.length === 0 || mutation.isLoading}
            className="px-5 py-2.5 text-sm rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {mutation.isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">group_add</span>
                Assign {selectedIds.length > 0 ? `${selectedIds.length} ` : ""}member{selectedIds.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
