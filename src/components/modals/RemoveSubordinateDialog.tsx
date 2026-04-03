"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { getApiErrorMessage } from "@/utils";

interface RemoveSubordinateDialogProps {
  subordinate: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RemoveSubordinateDialog({
  subordinate,
  isOpen,
  onClose,
  onSuccess,
}: RemoveSubordinateDialogProps) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      // Remove subordinate by setting their manager_id to null
      return axiosAuth.patch(`/api/v1/users/${subordinate.id}/manager`, {
        manager_id: null,
      });
    },
    onSuccess: () => {
      toast.success(`${subordinate.first_name} removed from your team.`);
      queryClient.invalidateQueries({ queryKey: ["mySubordinates"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to remove team member.");
      toast.error(message);
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm border border-outline">
        {/* Header */}
        <div className="border-b border-outline px-6 py-5">
          <h2 className="text-lg font-bold font-headline text-on-surface">
            Remove Team Member
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
              {subordinate.profile_pic_url ? (
                <img
                  src={subordinate.profile_pic_url}
                  alt={subordinate.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">
                    person
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-on-surface">
                {subordinate.first_name} {subordinate.last_name}
              </p>
              <p className="text-xs text-on-surface-variant">
                @{subordinate.username}
              </p>
            </div>
          </div>

          <div className="bg-error/10 border border-error/30 rounded-lg px-4 py-3">
            <p className="text-sm text-error font-medium">
              Are you sure you want to remove {subordinate.first_name} from your
              team? They will no longer be listed as your direct report.
            </p>
          </div>

          <p className="text-xs text-on-surface-variant">
            This action can be undone by reassigning them as a direct report.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-outline">
          <button
            onClick={onClose}
            disabled={mutation.isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container-high transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-error text-white font-medium text-sm hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {mutation.isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  person_remove
                </span>
                Remove
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
