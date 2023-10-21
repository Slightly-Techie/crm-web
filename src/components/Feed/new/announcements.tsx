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
    <div className="w-full h-fit flex flex-col ">
      {isFetching && (
        <div className="h-full w-full flex p-4 flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {isFetchingError && (
        <h1 className="h-full w-full flex flex-col items-center justify-center">
          There is an error fetching posts
        </h1>
      )}
      {paginatedData && (
        <div className=" flex gap-3 flex-col">
          <h5 className="font-bold text-2xl pb-4 text-secondary dark:text-primary ">
            Announcements{" "}
            <small className=" text-status-check-success">
              + {Announcements.length}
            </small>
          </h5>

          {paginatedData.length === 0 ? (
            <h1 className="text-[#575F70] dark:text-primary font-semibold text-center">
              No Announcements
            </h1>
          ) : (
            paginatedData.length &&
            paginatedData.map((item) => {
              return (
                <div
                  key={item.id}
                  className="p-3 flex flex-col bg-white rounded-md dark:bg-st-surfaceDark border-st-gray dark:border-st-grayDark"
                >
                  <h6 className="text-[#575F70] text-lg pb-4 dark:text-st-gray font-semibold">
                    {item.title}
                  </h6>

                  <p className=" text-[#626979] dark:text-st-subTextDark">
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
