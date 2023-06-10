import React from "react";

const Announcements = () => {
  return (
    <div className="w-[280px] h-min flex flex-col rounded-[4px] border border-st-gray dark:border-st-grayDark bg-white dark:bg-transparent">
      <h5 className="font-bold text-xl p-3 text-secondary dark:text-st-textDark border-b border-st-gray dark:border-st-grayDark">
        Announcements
      </h5>
      <div className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark">
        <h6 className="text-[#575F70] font-semibold">
          Techie Academy 🎉 🎉 🎉
        </h6>
        <p className="text-xs text-[#626979]">
          Yes!!! That’s right. Techie Academy is now accepting students. Come
          and Learn from industry experts and get the solid foundation you need
          to start your career...{" "}
          <span className="text-[#1976D2]">Learn More</span>
        </p>
      </div>
      <div className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark">
        <h6 className="text-[#575F70] font-semibold">
          New Champion Techie for May
        </h6>
        <p className="text-xs text-[#626979]">
          Insert the things Kwesi has been saying or posting about the techies
          on Twitter over here So that all who visit the site can be notified of
          the month’s new techie.
        </p>
      </div>
      <div className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark hover:bg-st-text/30 duration-100">
        <h6 className="text-[#575F70] font-semibold">
          Talk on scalable Rust code
        </h6>
        <p className="text-xs text-[#626979]">
          This weekend we’ll have our very own Marvin Edem take us through on
          the importance of writing scalable code in-general and how to do it in
          Rust.
        </p>
      </div>
      <button className="w-full flex items-center justify-center p-3 hover:bg-st-text/30 duration-100">
        <p className="text-sm text-secondary dark:text-st-textDark">
          Show More
        </p>
      </button>
    </div>
  );
};

export default Announcements;
