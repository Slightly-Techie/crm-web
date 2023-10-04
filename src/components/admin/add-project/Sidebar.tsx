import React from "react";
import { AiOutlineSearch } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className=" border border-gray-300 dark:border-gray-100 rounded-md w-1/5  h-[48rem]">
      <div className="border border-3 border-gray-300 dark:border-gray-100 py-2 px-2 m-2 rounded-md">
        <div className="flex items-center gap-3">
          <AiOutlineSearch size={20} className="text-gray-400" />
          <input
            type="search"
            name="search"
            placeholder="Search Project"
            className="w-full border-none outline-none bg-transparent"
          />
        </div>
      </div>

      <button className="bg-[#3D4450] dark:bg-white dark:text-st-text font-medium text-white w-full rounded-md py-2">
        Add Project
      </button>
      <div className="mt-5 flex flex-col cursor-pointer gap-5">
        <div className="border-b px-3 py-3 border-gray-300 dark:border-gray-100 hover:bg-gray-500 hover:text-white dark:text-st-gray">
          Slightly Techie CRM
        </div>
        <div className="border-b px-3 py-3 border-gray-300 hover:bg-gray-500 hover:text-white dark:text-st-gray">
          Slightly Techie Point System
        </div>
        <div className="border-b px-3 py-3 border-gray-300 hover:bg-gray-500 hover:text-white dark:text-st-gray">
          Slightly Techie CRM Design System
        </div>
        <div className="px-3 py-3 border-b border-gray-300 hover:bg-gray-500 hover:text-white dark:text-st-gray">
          New Project
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
