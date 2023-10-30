"use client";

import { REGEXVALIDATION } from "@/constants";
import { useForm } from "react-hook-form";

type ForgotPasswordField = {
  email: string;
};

export default function ForgotPassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordField>({ mode: "onSubmit" });
  const onSubmit = async (data: ForgotPasswordField) => {};

  return (
    <>
      <section className="text-[#000] dark:text-[#f1f3f7] justify-between">
        <h3 className=" font-medium text-2xl">Forgot Password?🤯</h3>
        <p className=" text-white/40 font-light">
          Not a problem! It happens to the best of us👌
        </p>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" my-4">
          <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
            Enter your email
          </label>
          <p className=" dark:text-white/40 text-sm">
            We will send you an email with instructions on how to reset your
            password.
          </p>
          <input
            {...register("email", {
              required: true,
              pattern: REGEXVALIDATION.email,
            })}
            className="w-full border mt-2 px-2 text-[#000] dark:text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
            type="email"
            placeholder="susanataibs@email.com"
          />
          {errors.email && <small>Email must be valid</small>}
        </div>
        <button className="w-full flex items-center justify-center font-bold p-2 dark:hover:bg-st-subTextDark hover:bg-st-text/30 dark:bg-primary-light bg-primary-dark duration-100 rounded-md dark:text-st-surfaceDark text-st-surface">
          Submit
        </button>
      </form>
    </>
  );
}
