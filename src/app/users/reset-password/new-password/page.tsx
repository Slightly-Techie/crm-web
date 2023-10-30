"use client";

import { REGEXVALIDATION } from "@/constants";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type NewPassword = Record<"password" | "password_confirmation", string>;

export default function CreateNewPassword() {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<NewPassword>({ mode: "onSubmit" });
  const [password, password_confirmation] = watch([
    "password",
    "password_confirmation",
  ]);

  const passwordMatch = password && password === password_confirmation;

  const onSubmit = (data: NewPassword) => {
    const payload = {
      new_password: data.password,
      token:
        //change this token
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZ3lhcG9uZ2FudHdpQHlhaG9vLmNvbSIsImlhdCI6MTY5ODY5MDQ0OCwiZXhwIjoxNjk4NjkxMzQ4fQ.Kfix3kmLnC6D7Fgelfr6I3FapCZ2ctfQvHp6jjmZgIQ",
    };
    console.log(payload);
    axios
      .post("https://crm-api.fly.dev/api/v1/users/reset-password", payload)
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        //reroute to login page
      })
      .catch((err) => {
        console.log(err);
      });
    reset();
  };

  return (
    <>
      <section className=" text-st-surfaceDark dark:text-st-surface justify-between">
        <h3 className=" font-medium text-2xl">Reset Password ✅</h3>
        <p className=" text-white/40 font-light">
          Your email has been verified, create your new password.
        </p>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" my-4">
          <label
            className=" text-st-surfaceDark dark:text-st-surface"
            htmlFor=""
          >
            New Password
          </label>
          <input
            {...register("password", {
              min: 8,
              max: 25,
              required: true,
              pattern: REGEXVALIDATION.password,
            })}
            className="w-full border mt-2 px-2 text-[#000] dark:text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
            type="password"
          />
          {errors.password && (
            <small className=" break-words">
              Password should be at least 8 characters and must contain an
              uppercase letter, lowercase letter, a number and a symbol
            </small>
          )}
        </div>
        <div className=" my-4">
          <label
            className=" text-st-surfaceDark dark:text-st-surface"
            htmlFor=""
          >
            Confirm New Password
          </label>
          <input
            {...register("password_confirmation", {
              required: true,
              pattern: REGEXVALIDATION.password,
              min: 8,
              max: 25,
              validate: (val: string) => {
                if (watch("password") !== val) {
                  return "Your passwords do no match";
                }
              },
            })}
            style={{
              borderColor: errors.password_confirmation
                ? "#b92828"
                : passwordMatch
                ? "#21c129"
                : "",
            }}
            className="w-full border mt-2 px-2 text-[#000] dark:text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
            type="password"
          />
          {errors.password_confirmation && (
            <small>Passwords do not match</small>
          )}
        </div>
        <button className="w-full flex items-center justify-center font-bold p-2 dark:hover:bg-st-subTextDark hover:bg-st-text/30 dark:bg-primary-light bg-primary-dark duration-100 rounded-md dark:text-st-surfaceDark text-st-surface">
          Submit
        </button>
      </form>
    </>
  );
}
