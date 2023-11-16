"use client";

import { useFetchAnnouncements } from "@/services/AnnouncementServices";
import React, { useState } from "react";
import LoadingSpinner from "@/components/loadingSpinner";
import { getTimeElapsedOrDate } from "@/utils";

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
        <div className=" flex gap-3 flex-col pb-6">
          <h5 className=" dark:bg-primary-dark pt-4 bg-primary-light z-50 font-bold text-xl sticky top-0 pb-4 text-secondary dark:text-primary ">
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
                  className="p-3 flex flex-col bg-white rounded-md dark:bg-st-cardDark border-st-gray dark:border-st-grayDark"
                >
                  <span className=" flex justify-between gap-4">
                    <h6 className="text-[#575F70] text-lg pb-4 dark:text-st-gray font-semibold">
                      {item.title}{" "}
                      <span className="text-[#9F9F9F] text-[13px]">
                        &bull;{" "}
                        {item.created_at &&
                          getTimeElapsedOrDate(item.created_at)}{" "}
                      </span>
                    </h6>
                  </span>

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
              className="w-full flex items-center justify-center font-bold p-3 dark:hover:bg-st-subTextDark hover:bg-st-text/30 dark:bg-primary-light bg-primary-dark duration-100 rounded-md dark:text-st-surfaceDark text-st-surface"
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
