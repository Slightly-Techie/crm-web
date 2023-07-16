"use client";
import { useEffect, useState } from "react";
import { isNonWhitespace } from "@/utils";
import { AnnouncementData } from "@/types";

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

  useEffect(() => {
    if (existingPost) {
      setFormTitle(existingPost.title);
      setFormContent(existingPost.content);
    }
  }, [existingPost]);

  function onSubmit() {
    if (!isNonWhitespace(formTitle) || !isNonWhitespace(formContent)) return;
    const data = {
      ...existingPost,
      title: formTitle,
      content: formContent,
      image_url: "",
      edited: existingPost ? true : false,
    };
    try {
      submitHandler(data);
      setFormTitle("");
      setFormContent("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className=" w-full h-fit lg:w-4/5 lg:mx-auto lg:sticky lg:top-[80px] self-start "
    >
      <h1 className=" text-center text-st-text dark:text-st-textDark font-semibold text-[1.2rem] py-4">
        Create Announcement
      </h1>
      <div className=" p-4 bg-st-surface border-st-gray border-[1px] dark:border-none dark:bg-st-edgeDark rounded-sm">
        <div className=" my-4 ">
          <label className=" dark:text-st-gray">Title</label>
          <input
            onChange={(e) => setFormTitle(e.target.value)}
            value={formTitle}
            className="w-full text-st-textDark border-[1px] mt-2 px-2 dark:text-st-subTextDark dark:border-st-gray input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-st-edge"
            type="text"
          />
        </div>
        <div className="my-4">
          <label className=" dark:text-st-gray">Content</label>
          <textarea
            onChange={(e) => setFormContent(e.target.value)}
            value={formContent}
            cols={30}
            rows={3}
            className="w-full text-st-textDark dark:text-st-subTextDark dark:border-st-gray resize-none my-4 border-[1px] px-2 py-2 border-st-edge dark:bg-[transparent] focus:outline-none focus:border-st-edge"
          />
        </div>
        <button className="h-9 w-full flex items-center justify-center bg-secondary text-white font-tt-hoves font-semibold rounded-[4px]">
          {existingPost ? "Save Announcement" : "Post Announcement"}
        </button>
      </div>
    </form>
  );
}
