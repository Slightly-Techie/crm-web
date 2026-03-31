"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface AnnouncementFormData {
  title: string;
  content: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (selectedFile) {
        formData.append("image_url", selectedFile);
      }
      return axiosAuth.post("/api/v1/announcements/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success("Announcement created successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to create announcement.");
      toast.error(message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

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

          {/* Image Upload Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Image (Optional)
            </label>

            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline rounded-lg cursor-pointer hover:border-primary transition-colors bg-surface-container-lowest">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">upload</span>
                  <p className="text-xs text-on-surface-variant">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-outline">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
                >
                  <AiOutlineClose size={16} />
                </button>
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
