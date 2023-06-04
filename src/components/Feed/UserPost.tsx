import React from "react";
import { IPost } from "@/types";
import Image from "next/image";
import { getTimeElapsedOrDate } from "@/utils";

type UserPostProps = {
  post: IPost;
};

function UserPost({ post }: UserPostProps) {
  return (
    <div className="border-b-[#c7c7c73b] border-b-[1px] pb-4">
      <section className="flex gap-4 p-4">
        <div className="w-12 aspect-square rounded-full overflow-hidden ">
          <Image
            src={
              post.user?.profile_pic_url
                ? post.user?.profile_pic_url
                : `https://avatars.dicebear.com/api/initials/${post.user?.first_name} ${post.user?.last_name}.svg`
            }
            width={48}
            height={48}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div>
          <h3 className=" text-lg font-semibold">
            {post.user.first_name} {post.user.last_name}
          </h3>
          <p className="text-sm font-light">
            {getTimeElapsedOrDate(post.created_at!)}
          </p>
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
