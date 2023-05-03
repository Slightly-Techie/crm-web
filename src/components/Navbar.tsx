import { useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../services/api";
import { NavbarProps, userProfile } from "../types/type";
import { useQuery } from "react-query";
import HamburgerIcon from "../assets/icons/menu.png";
import CloseIcon from "../assets/icons/close.png";

function Navbar({ setIsOpen, isOpen }: NavbarProps) {
  const [user, setUser] = useState<undefined | userProfile>();
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess(res) {
      setUser(res.data);
    },
  });

  return (
    <div className="w-full gap-4 sticky top-0 bg-white sm:bg-primary sm:static flex items-center justify-between py-6 px-[14px] sm:px-[16px] border-b border-[#DCDDE1]">
      <div className="p-3">
        <h1 className="font-bold w-[63px] lg:w-full text-lg sm:text-xl text-[#3D4450]">
          Slightly Techie CRM
        </h1>
      </div>

      <div className="sm:gap-4 xl:gap-16 hidden sm:flex">
        <button className="nav-btn sm:px-3 lg:px-6">Recent Activity</button>
        <button className="nav-btn sm:px-3 lg:px-6">Marketplace</button>
        <button className="nav-btn sm:px-3 lg:px-6">Scoreboard</button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:w-[300px]">
        {query.isSuccess && (
          <>
            <h2 className="font-bold text-lg w-[100px] lg:w-[220px] sm:text-xl text-secondary inline-block">
              Welcome {user && user.first_name}!
            </h2>
            <Link to={"/profile"}>
              <img
                className="w-12 h-12 rounded-full"
                src={
                  user?.profile_pic_url
                    ? user?.profile_pic_url
                    : `https://avatars.dicebear.com/api/initials/${user?.first_name} ${user?.last_name}.svg`
                }
                alt="profile"
              />
            </Link>
          </>
        )}
      </div>
      <div className="flex sm:hidden" onClick={() => setIsOpen?.(!isOpen)}>
        <img
          src={isOpen ? CloseIcon : HamburgerIcon}
          alt=""
          className="w-[30px]"
        />
      </div>
    </div>
  );
}

export default Navbar;
