"use client";

import { useFetchAnnouncements } from "@/services/AnnouncementServices";
import React, { useState } from "react";
import LoadingSpinner from "@/components/loadingSpinner";

const Announcements = () => {
  const { isFetching, isFetchingError, Announcements } =
    useFetchAnnouncements(6);
  const [currentLimit, setCurrentLimit] = useState(3);
  const paginatedData = Announcements && Announcements.slice(0, currentLimit);
  const showMore = () => {
    if (paginatedData.length === Announcements.length) {
      setCurrentLimit((prevLimit) => prevLimit - 3);
      return;
    }
    setCurrentLimit((prevLimit) => prevLimit + 3);
  };

  return (
    <div className="w-full h-fit flex flex-col rounded-[4px] border border-st-gray dark:border-st-edgeDark bg-white dark:bg-st-surfaceDark">
      {isFetching && (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {isFetchingError && (
        <h1 className="h-full w-full flex flex-col items-center justify-center">
          There is an error fetching posts
        </h1>
      )}
      {paginatedData && (
        <div>
          <h5 className="font-bold text-xl p-3 text-secondary dark:text-primary border-b border-st-gray dark:border-st-grayDark">
            Announcements
          </h5>

          {paginatedData.length === 0 ? (
            <h1>No Announcements</h1>
          ) : (
            paginatedData.length &&
            paginatedData.map((item) => {
              return (
                <div
                  key={item.id}
                  className="p-3 flex flex-col border-b border-st-gray dark:border-st-grayDark"
                >
                  <h6 className="text-[#575F70] dark:text-primary font-semibold">
                    {item.title}
                  </h6>
                  <p className="text-md text-[#626979] dark:text-st-subTextDark">
                    {item.content}
                  </p>
                </div>
              );
            })
          )}
          {Announcements.length > 3 && (
            <button
              onClick={showMore}
              className="w-full flex items-center justify-center p-3 hover:bg-st-text/30 duration-100"
            >
              <p className="text-sm text-secondary dark:text-primary">
                {paginatedData.length === Announcements.length
                  ? "Show Less"
                  : "Show More"}
              </p>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;
