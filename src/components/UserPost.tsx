import React from "react";

type UserPostProps = {
  post: Record<
    "profile_url" | "name" | "username" | "post" | "image_url",
    string
  >;
};

function UserPost({ post }: UserPostProps) {
  return (
    <div className="border-b-[#c7c7c76a] border-b-[1px] pb-4">
      <section className="flex gap-4 p-4">
        <div className="w-12 aspect-square rounded-full overflow-hidden ">
          <img
            src={post.profile_url}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div>
          <h3 className=" text-lg font-semibold">{post.name}</h3>
          <p className="text-sm font-light">@{post.username}</p>
        </div>
      </section>
      <section>
        <p>{post.post}</p>
      </section>
      {post.image_url && (
        <section className="my-4 overflow-hidden rounded-lg">
          <img src={post.image_url} alt="user" />
        </section>
      )}
    </div>
  );
}

export default UserPost;
