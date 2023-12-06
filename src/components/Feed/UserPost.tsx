import React from "react";
import { IPost } from "@/types";
import Image from "next/image";
import { getTimeElapsedOrDate } from "@/utils";
import Link from "next/link";

type UserPostProps = {
  post: IPost;
};

function UserPost({ post }: UserPostProps) {
  return (
    <div className="flex flex-col gap-3 w-full p-3 border-b border-st-gray dark:border-st-grayDark">
      <Link href={`/techies/${String(post.user.id)}`}>
        <div className="flex flex-row items-center gap-3">
          <div>
            <Image
              className="w-12 h-12 aspect-square object-cover shrink-0 rounded-full"
              width={1000}
              height={1000}
              src={
                (post.user.profile_pic_url === "string"
                  ? `https://api.dicebear.com/7.x/initials/jpg?seed=${post.user.first_name} ${post.user.last_name}`
                  : `${post.user.profile_pic_url}`) ||
                `https://api.dicebear.com/7.x/initials/jpg?seed=${post.user.first_name} ${post.user.last_name}`
              }
              alt="profile"
              placeholder="blur"
              blurDataURL={`https://avatars.dicebear.com/api/initials/${post.user?.first_name} ${post.user?.last_name}.svg`}
              priority={true}
            />
          </div>
          <div className="flex flex-col text-black dark:text-white">
            <p className="font-medium">
              {post.user.first_name} {post.user.last_name}{" "}
              <span className="text-[#9F9F9F] text-[13px]">
                &bull; {getTimeElapsedOrDate(post.created_at!)}{" "}
              </span>
            </p>
            <p className="text-[13px] text-[#9F9F9F]">@{post.user.username}</p>
          </div>
        </div>
      </Link>
      <p className="text-black dark:text-white">{post.content}</p>
      {post.feed_pic_url && (
        <div className="rounded-lg overflow-clip">
          <Image
            width={5000}
            height={5000}
            src={post.feed_pic_url as string}
            alt="content-pic"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

export default UserPost;
