"use client";
import Image from "next/image";
import LeftImage from "@/assets/images/Left.png";
import useNavigateForms from "@/hooks/useNavigateForms";
import usePostNewSignUp from "@/hooks/usePostNewSignUp";
import { NewUserFields } from "@/types";
import SubmitStatus from "@/components/signup/pages/SubmitStatus";
import { NEW_USER_DATA as INITIAL_USER_DATA } from "@/constants";
import { getSkillsArray } from "@/utils";
import ClosedSignup from "@/components/signup/pages/ClosedSignup";
import { RiArrowLeftLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getStacks } from "@/services";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export type Status = "onsubmit" | "success" | "error" | "progress";

export default function Signup() {
  const router = useRouter();
  const userDataRef = useRef<Partial<NewUserFields>>({ ...INITIAL_USER_DATA });

  const { data: Stacks } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks(),
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const {
    handleSubmit,
    next,
    previous,
    resetForm,
    currentForm,
    currentFormIndex,
    LAST_FORM_INDEX,
  } = useNavigateForms();
  const { createNewUser, status, setStatus, errMessage } = usePostNewSignUp();
  const isClosed = false;

  const onSubmit = async (data: Partial<NewUserFields>) => {
    userDataRef.current = { ...userDataRef.current, ...data };
    if (currentFormIndex === LAST_FORM_INDEX) {
      const { years_of_experience, skills } = userDataRef.current;
      const validatedSkills = getSkillsArray(skills);
      userDataRef.current = {
        ...userDataRef.current,
        years_of_experience: Number(years_of_experience),
      };

      if (userDataRef.current) {
        const {
          stack,
          custom_stack,
          skills,
          stack_id,
          profile_pic_url,
          ...otherUserData
        } = userDataRef.current;
        const selectedId = Number(stack);
        const selectedStack = Stacks?.data.find(
          (stack) => stack.id === selectedId
        );

        const payload = {
          ...otherUserData,
          stack_id: selectedId,
        };
        createNewUser(payload);
      }
      return;
    }
    next();
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      {isClosed ? (
        <ClosedSignup />
      ) : status !== "progress" ? (
        <SubmitStatus
          status={status}
          message={
            status === "success" ? userDataRef.current.first_name : errMessage
          }
          resetForm={() => {
            resetForm();
            userDataRef.current = { ...INITIAL_USER_DATA };
            setStatus("progress");
          }}
        />
      ) : (
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Side - Image */}
          <div className="lg:h-screen lg:block sticky top-0 bg-white lg:bg-surface-dark">
            <Image
              src={LeftImage}
              alt="Collaborative workspace"
              className="hidden lg:block w-full object-cover h-screen"
            />
          </div>

          {/* Right Panel - Signup Form */}
          <div className="w-full min-h-screen flex items-center justify-center p-6 sm:p-12 bg-white">
            <div className="w-full max-w-md space-y-6 mx-auto">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-on-surface">ST Network</span>
              </div>

              {/* Header with Progress */}
              <div className="text-center lg:text-left">
                {currentFormIndex !== 0 && (
                  <button
                    onClick={previous}
                    type="button"
                    className="mb-4 inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <RiArrowLeftLine className="text-xl" />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                )}
                <h2 className="font-display font-bold text-3xl text-on-surface mb-2">
                  Welcome to ST Network 🎉
                </h2>
                <p className="text-on-surface-variant text-base mb-4">
                  {currentForm.category} - Step {currentFormIndex + 1} of 3
                </p>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-300"
                    style={{ width: `${((currentFormIndex + 1) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {currentForm.element}

                {/* Submit Button */}
                {currentFormIndex <= LAST_FORM_INDEX && (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    {currentFormIndex === LAST_FORM_INDEX ? "Create account" : "Continue"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </form>

              {/* Sign In Link */}
              <p className="text-center text-sm text-on-surface-variant pt-4">
                Already have an account?
                <a href="/login" className="font-semibold text-primary hover:text-primary-container transition-colors ml-1">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
