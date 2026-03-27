"use client";

import { OrgChartNode } from "@/types";
import useEndpoints from "@/services";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiOutlineSearch, AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

interface BulkAssignModalProps {
  manager: OrgChartNode;
  onClose: () => void;
}

export default function BulkAssignModal({
  manager,
  onClose,
}: BulkAssignModalProps) {
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
    mutationFn: () =>
      bulkAssignSubordinates(manager.id, { user_ids: selectedIds }),
    onSuccess: (res) => {
      const notFound = res.data.not_found;
      if (notFound.length > 0) {
        toast.error(`${notFound.length} user(s) could not be found`);
      }
      toast.success(
        `${res.data.updated.length} user(s) assigned to ${manager.first_name} ${manager.last_name}`
      );
      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      onClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        "Failed to assign subordinates.";
      toast.error(message);
    },
  });

  const toggleUser = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const users = searchResults?.items ?? [];
  const filteredUsers = users.filter((u: any) => u.id !== manager.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Manage Team
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Assign subordinates to {manager.first_name} {manager.last_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <AiOutlineClose size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center gap-2 border dark:border-gray-700 rounded-md px-3 py-2">
            <AiOutlineSearch size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users to add..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
              autoFocus
            />
          </div>
          {selectedIds.length > 0 && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              {selectedIds.length} user{selectedIds.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto px-4">
          {isFetching && (
            <p className="text-sm text-gray-500 text-center py-4">
              Searching...
            </p>
          )}
          {!isFetching && search.length >= 2 && filteredUsers.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No users found
            </p>
          )}
          {search.length < 2 && (
            <p className="text-sm text-gray-400 text-center py-4">
              Type at least 2 characters to search
            </p>
          )}
          <div className="flex flex-col gap-1">
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
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors text-left w-full ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Image
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    width={32}
                    height={32}
                    src={picUrl}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user.username}
                      {user.stack?.name && ` · ${user.stack.name}`}
                    </p>
                  </div>
                  {isSelected && (
                    <AiOutlineCheck
                      size={18}
                      className="text-blue-600 dark:text-blue-400 shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={selectedIds.length === 0 || mutation.isLoading}
            className="px-4 py-2 text-sm rounded-md bg-primary-dark text-white dark:bg-primary-light dark:text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading
              ? "Assigning..."
              : `Assign ${selectedIds.length} user${selectedIds.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
