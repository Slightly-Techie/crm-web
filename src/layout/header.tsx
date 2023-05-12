import React from "react";
import { Colors } from "../constants";

const Header = () => {
  return (
    <div
      className={`flex h-[58px] w-full justify-center text-slate-50 items-center bg-[${Colors.Gray[200]}] text-2xl`}
    >
      Header
    </div>
  );
};

export default Header;
