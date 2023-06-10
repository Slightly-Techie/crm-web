"use client";
import { useState } from "react";
import { useQuery } from "react-query";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import useEndpoints from "@/services";
import { ITechie } from "@/types";
import { action } from "@/redux";
import { useAppDispatch } from "@/hooks";
import AccountMenu from "./account-menu";
import PersonIcon from "@/assets/icons/person-icon.svg";

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
    <div className="w-full bg-st-bg dark:bg-[#0202022f] backdrop-saturate-200 dark:text-st-gray200 lg:sticky z-50 top-0 h-20 backdrop-blur-sm px-8 md:px-16 lg:px-24 xl:px-48 py-4 flex justify-between items-center border-b-solid border-b-[#cecece73] border-b-[1px]">
      <Link href={"/"}>
        <button className="bg-secondary p-2 mx-auto rounded-sm text-white">
          <h1 className="font-bold text-xl">ST</h1>
        </button>
      </Link>
      <div className="flex gap-8 items-center">
        <Link
          href={"/techies"}
          className="flex items-center gap-2 bg-white italic font-light dark:bg-transparent border-[1px] border-st-gray dark:border-st-grayDark hover:border-st-gray p-2 px-4 rounded-3xl duration-150"
        >
          <Image src={PersonIcon} alt="person" />
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
