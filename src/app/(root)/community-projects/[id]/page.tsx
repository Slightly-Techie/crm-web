"use client";
import PageTitle from "@/components/PageTitle";
import StatusCheck from "@/components/projects/StatusCheck";
import useEndpoints from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import UpdateProjectModal from "@/components/admin/add-project/Modal";
import Member from "@/components/techies/Member"; // Import the Member component
import { IProject, IStack, ITechie } from "@/types";

const ProjectDetail = ({ params }: any) => {
  const [isAdmin] = useState<boolean>(true);

  const { id } = params; // Extract the project ID from params
  const { getProjectById, deleteProjectById, updateProjectById } =
    useEndpoints();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false); // State to manage modal visibility

  const {
    data: Project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const { mutate: deleteProject, isLoading: isDeleting } = useMutation({
    mutationFn: (projectId: string) => deleteProjectById(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      router.push("/community-projects");
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
    },
  });

  // const { mutate: updateProject, isLoading: isUpdating } = useMutation({
  //   mutationFn: (projectId: string) => updateProjectById(projectId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["projects", id]);
  //     alert("Project updated successfully!");
  //   },
  //   onError: (error) => {
  //     console.error("Error updating project:", error);
  //   },
  // });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Data Failed to load</div>;
  }

  const project = Project?.data;

  const stack = project.project_tools;
  console.log("Project", project);
  console.log("stack", stack);

  // const generateImageUrl = (toolName: string) => {
  //   return `https://cdn.simpleicons.org/${toolName.toLowerCase()}`; // Adjust the color as needed
  // };

  // const projectToolsWithImages: any = project.project_tools?.map(
  //   (tool: string) => ({
  //     value: tool,
  //     imageUrl:
  //   })
  // );

  if (!project) {
    return <div>Project not found</div>;
  }

  // Safeguard against invalid date
  const formattedDate = project.created_at
    ? format(new Date(project.created_at), "MM/dd/yyyy")
    : "Unknown Date";

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleUpdate = () => {
    setModalOpen(true);
  };

  return (
    <main className="w-full">
      <PageTitle title={`${project.name} Project`} />
      <section className=" pt-[7vh] p-5 lg:mr-20">
        <div className="justify-center border dark:border-gray-700 rounded-lg p-5 dark:bg-[#121212] mt-10 md:mx-[231px] w-full">
          <h2 className="text-2xl font-bold mb-4">Project Details</h2>

          <p className="flex flex-col mb-2 gap-2 ">
            <strong className="text-gray-400">ABOUT</strong>
            {project.description}
          </p>
          <p className="mb-2 flex flex-col gap-2">
            <strong className="text-gray-400">PROJECT STATUS </strong>
            <StatusCheck status="IN PROGRESS" />
          </p>
          <div className="flex flex-col gap-2 mb-5">
            <p className="mb-2 text-gray-400">PROJEC TYPE & PRIORITY</p>
            <div className="flex gap-2">
              <StatusCheck project_type={project.project_type} />
              <StatusCheck priority={project.project_priority} />
            </div>
          </div>
          <div className=" flex flex-col gap-5 mb-5">
            <h3 className="text-gray-400 font-bold">PROJECT TOOLS</h3>
            <div className="flex gap-5">
              {stack.map((tool: any) => (
                <div
                  key={tool.id}
                  className="flex flex-rows items-center gap-2"
                >
                  <img
                    src={tool.imageUrl}
                    alt={tool.name}
                    className="w-6 h-6"
                  />
                  {/* <span>{tool.value}</span> */}
                </div>
              ))}
            </div>
          </div>
          <div className=" flex flex-col gap-5 mb-5">
            <h3 className="text-gray-400 font-bold">STACKS</h3>
            <div className="flex gap-5">
              {project.stacks.map((stack: IStack) => (
                <p className="bg-green-400 w-[120px] text-center rounded-full font-bold">
                  {stack.name}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap5 w-full">
            <h3 className="font-extrabold text-lg my-10">Team</h3>
            <div className="grid grid-cols-3 justify-between gap-3">
              {project.members.map((member: ITechie) => (
                <Member key={member.id} data={member} />
              ))}
            </div>
          </div>

          {/* Add more fields as needed */}
        </div>
        <div className="flex gap-5">
          <Link
            className=" flex items-center justify-center border-2 bg-blue-500 rounded-lg text-white w-20 h-10 mt-10"
            href="/community-projects"
          >
            Back
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className=" flex items-center justify-center border-2 bg-red-500 rounded-lg text-white w-20 h-10 mt-10"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          {/* <button
            onClick={handleUpdate}
            className=" flex items-center justify-center border-2 bg-green-500 rounded-lg text-white w-20 h-10 mt-10"
          >
            Update
          </button> */}
        </div>
      </section>
      {/* <UpdateProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      /> */}
    </main>
  );
};

export default ProjectDetail;
