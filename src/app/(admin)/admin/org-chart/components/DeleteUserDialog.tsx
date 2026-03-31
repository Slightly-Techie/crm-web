"use client";

import { OrgChartNode } from "@/types";
import useEndpoints from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

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
      const message = getApiErrorMessage(error, "Failed to delete user.");
      toast.error(message);
    },
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-sm mx-4 border border-outline">
        <div className="flex items-center justify-between p-4 border-b border-outline">
          <h2 className="text-lg font-semibold text-on-surface">
            Delete User
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <AiOutlineClose size={20} className="text-on-surface-variant" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-on-surface-variant">
            Deleting{" "}
            <strong className="text-on-surface">
              {node.first_name} {node.last_name}
            </strong>{" "}
            will reassign their{" "}
            <strong className="text-on-surface">
              {node.subordinates.length} direct report
              {node.subordinates.length !== 1 ? "s" : ""}
            </strong>{" "}
            to {managerName}. This cannot be undone.
          </p>
        </div>

        <div className="p-4 border-t border-outline flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
            className="px-4 py-2 text-sm rounded-lg bg-error text-on-error font-semibold hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
