import React from "react";
import Leaderboard from "./Leaderboard";
import Announcements from "./Announcements";
import FeedNav from "./FeedNav";
import Posts from "./Posts";

function FeedPage() {
  return (
    <div className="w-full">
      <FeedNav />
      <div className=" grid gap-4  lg:grid-cols-3 ">
        <Leaderboard />
        <Posts />
        <Announcements />
      </div>
    </div>
  );
}

export default FeedPage;
