/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Search from "@/assets/icons/search.png";
import Member from "./Member";
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "../loadingSpinner";

function Team() {
  const { getTechiesList } = useEndpoints();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatioinDetails, setPaginatioinDetails] = useState({
    total: 0,
    size: 0,
    pages: 0,
    page: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    data: TechiesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["techies", currentPage],
    queryFn: () =>
      getTechiesList({
        page: currentPage,
      }),
    onSuccess: (data) => {
      setPaginatioinDetails({
        total: data.total,
        size: data.size,
        pages: data.pages,
        page: data.page,
      });
    },
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const techies = TechiesData?.users;

  const filteredTechies = techies?.filter((user) => {
    if (searchKeyword === "") {
      return user;
    }
    return (
      user.first_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  return (
    <section className="w-4/5 py-4 bg-white dark:bg-[#232323] rounded-sm border border-st-edge dark:border-st-edgeDark">
      <div className="flex items-center gap-4 pb-4 px-8 border-b border-b-st-edge dark:border-st-edgeDark">
        <h3 className="font-medium text-secondary dark:text-[#F1F3F7] flex gap-1 items-center text-base">
          Team Memebers
          <span className="text-[9px] px-3 font-medium bg-[#F1F3F7] dark:bg-[#444444] rounded-3xl">
            {TechiesData ? TechiesData.total : 0} techies
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
      <div className=" border-b-st-edge dark:border-st-edgeDark border-b py-4 px-8">
        <form
          action=""
          className="bg-white dark:bg-[#444444] w-full border flex justify-between p-2 dark:border-st-edgeDark border-st-edge rounded"
        >
          <div className="w-full flex items-center py-2 px-3 gap-2">
            <img src={Search.src} alt="search icon" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full dark:bg-[#444444] border-none placeholder-st-gray-500 text-black dark:text-white focus:outline-none"
              placeholder="Search by keyword"
            />
          </div>

          <button className="bg-[#3D4450] dark:bg-st-edgeDark text-white py-2 px-6 rounded-sm">
            Search
          </button>
        </form>
      </div>

      {/* User Info */}
      <div className="w-full h-[calc(100%-196px)] overflow-y-scroll">
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
        {filteredTechies && (
          <div className="grid mt-8 px-8 grid-cols-3 gap-4">
            {filteredTechies.map((user) => (
              <Member key={`${user.id}`} data={user} />
            ))}
          </div>
        )}
      </div>
      <div className="w-full h-10 mt-2 px-8">
        <div className="flex items-center justify-between h-full">
          <p className="text-sm text-slate-700 dark:text-[#F1F3F7]">
            Showing{" "}
            {1 + (paginatioinDetails.page - 1) * paginatioinDetails.size} to{" "}
            {paginatioinDetails.page === paginatioinDetails.pages
              ? paginatioinDetails.total
              : paginatioinDetails.size * paginatioinDetails.page}{" "}
            of {paginatioinDetails.total} entries
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
              className="bg-[#3D4450] dark:bg-st-edgeDark text-white py-2 px-6 rounded-sm disabled:opacity-70"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentPage < paginatioinDetails.pages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === paginatioinDetails.pages}
              className="bg-[#3D4450] dark:bg-st-edgeDark text-white py-2 px-6 rounded-sm disabled:opacity-70"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;
