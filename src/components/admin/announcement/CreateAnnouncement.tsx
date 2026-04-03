"use client";
import { useEffect, useState } from "react";
import { isNonWhitespace, logToConsole } from "@/utils";
import { AnnouncementData, AnnouncementDataResponse } from "@/types";
import toast from "react-hot-toast";

type CreateAnnouncementProps = {
  existingPost: AnnouncementDataResponse | null;
  submitHandler: (obj: AnnouncementData & { id?: number }) => void;
};

export default function CreateAnnouncement({
  submitHandler,
  existingPost,
}: CreateAnnouncementProps) {
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImageUrl, setFormImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (existingPost) {
      setFormTitle(existingPost.title);
      setFormContent(existingPost.content);
      setFormImageUrl(existingPost.image_url || "");
    }
  }, [existingPost]);

  // Real-time validation
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

  const clearImage = () => {
    setFormImageUrl("");
  };

  function onSubmit() {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    // Build data object
    const data: any = {
      title: formTitle.trim(),
      content: formContent.trim(),
      image_url: formImageUrl.trim() || undefined,
    };

    // If editing, include the ID so the hook knows to use PUT instead of POST
    if (existingPost && (existingPost as AnnouncementDataResponse).id) {
      data.id = (existingPost as AnnouncementDataResponse).id;
    }

    try {
      submitHandler(data);
      if (existingPost) {
        toast.success("Announcement updated successfully!");
      } else {
        toast.success("Announcement created successfully!");
      }
      setFormTitle("");
      setFormContent("");
      setFormImageUrl("");
      setErrors({});
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
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="pl-2 w-full h-fit lg:w-full lg:mx-auto lg:sticky lg:top-16 self-start"
    >
      <div className="p-4 light:bg-st-edgeDark rounded-sm space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label htmlFor="announcement-title" className="light:text-st-gray dark:text-st-surface text-st-text text-sm font-medium">
            Title <span className="text-error">*</span>
          </label>
          <input
            id="announcement-title"
            onChange={(e) => {
              setFormTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            value={formTitle}
            className={`w-full bg-transparent text-st-textDark border mt-1 px-3 dark:text-st-surface py-2.5 rounded-lg focus:outline-none transition-colors ${
              errors.title
                ? "border-error focus:border-error"
                : "border-st-edgeDark focus:border-primary-dark dark:focus:border-st-surface"
            }`}
            type="text"
            placeholder="Announcement title"
            maxLength={200}
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
          <label htmlFor="announcement-content" className="light:text-st-gray dark:text-st-surface text-st-text text-sm font-medium">
            Content <span className="text-error">*</span>
          </label>
          <textarea
            id="announcement-content"
            onChange={(e) => {
              setFormContent(e.target.value);
              if (errors.content) setErrors({ ...errors, content: "" });
            }}
            value={formContent}
            cols={30}
            rows={6}
            className={`w-full bg-transparent text-st-textDark border-[1px] mt-1 px-3 dark:text-st-surface py-2.5 rounded-lg focus:outline-none transition-colors ${
              errors.content
                ? "border-error focus:border-error"
                : "border-st-edgeDark focus:border-primary-dark dark:focus:border-st-surface"
            }`}
            placeholder="Write your announcement here..."
          />
          {errors.content && (
            <p className="text-error text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {errors.content}
            </p>
          )}
          <p className="text-xs text-on-surface-variant">{formContent.length} characters</p>
        </div>

        {/* Image Upload */}
        {formImageUrl && (
          <div className="space-y-2">
            <div className="relative w-full rounded-lg overflow-hidden border border-outline">
              <img src={formImageUrl} alt="Preview" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 bg-error hover:bg-error/90 rounded-full text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="announcement-image" className="light:text-st-gray dark:text-st-surface text-st-text text-sm font-medium">
            Image URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="announcement-image"
            onChange={(e) => setFormImageUrl(e.target.value)}
            value={formImageUrl}
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2.5 rounded-lg border border-st-edgeDark bg-transparent text-st-textDark dark:text-st-surface focus:outline-none transition-colors focus:border-primary-dark"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              Saving...
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
