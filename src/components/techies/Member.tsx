/* eslint-disable @next/next/no-img-element */
import React from "react";
import { ITechie } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface MemberProps {
  data: ITechie;
}

function Member({ data }: MemberProps) {
  console.log(data);

  return (
    <section className="col-span-1 border-st-edge dark:border-st-edgeDark dark:text-[#F1F3F7] border-2 rounded-md p-5">
      {/* Top Section */}
      <Image
        className="rounded-full w-[60px] h-[60px] object-cover mb-5"
        width={5000}
        height={5000}
        src={
          (data.profile_pic_url === "string"
            ? `https://api.dicebear.com/7.x/initials/jpg?seed=${data.first_name} ${data.last_name}`
            : `${data.profile_pic_url}`) ||
          `https://api.dicebear.com/7.x/initials/jpg?seed=${data.first_name} ${data.last_name}`
        }
        priority
        alt="profile"
      />
      <section>
        <p className="lg:text-lg font-semibold">
          {data.first_name} {data.last_name}
        </p>
        <p className="font-light text-[#5D6675] dark:text-[#cacbcf] text-sm">
          {data.stack?.name ? `${data.stack.name} Engineer` : "Techie"}
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
