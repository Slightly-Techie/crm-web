"use client";

import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

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
  } = useForm<TaskSubmissionFormData>({ mode: "onSubmit" });

  const submitAssignment = async (data: TaskSubmissionFormData) => {
    console.log("Submitting data:", data); // Log the data being sent
    try {
      const response = await axiosAuth.post(
        `/api/v1/applicant/submission/`,
        data
      );
      console.log("Response:", response); // Log the response
      return response.data;
    } catch (error) {
      console.error("Submission Error:", error);
      throw error; // Re-throw error to be caught by useMutation
    }
  };

  const { mutate } = useMutation(submitAssignment, {
    onSuccess: () => {
      toast.success("Assessment submitted successfully!");
      queryClient.invalidateQueries(["announcements"]);
      setIsRequestSent(false);
    },
    onError: () => {
      toast.error("Failed to submit assessment. Please try again.");
      setIsRequestSent(false);
    },
  });

  const onSubmit: SubmitHandler<TaskSubmissionFormData> = async (data) => {
    setIsRequestSent(true);
    mutate(data); // Trigger mutation with form data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 mb-5">
        <input
          {...register("github_link", { required: true, minLength: 2 })}
          style={{ borderColor: errors.github_link ? "#b92828" : "" }}
          className="border-st-edge dark:border-st-subTextDark bg-transparent rounded-sm border-[1.8px] h-[40px] w-full placeholder:text-[14px] dark:placeholder:text-st-edgeDark placeholder:text-[#5D6675] pl-4 focus:outline-none dark:focus:border-white focus:border-[#3D4450]"
          type="url"
          name="github_link"
          placeholder="Your GitHub submission link"
        />
        {errors.github_link && (
          <p className="text-[#b92828] text-[12px]">
            Field must not be empty and should be at least 2 characters long
          </p>
        )}
      </div>

      <div className="mb-5">
        <input
          {...register("live_demo_url")}
          className="border-st-edge dark:border-st-subTextDark bg-transparent rounded-sm border-[1.8px] h-[40px] w-full placeholder:text-[14px] dark:placeholder:text-st-edgeDark placeholder:text-[#5D6675] pl-4 focus:outline-none dark:focus:border-white focus:border-[#3D4450]"
          type="url"
          name="live_demo_url"
          placeholder="Live demo URL (optional)"
        />
      </div>

      <div className="mb-5">
        <textarea
          {...register("description")}
          className="border-st-edge dark:border-st-subTextDark bg-transparent rounded-sm border-[1.8px] h-[80px] w-full placeholder:text-[14px] dark:placeholder:text-st-edgeDark placeholder:text-[#5D6675] pl-4 focus:outline-none dark:focus:border-white focus:border-[#3D4450] resize-none"
          name="description"
          placeholder="Additional info (optional)"
        />
      </div>

      <button
        className="bg-primary-dark text-primary-light hover:bg-st-cardDark font-monalisa rounded-sm dark:bg-white text-st-bg text-sm dark:text-black hover:dark:bg-st-edge py-2 flex items-center justify-center w-full"
        type="submit"
        disabled={isRequestSent}
      >
        Submit assessment
      </button>
    </form>
  );
}

export default TaskSubmissionForm;
