"use client";

import { useFetchAnnouncements } from "@/services/AnnouncementServices";
import React, { useState } from "react";
import LoadingSpinner from "@/components/loadingSpinner";
import { getTimeElapsedOrDate } from "@/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  const normalizedUrl = url.trim();
  if (!normalizedUrl) return "";
  if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://")) {
    return normalizedUrl;
  }
  if (!API_BASE_URL) {
    return normalizedUrl;
  }
  return `${API_BASE_URL.replace(/\/$/, "")}/${normalizedUrl.replace(/^\//, "")}`;
};

const Announcements = () => {
  const { isFetching, isFetchingError, Announcements } =
    useFetchAnnouncements(6);
  const INITIAL_LIMIT = 3;
  const [currentLimit, setCurrentLimit] = useState(INITIAL_LIMIT);
  const paginatedData = Announcements && Announcements.slice(0, currentLimit);
  const isShowingAll = paginatedData?.length === Announcements?.length;
  const toggleShowMore = () => {
    if (isShowingAll) {
      setCurrentLimit(INITIAL_LIMIT);
      return;
    }
    setCurrentLimit((prevLimit) => prevLimit + 3);
  };

  return (
    <div className="w-full h-fit flex flex-col p-5">
      {isFetching && (
        <div className="h-full w-full flex p-4 flex-col items-center justify-center py-32">
          <LoadingSpinner fullScreen={false} />
        </div>
      )}
      {isFetchingError && (
        <h1 className="h-full w-full flex flex-col items-center justify-center">
          There is an error fetching posts
        </h1>
      )}
      {paginatedData && (
        <div className=" flex gap-3 flex-col pb-6">
          <h5 className=" bg-white dark:bg-primary-dark pt-4 z-50 font-bold text-xl sticky top-0 pb-4 text-secondary dark:text-primary ">
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
                  className="p-5 flex flex-col bg-neutral-100 rounded-md dark:bg-st-cardDark border-st-gray dark:border-st-grayDark"
                >
                  <span className=" flex justify-between gap-4">
                    <h6 className="text-primary-dark text-lg pb-4 dark:text-st-gray font-semibold">
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

                  {item.image_url && (
                    <div className="mt-4 rounded-md overflow-hidden border border-st-gray dark:border-st-grayDark">
                      <img
                        src={resolveImageUrl(item.image_url)}
                        alt={item.title || "Announcement image"}
                        className="w-full h-44 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
          {Announcements.length > 3 && (
            <button
              onClick={toggleShowMore}
              className="w-full flex items-center justify-center font-bold p-3 dark:hover:bg-st-subTextDark hover:bg-st-text/90 dark:bg-primary-light bg-primary-dark duration-100 rounded-md dark:text-st-surfaceDark text-st-surface"
            >
              <p className="text-sm text-secondary dark:text-primary">
                {isShowingAll ? "Show Less" : "Show More"}
              </p>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;
