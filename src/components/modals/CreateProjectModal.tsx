"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useEndpoints from "@/services";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";

interface ProjectFormData {
  name: string;
  description: string;
  project_type: "PAID" | "COMMUNITY";
  project_priority: "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGH PRIORITY";
  manager_id: number;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const { getUserProfile, postProjects } = useEndpoints();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      project_type: "COMMUNITY",
      project_priority: "MEDIUM PRIORITY",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProjectFormData) =>
      postProjects({ ...data, manager_id: userProfile?.id ?? data.manager_id }),
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      reset();
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to create project.");
      toast.error(message);
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: ProjectFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest dark:bg-surface-dim rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">
              Create Project
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Start a new project and bring your ideas to life
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={mutation.status === 'loading'}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Project Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name"
              {...register("name", {
                required: "Project name is required",
                minLength: {
                  value: 3,
                  message: "Project name must be at least 3 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Description
            </label>
            <textarea
              placeholder="Describe your project"
              rows={4}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />
            {errors.description && (
              <p className="text-xs text-error">{errors.description.message}</p>
            )}
          </div>

          {/* Project Type Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Project Type
            </label>
            <select
              {...register("project_type", {
                required: "Project type is required",
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="COMMUNITY">Community Project</option>
              <option value="PAID">Paid Project</option>
            </select>
            {errors.project_type && (
              <p className="text-xs text-error">{errors.project_type.message}</p>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-body font-medium text-on-surface">
              Priority
            </label>
            <select
              {...register("project_priority", {
                required: "Priority is required",
              })}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <option value="LOW PRIORITY">Low</option>
              <option value="MEDIUM PRIORITY">Medium</option>
              <option value="HIGH PRIORITY">High</option>
            </select>
            {errors.project_priority && (
              <p className="text-xs text-error">{errors.project_priority.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container transition-colors font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-body font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.status === 'loading' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
