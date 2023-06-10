"use client";
import React, { ChangeEvent } from "react";
import { IPost } from "@/types";
import { isNonWhitespace } from "@/utils";
import PictureGlyph from "@/assets/icons/picture-glyph.svg";
import Image from "next/image";
import { useAppSelector } from "@/hooks";
import { usePostFeeds } from "./FeedServices";

export type NewPostFields = Pick<IPost, "content" | "feed_pic_url">;

function CreatePost() {
  const { createNewPost } = usePostFeeds();
  const [postText, setPostText] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>();
  const [preview, setPreview] = React.useState<string>("");

  function submitHandler(
    userPostData: Pick<IPost, "content" | "feed_pic_url">
  ) {
    const PostData = {
      ...userPostData,
      title: "",
    };
    createNewPost(PostData);
  }

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreview("");
      return;
    }

    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataURL = reader.result as string;
      setPreview(dataURL);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!postText || !isNonWhitespace(postText)) && !selectedFile) return;
    const data = {
      content: postText,
      feed_pic_url: "",
    };
    submitHandler(data);
    setPostText("");
    setSelectedFile(null);
    setPreview("");
  }

  const { user } = useAppSelector((state) => state.auth);

  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="w-full gap-3 flex flex-col p-4 border-b border-st-gray dark:border-st-grayDark"
    >
      <div className="w-full gap-4 flex flex-row">
        <div className="w-12 shrink-0 flex flex-col items-center">
          {user !== undefined && (
            <Image
              className="w-12 h-12 aspect-square shrink-0 rounded-full"
              width={48}
              height={48}
              src={
                user?.profile_pic_url
                  ? user?.profile_pic_url
                  : `https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`
              }
              alt="profile"
              placeholder="blur"
              blurDataURL={`https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`}
              priority={true}
            />
          )}
        </div>
        <textarea
          className="w-full min-h-20 resize-none text-black dark:text-white p-4 border-st-grayDark dark:border-st-grayDark focus:border-2 bg-transparent border rounded-md outline-none"
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <label
          htmlFor="imageUpload"
          className="h-9 w-24 gap-2 flex flex-row items-center justify-center bg-[#EBEDF1] dark:bg-transparent dark:border dark:border-secondary text-secondary font-tt-hoves font-semibold rounded-[4px] hover:cursor-pointer"
        >
          <div className="">
            <Image
              className="w-[20px] h-[20px]"
              src={PictureGlyph}
              alt="sunny-picture-glyph"
            />
          </div>
          <p>Media</p>
        </label>
        <input
          type="file"
          id="imageUpload"
          className="hidden relative h-[0.1px] -z-50"
          accept="image/*"
          onChange={(e) => onSelectFile(e)}
          disabled
          key={selectedFile?.name} // Add a unique key to the input element
        />
        <button
          className="h-9 w-20 flex items-center justify-center bg-secondary text-white font-tt-hoves font-semibold rounded-[4px]"
          type="submit"
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default CreatePost;
