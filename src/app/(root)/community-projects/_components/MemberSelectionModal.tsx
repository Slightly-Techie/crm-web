import React from "react";
import { ITechie } from "@/types";
import Member from "@/components/techies/Member";

interface MemberSelectionModalProps {
  members: ITechie[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMember: (member: ITechie) => void;
  selectedMembers: ITechie[];
}

const MemberSelectionModal = ({
  members,
  isOpen,
  onClose,
  onSelectMember,
  selectedMembers,
}: MemberSelectionModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Select Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className={`cursor-pointer border ${
                selectedMembers.includes(member)
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => onSelectMember(member)}
            >
              <Member data={member} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSelectionModal;
