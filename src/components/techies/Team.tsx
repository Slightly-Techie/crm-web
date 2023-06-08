/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Search from "@/assets/icons/search.png";
import Member from "./Member";
import { ITechie } from "@/types";
import { useQuery } from "react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "../loadingSpinner";

function Team() {
  const [techies, setTechies] = useState<ITechie[]>([]);
  const { getTechiesList } = useEndpoints();

  const { isLoading, isError } = useQuery({
    queryKey: "techies",
    queryFn: getTechiesList,
    onSuccess: ({ data }) => {
      console.log(data);

      setTechies(data);
    },
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return (
    <section className="w-4/5 py-4 bg-white dark:bg-[#232323] rounded-sm border border-[#DCDDE1] dark:border-[#353535]">
      <div className="flex items-center gap-4 pb-4 px-8 border-b border-b-[#DCDDE1] dark:border-[#353535]">
        <h3 className="font-medium text-secondary dark:text-[#F1F3F7] flex gap-1 items-center text-base">
          Team Memebers
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] dark:bg-[#444444] rounded-3xl">
            {techies.length} techies
          </span>
        </h3>
        <h3 className="font-medium text-secondary dark:text-[#F1F3F7] flex gap-1 items-center text-base">
          Community Projects
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] dark:bg-[#444444] rounded-3xl">
            2 Active
          </span>
        </h3>
        <h3 className="font-medium text-secondary dark:text-[#F1F3F7] flex gap-1 items-center text-base">
          Paid Projects
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] dark:bg-[#444444] rounded-3xl">
            1 Active
          </span>
        </h3>
      </div>

      {/* Form Section */}
      <div className=" border-b-[#DCDDE1] dark:border-[#353535] border-b py-4 px-8">
        <form
          action=""
          className="bg-white dark:bg-[#444444] w-full border flex justify-between p-2 dark:border-[#353535] border-[#DCDDE1] rounded"
        >
          <div className="w-full flex items-center py-2 px-3 gap-2">
            <img src={Search.src} alt="search icon" />
            <input
              type="text"
              className="w-full dark:bg-[#444444] border-none placeholder-gray-500 text-black focus:outline-none"
              placeholder="Search by keyword"
            />
          </div>

          <button className="bg-[#3D4450] dark:bg-[#353535] text-white py-2 px-6 rounded-sm">
            Search
          </button>
        </form>
      </div>

      {/* User Info */}
      <div className="w-full h-[calc(100%-148px)] overflow-y-scroll">
        {isError && (
          <div className="flex items-center justify-center w-full h-full">
            <h1 className="text-2xl font-medium text-center text-secondary dark:text-[#F1F3F7]">
              Something went wrong
            </h1>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center w-full h-full">
            <LoadingSpinner />
          </div>
        )}
        {techies.length > 0 && (
          <div className="grid mt-8 px-8 grid-cols-3 gap-4">
            {techies.map((user) => (
              <Member key={`${user.id}`} data={user} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Team;
