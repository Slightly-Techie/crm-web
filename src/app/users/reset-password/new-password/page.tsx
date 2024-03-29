"use client";

import { REGEXVALIDATION } from "@/constants";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { logToConsole } from "@/utils";
import { useState } from "react";
import { Status } from "@/types";
import { Oval } from "react-loader-spinner";
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

  const [status, setStatus] = useState<Status>("progress");

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const passwordMatch = password && password === password_confirmation;

  const onSubmit = async (data: NewPassword) => {
    setStatus("onsubmit");
    try {
      const payload = {
        new_password: data.password,
        token: token,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`,
        payload
      );
      setStatus("success");
      toast.success(res.data.message);
      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (err) {
      toast.error("Something went wrong, try again");
      setStatus("error");
      logToConsole(err);
    }
    reset();
  };

  return (
    <>
      <section className=" text-st-surface justify-between">
        <h3 className=" font-medium text-2xl">Reset Password ✅</h3>
        <p className=" text-white/40 font-light">
          Your email has been verified, create your new password.
        </p>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" my-4">
          <label className=" text-st-surface" htmlFor="">
            New Password
          </label>
          <input
            {...register("password", {
              min: 8,
              max: 25,
              required: true,
              pattern: REGEXVALIDATION.password,
            })}
            className="w-full border mt-2 px-2 text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
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
          <label className=" text-st-surface" htmlFor="">
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
            className="w-full border mt-2 px-2 text-[#f1f3f7] dark:border-st-grayDark input__transparent py-2 focus:outline-none focus:border rounded-md dark:focus:border-st-surface"
            type="password"
          />
          {errors.password_confirmation && (
            <small>Passwords do not match</small>
          )}
        </div>
        <button className="w-full flex items-center justify-center font-bold p-2 dark:hover:bg-st-subTextDark hover:bg-primary-light/90 bg-primary-light duration-100 rounded-md text-st-surfaceDark ">
          {status === "onsubmit" ? (
            <Oval width={20} height={20} strokeWidth={4} color="#42f5ad" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
}
