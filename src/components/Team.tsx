import React from "react";
import Search from "../assets/icons/search.png";
import Member from "./Member";
import { IMember } from "../types/type";
import jsondata from "./apimock.json";

function Team() {
  const data = jsondata as IMember[];

  return (
    <section className="w-4/5 py-8 bg-white rounded-sm border border-[#DCDDE1]">
      <div className="flex items-center gap-4 pb-4 px-8 border-b border-b-[#DCDDE1]">
        <h3 className="font-medium text-secondary flex gap-1 items-center text-base">
          Team Memebers
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] rounded-3xl">
            65 techies
          </span>
        </h3>
        <h3 className="font-medium text-secondary flex gap-1 items-center text-base">
          Community Projects
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] rounded-3xl">
            2 Active
          </span>
        </h3>
        <h3 className="font-medium text-secondary flex gap-1 items-center text-base">
          Paid Projects
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] rounded-3xl">
            1 Active
          </span>
        </h3>
      </div>

      {/* Form Section */}
      <div className=" border-b-[#DCDDE1] border-b py-4 px-8">
        <form
          action=""
          className="bg-white w-full border flex justify-between p-2  border-[#DCDDE1] rounded"
        >
          <div className="flex items-center py-2 px-3 gap-2">
            <img src={Search} alt="search icon" />
            <input
              type="text"
              className="border-none placeholder-gray-500 text-black focus:outline-none"
              placeholder="Search by keyword"
            />
          </div>

          <button className="bg-[#3D4450] text-white py-2 px-6 rounded-sm">
            Search
          </button>
        </form>
      </div>

      {/* User Info */}
      <div className="grid mt-8 px-8 grid-cols-3 gap-4">
        {data.map((user) => (
          <Member key={`${user.id}`} data={user} />
        ))}
      </div>
    </section>
  );
}

export default Team;
