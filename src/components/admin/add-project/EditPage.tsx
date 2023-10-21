import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

const EditPage = () => {
  return (
    <div className=" w-full lg:w-2/3 p-2 pb-6">
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className=" text-lg pb-2">Project Name</label>
        <input
          type="text"
          placeholder="Enter the project's name"
          name="name-of-project"
          className="border border-neutral-700 rounded-md p-2 focus:outline-none bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className="text-lg pb-2 ">Project Description</label>
        <textarea
          name="project description"
          placeholder="What is the project about?"
          rows={4}
          className="border border-neutral-700 rounded-md p-2 resize-none focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-1 mx-3 mt-4">
        <label className="pb-2">Project type</label>
        <select
          name="project_type"
          className="border border-neutral-700 py-3 rounded-md focus:outline-none bg-transparent"
        >
          <option value="community">Community</option>
          <option value="paid">Medium</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 mx-3 mt-4">
        <label className="text-bold pb-2 ">Priority</label>
        <select
          name="priority"
          placeholder="How urgent is the project?"
          className="border border-neutral-700 py-3 rounded-md focus:outline-none bg-transparent"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="mt-6 mx-3">
        <div className="text-bold   flex items-center gap-2 cursor-pointer">
          <span>
            <AiOutlinePlus className="" />
          </span>
          Add Team Lead
        </div>
        <input
          type="text"
          name="add"
          className="border border-neutral-700 rounded-md p-2 w-full mt-2 focus:outline-none bg-transparent"
        />
      </div>
      <div className="mt-6 mx-3">
        <div className="text-bold   flex items-center gap-2 cursor-pointer">
          <span>
            <AiOutlinePlus className="" />
          </span>
          Add Frontend Team
        </div>
        <input
          type="text"
          name="add"
          className="border border-neutral-700 rounded-md p-2 w-full mt-2 focus:outline-none bg-transparent"
        />
      </div>
      <div className="mt-6 mx-3">
        <div className="text-bold   flex items-center gap-2 cursor-pointer">
          <span>
            <AiOutlinePlus className="" />
          </span>
          Add Backend Team
        </div>
        <input
          type="text"
          name="add"
          className="border border-neutral-700 rounded-md p-2 w-full mt-2 focus:outline-none bg-transparent"
        />
      </div>
      <div className="mt-6 mx-3">
        <button className=" text-st-surfaceDark font-bold w-1/2 py-2 bg-white rounded-md">
          Create Project
        </button>
      </div>
    </div>
  );
};

export default EditPage;
