"use client";
import { useState } from "react";
import Search from "@/assets/icons/search.png";
import StatusCheck from "@/components/projects/StatusCheck";
import Link from "next/link";
import useEndpoints from "@/services";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loadingSpinner";
import Image from "next/image";
import { BsPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

function Page() {
  const [isAdmin] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const { getProjects } = useEndpoints().projects;
  const router = useRouter();

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

  const projectList = Projects?.data.items;

  const filteredItems = projectList?.filter((item) => {
    const projectMatch = item?.name
      ?.toLowerCase()
      .includes(query.toLowerCase());
    return projectMatch;
  });

  return (
    <main>
      <section className="border-b border-b-neutral-700 sticky top-0 bg-primary-light dark:bg-[#141414] w-full p-5">
        <p className="lg:text-xl font-bold">Community Projects</p>
      </section>
      <section className="flex justify-between items-center gap-6 w-full my-2 p-5">
        <section className="w-[90%] flex items-center py-2 px-3 gap-2 border rounded-md">
          <input
            type="text"
            className="w-full bg-transparent border-none placeholder-st-gray-500 text-black dark:text-white focus:outline-none"
            placeholder="Search by keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Image src={Search.src} width={20} height={20} alt="search icon" />
        </section>
        {isAdmin && (
          <Link
            href={"/admin/add-project"}
            className="flex flex-row items-center shrink-0 gap-2 border dark:border-none dark:bg-white dark:text-black px-2 pr-3.5 py-1.5 rounded text-sm"
          >
            <BsPlus size={24} />
            <p>Add Project</p>
          </Link>
        )}
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
                    <th scope="col" className="px-6 py-3">
                      Project type
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Project Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems?.map((item) => {
                    return (
                      <tr
                        key={item.name}
                        onClick={() =>
                          router.push(`/community-projects/${item.id}`)
                        }
                        className="dark:bg-[#121212] dark:hover:bg-zinc-900 text-black dark:text-white border-b border-black w-full"
                      >
                        <td className="px-6 py-3">{item.name}</td>
                        <td className="px-6 py-3">
                          {<StatusCheck project_type={item.project_type} />}
                        </td>
                        <td className="px-6 py-3">
                          {<StatusCheck priority={item?.project_priority} />}
                        </td>
                      </tr>
                    );
                  })}
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
    </main>
  );
}

export default Page;
