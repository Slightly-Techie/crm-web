import React from "react";
import Leaderboard from "./Leaderboard";
import Announcements from "./Announcements";
import FeedNav from "./FeedNav";
import Posts from "./Posts";

function FeedPage() {
  return (
    <div className="max-w-screen bg-[#fafafa] dark:bg-[#020202] ">
      <FeedNav />
      <div className="feed w-[95%] mx-auto grid  lg:grid-cols-feed ">
        <Leaderboard />
        <Posts />
        <Announcements />
      </div>
    </div>
  );
}

export default FeedPage;
