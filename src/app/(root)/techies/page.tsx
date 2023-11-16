"use client";
import dynamic from "next/dynamic";
const Team = dynamic(() => import("@/components/techies/Team"), { ssr: false });

export default function TechiesList() {
  return (
    <div className="w-full h-full">
      <Team />
    </div>
  );
}
