import React from "react";
import { PostDataTypes } from "../types/type";
type UserPostProps = {
  post: PostDataTypes;
};

function UserPost({ post }: UserPostProps) {
  return (
    <div className="border-b-[#c7c7c73b] border-b-[1px] pb-4">
      <section className="flex gap-4 p-4">
        <div className="w-12 aspect-square rounded-full overflow-hidden ">
          <img
            src={post.user.profile_pic_url}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div>
          <h3 className=" text-lg font-semibold">
            {post.user.first_name} {post.user.last_name}
          </h3>
          <p className="text-sm font-light">{post.created_at}</p>
        </div>
      </section>
      <section>
        <p>{post.content}</p>
      </section>
      {post.feed_pic_url && (
        <section className="my-4 overflow-hidden rounded-lg">
          <img src={post.feed_pic_url} alt="user" />
        </section>
      )}
    </div>
  );
}

export default UserPost;
