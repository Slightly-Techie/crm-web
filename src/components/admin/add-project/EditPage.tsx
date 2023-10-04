import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const EditPage = () => {
  return (
    <div className="w-2/3 h-[58rem] border border-gray-300 dark:border-gray-100 rounded-md ml-3">
      <h1 className="text-2xl text-[#3D4450] dark:text-st-gray border-b border-gray-300 font-bold p-3 ">
        Slightly Techie CRM E-commerce
      </h1>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className="text-[#3D4450] dark:text-st-gray text-lg font-medium">
          Name of Project
        </label>
        <input
          type="text"
          name="name-of-project"
          className="border border-gray-300 rounded-md dark:text-st-gray p-2 focus:outline-none bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className="text-[#3D4450] text-lg font-medium dark:text-st-gray">
          Project Description
        </label>
        <textarea
          name="project description"
          rows={6}
          className="border border-gray-300 rounded-md p-2 resize-none focus:outline-none bg-transparent dark:text-st-gray"
        />
      </div>
      <div className="flex justify-evenly mt-5 mx-3 gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-bold text-[#3D4450] font-medium dark:text-st-gray">
            Priorities
          </label>
          <select
            name="priorities"
            className="border border-gray-300 py-3 rounded-md focus:outline-none bg-transparent dark:text-st-gray"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-bold text-[#3D4450] font-medium dark:text-st-gray">
            Priorities
          </label>
          <select
            name="priorities"
            className="border border-gray-300 py-3 rounded-md focus:outline-none bg-transparent dark:text-st-gray"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-bold text-[#3D4450] font-medium dark:text-st-gray">
            Size
          </label>
          <select
            name="priorities"
            className="border border-gray-300 py-3 rounded-md focus:outline-none bg-transparent  dark:text-st-gray"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="mt-6 mx-3">
        <div className="text-bold text-[#3D4450] dark:text-st-gray font-medium flex items-center gap-2 cursor-pointer">
          <span>
            <AiOutlinePlus className="text-[#3D4450] dark:text-st-gray" />
          </span>
          Add Team Lead
        </div>
        <input
          type="text"
          name="add"
          className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none bg-transparent dark:text-st-gray"
        />
      </div>
      <div className="mt-6 mx-3">
        <div className="text-bold text-[#3D4450] dark:text-st-gray font-medium flex items-center gap-2 cursor-pointer">
          <span>
            <AiOutlinePlus className="text-[#3D4450] dark:text-st-gray" />
          </span>
          Add Frontend Team
        </div>
        <input
          type="text"
          name="add"
          className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none bg-transparent dark:text-st-gray"
        />
      </div>
      <div className="mt-6 mx-3">
        <div className="text-bold text-[#3D4450] dark:text-st-gray font-medium flex items-center gap-2 cursor-pointer">
          <span>
            <AiOutlinePlus className="text-[#3D4450] dark:text-st-gray" />
          </span>
          Add Backend Team
        </div>
        <input
          type="text"
          name="add"
          className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:outline-none bg-transparent dark:text-st-gray"
        />
      </div>
      <div className="flex gap-4 mt-6 mx-3">
        <button className="bg-[#3D4450] w-1/2 py-2 text-white font-normal rounded-md">
          Add Project
        </button>
        <button className="bg-white w-1/2 border border-[#3D4450] text-[#3D4450] font-medium rounded-md">
          Draft Project
        </button>
      </div>
    </div>
  );
};

export default EditPage;
