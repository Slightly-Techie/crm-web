import { AnnouncementDataResponse } from "@/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { getTimeElapsedOrDate } from "@/utils";

type ViewAnnouncementProps = AnnouncementDataResponse & {
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
};
export default function ViewAnnouncement({
  title,
  content,
  id,
  image_url,
  created_at,
  handleDelete,
  handleEdit,
}: ViewAnnouncementProps) {
  return (
    <div className="w-full p-4 rounded-xl dark:text-st-surface bg-[#F9FAFC] dark:bg-st-cardDark flex flex-col gap-6">
      <div className=" flex justify-between">
        <h2 className=" dark:text-st-surface text-xl font-medium ">{title}</h2>
        <div className=" dark:text-st-surface">
          {created_at && getTimeElapsedOrDate(created_at)}
        </div>
      </div>
      <p className="  text-st-text dark:text-st-surface">{content}</p>
      {image_url && (
        <div className="rounded-lg overflow-hidden border border-st-gray dark:border-st-grayDark">
          <img
            src={image_url}
            alt={title || "Announcement image"}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="w-fit ml-auto flex gap-4 justify-between">
        <div className="flex gap-2">
          <button
            className=" text-inherit dark:text-st-surface"
            onClick={() => handleEdit(id)}
          >
            <FiEdit2 />
          </button>
          <button onClick={() => handleDelete(id)}>
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
