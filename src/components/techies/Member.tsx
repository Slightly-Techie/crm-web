"use client";

import React from "react";
import { ITechie } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface MemberProps {
  data: ITechie;
  onSelect?: () => void;
  isSelected?: boolean;
  className?: string;
}

function Member({ data, onSelect, isSelected, className }: MemberProps) {
  const profilePicUrl =
    data.profile_pic_url && data.profile_pic_url !== "string"
      ? data.profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${data.first_name} ${data.last_name}`;

  const stackName = data.stack?.name || "Techie";
  const location = "Remote"; // Location not available from API

  // Mock online status - you can replace this with real data
  const isOnline = Math.random() > 0.5;

  return (
    <div
      className={`group bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(27,28,28,0.06)] hover:-translate-y-1 relative overflow-hidden ${
        isSelected ? "ring-2 ring-primary/20" : ""
      } ${className}`}
      onClick={onSelect}
    >
      <div className="flex flex-col items-center text-center">
        {/* Avatar with online status */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-secondary-container/30">
            <Image
              alt="Techie Avatar"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              width={96}
              height={96}
              src={profilePicUrl}
            />
          </div>
          <span
            className={`absolute bottom-1 right-1 w-5 h-5 ${
              isOnline ? "bg-emerald-500" : "bg-stone-300"
            } border-4 border-white rounded-full`}
            title={isOnline ? "Online" : "Offline"}
          ></span>
        </div>

        {/* Name and Title */}
        <h3 className="font-headline font-bold text-lg text-on-surface leading-tight">
          {data.first_name} {data.last_name}
        </h3>
        <p className="text-sm text-primary font-medium mt-1">{stackName} Engineer</p>

        {/* Location */}
        <p className="text-xs text-on-surface-variant mt-2 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-xs">location_on</span>
          {location}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {data.github_profile && (
            <span className="px-2 py-0.5 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              GitHub
            </span>
          )}
          <span className="px-2 py-0.5 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
            {stackName}
          </span>
          {data.email && (
            <span className="px-2 py-0.5 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              Active
            </span>
          )}
        </div>

        {/* View Profile Button */}
        <Link href={`/techies/${data.id}`} className="w-full mt-6">
          <button className="w-full py-2.5 rounded-lg border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors active:scale-95">
            View Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

export default React.memo(Member);
