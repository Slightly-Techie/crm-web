"use client";

import CreateAnnouncement from "@/components/admin/announcement/CreateAnnouncement";
import ViewAnnouncement from "@/components/admin/announcement/ViewAnnouncement";
import { useState } from "react";
import {
  useFetchAnnouncements,
  usePostAnnouncment,
} from "../../../../services/AnnouncementServices";
import { AnnouncementDataResponse } from "@/types";
import LoadingSpinner from "@/components/loadingSpinner";

export default function Announcement() {
  const [currentPost, setCurrentPost] =
    useState<AnnouncementDataResponse | null>(null);
  const { isFetching, isFetchingError, Announcements } =
    useFetchAnnouncements(10);
  const { createNewAnnouncement, DeleteAnnouncement } = usePostAnnouncment();

  const [visibleAnnouncement, setVisibleAnnouncement] = useState(3);
  const paginatedAnnouncement =
    Announcements && Announcements.slice(0, visibleAnnouncement);

  const showMoreAnnouncements = () => {
    if (visibleAnnouncement === Announcements.length) {
      setVisibleAnnouncement(3);
    } else {
      setVisibleAnnouncement(visibleAnnouncement + 3);
    }
  };

  function handleNewAnnouncement(obj: Partial<AnnouncementDataResponse>) {
    createNewAnnouncement(obj);
    setCurrentPost(null);
  }

  function editAnnouncement(id: number) {
    const item = Announcements?.find((item) => item.id === id);
    if (item) {
      setCurrentPost(item);
    }
  }

  function deleteAnnouncement(id: number) {
    if (currentPost && currentPost.id === id) return;
    DeleteAnnouncement(id);
  }
  return (
    <div className="w-4/5 absolute right-0 grid h-full lg:grid-cols-[50%,1fr]">
      <CreateAnnouncement
        existingPost={currentPost}
        submitHandler={handleNewAnnouncement}
      />
      <div className=" w-full lg:w-4/5 mx-auto ">
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
          <div className="h-full mt-14 ">
            <h3 className="text-st-text light:text-st-subTextDark text-left text-xl font-">
              {Announcements.length} New Announcements
            </h3>
            {Announcements.slice(0, visibleAnnouncement).map((item) => {
              return (
                <ViewAnnouncement
                  handleDelete={deleteAnnouncement}
                  handleEdit={editAnnouncement}
                  key={item.id}
                  {...item}
                />
              );
            })}
            {Announcements.length > 3 && (
              <button
                className="py-3 w-full flex items-center justify-center bg-[#1E1E1E] text-white font-tt-hoves text-lg rounded-lg"
                onClick={showMoreAnnouncements}
              >
                <p className="text-sm text-secondary dark:text-primary">
                  {paginatedAnnouncement.length === Announcements.length
                    ? "Show Less"
                    : "Show More"}
                </p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
