import React from "react";
import ProfileImage from "../assets/icons/bryan.png"

function Navbar() {
  return (
    <div className="w-full  flex items-center justify-between py-6 px-10 border-b border-[#DCDDE1]">
      <div className="p-3">
        <h1 className="font-bold text-xl text-[#3D4450]">Slightly Techie CRM</h1>
      </div>

      <div className="gap-16 flex">
        <button className="nav-btn px-6">Recent Activity</button>
        <button className="nav-btn px-6">Marketplace</button>
        <button className="nav-btn px-6">Scoreboard</button>
      </div>

      <div className="flex items-center gap-4">
        <h2 className="font-bold text-xl text-secondary">Welcome Brian!</h2>
        <img src={ProfileImage} alt="profile image" />
      </div>
    </div>
  );
}

export default Navbar;