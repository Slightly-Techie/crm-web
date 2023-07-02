"use client";

import { useFetchAnnouncements } from "@/app/(admin)/admin/announcements/AnnouncementServices";
import React from "react";
import LoadingSpinner from "@/components/loadingSpinner";

const Announcements = () => {
  const { isFetching, isFetchingError, Announcements } =
    useFetchAnnouncements();
  return (
    <div className="w-[280px] h-min flex flex-col rounded-[4px] border border-st-gray dark:border-st-edgeDark bg-white dark:bg-st-surfaceDark">
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
      {Announcements && (
        <div>
          <h5 className="font-bold text-xl p-3 text-secondary dark:text-primary border-b border-st-gray dark:border-st-grayDark">
            Announcements
          </h5>

          {Announcements.map((item) => {
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
          })}
          {/* <button className="w-full flex items-center justify-center p-3 hover:bg-st-text/30 duration-100">
            <p className="text-sm text-secondary dark:text-primary">
              Show More
            </p>
          </button> */}
        </div>
      )}
    </div>
  );
};

export default Announcements;
