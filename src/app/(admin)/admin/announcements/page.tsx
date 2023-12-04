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
import PageTitle from "@/components/PageTitle";
import toast from "react-hot-toast";

export default function Announcement() {
  const [currentPost, setCurrentPost] =
    useState<AnnouncementDataResponse | null>(null);
  const { isFetching, isFetchingError, Announcements } =
    useFetchAnnouncements(9);
  const { createNewAnnouncement, DeleteAnnouncement } = usePostAnnouncment();

  const [visibleAnnouncement, setVisibleAnnouncement] = useState(3);
  const paginatedAnnouncement =
    Announcements && Announcements.slice(0, visibleAnnouncement);

  const showMoreAnnouncements = () => {
    if (paginatedAnnouncement.length === Announcements.length) {
      setVisibleAnnouncement((curr) => curr - 3);
      return;
    } else {
      setVisibleAnnouncement((curr) => curr + 3);
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
    toast.success("Announcement Deleted!");
  }
  return (
    <div className="">
      <PageTitle title="Create announcement" />
      <div className="w-full right-0 grid h-full lg:grid-cols-announcement">
        <CreateAnnouncement
          existingPost={currentPost}
          submitHandler={handleNewAnnouncement}
        />
        <div className=" w-full lg:w-4/5 mx-auto h-full ">
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
            <div className="h-full pt-14 py-4 ">
              <h3 className="text-st-text py-4 dark:text-st-surface text-left text-xl font-">
                {Announcements.length} New Announcements
              </h3>
              <div className=" flex flex-col gap-4">
                {paginatedAnnouncement.map((item) => {
                  return (
                    <ViewAnnouncement
                      handleDelete={deleteAnnouncement}
                      handleEdit={editAnnouncement}
                      key={item.id}
                      {...item}
                    />
                  );
                })}
              </div>
              {Announcements.length > 3 && (
                <button
                  className="py-3 w-full flex items-center justify-center bg-[#1E1E1E] my-4 text-white hover:bg-st-edgeDark hover:dark:bg-st-grayDarktext-lg rounded-lg"
                  onClick={showMoreAnnouncements}
                >
                  <p className=" text-base text-secondary dark:text-primary">
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
    </div>
  );
}
