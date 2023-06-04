import React from "react";
import UserPost from "./UserPost";
import CreatePost from "./CreatePost";
import { useFetchFeeds, usePostFeeds } from "./FeedServices";
import LoadingSpinner from "../loadingSpinner";

function Posts() {
  const { isFetching, isFetchingError, FeedPosts } = useFetchFeeds();
  const { createNewPost } = usePostFeeds();

  function handlePostSubmit(userPostData: any) {
    const PostData = {
      ...userPostData,
      title: "",
    };
    createNewPost(PostData);
  }

  if (isFetching) return <LoadingSpinner />;
  if (isFetchingError) return <h1>There is an error fetching posts</h1>;

  return (
    <div className="h-full mx-auto pt-8 p-4 bg-[#fff] lg:w-[95%] dark:bg-[#020202] dark:text-st-gray200 ">
      <h1 className="text-2xl pb-4 font-semibold ">Feed</h1>
      <section>
        <CreatePost submitHandler={handlePostSubmit} />
      </section>
      <section>
        {FeedPosts &&
          FeedPosts.map((data: any) => <UserPost key={data.id} post={data} />)}
      </section>
    </div>
  );
}

export default Posts;
