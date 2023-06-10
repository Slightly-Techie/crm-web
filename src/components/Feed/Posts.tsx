"use client";
import React from "react";
import UserPost from "./UserPost";
import { useFetchFeeds } from "./FeedServices";
import LoadingSpinner from "../loadingSpinner";

function Posts() {
  const { isFetching, isFetchingError, FeedPosts } = useFetchFeeds();

  return (
    <>
      <div className="h-full w-full flex-col">
        {isFetching && (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {isFetchingError && (
          <h1 className="h-full w-full flex flex-col items-center justify-center">
            There is an error fetching posts
          </h1>
        )}
        {FeedPosts &&
          FeedPosts.map((data) => <UserPost key={data.id} post={data} />)}
      </div>
    </>
  );
}

export default Posts;
