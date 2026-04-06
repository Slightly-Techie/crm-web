"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isMutationLoading } from "@/lib/queryUtils";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";
import useEndpoints from "@/services";
import useAxiosAuth from "@/hooks/useAxiosAuth";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
}: CreateAnnouncementModalProps) {
  const axiosAuth = useAxiosAuth();
  const { uploadAnnouncementImage } = useEndpoints();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validate = () => {
    const e: { title?: string; content?: string } = {};
    if (!title.trim()) e.title = "Title is required";
    else if (title.trim().length < 3) e.title = "Title must be at least 3 characters";
    if (!content.trim()) e.content = "Content is required";
    else if (content.trim().length < 10) e.content = "Content must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLocalPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setLocalPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!validate()) throw new Error("validation");

      let image_url: string | null = null;
      if (selectedFile) {
        const res = await uploadAnnouncementImage(selectedFile);
        image_url = res.data.url;
      }

      return axiosAuth.post("/api/v1/announcements/", {
        title: title.trim(),
        content: content.trim(),
        image_url,
      });
    },
    onSuccess: () => {
      toast.success("Announcement created successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setTitle("");
      setContent("");
      clearImage();
      setErrors({});
      onClose();
    },
    onError: (error: any) => {
      if (error?.message === "validation") return;
      toast.error(getApiErrorMessage(error, "Failed to create announcement."));
    },
  });

  if (!isOpen) return null;

  const isLoading = isMutationLoading(mutation);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Create Announcement</h2>
            <p className="text-sm text-on-surface-variant mt-1">Share important updates with your team</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({ ...errors, title: undefined }); }}
              placeholder="Enter announcement title"
              className={`w-full px-4 py-3 rounded-lg border bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${errors.title ? "border-error" : "border-outline focus:border-primary"}`}
            />
            {errors.title && <p className="text-xs text-error">{errors.title}</p>}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Content</label>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors({ ...errors, content: undefined }); }}
              placeholder="Enter announcement content"
              rows={5}
              className={`w-full px-4 py-3 rounded-lg border bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none ${errors.content ? "border-error" : "border-outline focus:border-primary"}`}
            />
            {errors.content && <p className="text-xs text-error">{errors.content}</p>}
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">
              Image <span className="text-on-surface-variant font-normal">(optional)</span>
            </label>
            {localPreview ? (
              <div className="relative w-full rounded-xl overflow-hidden border border-outline">
                <img src={localPreview} alt="Preview" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <label className="cursor-pointer px-3 py-1.5 bg-white/90 rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                    Replace
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
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
                <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => mutation.mutate()}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  {selectedFile ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Announcement"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
