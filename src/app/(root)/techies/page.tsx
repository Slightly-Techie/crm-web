"use client";
import dynamic from "next/dynamic";
const Recent = dynamic(() => import("@/components/techies/Recent"));
const Team = dynamic(() => import("@/components/techies/Team"), { ssr: false });

export default function TechiesList() {
  return (
    <div className="flex gap-4 w-full h-full p-8">
      <Recent />
      <Team />
    </div>
  );
}
