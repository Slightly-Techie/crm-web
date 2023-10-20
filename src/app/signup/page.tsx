"use client";
import Image from "next/image";
import Stars from "@/assets/icons/Stars.png";
import Rocket from "@/assets/icons/blue-rocket.png";
import useNavigateForms from "@/hooks/useNavigateForms";
import usePostNewSignUp from "@/hooks/usePostNewSignUp";
import { NewUserFields } from "@/types";
import SubmitStatus from "@/components/signup/pages/SubmitStatus";
import { NEW_USER_DATA as INITIAL_USER_DATA } from "@/constants";
import ClosedSignup from "@/components/signup/pages/ClosedSignup";

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
      const { years_of_experience } = NEW_USER_DATA;
      NEW_USER_DATA = {
        ...NEW_USER_DATA,
        stack_id:
          Number(NEW_USER_DATA.stack_id) === -1 ? 1 : NEW_USER_DATA.stack_id,
        years_of_experience: Number(years_of_experience),
      };
      createNewUser(NEW_USER_DATA);
    }
    next();
  };

  return (
    <div className="w-full bg-st-bg dark:bg-[#111111] overflow-x-hidden">
      <div className="w-screen h-screen grid lg:grid-cols-2 bg-[#fff] dark:bg-[#111111] mx-auto">
        <>
          <div className="new-sign-upbg  lg:block  ">
            <div className="flex flex-col gap-4 justify-center p-0 lg:p-8 w-4/5 mx-auto  h-full">
              <Image
                src={Stars}
                className="hidden lg:block w-36 object-contain h-8 "
                alt="stars"
              />
              <h1 className=" text-[2rem] text-center lg:text-left md:text-[3.5rem] text-white font-bold ">
                Welcome to{" "}
                <span className="text-[#ffffffd8]">
                  Slightly Techie Network
                </span>
              </h1>
              <Image
                className=" hidden lg:block aspect-square w-20 object-contain "
                src={Rocket}
                alt="rocket"
              />
            </div>
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
            <div className=" p-8 w-full md:w-[30rem] lg:w-5/6 mx-auto my-auto flex flex-col gap-4 justify-center h-fit">
              <section className="flex text-[#000] dark:text-[#f1f3f7]  mx-auto text-[1.5rem] font-medium justify-between">
                <h3>{currentForm.category}</h3>
              </section>
              <form onSubmit={handleSubmit(onSubmit)}>
                {currentForm.element}
                <section className="flex gap-4 justify-end">
                  {currentFormIndex !== 0 && (
                    <button
                      onClick={previous}
                      type="button"
                      className=" px-8 py-2 bg-[#001] hover:bg-[#333] dark:bg-[#F1F3F7] dark:hover:bg-[#ffffff] text-[#f1f3f7]  dark:text-[#000] rounded-sm"
                    >
                      Back
                    </button>
                  )}
                  {currentFormIndex <= 3 && (
                    <button className="px-8 py-2 bg-[#001] hover:bg-[#333] dark:bg-[#F1F3F7] dark:hover:bg-[#ffffff] text-[#f1f3f7] dark:text-[#000] rounded-sm">
                      {currentFormIndex === 3 ? "Submit" : "Next"}
                    </button>
                  )}
                </section>
              </form>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
