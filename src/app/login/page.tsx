"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { API_URL, REGEXVALIDATION } from "@/constants";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LoadingSpinner from "@/components/loadingSpinner";
import LeftImage from "@/assets/images/Left.png";

interface FormInputs {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ mode: "onSubmit" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<string | undefined>();
  const [isRequestSent, setIsRequestSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams?.get("callbackUrl");
  const callbackUrl = callback ?? "/";

  const onSubmit = handleSubmit(async (data: FormInputs) => {
    try {
      setIsRequestSent(true);

      const newData = {
        username: data.email,
        password: data.password,
      };

      const serializedData = new URLSearchParams(newData).toString();

      const response = await fetch(`${API_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: serializedData,
      });

      const responseBody = await response.json();

      const token = responseBody?.token;
      if (token && typeof token === "string" && token.split(".").length === 3) {
        sessionStorage.setItem("authToken", token);
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl,
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        const userStatus = responseBody.user_status;

        if (userStatus === "CONTACTED") {
          router.push(`/assesment/${encodeURIComponent(data.email)}`);
        } else if (userStatus === "ACCEPTED") {
          router.push(callbackUrl);
        } else {
          setIsRequestSent(false);
          setResponseError("There is something wrong with your login.");
        }
      } else {
        if (result?.error) {
          setIsRequestSent(false);
          setResponseError(result?.error);
        }
      }
    } catch (error) {
      setIsRequestSent(false);
      setResponseError("Something went wrong...");
    }
  });

  return (
    <div className="w-screen min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Original Image */}
        <div className="lg:h-screen lg:block sticky top-0 bg-white lg:bg-surface-dark">
          <Image
            src={LeftImage}
            alt="Collaborative workspace"
            className="hidden lg:block w-full object-cover h-screen"
          />
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-white">
          {isRequestSent ? (
            <LoadingSpinner />
          ) : (
            <div className="w-full max-w-md space-y-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <span className="font-display font-bold text-xl text-on-surface">ST Network</span>
              </div>

              {/* Header */}
              <div className="text-center lg:text-left">
                <h2 className="font-display font-bold text-3xl text-on-surface mb-2">Welcome back</h2>
                <p className="text-on-surface-variant text-base">Sign in to your account to continue</p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-2" htmlFor="email">
                    Email address
                  </label>
                  <input
                    {...register("email", {
                      required: true,
                      pattern: REGEXVALIDATION.email,
                    })}
                    className="auth-input w-full px-4 py-3.5 bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface placeholder:text-on-surface-variant"
                    id="email"
                    name="email"
                    placeholder="you@company.com"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">Email must be valid</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                      Password
                    </label>
                    <Link href="/users/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-container transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      {...register("password", {
                        required: true,
                        minLength: 8,
                      })}
                      className="auth-input w-full px-4 py-3.5 bg-surface-container-low border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-on-surface placeholder:text-on-surface-variant pr-12"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
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
                    <p className="text-red-600 text-xs mt-1">
                      Password must be at least 8 characters
                    </p>
                  )}
                  {responseError && (
                    <p className="text-red-600 text-xs mt-1">{responseError}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    className="h-5 w-5 rounded-md border-2 border-outline-variant text-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    id="remember"
                    name="remember"
                    type="checkbox"
                  />
                  <label className="ml-3 text-sm font-medium text-on-surface-variant" htmlFor="remember">
                    Keep me signed in
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  type="submit"
                  disabled={isRequestSent}
                >
                  Sign in to dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-on-surface-variant pt-4">
                Not a member yet?
                <Link href="/signup" className="font-semibold text-primary hover:text-primary-container transition-colors ml-1">
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
