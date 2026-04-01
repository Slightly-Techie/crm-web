"use client";

import Link from "next/link";
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
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/forgot-password`, data)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        logToConsole(err);
      });
    reset();
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="font-display font-bold text-3xl text-on-surface mb-2">Reset your password</h2>
        <p className="text-on-surface-variant text-base">
          Enter your account email and we will send you a secure reset link.
        </p>
      </div>

      {status === "error" && (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Something went wrong while sending the reset link.
        </div>
      )}

      {status === "success" ? (
        <div className="space-y-4 rounded-2xl border border-outline-variant bg-surface-container-low p-5">
          <h3 className="text-lg font-semibold text-on-surface">Check your inbox</h3>
          <p className="text-sm text-on-surface-variant">
            A password reset link has been sent to your email address.
          </p>
          <button
            onClick={resetForm}
            className="w-full bg-surface-container-high text-on-surface py-3 px-4 rounded-xl font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Send again
          </button>
          <Link
            href="/login"
            className="block text-center text-sm font-semibold text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="email">
              Email address
            </label>
            <input
              {...register("email", {
                required: true,
                pattern: REGEXVALIDATION.email,
              })}
              id="email"
              className="w-full px-4 py-3.5 bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface"
              type="email"
              placeholder="you@company.com"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">Email must be valid</p>}
          </div>
          <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
            Send reset link
          </button>
          <Link href="/login" className="block text-center text-sm font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </form>
      )}
    </div>
  );
}
