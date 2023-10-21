import EditPage from "@/components/admin/add-project/EditPage";
import React from "react";
import PageTitle from "@/components/PageTitle";

const page = () => {
  return (
    <div className=" dark:text-st-surface text-st-surfaceDark">
      <PageTitle title="Create A New Project" />
      <EditPage />
    </div>
  );
};

export default page;
