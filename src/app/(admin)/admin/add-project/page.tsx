"use client";

import EditPage from "@/components/admin/add-project/EditPage";
import PageTitle from "@/components/PageTitle";
import { ProjectFields } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";

function AddProject() {
  const { postProjects } = useEndpoints();
  const { mutate: CreateNewProject, isLoading } = useMutation<
    unknown,
    unknown,
    ProjectFields
  >(async (data) => {
    const res = await postProjects<ProjectFields>(data);
    return res.data;
  });
  return (
    <div className=" dark:text-st-surface text-st-surfaceDark dark:bg-primary-dark mt-[100px]">
      <PageTitle title="Create A New Project" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className=" lg:ml-[300px] justify-center">
          <EditPage ProjectSubmitHandler={CreateNewProject} />
        </div>
      )}
    </div>
  );
}

export default AddProject;
