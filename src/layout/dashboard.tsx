import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex relative h-screen">
        <Sidebar isOpen={isOpen} />
        <main className="w-full pb-8 bg-primary overflow-scroll">
          <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="flex justify-center sm:justify-start px-5 gap-4 mt-8 w-[calc(100% - 48px)] max-w-[100%]">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
