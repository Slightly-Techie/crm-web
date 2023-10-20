import { AnnouncementDataResponse } from "@/types";
import Image from "next/image";
import EditIcon from "@/assets/icons/Edit_light.svg";
import TrashIcon from "@/assets/icons/Trash_light.svg";
import PersonIcon from "@/assets/icons/person-icon.svg";

type ViewAnnouncementProps = AnnouncementDataResponse & {
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
};
export default function ViewAnnouncement({
  title,
  content,
  id,
  handleDelete,
  handleEdit,
}: ViewAnnouncementProps) {
  return (
    <div className="w-full mt-6 py-4 border rounded-xl mb-6 bg-[#F9FAFC] border-gray-300 px-3 flex flex-col gap-5">
      <div className=" flex justify-between">
        <h2 className=" text-st-text dark:text-slate-200 text-xl font-medium ">
          {title}
        </h2>
        <div className="text-[#777777]">2h ago.</div>
      </div>
      <div className="  text-st-text dark:text-slate-300">{content}</div>
      <div className="w-full mx-auto my-2 flex gap-4 justify-between">
        <div className="flex items-center gap-1">
          <Image
            src={PersonIcon}
            alt="image"
            width={20}
            height={20}
            className="w-10 h-10 aspect-square shrink-0 rounded-full"
          />
          <div className="text-lg font-medium">Ayebea Korantema</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleEdit(id)}>
            <Image src={EditIcon} alt="edit-icon" width={20} height={20} />
          </button>
          <button onClick={() => handleDelete(id)}>
            <Image src={TrashIcon} alt="delete-icon" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
