"use client";
import Recent from "@/components/techies/Recent";
import Team from "@/components/techies/Team";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function TechiesList() {
  return (
    <div className="flex gap-4 w-full h-full p-8">
      <Recent />
      <Team />
    </div>
  );
}
