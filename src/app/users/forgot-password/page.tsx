"use client";

import { REGEXVALIDATION } from "@/constants";
import { useForm } from "react-hook-form";
import axios from "@/lib/axios";
import { useState } from "react";
import LoadingSpinner from "@/components/loadingSpinner";
import { logToConsole } from "@/utils";

type ForgotPasswordField = {
  email: string;
};

type Status = "success" | "loading" | "error" | "progress";

export default function ForgotPassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ForgotPasswordField>({ mode: "onSubmit" });
  const [status, setStatus] = useState<Status>("progress");

  const resetForm = () => {
    setStatus("progress");
    reset();
  };

  const onSubmit = (data: ForgotPasswordField) => {
    setStatus("loading");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`,
        data
      )
      .then((res) => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        logToConsole(err);
      });
    reset();
  };

  if (status === "error") {
    return (
      <div>
        <h3 className=" font-medium text-2xl text-center text-white">
          Something went wrong ❌
        </h3>
        <button
          onClick={resetForm}
          className=" text-black font-bold my-4 bg-white rounded-md py-2 w-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-[#000] dark:text-[#f1f3f7] justify-between bg-primary-dark">
      {status === "progress" ? (
        <>
          <section className="text-[#f1f3f7] justify-between">
            <h3 className=" font-medium text-2xl">Forgot Password?🤯</h3>
            <p className=" text-white/40 font-light">
              Not a problem! It happens to the best of us👌
            </p>
          </section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" my-4">
              <label className=" text-[#f1f3f7]" htmlFor="">
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
            <button className="w-full flex items-center justify-center font-bold p-2 dark:hover:bg-st-subTextDark hover:bg-white/90 bg-primary-light duration-100 rounded-md text-st-surfaceDark">
              Submit
            </button>
          </form>
        </>
      ) : (
        <div>
          <h1 className=" text-white text-center text-2xl">
            Email Verified successfully ✅
          </h1>
          <p className=" text-center py-4 text-st-subTextDark">
            {" "}
            A password reset link has been sent to your email. Click on it to
            reset your password
          </p>
        </div>
      )}
    </div>
  );
}
