"use client";

import Link from "next/link";
import { REGEXVALIDATION } from "@/constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type ResetPasswordCodeFields = {
  token: string;
};

export default function ResetPasswordCode() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ResetPasswordCodeFields>({ mode: "onSubmit" });
  const router = useRouter();

  const onSubmit = (data: ResetPasswordCodeFields) => {
    const token = data.token.trim();
    router.push(`/users/reset-password/new-password?token=${encodeURIComponent(token)}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="font-display font-bold text-3xl text-on-surface mb-2">Enter reset token</h2>
        <p className="text-on-surface-variant text-base">
          Paste the token you received to continue resetting your password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="token">
            Reset token
          </label>
          <input
            {...register("token", {
              required: "This field must be specified",
              pattern: REGEXVALIDATION.shouldNotBeEmptyString,
            })}
            id="token"
            className="w-full px-4 py-3.5 bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface"
            type="text"
            placeholder="Paste token"
          />
          {errors.token && <p className="text-red-600 text-xs mt-1">Enter your reset token.</p>}
        </div>
        <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
          Continue
        </button>
        <Link href="/users/forgot-password" className="block text-center text-sm font-semibold text-primary hover:underline">
          Back to forgot password
        </Link>
      </form>
    </div>
  );
}
