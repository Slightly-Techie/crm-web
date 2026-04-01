"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useEndpoints from "@/services";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface AnnouncementFormData {
  title: string;
  content: string;
  image_url?: string;
}

interface EditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: {
    id: number;
    title: string;
    content: string;
    image_url?: string;
  } | null;
}

export default function EditAnnouncementModal({ isOpen, onClose, announcement }: EditAnnouncementModalProps) {
  const { updateAnnouncement } = useEndpoints();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormData>();

  useEffect(() => {
    if (announcement) {
      reset({
        title: announcement.title,
        content: announcement.content,
        image_url: announcement.image_url || "",
      });
    }
  }, [announcement, reset]);

  const mutation = useMutation({
    mutationFn: (data: AnnouncementFormData) => updateAnnouncement(announcement!.id, data),
    onSuccess: () => {
      toast.success("Announcement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update announcement.");
      toast.error(message);
    },
  });

  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Edit Announcement</h2>
            <p className="text-sm text-on-surface-variant mt-1">Update announcement details</p>
          </div>
          <button
            onClick={onClose}
            disabled={mutation.status === "loading"}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Title</label>
            <input
              type="text"
              {...register("title", { required: "Title is required", minLength: { value: 3, message: "At least 3 characters" } })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Content</label>
            <textarea
              rows={6}
              {...register("content", { required: "Content is required", minLength: { value: 10, message: "At least 10 characters" } })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            {errors.content && <p className="text-xs text-error">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("image_url", {
                pattern: { value: /^(https?:\/\/.+)?$/, message: "Please enter a valid URL" },
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {errors.image_url && <p className="text-xs text-error">{errors.image_url.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.status === "loading"}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.status === "loading"}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.status === "loading" ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
