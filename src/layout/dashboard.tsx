import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <main className="w-full pb-8 bg-primary dark:bg-[#111111] h-screen overflow-clip">
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
        <div className="flex justify-center sm:justify-start p-8 w-full h-[calc(100vh-80px)] overflow-y-scroll">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
