import EditPage from "@/components/admin/add-project/EditPage";
import Sidebar from "@/components/admin/add-project/Sidebar";
import React from "react";

const page = () => {
  return (
    <div className="flex">
      <Sidebar />
      <EditPage />
    </div>
  );
};

export default page;
