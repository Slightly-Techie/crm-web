/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Search from "@/assets/icons/search.png";
import Member from "./Member";
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "../loadingSpinner";
import PageTitle from "../PageTitle";
import useDebounce from "@/hooks/useDebouncedSearch";
import { IGetAllTechiesResponse } from "@/types";

function Team() {
  const { getTechiesList, searchTechie } = useEndpoints();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatioinDetails, setPaginatioinDetails] = useState({
    total: 0,
    size: 0,
    pages: 0,
    page: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const { debounce, result } = useDebounce<IGetAllTechiesResponse>(
    searchTechie,
    500
  );

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

  const handleSearch = async (value: string) => {
    setSearchKeyword(value);
    debounce(value);
  };

  const techies =
    searchKeyword && result?.items ? result?.items : TechiesData?.items;

  return (
    <section className="w-full h-full">
      <PageTitle title="Techies" />

      {/* Search Input Section */}
      <section className=" border-b-st-edge dark:border-st-edgeDark p-5">
        <form className="flex justify-between items-center gap-5">
          <section className="w-full flex items-center py-2 px-3 gap-2 border rounded-md">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent border-none placeholder-st-gray-500 text-black dark:text-white focus:outline-none"
              placeholder="Search by keyword"
            />
            <img src={Search.src} alt="search icon" />
          </section>
          <section className="flex items-center gap-5">
            <button className="bg-[#3D4450] dark:bg-st-edgeDark text-white py-2 px-6 rounded-sm">
              Search
            </button>
          </section>
        </form>
        {/* Pagination */}
        <section className="w-full h-10 mt-4">
          <section className="flex items-center justify-between h-full">
            <p className="text-sm text-slate-700 dark:text-[#F1F3F7]">
              Showing{" "}
              {1 + (paginatioinDetails.page - 1) * paginatioinDetails.size} to{" "}
              {paginatioinDetails.page === paginatioinDetails.pages
                ? paginatioinDetails.total
                : paginatioinDetails.size * paginatioinDetails.page}{" "}
              of {paginatioinDetails.total} entries
            </p>

            <section className="flex items-center gap-2">
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
            </section>
          </section>
        </section>
      </section>

      {/* Content */}
      <section className="p-5">
        {isError && (
          <section className="flex items-center justify-center w-full h-full">
            <h1 className="text-2xl font-medium text-center text-secondary dark:text-[#F1F3F7]">
              Something went wrong
            </h1>
          </section>
        )}
        {isLoading && (
          <section className="flex items-center justify-center w-full h-full">
            <LoadingSpinner />
          </section>
        )}
        {techies && (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {techies.map((user) => (
              <Member key={`${user.id}`} data={user} />
            ))}
          </section>
        )}
      </section>
    </section>
  );
}

export default Team;
