import React from "react";
import UserPost from "../../components/UserPost";
import UsersPosts from "../../data/feedmock.json";
import CreatePost from "./CreatePost";
import { PostDataTypes } from "../../types/type";

// profile_url, username and name will automatically be set when the user logs in

let PostData: PostDataTypes = {
  profile_url:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  username: "diabeney",
  post: "",
  name: "Addo Diabene",
  image_url: "",
  id: "",
};

function Posts() {
  const [feedPosts, setFeedPosts] = React.useState(UsersPosts);
  function handlePostSubmit(data: Partial<PostDataTypes>) {
    PostData = { ...PostData, ...data };
    const updatedFeeds = [...feedPosts];
    //send to db then update Posts
    updatedFeeds.unshift(PostData);
    setFeedPosts(updatedFeeds);
  }
  return (
    <div className="h-full post p-4 bg-[#fff] dark:bg-[#020202] dark:text-st-gray200 ">
      <h1 className="text-2xl pb-4 font-semibold ">Feed</h1>
      <section>
        <CreatePost submitHandler={handlePostSubmit} />
      </section>
      <section>
        {feedPosts.map((item) => (
          <UserPost key={item.id} post={item} />
        ))}
      </section>
    </div>
  );
}

export default Posts;
