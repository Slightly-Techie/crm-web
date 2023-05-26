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
        <main className="w-full pb-8 bg-primary h-screen overflow-clip">
          <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="flex justify-center sm:justify-start p-8 w-[calc(100vw-80px)] h-[calc(100vh-104px)] overflow-y-scroll">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
