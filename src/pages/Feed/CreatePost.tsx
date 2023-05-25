import React, { ChangeEvent } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { RiCloseLine } from "react-icons/ri";
import { PostDataTypes } from "../../types/type";
import { id } from "../../utils";
import { isNonWhitespace } from "../../utils";

export type NewPostFields = Pick<
  PostDataTypes,
  "content" | "feed_pic_url" | "id"
>;

type CreatePostProp = {
  submitHandler: (data: NewPostFields) => void;
};

function CreatePost({ submitHandler }: CreatePostProp) {
  const [postText, setPostText] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>();
  const [preview, setPreview] = React.useState<string>("");

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
      feed_pic_url: preview,
      id: id.next().value,
    };
    submitHandler(data);
    setPostText("");
    setSelectedFile(null);
    setPreview("");
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="w-full">
      <textarea
        className="w-full min-h-20 resize-none p-4 border-[#c7c7c73b] bg-[transparent] border-[1px] rounded-md focus:outline-[1px] focus:outline-[#33333378] "
        placeholder="What's on your mind?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <section>
        {preview && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreview("");
              }}
              className="absolute p-4 aspect-square rounded-full bg-secondary hover:cursor-pointer top-4 right-4"
            >
              <RiCloseLine className="text-st-gray200" />
            </button>
            <img
              src={preview}
              alt="User Post"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="py-2 border-b-[#c7c7c73b] border-b-[1px] flex justify-between items-center">
          <div>
            <label htmlFor="imageUpload" className="w-fit block mr-0">
              <RiImageAddLine size={24} />
            </label>
            <input
              type="file"
              id="imageUpload"
              className="hidden relative h-[0.1px] -z-50"
              accept="image/*"
              onChange={(e) => onSelectFile(e)}
              key={selectedFile?.name} // Add a unique key to the input element
            />
          </div>
          <button
            className="px-4 py-1 bg-secondary text-white rounded-sm"
            type="submit"
          >
            Send
          </button>
        </div>
      </section>
    </form>
  );
}

export default CreatePost;
