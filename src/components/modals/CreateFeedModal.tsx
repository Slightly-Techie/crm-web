"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isMutationLoading } from "@/lib/queryUtils";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { AiOutlineClose } from "react-icons/ai";
import { ChangeEvent, useRef, useState } from "react";
import { getApiErrorMessage } from "@/utils";

interface FeedFormData {
  content: string;
}

interface CreateFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFeedModal({
  isOpen,
  onClose,
}: CreateFeedModalProps) {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedFormData>({
    defaultValues: {
      content: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FeedFormData) => {
      const formData = new FormData();
      formData.append("content", data.content);
      if (selectedFile) {
        formData.append("feed_pic_url", selectedFile);
      }
      return axiosAuth.post("/api/v1/feed/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      toast.success("Feed post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["recentFeeds"] });
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      reset();
      setImagePreview(null);
      setSelectedFile(null);
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to create feed post.");
      toast.error(message);
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  const onSubmit = (data: FeedFormData) => {
    if (!data.content.trim()) {
      toast.error("Please write something for your post");
      return;
    }
    mutation.mutate(data);
  };

  const isLoading = isMutationLoading(mutation);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">
              Share Update
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Post what you're working on
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Content Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              What's on your mind?
            </label>
            <textarea
              placeholder="Share your update, project progress, or thoughts..."
              rows={5}
              {...register("content", {
                required: "Post content is required",
                minLength: {
                  value: 3,
                  message: "Post must be at least 3 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            {errors.content && (
              <p className="text-xs text-error">{errors.content.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Add an image <span className="text-on-surface-variant font-normal">(optional)</span>
            </label>
            {imagePreview ? (
              <div className="relative w-full rounded-xl overflow-hidden border border-outline">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <label className="cursor-pointer px-3 py-1.5 bg-white/90 rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                    Replace
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <button type="button" onClick={clearImage} className="px-3 py-1.5 bg-error/90 rounded-lg text-xs font-semibold text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-outline cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
                <p className="text-sm text-on-surface-variant group-hover:text-primary mt-1 transition-colors">Click to upload image</p>
                <p className="text-xs text-on-surface-variant/60 mt-0.5">PNG, JPG, GIF</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container transition-colors font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-body font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                "Share"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
