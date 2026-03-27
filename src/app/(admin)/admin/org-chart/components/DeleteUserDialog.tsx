"use client";

import { OrgChartNode } from "@/types";
import useEndpoints from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

interface DeleteUserDialogProps {
  node: OrgChartNode;
  onClose: () => void;
}

export default function DeleteUserDialog({
  node,
  onClose,
}: DeleteUserDialogProps) {
  const { deleteUser } = useEndpoints();
  const queryClient = useQueryClient();

  const managerName = node.manager_id
    ? "their current manager"
    : "no manager (they become roots)";

  const mutation = useMutation({
    mutationFn: () => deleteUser(node.id),
    onSuccess: () => {
      toast.success(`${node.first_name} ${node.last_name} has been deleted`);
      queryClient.invalidateQueries({ queryKey: ["orgChart"] });
      onClose();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail || "Failed to delete user.";
      toast.error(message);
    },
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Delete User
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <AiOutlineClose size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Deleting{" "}
            <strong>
              {node.first_name} {node.last_name}
            </strong>{" "}
            will reassign their{" "}
            <strong>
              {node.subordinates.length} direct report
              {node.subordinates.length !== 1 ? "s" : ""}
            </strong>{" "}
            to {managerName}. This cannot be undone.
          </p>
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
