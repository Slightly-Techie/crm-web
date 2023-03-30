import React from "react";
import Navbar from "../components/Navbar";
import Recent from "../components/Recent";
import Sidebar from "../components/Sidebar";
import Team from "../components/Team";

function UserList() {
  return (
    <div className="flex relative w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 pb-8 bg-primary">
        <Navbar />
        <div className="flex px-5 gap-4 mt-8">
          <Recent />

          <Team />
        </div>
      </main>
    </div>
  );
}

export default UserList;
