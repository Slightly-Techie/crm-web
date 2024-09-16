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

export type Status = "onsubmit" | "success" | "error" | "progress";

let NEW_USER_DATA: Partial<NewUserFields> = INITIAL_USER_DATA;

export default function Signup() {
  const router = useRouter();
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
  } = useNavigateForms();
  const { createNewUser, status, setStatus, errMessage } = usePostNewSignUp();
  const isClosed = true;

  const serializePayload = (payload: Record<string, any>) =>
    Object.keys(payload)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`
      )
      .join("&");

  const onSubmit = async (data: Partial<NewUserFields>) => {
    NEW_USER_DATA = { ...NEW_USER_DATA, ...data };
    if (currentFormIndex === 3) {
      const { years_of_experience, skills } = NEW_USER_DATA;
      const validatedSkills = getSkillsArray(skills);
      NEW_USER_DATA = {
        ...NEW_USER_DATA,
        years_of_experience: Number(years_of_experience),
        // skills: validatedSkills,
      };

      if (NEW_USER_DATA) {
        const {
          stack,
          skills,
          stack_id,
          role_id,
          profile_pic_url,
          ...otherNEW_USER_DATA
        } = NEW_USER_DATA;
        // console.log("Stack>>>", stack);
        const selectedId = Number(stack);
        const selectedStack = Stacks?.data.find(
          (stack) => stack.id === selectedId
        );
        // If a matching stack is found, you can use it
        // if (selectedStack) {
        //   console.log("Selected Stack:", selectedStack);
        // You can now use selectedStack for your payload or any other logic
        const payload = {
          ...otherNEW_USER_DATA,
          // stack: [selectedStack],
          stack_id: 1,
          role_id: 1,
          profile_pic_url: "/profile.png",
        };
        const response = await fetch(
          "https://crm-api.fly.dev/api/v1/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        // createNewUser(payload);
        // } else {
        //   console.log("No matching stack found for the selected ID.");
        // }
      }
      router.push("/login");
      return;
    }
    next();
  };

  return (
    <div className="w-screen dark:bg-[#020202]">
      <div className="grid lg:grid-cols-2 bg-[#fff] dark:bg-[#020202] mx-auto">
        <div className="lg:h-screen lg:block sticky top-0 bg-[#fff] dark:bg-[#020202] lg:bg-[#020202]">
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
          <div className="p-8 w-full md:w-[30rem] lg:w-5/6 mx-auto my-auto flex flex-col gap-4 justify-center h-full">
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
