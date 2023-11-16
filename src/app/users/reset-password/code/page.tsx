"use client";

import { REGEXVALIDATION } from "@/constants";
import { useForm } from "react-hook-form";

type ResetPasswordCodeFields = {
  token: string;
};

export default function ResetPasswordCode() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPasswordCodeFields>({ mode: "onSubmit" });

  const onSubmit = (data: ResetPasswordCodeFields) => {
    console.log(data);
  };

  return (
    <>
      <section className=" text-st-surfaceDark dark:text-st-surface justify-between">
        <h3 className=" font-medium text-2xl">Reset Password ✅</h3>
        <p className=" text-white/40 font-light">
          A confirmation code has been sent to your email.
        </p>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" my-4">
          <label
            className=" text-st-surfaceDark dark:text-st-surface"
            htmlFor=""
          >
            Confirmation Code
          </label>
          <input
            {...register("token", {
              required: "This field must be specified",
              pattern: REGEXVALIDATION.shouldNotBeEmptyString,
            })}
            className="w-full border mt-2 px-2 text-[#000] dark:text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
            type="number"
            placeholder="Enter the confirmation code that was sent to your email."
          />
          {errors.token && <small>Enter the reset password code.</small>}
        </div>
        <button className="w-full flex items-center justify-center font-bold p-2 dark:hover:bg-st-subTextDark hover:bg-st-text/30 dark:bg-primary-light bg-primary-dark duration-100 rounded-md dark:text-st-surfaceDark text-st-surface">
          Submit
        </button>
      </form>
    </>
  );
}
