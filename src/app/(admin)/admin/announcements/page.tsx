"use client";

import CreateAnnouncement from "@/components/admin/announcement/CreateAnnouncement";
import ViewAnnouncement from "@/components/admin/announcement/ViewAnnouncement";
import { useState } from "react";

export type AnnouncementFields = "id" | "title" | "content";

export type AnnouncementData = {
  id: string | null;
  title: string;
  content: string;
  edited?: boolean;
};
const dummyData: AnnouncementData[] = [
  {
    id: "0",
    title: "Dev Congress",
    content:
      "I know what it feels like to lose, you feel so desperate that you are right yet you fail nonetheless. But I ask you to what end? Dread it, run from it destiny arrives all the same and now it is here.",
  },
  {
    id: "1",
    title: "Champion Techie",
    content:
      "I know what it feels like to lose, you feel so desperate that you are right yet you fail nonetheless. But I ask you to what end? Dread it, run from it destiny arrives all the same and now it is here.",
  },
];

export default function Announcement() {
  const [announcement, setAnnouncement] = useState(dummyData);
  const [currentPost, setCurrentPost] = useState<AnnouncementData | null>(null);

  function handleNewAnnouncement(obj: AnnouncementData) {
    let newArray;
    if (obj.edited) {
      const updated = announcement.map((item) => {
        if (item.id === obj.id) {
          return { ...obj, id: item.id };
        } else return item;
      });
      newArray = updated;
    } else {
      const updatedObj = {
        ...obj,
        id: new Date().getMilliseconds().toString(),
      };
      newArray = [updatedObj].concat(...announcement);
    }
    setAnnouncement(newArray);
    setCurrentPost(null);
  }

  function editAnnouncement(id: string) {
    const item = announcement.find((item) => item.id === id);
    if (item) {
      setCurrentPost(item);
    }
  }

  function deleteAnnouncement(id: string) {
    if (currentPost && currentPost.id === id) return;
    const filteredArr = announcement.filter((item) => item.id !== id);
    setAnnouncement(filteredArr);
  }
  return (
    <div className="w-full grid gap-4 place-content-center lg:grid-cols-announcement">
      <CreateAnnouncement
        existingPost={currentPost}
        submitHandler={handleNewAnnouncement}
      />
      <div className="w-4/5 mx-auto ">
        {announcement.length && (
          <h3 className="text-white text-center">
            All Announcements ({announcement.length})
          </h3>
        )}
        {announcement.map((item) => {
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
    </div>
  );
}
