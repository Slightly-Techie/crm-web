import EditPage from "@/components/admin/add-project/EditPage";
import React from "react";

const page = () => {
  return (
    <div className=" dark:text-st-surface text-st-surfaceDark">
      <section className="border-b border-b-neutral-700 sticky top-0 bg-primary-light dark:bg-[#141414] w-full p-5">
        <p className="lg:text-xl font-bold">Create A New Project</p>
      </section>
      <EditPage />
    </div>
  );
};

export default page;
