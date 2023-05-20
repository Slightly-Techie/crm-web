import React, { ChangeEvent } from "react";
import { RiImageAddLine } from "react-icons/ri";
import { RiCloseLine } from "react-icons/ri";
import { PostDataTypes } from "../../types/type";
import { id } from "../../utils";

type CreatePostProp = {
  submitHandler: (
    data: Pick<PostDataTypes, "post" | "image_url" | "id">
  ) => void;
};

function CreatePost({ submitHandler }: CreatePostProp) {
  const [postText, setPostText] = React.useState("");
  const [image, setImage] = React.useState<string>("");

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const imageURL = e.target.files && URL.createObjectURL(e.target.files[0]);
    if (imageURL) setImage(imageURL);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postText && !image) return;
    const data = { post: postText, image_url: image, id: id.next().value };
    console.log(data);
    submitHandler(data);
    setPostText("");
    setImage("");
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="w-full">
      <textarea
        className="w-full min-h-20 resize-none p-4 border-[#c7c7c76a] bg-[transparent] border-[1px] rounded-md"
        placeholder="What's on your mind?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <section>
        {image && (
          <div className="relative ">
            <button
              onClick={() => setImage("")}
              className="absolute p-4 aspect-square rounded-full bg-secondary hover:cursor-pointer  top-4 right-4"
            >
              <RiCloseLine color="#fff" />
            </button>
            <img
              src={image}
              alt="User Post"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className=" py-2 border-b-[#c7c7c76a] border-b-[1px] flex justify-between items-center">
          <div>
            <label htmlFor="imageUpload" className=" w-fit block mr-0">
              {" "}
              <RiImageAddLine size={24} />
            </label>
            <input
              type="file"
              id="imageUpload"
              className=" hidden relative h-[0.1px] -z-50"
              accept="image/*"
              onChange={(e) => handleImageSelect(e)}
            />
          </div>
          <button className="px-4 py-1 bg-secondary text-white rounded-sm">
            Send
          </button>
        </div>
      </section>
    </form>
  );
}

export default CreatePost;
