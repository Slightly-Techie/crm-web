import { useState } from "react";
import useEndpoints from "../services/api";
import { NavbarProps, userProfile } from "../types/type";
import { useQuery } from "react-query";
import HamburgerIcon from "../assets/icons/menu.png";
import CloseIcon from "../assets/icons/close.png";
import AccountMenu from "./account-menu";
import useLogout from "../useHooks/useLogout";

function Navbar({ setIsOpen, isOpen }: NavbarProps) {
  const logout = useLogout();
  const { getUserProfile } = useEndpoints();
  const [user, setUser] = useState<undefined | userProfile>();
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess(res) {
      setUser(res.data);
    },
  });

  return (
    <div className="w-full gap-2 sticky top-0 bg-white sm:bg-primary sm:static flex items-center justify-between py-2 lg:py-6 px-[19px] sm:px-[16px] border-b border-[#DCDDE1]">
      <div>
        <h1 className="font-bold w-[120px] lg:w-full text-lg sm:text-xl text-[#3D4450]">
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
            <h2 className="flex justify-end shrink-0 font-bold text-lg w-[100px] lg:w-[220px] sm:text-xl text-secondary">
              Welcome {user && user.first_name}!
            </h2>
            <AccountMenu
              items={[
                {
                  type: "link",
                  link: "/profile",
                  value: "Profile",
                },
                {
                  type: "button",
                  value: "Logout",
                  onClick() {
                    logout();
                  },
                },
              ]}
            />
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
