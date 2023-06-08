"use client";
import Recent from "@/components/techies/Recent";
import Team from "@/components/techies/Team";

export default function TechiesList() {
  return (
    <div className="flex gap-4 w-full h-full">
      <Recent />
      <Team />
    </div>
  );
}
