import { RiDeleteBin4Line } from "react-icons/ri";
import { AnnouncementData } from "@/app/(admin)/admin/announcements/page";

type ViewAnnouncementProps = AnnouncementData & {
  handleDelete: (id: string) => void;
  handleEdit: (id: string) => void;
};
export default function ViewAnnouncement({
  title,
  content,
  id,
  handleDelete,
  handleEdit,
}: ViewAnnouncementProps) {
  return (
    <div className="w-full py-4 border-b-[1px] border-b-slate-700">
      <section>
        <h2 className="text-slate-200 text-[1.2rem] font-semibold ">{title}</h2>
        <p className="text-slate-300">{content}</p>
      </section>
      <section className="w-full mx-auto my-2 flex gap-4 flex-row-reverse ">
        <button
          onClick={() => handleDelete(id)}
          className="h-9 py-2 px-8 flex items-center justify-center bg-secondary text-white font-tt-hoves font-semibold rounded-[4px]"
        >
          <RiDeleteBin4Line />
        </button>
        <button
          onClick={() => handleEdit(id)}
          className="h-9 py-2 px-8  flex items-center justify-center bg-secondary text-white font-tt-hoves font-semibold rounded-[4px]"
        >
          Edit
        </button>
      </section>
    </div>
  );
}
