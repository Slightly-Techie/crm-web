"use client";

import EditPage from "@/components/admin/add-project/EditPage";
import PageTitle from "@/components/PageTitle";
import { ProjectFields } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";

function AddProject() {
  const { postProjects } = useEndpoints().projects;
  const { mutate: CreateNewProject, isLoading } = useMutation<
    unknown,
    unknown,
    ProjectFields
  >(async (data) => {
    const res = await postProjects<ProjectFields>(data);
    return res.data;
  });
  return (
    <div className=" dark:text-st-surface text-st-surfaceDark dark:bg-primary-dark">
      <PageTitle title="Create A New Project" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <EditPage ProjectSubmitHandler={CreateNewProject} />
      )}
    </div>
  );
}

export default AddProject;
