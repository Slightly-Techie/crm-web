/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ITechie } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface MemberProps {
  data: ITechie;
}

const Member = ({ data }: MemberProps) => {
  return (
    <section className="col-span-1 border-st-edge dark:border-st-edgeDark dark:text-[#F1F3F7] border rounded-md">
      <Image
        className="rounded-t-md w-full h-[250px] object-cover"
        width={48}
        height={48}
        src={`https://avatars.dicebear.com/api/initials/${data?.first_name} ${data?.last_name}.svg`}
        priority
        alt="profile"
      />
      <section className="p-3">
        <p className="font-light text-[#5D6675] dark:text-[#cacbcf] text-sm">
          {data.stack?.name} Engineer
        </p>
        <p className="text-complementary text-sm">@{data.username}</p>
        <br />
        <Link href={`/techies/${data.id}`}>
          <button className="text-white bg-primary-dark text-primary-white dark:bg-primary-light dark:text-primary-dark px-2 py-1 rounded-md text-sm">
            View Profile
          </button>
        </Link>
      </section>
    </section>
  );
};

export default Member;
