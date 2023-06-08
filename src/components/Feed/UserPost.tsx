import React from "react";
import { IPost } from "@/types";
import Image from "next/image";
import { getTimeElapsedOrDate } from "@/utils";

type UserPostProps = {
  post: IPost;
};

function UserPost({ post }: UserPostProps) {
  return (
    <div className="flex flex-col gap-3 w-full p-3 border-b border-st-gray dark:border-st-grayDark">
      <div className="flex flex-row items-center gap-3">
        <div>
          <Image
            className="w-12 h-12 aspect-square shrink-0 rounded-full"
            width={48}
            height={48}
            src={
              post.user?.profile_pic_url
                ? post.user?.profile_pic_url
                : `https://avatars.dicebear.com/api/initials/${post.user?.first_name} ${post.user?.last_name}.svg`
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
          <p className="text-[13px] text-[#9F9F9F]">
            @{post.user.first_name}
            {post.user.last_name}
          </p>
        </div>
      </div>
      <p className="text-black dark:text-white">{post.content}</p>
    </div>
  );
  // return (
  //   <div className="border-b-st-grayDark border-b-[1px] pb-4">
  //     <section className="flex gap-4 p-4">
  //       <div className="w-12 aspect-square rounded-full overflow-hidden ">
  //         <Image
  //           src={
  //             post.user?.profile_pic_url
  //               ? post.user?.profile_pic_url
  //               : `https://avatars.dicebear.com/api/initials/${post.user?.first_name} ${post.user?.last_name}.svg`
  //           }
  //           width={48}
  //           height={48}
  //           alt="Profile"
  //           className="w-full h-full object-cover object-center"
  //         />
  //       </div>
  //       <div>
  //         <h3 className=" text-lg font-semibold">
  //           {post.user.first_name} {post.user.last_name}
  //         </h3>
  //         <p className="text-sm font-light">
  //           {getTimeElapsedOrDate(post.created_at!)}
  //         </p>
  //       </div>
  //     </section>
  //     <section>
  //       <p>{post.content}</p>
  //     </section>
  //     {post.feed_pic_url && (
  //       <section className="my-4 overflow-hidden rounded-lg">
  //         <img src={post.feed_pic_url} alt="user" />
  //       </section>
  //     )}
  //   </div>
  // );
}

export default UserPost;
