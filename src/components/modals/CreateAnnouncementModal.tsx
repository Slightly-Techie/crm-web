"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface AnnouncementFormData {
  title: string;
  content: string;
  image_url?: string;
}

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
}: CreateAnnouncementModalProps) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    defaultValues: {
      title: "",
      content: "",
      image_url: "",
    },
  });

  const imageUrlValue = watch("image_url");

  const mutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const payload = {
        title: data.title.trim(),
        content: data.content.trim(),
        image_url: data.image_url?.trim() || null,
      };
      return axiosAuth.post("/api/v1/announcements/", payload);
    },
    onSuccess: () => {
      toast.success("Announcement created successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to create announcement.");
      toast.error(message);
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: AnnouncementFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">
              Create Announcement
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Share important updates with your team
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={mutation.status === 'loading'}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter announcement title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {errors.title && (
              <p className="text-xs text-error">{errors.title.message}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Content
            </label>
            <textarea
              placeholder="Enter announcement content"
              rows={6}
              {...register("content", {
                required: "Content is required",
                minLength: {
                  value: 10,
                  message: "Content must be at least 10 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            {errors.content && (
              <p className="text-xs text-error">{errors.content.message}</p>
            )}
          </div>

          {/* Image URL Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("image_url")}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {imageUrlValue && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-outline">
                <img
                  src={imageUrlValue}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    // If image fails to load, don't show it
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container transition-colors font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-body font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.status === 'loading' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Announcement"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
