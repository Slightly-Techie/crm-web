import React from "react";

function Recent() {
  return (
    <div className="bg-blue-200 w-96 bg-white dark:bg-[#232323] border border-st-edge dark:border-st-edgeDark rounded-sm">
      <div className="border-b border-st-edge dark:border-st-edgeDark pt-4 pb-4">
        <div className="flex justify-between px-3 ">
          <h2 className="dark:text-primary">Leaderboard</h2>

          <span className="text-[#3D4450] dark:text-primary font-bold text-base">
            March 10, 2023
          </span>
        </div>
      </div>

      <div className="border-b border-st-edge dark:border-st-edgeDark">
        <div className="flex justify-between  px-3 py-3">
          <h2 className="text-[#3D4450] dark:text-primary font-normal text-sm">
            #Techie
          </h2>

          <span className="text-[#3D4450] dark:text-primary font-normal text-sm">
            Points
          </span>
        </div>
      </div>
    </div>
  );
}

export default Recent;
