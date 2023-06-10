import Image from "next/image";
import React from "react";
import SvgCurve1 from "@/assets/icons/svgcurve1.svg";
import SvgCurve1Dark from "@/assets/icons/svgcurve1Dark.svg";

const TechieLeaderboard = () => {
  return (
    <div className="w-[280px] h-min flex flex-col rounded-[4px] border border-st-gray dark:border-st-edgeDark bg-white dark:bg-st-surfaceDark">
      <h5 className="font-bold text-xl p-3 text-secondary dark:text-primary border-b border-st-gray dark:border-st-grayDark">
        Techie Leaderboard
      </h5>
      <div className="relative px-4 py-5 h-32 flex flex-row items-center justify-center border-b border-st-gray dark:border-st-grayDark">
        <div className="absolute w-full top-0 left-0 z-0">
          <Image
            className="block dark:hidden"
            src={SvgCurve1}
            alt="svg curve"
          />
          <Image
            className="hidden dark:block"
            src={SvgCurve1Dark}
            alt="svg curve"
          />
        </div>
        <div className="flex flex-row items-center gap-5 z-10 w-full">
          <div className="w-[90px] h-[90px] rounded-full bg-st-edge dark:bg-st-edgeDark p-0.5"></div>
          <div className="flex flex-col justify-center">
            <p className="text-xl leading-5 text-black dark:text-primary">
              Brian Newton
            </p>
            <p className="text-xs leading-4 text-black/40 dark:text-st-subTextDark">
              @briannewton
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 flex gap-3 flex-row items-center border-b border-st-gray dark:border-st-grayDark">
        <div className="w-7 h-4 rounded-[4px] bg-[#808080] dark:bg-[#636363] flex items-center justify-center">
          <p className="text-[8px] font-medium font-tt-hoves text-white">2ND</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-st-edge"></div>
        <p className="text-xs font-light dark:text-primary">Greatness Mensah</p>
      </div>
      <div className="px-4 py-2 flex gap-3 flex-row items-center border-b border-st-gray dark:border-st-grayDark">
        <div className="w-7 h-4 rounded-[4px] bg-[#CD7F31] dark:bg-[#945c24] flex items-center justify-center">
          <p className="text-[8px] font-medium font-tt-hoves text-white">3RD</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-st-edge"></div>
        <p className="text-xs font-light dark:text-primary">Addo Diabene</p>
      </div>
      <div className="px-4 py-2 flex gap-3 flex-row items-center border-b border-st-gray dark:border-st-grayDark">
        <div className="w-7 h-4 rounded-[4px] border border-[#575F70] dark:border-st-textDark flex items-center justify-center">
          <p className="text-[8px] font-medium font-tt-hoves text-[#575F70]">
            4TH
          </p>
        </div>
        <div className="w-6 h-6 rounded-full bg-st-edge"></div>
        <p className="text-xs font-light dark:text-primary">Essilfie Quansah</p>
      </div>

      <button className="w-full flex items-center justify-center p-3 hover:bg-st-text/30 duration-100">
        <p className="text-sm text-secondary dark:text-primary">Show More</p>
      </button>
    </div>
  );
};

export default TechieLeaderboard;
