"use client";
import CreatePost from "@/components/Feed/CreatePost";
import { useFetchFeeds, usePostFeeds } from "@/components/Feed/FeedServices";
import UserPost from "@/components/Feed/UserPost";
import Announcements from "@/components/Feed/new/announcements";
import TechieLeaderboard from "@/components/Feed/new/techieLeaderboard";
import { IPost } from "@/types";

export default function FeedPage() {
  const { isFetching, isFetchingError, FeedPosts } = useFetchFeeds();
  const { createNewPost } = usePostFeeds();

  function handlePostSubmit(
    userPostData: Pick<IPost, "content" | "feed_pic_url">
  ) {
    const PostData = {
      ...userPostData,
      title: "",
    };
    createNewPost(PostData);
  }

  return (
    <div className="flex flex-row justify-center w-full h-full px-4 font-tt-hoves">
      <section className="hidden xl:flex p-8">
        <TechieLeaderboard />
      </section>
      <section className="w-full lg:w-[652px] h-[calc(100vh-80px)] overflow-y-scroll flex flex-col border-l border-r border-st-gray dark:border-st-grayDark">
        <div className="h-14 shrink-0 flex-row px-2 flex items-center border-b border-st-gray dark:border-st-grayDark">
          <h3 className="text-secondary text-4xl font-tt-hoves font-semibold tracking-wider">
            Feed
          </h3>
        </div>
        <CreatePost submitHandler={handlePostSubmit} />
        <div className="h-full w-full flex-col">
          {isFetching && (
            <div className="h-full w-full flex flex-col items-center justify-center">
              Loading...
            </div>
          )}
          {isFetchingError && (
            <h1 className="h-full w-full flex flex-col items-center justify-center">
              There is an error fetching posts
            </h1>
          )}
          {FeedPosts &&
            FeedPosts.map((data: any) => (
              <UserPost key={data.id} post={data} />
            ))}
        </div>
      </section>
      <section className="hidden xl:flex p-8">
        <Announcements />
      </section>
    </div>
  );
}
