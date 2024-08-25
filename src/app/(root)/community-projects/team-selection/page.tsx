"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Search from "@/assets/icons/search.png";
import Member from "@/components/techies/Member"; // Adjust the path if necessary
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner"; // Adjust the path if necessary
import PageTitle from "@/components/PageTitle"; // Adjust the path if necessary
import useDebounce from "@/hooks/useDebouncedSearch";
import { IGetAllTechiesResponse, ProjectFields } from "@/types";
import axios from "axios";
import { useProject } from "@/context/ProjectContext";

function TeamSelectionPage() {
  const router = useRouter();
  const { formValues } = useProject();
  const [selectedTeam, setSelectedTeam] = useState<any[]>([]);
  const { getTechiesList, searchTechie, postProjects } = useEndpoints();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationDetails, setPaginationDetails] = useState({
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
      setPaginationDetails({
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

  const handleTeamSelection = (teamMember: any) => {
    setSelectedTeam((prev) =>
      prev.find((member) => member.id === teamMember.id)
        ? prev.filter((member) => member.id !== teamMember.id)
        : [...prev, teamMember]
    );
  };

  const handleSubmit = async () => {
    if (formValues) {
      console.log("formValues", formValues);

      // Assuming you have stack IDs in your selectedTeam
      // const stackIds = selectedTeam.map((member) => member.stack.id);
      const { project_tools, stacks, ...otherFormValues } = formValues;
      const adjustedProjectTools = project_tools?.map((tool) => tool.id); // Extract the value from each tool
      const adjustedProjectStack = stacks?.map((tool) => tool.id); // Extract the value from each tool

      const payload = {
        ...otherFormValues,
        project_tools: adjustedProjectTools,
        stacks: adjustedProjectStack,
        members: selectedTeam.map((member) => member.id), // Extract the id from each member
        manager_id: 5, // Replace with the actual manager ID
      };

      try {
        console.log("Submitting payload:", payload); // Log the payload
        const response = await postProjects(payload);
        console.log("API response:", response); // Log the response

        // Check if the response is successful
        if (response.status === 200 || response.status === 201) {
          router.push("/community-projects"); // Redirect to projects page or any other page
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error creating project:", error);
      }
    } else {
      console.error("Form values are null"); // Log if formValues is null
    }
  };

  const techies =
    searchKeyword && result?.items ? result?.items : TechiesData?.items;

  return (
    <section className="w-full h-full mb-10">
      <PageTitle title="Create a Project" />

      <section className="pt-[7vh]">
        {/* Search Input Section */}
        <section className="border-b-st-edge dark:border-st-edgeDark p-5">
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
                {1 + (paginationDetails.page - 1) * paginationDetails.size} to{" "}
                {paginationDetails.page === paginationDetails.pages
                  ? paginationDetails.total
                  : paginationDetails.size * paginationDetails.page}{" "}
                of {paginationDetails.total} entries
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
                    if (currentPage < paginationDetails.pages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  disabled={currentPage === paginationDetails.pages}
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
          <h1 className="font-bold text-4xl pb-10">
            Select a Team for the Project
          </h1>
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
                <Member
                  key={user.id}
                  data={user}
                  onSelect={() => handleTeamSelection(user)}
                  isSelected={
                    !!selectedTeam.find((member) => member.id === user.id)
                  }
                  className="cursor-pointer"
                />
              ))}
            </section>
          )}
        </section>
      </section>
      <div className="h-[100px] mt-6 mx-3">
        <button
          onClick={handleSubmit}
          className="flex justify-center text-primary-light dark:text-st-surfaceDark font-bold w-[120px] py-2 dark:bg-primary-light bg-primary-dark rounded-md"
        >
          Create Project
        </button>
      </div>
    </section>
  );
}

export default TeamSelectionPage;
