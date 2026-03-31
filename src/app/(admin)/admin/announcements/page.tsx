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
    <div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-screen gap-8 p-8">
        {/* Left Column - Create/Edit Form */}
        <div className="bg-surface-container-lowest rounded-xl p-6 h-fit sticky top-24">
          <CreateAnnouncement
            existingPost={currentPost}
            submitHandler={handleNewAnnouncement}
          />
        </div>

        {/* Right Column - Announcements List */}
        <div className="space-y-4">
          {isFetching && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}
          {isFetchingError && (
            <div className="bg-error-container border border-error rounded-xl p-6 text-center">
              <p className="text-on-error-container font-medium">
                Error loading announcements
              </p>
            </div>
          )}
          {Announcements && (
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold font-headline text-on-surface">
                  {Announcements.length} Announcements
                </h3>
                <p className="text-on-surface-variant text-sm mt-1 font-body">
                  Manage your announcements
                </p>
              </div>

              <div className="space-y-3">
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
                  className="w-full py-3 px-4 bg-primary text-on-primary font-semibold rounded-lg hover:shadow-md transition-all hover:-translate-y-0.5 font-headline text-sm"
                  onClick={showMoreAnnouncements}
                >
                  {paginatedAnnouncement.length === Announcements.length
                    ? "Show Less"
                    : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
