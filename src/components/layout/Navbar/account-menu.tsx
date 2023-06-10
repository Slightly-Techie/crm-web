import { AxiosResponse } from "axios";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import useMouseOverCallback from "@/hooks/useMouseOverCallback";
import Link from "next/link";
import Image from "next/image";

type AccountMenuProps = {
  items: {
    type: "link" | "button" | "other";
    value?: string;
    link?: string;
    onClick?: () => void;
  }[];
};

const AccountMenu = ({ items }: AccountMenuProps) => {
  const queryClient = useQueryClient();
  const { data: user } = queryClient.getQueryData([
    "userProfile",
  ]) as AxiosResponse;
  const accountMenuRef = useRef(null);
  useMouseOverCallback(accountMenuRef, () => setIsMenuOpen(false));

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div ref={accountMenuRef} className="relative">
      <button onClick={() => setIsMenuOpen((prev) => !prev)}>
        <Image
          className="w-12 h-12 aspect-square shrink-0 rounded-full"
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
      </button>
      {isMenuOpen && (
        <ul className="absolute botton-0 right-0 bg-white dark:bg-[#111111] border border-st-edge dark:border-st-edgeDark w-[160px]">
          {items.map((item, i) => {
            if (item.type === "link") {
              return (
                <Link key={`menu-item-${i}`} href={item.link!}>
                  <li
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 pl-3 border-b border-st-edge dark:border-st-edgeDark hover:bg-primary/40 dark:hover:bg-st-edgeDark"
                  >
                    {item.value}
                  </li>
                </Link>
              );
            } else {
              return (
                <button
                  key={`menu-item-${i}`}
                  className="w-full"
                  onClick={() => {
                    item.onClick!();
                    setIsMenuOpen(false);
                  }}
                >
                  <li
                    key={`menu-item-${i}`}
                    className="flex p-2 pl-3 border-b border-st-edge dark:border-st-edgeDark hover:bg-primary/40 dark:hover:bg-st-edgeDark"
                  >
                    {item.value}
                  </li>
                </button>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
};

export default AccountMenu;
