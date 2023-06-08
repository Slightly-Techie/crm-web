"use client";
import { useState } from "react";
import useEndpoints from "@/services";
import { ITechie } from "@/types";
import { useQuery } from "react-query";
import { RiUserLine } from "react-icons/ri";
import AccountMenu from "./account-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/hooks";
import { action } from "@/redux";

function Navbar() {
  const { getUserProfile } = useEndpoints();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<undefined | ITechie>();
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess({ data }) {
      setUser(data);
      dispatch(action.auth.setUser(data));
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full bg-[#F5F5F5] dark:bg-[#0202022f] backdrop-saturate-200 dark:text-st-gray200 lg:sticky z-50 top-0 h-20 backdrop-blur-sm px-8 md:px-16 lg:px-24 xl:px-48 py-4 flex justify-between items-start border-b-solid border-b-[#cecece73] border-b-[1px]">
      <Link href={"/"}>
        <button className="bg-secondary p-2 mx-auto rounded-sm text-white">
          <h1 className="font-bold text-xl">ST</h1>
        </button>
      </Link>
      <div className="flex gap-8 items-center">
        <Link
          href={"/techies"}
          className="flex items-center gap-2 bg-white dark:bg-transparent border-[1px] border-st-gray200 p-2 rounded-3xl "
        >
          <RiUserLine className=" inline-block my-auto" />
          Techies
        </Link>
        <section className="flex gap-4 items-center justify-center">
          <div className="flex items-center justify-end gap-2 sm:gap-4 lg:w-[300px]">
            {query.isSuccess && (
              <>
                <h2 className="flex justify-end shrink-0 dark:text-primary font-bold text-lg w-[100px] lg:w-[220px] sm:text-xl text-secondary">
                  Welcome {user && user.first_name}!
                </h2>
                <AccountMenu
                  items={[
                    {
                      type: "link",
                      link: "/techie/me",
                      value: "Profile",
                    },
                    {
                      type: "button",
                      value: "Logout",
                      onClick() {
                        signOut();
                      },
                    },
                  ]}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Navbar;
