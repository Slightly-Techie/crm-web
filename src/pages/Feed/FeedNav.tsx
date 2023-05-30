import React, { useState } from "react";
import { RiUserLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useEndpoints from "../../services/api";
import { useQuery } from "react-query";

function FeedNav() {
  const { getUserProfile } = useEndpoints();
  const { data } = useQuery({
    queryKey: "current-user",
    queryFn: getUserProfile,
  });

  return (
    <div className="w-full bg-[#ffffff53] dark:bg-[#0202022f] backdrop-saturate-200 dark:text-st-gray200 lg:sticky z-50 top-0 h-20 backdrop-blur-sm px-4 py-4 flex justify-between items-start border-b-solid border-b-[#cecece73] border-b-[1px]">
      <section className="p-2 aspect-square bg-secondary dark:bg-st-gray200 my-auto ">
        <p className=" text-st-gray200 dark:text-secondary ">ST</p>
      </section>
      <div className="flex gap-8 items-center px-4">
        <Link
          to={"/techies"}
          className="flex items-center gap-2 border-[1px] border-st-gray200 p-2 rounded-3xl "
        >
          <button>
            <RiUserLine className=" inline-block my-auto" /> Techies
          </button>
        </Link>
        <section className="flex gap-4 items-center px-4 justify-center">
          <h3 className="hidden lg:block">
            Welcome, {data?.data.first_name || "Techie"}
          </h3>
          <div className=" w-12 aspect-square rounded-full overflow-hidden  ">
            <img
              className="w-full h-full object-cover  "
              src={data?.data.profile_pic_url || ""}
              alt="Profile"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default FeedNav;
