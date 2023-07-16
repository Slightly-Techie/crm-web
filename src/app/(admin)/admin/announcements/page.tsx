"use client";

import CreateAnnouncement from "@/components/admin/announcement/CreateAnnouncement";
import ViewAnnouncement from "@/components/admin/announcement/ViewAnnouncement";
import { useState } from "react";
import { useFetchAnnouncements } from "./AnnouncementServices";
import { usePostAnnouncment } from "./AnnouncementServices";
import { AnnouncementDataResponse } from "@/types";
import LoadingSpinner from "@/components/loadingSpinner";

export default function Announcement() {
  const [currentPost, setCurrentPost] =
    useState<AnnouncementDataResponse | null>(null);
  const { isFetching, isFetchingError, Announcements } =
    useFetchAnnouncements(10);
  const { createNewAnnouncement, DeleteAnnouncement } = usePostAnnouncment();

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
    <div className="w-full grid gap-4 h-full lg:grid-cols-announcement">
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
          <div className="min-h-screen">
            <h3 className="text-st-textDark dark:text-st-subTextDark text-center">
              All Announcements ({Announcements.length})
            </h3>
            {Announcements.map((item) => {
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
        )}
      </div>
    </div>
  );
}
