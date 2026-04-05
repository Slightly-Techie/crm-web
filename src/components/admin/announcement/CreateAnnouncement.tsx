"use client";
import { useEffect, useRef, useState } from "react";
import { isNonWhitespace, logToConsole } from "@/utils";
import { AnnouncementData, AnnouncementDataResponse } from "@/types";
import toast from "react-hot-toast";
import useEndpoints from "@/services";

type CreateAnnouncementProps = {
  existingPost: AnnouncementDataResponse | null;
  submitHandler: (obj: AnnouncementData & { id?: number }) => void;
};

export default function CreateAnnouncement({
  submitHandler,
  existingPost,
}: CreateAnnouncementProps) {
  const { uploadAnnouncementImage } = useEndpoints();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  // The committed image URL (either from existing post or after upload)
  const [imageUrl, setImageUrl] = useState<string>("");
  // Selected file waiting to be uploaded on submit
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Local preview for the selected file
  const [localPreview, setLocalPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (existingPost) {
      setFormTitle(existingPost.title);
      setFormContent(existingPost.content);
      setImageUrl(existingPost.image_url || "");
      setSelectedFile(null);
      setLocalPreview("");
    } else {
      setFormTitle("");
      setFormContent("");
      setImageUrl("");
      setSelectedFile(null);
      setLocalPreview("");
    }
    setErrors({});
  }, [existingPost]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!isNonWhitespace(formTitle)) {
      newErrors.title = "Title is required";
    } else if (formTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formTitle.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }
    if (!isNonWhitespace(formContent)) {
      newErrors.content = "Content is required";
    } else if (formContent.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLocalPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Clear the existing committed URL so the new file takes over
    setImageUrl("");
  };

  const clearImage = () => {
    setSelectedFile(null);
    setLocalPreview("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const previewSrc = localPreview || imageUrl;

  async function onSubmit() {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;

      // Upload file first if one was selected
      if (selectedFile) {
        try {
          const res = await uploadAnnouncementImage(selectedFile);
          finalImageUrl = res.data.url;
        } catch {
          toast.error("Failed to upload image. Saving without image.");
          finalImageUrl = "";
        }
      }

      const data: any = {
        title: formTitle.trim(),
        content: formContent.trim(),
        image_url: finalImageUrl || undefined,
      };

      if (existingPost?.id) {
        data.id = existingPost.id;
      }

      submitHandler(data);

      toast.success(existingPost ? "Announcement updated!" : "Announcement posted!");
      setFormTitle("");
      setFormContent("");
      setImageUrl("");
      setSelectedFile(null);
      setLocalPreview("");
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || "Failed to save announcement";
      toast.error(errorMessage);
      logToConsole(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="pl-2 w-full h-fit lg:w-full lg:mx-auto lg:sticky lg:top-16 self-start"
    >
      <div className="p-4 rounded-sm space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor="announcement-title" className="text-st-text dark:text-st-surface text-sm font-medium">
            Title <span className="text-error">*</span>
          </label>
          <input
            id="announcement-title"
            value={formTitle}
            onChange={(e) => {
              setFormTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            type="text"
            placeholder="Announcement title"
            maxLength={200}
            className={`w-full bg-transparent text-st-textDark border mt-1 px-3 dark:text-st-surface py-2.5 rounded-lg focus:outline-none transition-colors ${
              errors.title
                ? "border-error focus:border-error"
                : "border-st-edgeDark focus:border-primary-dark dark:focus:border-st-surface"
            }`}
          />
          {errors.title && (
            <p className="text-error text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.title}
            </p>
          )}
          <p className="text-xs text-on-surface-variant">{formTitle.length}/200</p>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <label htmlFor="announcement-content" className="text-st-text dark:text-st-surface text-sm font-medium">
            Content <span className="text-error">*</span>
          </label>
          <textarea
            id="announcement-content"
            value={formContent}
            onChange={(e) => {
              setFormContent(e.target.value);
              if (errors.content) setErrors({ ...errors, content: "" });
            }}
            rows={6}
            placeholder="Write your announcement here..."
            className={`w-full bg-transparent text-st-textDark border mt-1 px-3 dark:text-st-surface py-2.5 rounded-lg focus:outline-none transition-colors resize-none ${
              errors.content
                ? "border-error focus:border-error"
                : "border-st-edgeDark focus:border-primary-dark dark:focus:border-st-surface"
            }`}
          />
          {errors.content && (
            <p className="text-error text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.content}
            </p>
          )}
          <p className="text-xs text-on-surface-variant">{formContent.length} characters</p>
        </div>

        {/* Image */}
        <div className="space-y-2">
          <label className="text-st-text dark:text-st-surface text-sm font-medium">
            Image <span className="text-on-surface-variant font-normal">(optional)</span>
          </label>

          {previewSrc ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-outline">
              <img
                src={previewSrc}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <label className="cursor-pointer px-3 py-1.5 bg-white/90 rounded-lg text-xs font-semibold text-on-surface flex items-center gap-1.5 mr-2">
                  <span className="material-symbols-outlined text-sm">swap_horiz</span>
                  Replace
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3 py-1.5 bg-error/90 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Remove
                </button>
              </div>
              {selectedFile && (
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded-full">
                  New file selected — will upload on save
                </span>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-outline cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
              <p className="text-sm text-on-surface-variant group-hover:text-primary mt-1 transition-colors">Click to upload image</p>
              <p className="text-xs text-on-surface-variant/60 mt-0.5">PNG, JPG, GIF up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {selectedFile ? "Uploading & Saving..." : "Saving..."}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">send</span>
              {existingPost ? "Save Changes" : "Post Announcement"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
