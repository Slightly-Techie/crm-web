"use client";
import React from "react";
import Link from "next/link";
import TeamMemberCard from "./teamMemberCard";

const TeamSection = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row items-end justify-between">
          <p className="text-sm uppercase font-semibold text-[#777777]">
            Team Lead
          </p>
          <p className="text-xs text-[#777777]">View all</p>
        </div>
        <div className="flex flex-row gap-2.5">
          <TeamMemberCard />
          <TeamMemberCard />
          <TeamMemberCard />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row items-end justify-between">
          <p className="text-sm uppercase font-semibold text-[#777777]">
            Frontend Team
          </p>
          <p className="text-xs text-[#777777]">View all</p>
        </div>
        <div className="flex flex-row gap-2.5">
          <TeamMemberCard />
          <TeamMemberCard />
          <TeamMemberCard />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row items-end justify-between">
          <p className="text-sm uppercase font-semibold text-[#777777]">
            Backend Team
          </p>
          <p className="text-xs text-[#777777]">View all</p>
        </div>
        <div className="flex flex-row gap-2.5">
          <TeamMemberCard />
          <TeamMemberCard />
          <TeamMemberCard />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-row items-end justify-between">
          <p className="text-sm uppercase font-semibold text-[#777777]">
            Design Team
          </p>
          <p className="text-xs text-[#777777]">View all</p>
        </div>
        <div className="flex flex-row gap-2.5">
          <TeamMemberCard />
          <TeamMemberCard />
          <TeamMemberCard />
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
