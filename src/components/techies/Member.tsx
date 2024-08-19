/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ITechie } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface MemberProps {
  data: ITechie;
  onSelect?: () => void; // Callback function for selection
  isSelected?: boolean; // Boolean to check if the member is selected
  className?: string;
}

function Member({ data, onSelect, isSelected, className }: MemberProps) {
  // console.log(data);

  // Determine the profile picture URL
  const profilePicUrl =
    data.profile_pic_url && data.profile_pic_url !== "string"
      ? data.profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${data.first_name} ${data.last_name}`;

  // Safely access stack properties
  const stackName = data.stack?.name || "Techie";

  return (
    <section
      className={`col-span-1 border-2 rounded-md p-5 ${className} ${
        isSelected ? "bg-blue-200" : "bg-white"
      }`}
      onClick={onSelect}
    >
      {/* Top Section */}
      <Image
        className="rounded-full w-[60px] h-[60px] object-cover mb-5"
        width={5000}
        height={5000}
        src={profilePicUrl}
        priority
        alt="profile"
      />
      <section>
        <p className="lg:text-lg font-semibold">
          {data.first_name} {data.last_name}
        </p>
        <p className="font-light text-[#5D6675] dark:text-[#cacbcf] text-sm">
          {/* {data.stack?.name ? `${data.stack.name} Engineer` : "Techie"} */}
          {stackName} Engineer
        </p>
      </section>
      <section className="mt-5">
        <Link href={`/techies/${data.id}`}>
          <button className="text-white bg-primary-dark text-primary-white dark:bg-primary-light dark:text-primary-dark px-2 py-1 rounded-md text-sm">
            View Profile
          </button>
        </Link>
      </section>
    </section>
  );
}

export default Member;
