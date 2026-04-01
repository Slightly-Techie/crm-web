"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useEndpoints from "@/services";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface ProjectFormData {
  name: string;
  description: string;
  project_type: "PAID" | "COMMUNITY";
  project_priority: "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGH PRIORITY";
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    name: string;
    description: string;
    project_type: string;
    project_priority: string;
  } | null;
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const normalizeProjectPriority = (value: string): ProjectFormData["project_priority"] => {
    if (value === "HIGH" || value === "HIGH PRIORITY") return "HIGH PRIORITY";
    if (value === "LOW" || value === "LOW PRIORITY") return "LOW PRIORITY";
    return "MEDIUM PRIORITY";
  };

  const { updateProjectById } = useEndpoints();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>();

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        project_type: project.project_type as "PAID" | "COMMUNITY",
        project_priority: normalizeProjectPriority(project.project_priority),
      });
    }
  }, [project, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      updateProjectById(project!.id, {
        ...data,
        project_priority: normalizeProjectPriority(data.project_priority),
      }),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update project.");
      toast.error(message);
    },
  });

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Edit Project</h2>
            <p className="text-sm text-on-surface-variant mt-1">Update project details</p>
          </div>
          <button
            onClick={onClose}
            disabled={mutation.status === "loading"}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Project Name</label>
            <input
              type="text"
              {...register("name", { required: "Project name is required", minLength: { value: 3, message: "At least 3 characters" } })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Description</label>
            <textarea
              rows={4}
              {...register("description", { required: "Description is required", minLength: { value: 10, message: "At least 10 characters" } })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Project Type</label>
            <select
              {...register("project_type", { required: true })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="COMMUNITY">Community Project</option>
              <option value="PAID">Paid Project</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface">Priority</label>
            <select
              {...register("project_priority", { required: true })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="LOW PRIORITY">Low</option>
              <option value="MEDIUM PRIORITY">Medium</option>
              <option value="HIGH PRIORITY">High</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.status === "loading"}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.status === "loading"}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {mutation.status === "loading" ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
