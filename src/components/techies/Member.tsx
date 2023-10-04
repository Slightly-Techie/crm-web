/* eslint-disable @next/next/no-img-element */
import React from "react";
import Circle from "@/assets/icons/circle.png";
import { ITechie } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface MemberProps {
  data: ITechie;
}

const Member = ({ data }: MemberProps) => {
  return (
    <Link href={`/techies/${data.id}`}>
      <div className="border-st-edge dark:border-st-edgeDark dark:text-[#F1F3F7] border rounded-md p-4">
        <div className="flex items-center gap-4 mb-2">
          <Image
            className="w-12 h-12 aspect-square shrink-0 rounded-full"
            width={48}
            height={48}
            src={`https://avatars.dicebear.com/api/initials/${data?.first_name} ${data?.last_name}.svg`}
            priority
            alt="profile"
          />

          <div>
            <h3 className="text-lg font-medium">
              {data.first_name} {data.last_name}
            </h3>
            <p className="font-medium text-[#5D6675] dark:text-[#cacbcf] text-sm">
              Accra, Ghana
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 inline-flex items-center gap-1 rounded-sm bg-[#F1F6F7] dark:bg-[#444444] p-2 font-medium text-[#5D6675] dark:text-[#cacbcf] text-sm">
            <img width={16} src={Circle.src} alt="circle" />
            Visit Website
          </p>
        </div>

        <div className="mb-2">
          <h2 className="font-medium text-[#5D6675] dark:text-[#cacbcf] text-sm">
            Work Experience
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Slightly Techie", "Andela", "Microsoft"].map((item, i) => (
              <p
                key={`work-${i}`}
                className="font-medium text-[#5D6675] dark:text-[#cacbcf] text-sm"
              >
                {item},
              </p>
            ))}
            <p className="font-medium text-[#5D6675] dark:text-[#cacbcf] text-sm">
              +3 more
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <p className="flex bg-[#F1F3F7] dark:bg-[#444444] rounded-3xl p-2 text-xs">
            Software Engineering
          </p>
          {data.skills.map((item, i) => (
            <p
              key={`stack-${i}`}
              className="bg-[#F1F3F7] rounded-3xl p-2 text-xs"
            >
              {item.name}
            </p>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default Member;
