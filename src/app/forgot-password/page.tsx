"use client";

"use client";
import Image from "next/image";
import Stars from "@/assets/icons/Stars.png";
import Rocket from "@/assets/icons/blue-rocket.png";
import { REGEXVALIDATION } from "@/constants";
import { useForm } from "react-hook-form";

export type Status = "onsubmit" | "success" | "error" | "progress";

export default function ForgotPassword() {
  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });
  return (
    <div className="w-full bg-st-bg dark:bg-primary-dark overflow-x-hidden">
      <div className="w-screen h-screen grid lg:grid-cols-2 bg-[#fff] dark:bg-black mx-auto">
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
          <div className=" p-8 w-full md:w-[30rem] lg:w-5/6 mx-auto my-auto flex flex-col gap-4 justify-center h-fit">
            <section className="text-[#000] dark:text-[#f1f3f7] justify-between">
              <h3 className=" font-medium text-2xl">Forgot Password?</h3>
              <p className=" text-white/40">
                Don&apos;t worry, it happens to even the best of us 👌
              </p>
            </section>
            <form>
              <div className=" my-4">
                <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
                  Enter your email
                </label>
                <input
                  {...register("skills", {
                    required: "This field must be specified",
                    pattern: REGEXVALIDATION.email,
                  })}
                  className="w-full border mt-2 px-2 text-[#000] dark:text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
                  type="email"
                  placeholder="susanataibs@email.com"
                />
                {errors.skills && (
                  <small>
                    Valid technologies or languages must be provided and they
                    must be separated by a comma
                  </small>
                )}
              </div>
              <button className="w-full flex items-center justify-center font-bold p-2 dark:hover:bg-st-subTextDark hover:bg-st-text/30 dark:bg-primary-light bg-primary-dark duration-100 rounded-md dark:text-st-surfaceDark text-st-surface">
                Proceed
              </button>
            </form>
          </div>
        </>
      </div>
    </div>
  );
}
