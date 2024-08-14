import React, { useState, ChangeEvent, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import { IProject, ProjectFields } from "@/types";

interface UpdateProjectModalProps {
  project: IProject;
  isOpen: boolean;
  onClose: () => void;
}

const UpdateProjectModal: React.FC<UpdateProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const { updateProjectById } = useEndpoints();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProjectFields>({
    name: project.name,
    description: project.description,
    project_type: project.project_type as "COMMUNITY" | "PAID",
    project_priority: project.project_priority as
      | "HIGH PRIORITY"
      | "MEDIUM PRIORITY"
      | "LOW PRIORITY",
    project_tools: project.project_tools?.map((tool) => ({
      value: tool,
      imageUrl: "",
    })), // Adjust this according to your actual data structure
    manage_id: 0, // Replace with actual manage_id if available
    stacks: project.stacks?.map((stack) => stack),
    // members: project.members.map((member)=> member
  });

  const { mutate: updateProject, isLoading } = useMutation({
    mutationFn: (projectId: any) => updateProjectById(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects", project.id]);
      onClose();
    },
    onError: (error) => {
      console.error("Error updating project:", error);
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProject(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-2 rounded-lg w-full h-10 pl-2 focus:outline-offset-0 "
            />
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-gray-400">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border-2 rounded-lg w-full pl-2 focus:outline-offset-0 "
            />
          </div>
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-gray-400">Type</label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              className="border-2 rounded-lg w-40 h-10 pl-2 focus:outline-offset-0 "
            >
              <option value="COMMUNITY">Community</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
          <div className="flex flex-col gap-2 mb-10">
            <label className="text-gray-400">Priority</label>
            <select
              name="project_priority"
              value={formData.project_priority}
              onChange={handleChange}
              className="border-2 rounded-lg w-40 h-10 pl-2 focus:outline-offset-0 "
            >
              <option value="HIGH PRIORITY">High Priority</option>
              <option value="MEDIUM PRIORITY">Medium Priority</option>
              <option value="LOW PRIORITY">Low Priority</option>
            </select>
          </div>

          <button
            className="bg-green-500 w-[150px] h-10 rounded-xl text-white font-semibold "
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProjectModal;
