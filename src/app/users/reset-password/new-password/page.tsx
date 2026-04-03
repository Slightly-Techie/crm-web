"use client";

import Link from "next/link";
import { REGEXVALIDATION } from "@/constants";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { logToConsole } from "@/utils";
import { useState } from "react";
import { Status } from "@/types";
import { Oval } from "react-loader-spinner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type NewPassword = Record<"password" | "password_confirmation", string>;

export default function CreateNewPassword() {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    reset,
  } = useForm<NewPassword>({ mode: "onSubmit" });

  const [password, passwordConfirmation] = watch(["password", "password_confirmation"]);
  const [status, setStatus] = useState<Status>("progress");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const passwordMatch = password && password === passwordConfirmation;

  const onSubmit = async (data: NewPassword) => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    setStatus("onsubmit");
    try {
      const payload = {
        new_password: data.password,
        token,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/reset-password`,
        payload
      );
      setStatus("success");
      toast.success(res.data.message);
      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err) {
      toast.error("Something went wrong, try again");
      setStatus("error");
      logToConsole(err);
    }
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="font-display font-bold text-3xl text-on-surface mb-2">Create new password</h2>
        <p className="text-on-surface-variant text-base">
          Set a strong password to secure your account.
        </p>
      </div>

      {status === "success" && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700">
          Password reset successful. Redirecting to login...
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Unable to reset password. Please try again.
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="password">
            New password
          </label>
          <div className="relative">
            <input
              {...register("password", {
                min: 8,
                max: 25,
                required: true,
                pattern: REGEXVALIDATION.password,
              })}
              id="password"
              className="w-full px-4 py-3.5 pr-12 bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-xs mt-1 break-words">
              Password should be at least 8 characters and must contain uppercase, lowercase, number, and symbol.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="password_confirmation">
            Confirm new password
          </label>
          <div className="relative">
            <input
              {...register("password_confirmation", {
                required: true,
                pattern: REGEXVALIDATION.password,
                min: 8,
                max: 25,
                validate: (val: string) => {
                  if (watch("password") !== val) {
                    return "Your passwords do not match";
                  }
                },
              })}
              id="password_confirmation"
              style={{
                borderColor: errors.password_confirmation
                  ? "#b92828"
                  : passwordMatch
                  ? "#21c129"
                  : "",
              }}
              className="w-full px-4 py-3.5 pr-12 bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center"
          disabled={status === "onsubmit"}
        >
          {status === "onsubmit" ? (
            <Oval width={20} height={20} strokeWidth={4} color="#42f5ad" />
          ) : (
            "Reset password"
          )}
        </button>

        <Link href="/login" className="block text-center text-sm font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </form>
    </div>
  );
}
