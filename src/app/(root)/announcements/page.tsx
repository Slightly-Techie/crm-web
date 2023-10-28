"use client";
import Search from "@/assets/icons/search.png";
import LoadingSpinner from "@/components/loadingSpinner";
import { useFetchAnnouncements } from "@/services/AnnouncementServices";
import { getTimeElapsedOrDate } from "@/utils";
import Link from "next/link";
import Image from "next/image";
import PageTitle from "@/components/PageTitle";
import { useState } from "react";

function Page() {
  const { isFetching, Announcements } = useFetchAnnouncements(10);
  const [currentLimit] = useState(10);
  const paginatedData = Announcements && Announcements.slice(0, currentLimit);
  // const showMore = () => {
  //   if (paginatedData.length === Announcements.length) {
  //     setCurrentLimit((prevLimit) => prevLimit - 3);
  //     return;
  //   }
  //   setCurrentLimit((prevLimit) => prevLimit + 3);
  // };
  const [isAdmin] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  const filteredItems = paginatedData?.filter((item) => {
    const projectMatch = item?.title
      ?.toLowerCase()
      .includes(query.toLowerCase());
    return projectMatch;
  });

  return (
    <section>
      <PageTitle title="Announcements" />
      <section className="flex flex-col lg:flex-row w-full h-full">
        {/* Left */}
        <section className="lg:w-[70%] h-full">
          <section className="flex justify-between items-center w-full p-5 border-r h-full">
            <section className="w-[50%] flex items-center py-2 px-3 gap-2 border rounded-md">
              <input
                type="text"
                className="w-full bg-transparent border-none placeholder-st-gray-500 text-black dark:text-white focus:outline-none"
                placeholder="Search by keyword"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Image
                src={Search.src}
                width={20}
                height={20}
                alt="search icon"
              />
            </section>
            {/* Add Filter and Sort Dropdowns */}
            {isAdmin && (
              <Link
                href={"/admin/announcements"}
                className=" dark:bg-st-surfaceDark px-4 py-2 rounded text-sm"
              >
                Create Announcement
              </Link>
            )}
          </section>
          <section className="p-5">
            {isFetching ? (
              <LoadingSpinner />
            ) : filteredItems?.length > 0 ? (
              filteredItems?.map((item) => {
                return (
                  <section
                    key={item.id}
                    className="bg-st-cardDark my-3 p-5 rounded-lg"
                  >
                    <section className="flex justify-between items-center">
                      <h2 className="font-bold text-lg">{item.title}</h2>
                      <span className="text-[#9F9F9F] text-[13px]">
                        {getTimeElapsedOrDate(item.created_at!)}
                      </span>
                    </section>
                    <p className="text-[#9F9F9F]">{item.content}</p>
                  </section>
                );
              })
            ) : (
              <h1 className="text-center text-2xl text-[#777777]">
                Sorry, this announcement does not exist.
              </h1>
            )}
          </section>
        </section>
        {/* Right */}
        <section className="flex justify-between lg:w-[25%] my-2 p-5">
          <p>Techie of the menth go dey here</p>
        </section>
        pP
      </section>
    </section>
  );
}

export default Page;
