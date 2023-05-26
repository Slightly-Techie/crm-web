import React from "react";
import Leaderboard from "./Leaderboard";
import Announcements from "./Announcements";
import FeedNav from "./FeedNav";
import Posts from "./Posts";
import { RiContactsLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";

type ActiveStates = "Announcement" | "Scoreboard" | null;

function FeedPage() {
  const [isActive, setIsActive] = React.useState<ActiveStates>(null);

  function toggleScoreAndAnnouncement(target: ActiveStates) {
    switch (target) {
      case "Announcement":
      case "Scoreboard":
        setIsActive(target);
        return;
      default:
        setIsActive(null);
    }
  }

  return (
    <div className="max-w-screen bg-[#fafafa] min-h-screen dark:bg-[#020202]">
      <div className="max-w-[1360px] lg:mx-auto ">
        <FeedNav />
        <div className=" sticky lg:hidden p-4 top-0 w-full flex justify-between bg-[#ffffff53] dark:bg-[#0202022f] backdrop-saturate-200 dark:text-st-gray200 z-10  backdrop-blur-sm border-b-solid border-b-[#cecece73] border-b-[1px]">
          <button
            onClick={() => toggleScoreAndAnnouncement("Scoreboard")}
            className=""
          >
            {" "}
            <RiContactsLine color="inherit" size={24} />{" "}
          </button>
          <button
            onClick={() => toggleScoreAndAnnouncement("Announcement")}
            className=""
          >
            {" "}
            <FiBell color="inherit" size={24} />{" "}
          </button>
        </div>
        <div className="feed lg:mx-auto grid  lg:grid-cols-feed ">
          <Leaderboard
            show={isActive}
            toggleScoreboard={toggleScoreAndAnnouncement}
          />
          <Posts />
          <Announcements
            show={isActive}
            toggleAnnouncement={toggleScoreAndAnnouncement}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
