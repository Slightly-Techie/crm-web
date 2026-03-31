"use client";
import { useEffect, useState } from "react";
import { isNonWhitespace, logToConsole } from "@/utils";
import { AnnouncementData } from "@/types";
import toast from "react-hot-toast";

type CreateAnnouncementProps = {
  existingPost: AnnouncementData | null;
  submitHandler: (obj: AnnouncementData) => void;
};

export default function CreateAnnouncement({
  submitHandler,
  existingPost,
}: CreateAnnouncementProps) {
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");

  useEffect(() => {
    if (existingPost) {
      setFormTitle(existingPost.title);
      setFormContent(existingPost.content);
      setFormImageUrl(existingPost.image_url || "");
    }
  }, [existingPost]);

  function onSubmit() {
    if (!isNonWhitespace(formTitle) || !isNonWhitespace(formContent)) return;
    const data = {
      ...existingPost,
      title: formTitle,
      content: formContent,
      image_url: formImageUrl.trim() || undefined,
      edited: existingPost ? true : false,
    };
    try {
      submitHandler(data);
      if (existingPost) {
        toast.success("Announcement Edited!");
      } else {
        toast.success("Announcement Created!");
      }
      setFormTitle("");
      setFormContent("");
      setFormImageUrl("");
    } catch (err) {
      logToConsole(err);
    }
  }



  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className=" pl-2 w-full h-fit lg:w-full lg:mx-auto lg:sticky lg:top-16 self-start"
    >
     
      <div className=" p-4  light:bg-st-edgeDark rounded-sm">
        <div className=" my-4 ">
          <label htmlFor="announcement-title" className=" light:text-st-gray dark:text-st-surface  text-st-text">
            Title
          </label>
          <input
            id="announcement-title"
            onChange={(e) => setFormTitle(e.target.value)}
            value={formTitle}
            className="w-full bg-transparent text-st-textDark border mt-2 px-2 dark:text-st-surface   py-3 rounded-lg focus:outline-none  border-st-edgeDark focus:border-primary-dark focus:dark:border-st-surface "
            type="text"
          />
        </div>
        <div className="my-4">
          <label htmlFor="announcement-content" className=" light:text-st-gray dark:text-st-surface  text-st-text">
            Content
          </label>
          <textarea
            id="announcement-content"
            onChange={(e) => setFormContent(e.target.value)}
            value={formContent}
            cols={30}
            rows={6}
            className="w-full bg-transparent text-st-textDark border-[1px] mt-2 px-2 dark:text-st-surface   py-3 rounded-lg focus:outline-none  border-st-edgeDark  focus:border-primary-dark focus:dark:border-st-surface   "
          />
        </div>
        <div className="my-4">
          <label htmlFor="announcement-image-url" className=" light:text-st-gray dark:text-st-surface  text-st-text">
            Image URL (optional)
          </label>
          <input
            id="announcement-image-url"
            onChange={(e) => setFormImageUrl(e.target.value)}
            value={formImageUrl}
            className="w-full bg-transparent text-st-textDark border mt-2 px-2 dark:text-st-surface py-3 rounded-lg focus:outline-none border-st-edgeDark focus:border-primary-dark focus:dark:border-st-surface"
            type="url"
            placeholder="https://..."
          />
        </div>
        <button className="py-3 w-full flex items-center justify-center bg-[#1E1E1E] text-white hover:bg-st-edgeDark hover:dark:bg-st-grayDark rounded-lg">
          {existingPost ? "Save Announcement" : "Post Announcement"}
        </button>
      </div>
    </form>
  );
}
