"use client";
import { useEffect, useState } from "react";
import { FaFilter, FaChevronDown, FaSearch } from "react-icons/fa";
import StatusCheck from "@/components/projects/StatusCheck";
import Link from "next/link";
import useEndpoints from "@/services";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loadingSpinner";
import PageTitle from "@/components/PageTitle";
import { format } from "date-fns";

function Page() {
  const [isAdmin] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showFilterOptions, setShowFilterOptions] = useState<boolean>(false);
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  const { getProjects, updateProjectStatus } = useEndpoints();

  const {
    data: Projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
    refetchOnWindowFocus: false,
    retry: 3,
  });

  // useEffect(() => {
  //   if (Projects?.data.items) {
  //     const initialStatuses = Projects.data.items.reduce(
  //       (acc: { [key: string]: string }, item: { id: string }) => {
  //         acc[item.id] = "In progress";
  //         return acc;
  //       },
  //       {}
  //     );
  //     setStatuses(initialStatuses);
  //   }
  // }, [Projects]);

  const projectList = Projects?.data.items;

  const filteredItems = projectList?.filter((item) => {
    const projectMatch = item?.name
      ?.toLowerCase()
      .includes(query.toLowerCase());

    const filterMatch =
      selectedFilter === "all" || item.project_type === selectedFilter;

    return projectMatch && filterMatch;
  });

  console.log("filteredItems", filteredItems);

  // const handleStatusChange = (projectId: string, newStatus: string) => {
  //   setStatuses((prev) => ({
  //     ...prev,
  //     [projectId]: newStatus,
  //   }));
  //   updateProjectStatus(projectId, newStatus); // Function to update the project status on the server
  // };

  return (
    <main>
      <PageTitle title="Community Projects" />
      <section className="pt-[7vh]">
        <section className="flex justify-between items-center w-full my-2 p-5">
          <section className="w-3/5 flex items-center py-2 px-3 gap-2 border-2 rounded-md">
            <input
              type="text"
              className="w-full bg-transparent border-none placeholder-st-gray-500 text-black dark:text-white focus:outline-none"
              placeholder="Search by keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FaSearch className="text-black dark:text-white" size={20} />
          </section>
          <section className="relative flex items-center">
            <button
              className="flex items-center gap-2 border-2 dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded-md"
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              <FaFilter size={20} />
              Filter
              <FaChevronDown size={14} />
            </button>
            {showFilterOptions && (
              <div className="absolute z-50 top-full right-0 mt-2 bg-gray-600 dark:bg-gray-900 border rounded-md shadow-lg p-4 ">
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-2">
                    Filter by Type:
                  </label>
                  <select
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    // onClick={() => setShowFilterOptions(showFilterOptions)}
                  >
                    <option value="all">All</option>
                    <option value="COMMUNITY">Community</option>
                    <option value="PAID">Paid</option>
                  </select>
                </div>
              </div>
            )}
          </section>
          <section>
            {isAdmin && (
              <Link
                href={"/admin/add-project"}
                className="border dark:border-none bg-primary-dark text-primary-light hover:bg-st-edgeDark dark:bg-white dark:text-st-surfaceDark hover:dark:bg-neutral-100 px-4 py-2 rounded text-sm"
              >
                Add Project
              </Link>
            )}
          </section>
        </section>
        <section className="p-5">
          <div className="relative overflow-x-auto">
            {isLoading && <LoadingSpinner />}

            {Projects &&
              (filteredItems?.length! > 0 ? (
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Project name
                      </th>
                      {/* <th scope="col" className="px-6 py-3">
                        Project Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Project Priority
                      </th> */}
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Start Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Team Members
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems?.map((item) => (
                      <tr
                        key={item.id}
                        className="dark:bg-[#121212] text-black dark:text-white border-b w-full hover:bg-gray-300"
                      >
                        <td className="px-6 py-3 hover:underline hover:text-blue-500">
                          <Link
                            key={item.id}
                            href={`/community-projects/${encodeURIComponent(
                              item.id
                            )}`}
                          >
                            {item.name}
                          </Link>
                        </td>
                        {/* <td className="px-6 py-3">
                          <StatusCheck project_type={item.project_type} />
                        </td>
                        <td className="px-6 py-3">
                          <StatusCheck priority={item?.project_priority} />
                        </td> */}
                        <td className="px-6 py-3">
                          <StatusCheck status={item.status} />
                        </td>
                        <td className="px-6 py-3">
                          {format(new Date(item.created_at), "MM/dd/yyyy")}
                        </td>
                        <td className="px-6 py-3 flex -space-x-4">
                          {item.members?.map((member, index) => (
                            <img
                              key={member.id}
                              src={
                                member.profile_pic_url &&
                                member.profile_pic_url !== ""
                                  ? member.profile_pic_url
                                  : `https://api.dicebear.com/7.x/initials/jpg?seed=${member.first_name} ${member.last_name}`
                              }
                              alt={`${member.first_name} ${member.last_name}`}
                              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                              style={{ zIndex: member.length - index }}
                            />
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h1 className="text-center text-2xl text-[#777777]">
                  Sorry, this project does not exist.
                </h1>
              ))}

            {isError && <h1>Data Failed to load</h1>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default Page;
