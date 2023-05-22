import React from "react";
import Leaderboard from "./Leaderboard";
import Announcements from "./Announcements";
import FeedNav from "./FeedNav";
import Posts from "./Posts";
import { RiContactsLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";

function FeedPage() {
  const [showScoreboard, setShowScoreboard] = React.useState(false);
  const [showAnnouncements, setShowAnnouncements] = React.useState(true);

  function toggleShowScoreboard() {
    setShowScoreboard((prev) => !prev);
  }

  function toggleShowAnnouncement() {
    setShowAnnouncements((prev) => !prev);
  }
  return (
    <div className="max-w-screen bg-[#fafafa] dark:bg-[#020202]">
      <div className="max-w-[1360px] lg:mx-auto ">
        <FeedNav />
        <div className=" sticky lg:hidden p-4 top-0 w-full flex justify-between bg-[#ffffff53] dark:bg-[#0202022f] backdrop-saturate-200 dark:text-st-gray200 z-10  backdrop-blur-sm border-b-solid border-b-[#cecece73] border-b-[1px]">
          <button onClick={toggleShowScoreboard} className="">
            {" "}
            <RiContactsLine color="inherit" size={24} />{" "}
          </button>
          <button onClick={toggleShowAnnouncement} className="">
            {" "}
            <FiBell color="inherit" size={24} />{" "}
          </button>
        </div>
        <div className="feed lg:mx-auto grid  lg:grid-cols-feed ">
          <Leaderboard
            show={showScoreboard}
            toggleScoreboard={toggleShowScoreboard}
          />
          <Posts />
          <Announcements
            show={showAnnouncements}
            toggleScoreboard={toggleShowAnnouncement}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
