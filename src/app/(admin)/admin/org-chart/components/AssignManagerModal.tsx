"use client";

import { OrgChartNode } from "@/types";
import useEndpoints from "@/services";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";

interface AssignManagerModalProps {
  node: OrgChartNode;
  onClose: () => void;
}

export default function AssignManagerModal({
  node,
  onClose,
}: AssignManagerModalProps) {
  const [search, setSearch] = useState("");
  const { searchTechie, updateUserManager } = useEndpoints();
  const queryClient = useQueryClient();

  const { data: searchResults, isFetching } = useQuery({
    queryKey: ["searchTechie", search],
    queryFn: () => searchTechie(search),
    enabled: search.length >= 2,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (managerId: number) =>
      updateUserManager(node.id, { manager_id: managerId }),
    onSuccess: () => {
      toast.success(
        `Manager assigned for ${node.first_name} ${node.last_name}`
      );
      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      onClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail || "Failed to assign manager.";
      toast.error(message);
    },
  });

  const users = searchResults?.items ?? [];
  // Filter out the node itself
  const filteredUsers = users.filter((u: any) => u.id !== node.id);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assign Manager
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              for {node.first_name} {node.last_name}
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
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto px-4 pb-4">
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
              const picUrl =
                user.profile_pic_url && user.profile_pic_url !== "string"
                  ? user.profile_pic_url
                  : `https://api.dicebear.com/7.x/initials/jpg?seed=${user.first_name} ${user.last_name}`;
              return (
                <button
                  key={user.id}
                  onClick={() => mutation.mutate(user.id)}
                  disabled={mutation.isLoading}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left w-full"
                >
                  <Image
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    width={32}
                    height={32}
                    src={picUrl}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{user.username}
                      {user.stack?.name && ` · ${user.stack.name}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
