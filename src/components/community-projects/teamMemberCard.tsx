import Link from "next/link";
import React from "react";

const TeamMemberCard = () => {
  return (
    <div className=" w-1/3 border-st-edge dark:border-st-edgeDark dark:text-[#F1F3F7] border rounded-md">
      <div className="w-full h-28 bg-slate-400"></div>

      <div className="p-3">
        <h3 className="text-lg font-medium">
          {/* {data.first_name} {data.last_name} */}
          Slightly Techie
        </h3>
        <p className="font-light text-[#5D6675] dark:text-[#cacbcf] text-sm">
          Full Stack Engineer
        </p>
        <p className="text-complementary text-sm">@data.username</p>
        <br />
        <Link href={`/techies/`}>
          <button className="text-white bg-primary-dark text-primary-white dark:bg-primary-light dark:text-primary-dark px-2 py-1 rounded-md text-sm">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TeamMemberCard;
