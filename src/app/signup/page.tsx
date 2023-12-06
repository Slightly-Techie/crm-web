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

export type Status = "onsubmit" | "success" | "error" | "progress";

let NEW_USER_DATA: Partial<NewUserFields> = INITIAL_USER_DATA;

export default function Signup() {
  const {
    handleSubmit,
    next,
    previous,
    resetForm,
    currentForm,
    currentFormIndex,
  } = useNavigateForms();
  const { createNewUser, status, setStatus, errMessage } = usePostNewSignUp();
  const isClosed = true;

  const onSubmit = (data: Partial<NewUserFields>) => {
    NEW_USER_DATA = { ...NEW_USER_DATA, ...data };
    if (currentFormIndex === 3) {
      const { years_of_experience, skills } = NEW_USER_DATA;
      const validatedSkills = getSkillsArray(skills);
      NEW_USER_DATA = {
        ...NEW_USER_DATA,
        stack_id:
          Number(NEW_USER_DATA.stack_id) === -1 ? 1 : NEW_USER_DATA.stack_id,
        years_of_experience: Number(years_of_experience),
        skills: validatedSkills,
      };
      createNewUser(NEW_USER_DATA);
      return;
    }
    next();
  };

  return (
    <div className="w-screen dark:bg-[#020202]">
      <div className="grid lg:grid-cols-2 bg-[#fff] dark:bg-[#020202] mx-auto">
        <div className="h-screen  lg:block sticky top-0 bg-[#fff] dark:bg-[#020202] lg:bg-[#020202]">
          <Image
            src={LeftImage}
            alt=""
            className="hidden lg:block w-full object-cover h-screen "
          />
        </div>

        {isClosed ? (
          <ClosedSignup />
        ) : status !== "progress" ? (
          <SubmitStatus
            status={status}
            message={
              status === "success" ? NEW_USER_DATA.first_name : errMessage
            }
            resetForm={() => {
              resetForm();
              setStatus("progress");
            }}
          />
        ) : (
          <div className="  p-8 w-full md:w-[30rem] lg:w-5/6 mx-auto my-auto flex flex-col gap-4 justify-center h-fit">
            <section className=" text-[#000] dark:text-[#f1f3f7]  text-[1.5rem] font-bold flex items-center gap-4">
              {currentFormIndex !== 0 && (
                <button
                  onClick={previous}
                  type="button"
                  className="px-2 py-2 bg-[#fff] border border-[#333] hover:bg-[#333] dark:bg-[#F1F3F7] dark:hover:bg-[#ffffff] text-[#f1f3f7]  dark:text-[#000] rounded-full"
                >
                  <RiArrowLeftLine />
                </button>
              )}
              <div>
                <h3>Welcome to CRM🎉</h3>
                <p className="text-[#777] text-[20px] font-normal">
                  Create your account
                </p>
              </div>
            </section>
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentForm.element}
              <section className="flex gap-4 mb-8">
                {currentFormIndex <= 3 && (
                  <button className="px-8 py-2 bg-[#001] hover:bg-[#333] dark:bg-[#F1F3F7] dark:hover:bg-[#ffffff] text-[#f1f3f7] dark:text-[#000] rounded-lg w-full">
                    {currentFormIndex === 3 ? "Submit" : "Proceed"}
                  </button>
                )}
              </section>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
