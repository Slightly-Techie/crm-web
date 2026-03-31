"use client";

import EditPage from "@/components/admin/add-project/EditPage";
import PageTitle from "@/components/PageTitle";
import { ProjectFields } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";
import toast from "react-hot-toast";

function AddProject() {
  const { postProjects } = useEndpoints();
  const { mutate: CreateNewProject, isLoading } = useMutation<
    unknown,
    unknown,
    ProjectFields
  >(
    async (data) => {
      const res = await postProjects<ProjectFields>(data);
      return res.data;
    },
    {
      onSuccess: () => {
        toast.success("Project created successfully!");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Failed to create project. Please try again.";
        toast.error(message);
      },
    }
  );
  return (
    <div className="w-full min-h-screen bg-surface-container-lowest">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <EditPage ProjectSubmitHandler={CreateNewProject} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProject;
