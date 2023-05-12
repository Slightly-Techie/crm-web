import { AxiosResponse } from "axios";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import useMouseOverCallback from "../hooks/useMouseOverCallback";

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
        <img
          className="w-12 h-12 aspect-square shrink-0 rounded-full"
          src={
            user?.profile_pic_url
              ? user?.profile_pic_url
              : `https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`
          }
          alt="profile"
        />
      </button>
      {isMenuOpen && (
        <ul className="absolute botton-0 right-0 bg-white border border-st-gray200 w-[160px]">
          {items.map((item, i) => {
            if (item.type === "link") {
              return (
                <Link key={`menu-item-${i}`} to={item.link!}>
                  <li
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 pl-3 border-b border-st-gray200 hover:bg-primary/40"
                  >
                    {item.value}
                  </li>
                </Link>
              );
            } else {
              return (
                <button
                  className="w-full"
                  onClick={() => {
                    item.onClick!();
                    setIsMenuOpen(false);
                  }}
                >
                  <li
                    key={`menu-item-${i}`}
                    className="flex p-2 pl-3 border-b border-st-gray200 hover:bg-primary/40"
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
