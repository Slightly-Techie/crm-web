import React from "react";
import { RiImageAddLine } from "react-icons/ri";
import UserPost from "../../components/UserPost";

function Posts() {
  return (
    <div className="h-full post p-4 bg-[#fff]">
      <h1 className="text-2xl font-semibold ">Feed</h1>
      <section>
        <form className="w-full">
          <textarea
            className="w-full min-h-20 resize-none p-4 border-[#c7c7c76a] border-[1px] rounded-md"
            placeholder="What's on your mind?"
          />
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
              />
            </div>
            <button className="px-4 py-1 bg-secondary text-white rounded-sm">
              Send
            </button>
          </div>
        </form>
      </section>
      <section>
        <UserPost />
        <UserPost />
        <UserPost />
        <UserPost />
        <UserPost />
        <UserPost />
        <UserPost />
      </section>
    </div>
  );
}

export default Posts;
