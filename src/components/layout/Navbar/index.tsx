"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import useEndpoints from "@/services";
import { ITechie } from "@/types";
import { action } from "@/redux";
import { useAppDispatch } from "@/hooks";
import { AiOutlineMenu } from "react-icons/ai";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineBell,
  AiOutlineHome,
  AiOutlineHourglass,
} from "react-icons/ai";
import { BsBarChart, BsChatLeft } from "react-icons/bs";
import { GoSignOut } from "react-icons/go";
import { FiTarget } from "react-icons/fi";
// import { LuPuzzle } from "react-icons/lu";
import DropDown from "@/components/DropDown";
import ThemeSwitcher from "@/components/theme/theme";
import { signOut } from "next-auth/react";

const Navlinks = [
  {
    title: "DASHBOARD",
    links: [
      {
        id: "d1",
        name: "Overview",
        link: "/",
        icon: <AiOutlineHome size={20} />,
      },
      {
        id: "d2",
        name: "Applicants",
        link: "/admin/applicants",
        icon: <AiOutlineHourglass size={20} />,
      },
      {
        id: "d3",
        name: "Feed",
        link: "/",
        icon: <BsChatLeft size={20} />,
      },
    ],
  },
  {
    title: "COMMUNITY",
    links: [
      {
        id: "c1",
        name: "Techies",
        link: "/techies",
        icon: <AiOutlineUser size={20} />,
      },
      {
        id: "c2",
        name: "Leaderboard",
        link: "/leaderboard",
        icon: <BsBarChart size={20} />,
      },
      {
        id: "c3",
        name: "Announcements",
        link: "/announcements",
        icon: <AiOutlineBell size={20} />,
      },
      {
        id: "c4",
        name: "Community Projects",
        link: "/community-projects",
        icon: <FiTarget size={20} />,
      },
      // {
      //   id: "c5",
      //   name: "Marketplace",
      //   link: "/marketplace",
      //   icon: <BsCart2 size={20} />,
      // },
      // {
      //   id: "c6",
      //   name: "Points System",
      //   link: "/points-system",
      //   icon: <LuPuzzle size={20} />,
      // },
    ],
  },
];

function Navbar() {
  const { getUserProfile } = useEndpoints();
  const dispatch = useAppDispatch();
  const [navToggle, setNavToggle] = useState<boolean>(false);
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
    <header>
      <nav className="hidden lg:block lg:w-[25vw] xl:w-[20vw] h-screen p-4 fixed top-0 left-0 z-[50] border-r border-r-neutral-700 dark:bg-primary-dark">
        <section className="flex flex-col justify-between items-center h-full">
          {/* Top Section */}
          <section className="w-full">
            <Link href={"/"}>
              <button className="bg-gray-600 p-2 mx-auto rounded-sm text-white">
                <h1 className="font-bold text-lg">ST</h1>
              </button>
            </Link>
            <section>
              {Navlinks.map((link) => {
                return (
                  <section key={link.title} className="my-5">
                    <p className="text-complementary font-bold text-sm mb-3">
                      {link.title}
                    </p>
                    <section className="flex flex-col gap-y-5">
                      {link.links.map((item) => {
                        return (
                          <Link href={item.link} key={item.id}>
                            <section className="flex items-center gap-3">
                              {item.icon}
                              <p className=" text-sm">{item.name}</p>
                            </section>
                          </Link>
                        );
                      })}
                    </section>
                  </section>
                );
              })}
              <ThemeSwitcher />
            </section>
          </section>
          {/* Bottom Section */}
          <section className="w-full">
            <DropDown
              MenuButtonContent={
                <section className="flex gap-3 items-center mb-5">
                  <Image
                    className="w-10 h-10 aspect-square shrink-0 rounded-full"
                    width={48}
                    height={48}
                    src={
                      user?.profile_pic_url
                        ? user?.profile_pic_url
                        : `https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`
                    }
                    alt="profile"
                    placeholder="blur"
                    blurDataURL={`https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`}
                    priority={true}
                  />
                  <section>
                    <p className="font-semibold text-sm">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-complementary text-sm">{user?.email}</p>
                  </section>
                </section>
              }
              MenuItemsContent={
                <section className="text-black dark:text-white flex flex-col justify-center gap-5 p-2">
                  <section className="flex items-center gap-3">
                    <AiOutlineSetting size={20} />
                    <p className="font-bold text-sm">Settings</p>
                  </section>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3"
                  >
                    <GoSignOut size={20} />
                    <p className="font-bold text-sm">Log Out</p>
                  </button>
                </section>
              }
            />
          </section>
        </section>
      </nav>
      {/* Navbar- Mobile */}
      <section className="block lg:hidden fixed top-0 left-0 z-50 w-full bg-white dark:bg-primary-dark h-[7vh]">
        <section className="flex justify-between items-center p-5 w-full h-full">
          <Link href={"/"}>
            <button className="bg-gray-600 p-1 mx-auto rounded-sm text-white">
              <h1 className="font-bold text-xs">ST</h1>
            </button>
          </Link>
          <section
            className="border p-1 rounded"
            onClick={() => setNavToggle(!navToggle)}
          >
            <AiOutlineMenu size={15} />
          </section>
        </section>
      </section>
      {/* Mobile Nav Toggle */}
      <section
        className={
          navToggle
            ? "fixed z-[50] mt-[7vh] ease duration-500 h-[93vh] top-0 left-0 w-screen bg-white dark:bg-primary-dark p-5"
            : "fixed z-[50] mt-[7vh] ease duration-500 h-[93vh] top-0 left-[-100vw] w-screen bg-white dark:bg-primary-dark p-5"
        }
      >
        <section className="flex flex-col justify-between h-full">
          {/* Top Section */}
          <section>
            {Navlinks.map((link) => {
              return (
                <section key={link.title} className="my-5">
                  <p className="text-complementary font-bold text-sm mb-3">
                    {link.title}
                  </p>
                  <section className="flex flex-col gap-y-5">
                    {link.links.map((item) => {
                      return (
                        <Link href={item.link} key={item.id}>
                          <section className="flex items-center gap-3">
                            {item.icon}
                            <p className=" text-sm">{item.name}</p>
                          </section>
                        </Link>
                      );
                    })}
                  </section>
                </section>
              );
            })}
          </section>
          {/* Bottom Section */}
          <section className="w-full">
            <DropDown
              MenuButtonContent={
                <section className="flex gap-3 items-center mb-5">
                  <Image
                    className="w-10 h-10 aspect-square shrink-0 rounded-full"
                    width={48}
                    height={48}
                    src={
                      user?.profile_pic_url
                        ? user?.profile_pic_url
                        : `https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`
                    }
                    alt="profile"
                    placeholder="blur"
                    blurDataURL={`https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`}
                    priority={true}
                  />
                  <section>
                    <p className="font-semibold text-sm">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-complementary text-sm">{user?.email}</p>
                  </section>
                </section>
              }
              MenuItemsContent={
                <section className="text-black dark:text-white flex flex-col justify-center gap-5 p-2">
                  <section className="flex items-center gap-3">
                    <AiOutlineSetting size={20} />
                    <p className="font-bold text-sm">Settings</p>
                  </section>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <GoSignOut size={20} />
                    Log Out
                  </button>
                </section>
              }
            />
          </section>
        </section>
      </section>
    </header>
  );
}

export default Navbar;
