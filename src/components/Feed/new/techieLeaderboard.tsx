import React from "react";

const TechieLeaderboard = () => {
  return (
    <div className="w-[280px] h-min flex flex-col rounded-[4px] border border-st-gray dark:border-st-edgeDark bg-white dark:bg-st-surfaceDark">
      <h5 className="font-bold text-xl p-3 text-secondary dark:text-primary border-b border-st-gray dark:border-st-grayDark">
        Techie Leaderboard
      </h5>
      <div className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark">
        <h6 className="text-[#575F70] dark:text-primary font-semibold">
          Techie Academy 🎉 🎉 🎉
        </h6>
        <p className="text-xs text-[#626979] dark:text-st-subTextDark">
          Yes!!! That’s right. Techie Academy is now accepting students. Come
          and Learn from industry experts and get the solid foundation you need
          to start your career...{" "}
          <span className="text-[#1976D2]">Learn More</span>
        </p>
      </div>
      <div className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark">
        <h6 className="text-[#575F70] dark:text-primary font-semibold">
          New Champion Techie for May
        </h6>
      </div>
      <div className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark hover:bg-st-text/30 duration-100">
        <h6 className="text-[#575F70] dark:text-primary font-semibold">
          Talk on scalable Rust code
        </h6>
      </div>
      <button className="w-full flex items-center justify-center p-3 hover:bg-st-text/30 duration-100">
        <p className="text-sm text-secondary dark:text-primary">Show More</p>
      </button>
    </div>
  );
};

export default TechieLeaderboard;
