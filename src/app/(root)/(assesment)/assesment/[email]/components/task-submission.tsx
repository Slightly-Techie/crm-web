"use client";

import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

interface TaskSubmissionFormData {
  github_link: string;
  live_demo_url?: string;
  description?: string;
}

function TaskSubmissionForm() {
  const [isRequestSent, setIsRequestSent] = useState(false);
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskSubmissionFormData>({ mode: "onSubmit" });

  const submitAssignment = async (data: TaskSubmissionFormData) => {
    try {
      const response = await axiosAuth.post(
        `/api/v1/applicant/submission/`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const { mutate } = useMutation(submitAssignment, {
    onSuccess: () => {
      toast.success("Assessment submitted successfully! Our team will review your submission.");
      queryClient.invalidateQueries({ queryKey: ["tasksubmission"] });
      reset();
      setIsRequestSent(false);

      setTimeout(async () => {
        await signOut({ redirect: true, callbackUrl: "/login" });
      }, 2000);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to submit assessment. Please try again.";
      toast.error(message, { duration: 6000 });
      setIsRequestSent(false);
    },
  });

  const onSubmit: SubmitHandler<TaskSubmissionFormData> = async (data) => {
    setIsRequestSent(true);
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="github_link" className="block text-sm font-semibold text-on-surface mb-2">
          GitHub Repository URL <span className="text-error">*</span>
        </label>
        <input
          {...register("github_link", { required: true, minLength: 2 })}
          id="github_link"
          type="url"
          placeholder="https://github.com/username/repository"
          className={`w-full px-4 py-3 bg-surface-container border rounded-lg focus:outline-none focus:ring-2 text-on-surface placeholder:text-on-surface-variant transition-all ${
            errors.github_link
              ? "border-error focus:ring-error"
              : "border-outline focus:ring-primary focus:border-transparent"
          }`}
        />
        {errors.github_link && (
          <p className="text-error text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            Please enter a valid GitHub repository URL
          </p>
        )}
      </div>

      <div>
        <label htmlFor="live_demo_url" className="block text-sm font-semibold text-on-surface mb-2">
          Live Demo URL (Optional)
        </label>
        <input
          {...register("live_demo_url")}
          id="live_demo_url"
          type="url"
          placeholder="https://your-demo.netlify.app"
          className="w-full px-4 py-3 bg-surface-container border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-on-surface mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={4}
          placeholder="Any additional information about your submission..."
          className="w-full px-4 py-3 bg-surface-container border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isRequestSent}
        className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isRequestSent ? (
          <>
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Submitting...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">send</span>
            Submit Assessment
          </>
        )}
      </button>
    </form>
  );
}

export default TaskSubmissionForm;
