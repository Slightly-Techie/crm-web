import React from "react";

function Recent() {
  return (
    <div className="bg-blue-200 w-96 bg-white border border-[#DCDDE1] rounded-sm">
      <div className="border-b border-[#DCDDE1] pt-4 pb-4">
        <div className="flex justify-between px-3 ">
          <h2 className="">Leaderboard</h2>

          <span className="text-[#3D4450] font-bold text-base">
            March 10, 2023
          </span>
        </div>
      </div>

      <div className="border-b border-[#DCDDE1]">
        <div className="flex justify-between  px-3 py-3">
          <h2 className="text-[#3D4450] font-normal text-sm">#Techie</h2>

          <span className="text-[#3D4450] font-normal text-sm">Points</span>
        </div>
      </div>
    </div>
  );
}

export default Recent;

export default Recent;
