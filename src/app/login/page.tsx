"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";
import { REGEXVALIDATION } from "@/constants";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import LoadingSpinner from "@/components/loadingSpinner";
import ThemeSwitcher from "../../components/theme/theme";
import LeftImage from "@/assets/images/Left.png";

interface FormInputs {
  email: String;
  password: String;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({ mode: "onSubmit" });
  const [showPassword, setShowPassword] = useState<boolean>();
  const [responseError, setResponseError] = useState<string | undefined>();
  const [isRequestSent, setIsRequestSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams?.get("callbackUrl");
  const callbackUrl = callback ?? "/";

  const onSubmit = handleSubmit(async (data: FormInputs) => {
    try {
      setIsRequestSent(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: callbackUrl,
        redirect: false,
      });
      if (result?.ok && !result?.error) {
        // setIsRequestSent(false);
        /**
         * setIsRequestSent is removed intentionally to avoid rendering the signup form again while
         * compiling the root page when the result is ok
         */
        router.push(callbackUrl);
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
    <div className="w-screen dark:bg-[#020202]">
      <div className="grid lg:grid-cols-2 bg-[#fff] dark:bg-[#020202] mx-auto">
        <div className="lg:h-screen lg:block sticky top-0 bg-[#fff] dark:bg-[#020202] lg:bg-[#020202]">
          <Image
            src={LeftImage}
            alt=""
            className="hidden lg:block w-full object-cover h-screen "
          />
        </div>
        <div className="w-full">
          {isRequestSent ? (
            <LoadingSpinner />
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <form
                className="flex flex-col justify-center items-center w-[20rem] py-8"
                onSubmit={onSubmit}
              >
                <div className="w-full">
                  <h3 className="text-[20px] font-bold">
                    Login To Your Account
                  </h3>
                </div>
                <div className="mt-8 mb-5">
                  <input
                    {...register("email", {
                      required: true,
                      min: 2,
                      max: 25,
                      pattern: REGEXVALIDATION.email,
                    })}
                    style={{ borderColor: errors.email ? "#b92828" : "" }}
                    className=" border-st-edge dark:border-st-subTextDark bg-transparent rounded-sm border-[1.8px] h-[40px] w-[20rem] placeholder:text-[14px] dark:placeholder:text-st-edgeDark placeholder:text-[#5D6675] pl-4 focus:outline-none dark:focus:border-white focus:border-[#3D4450]"
                    type="email"
                    name="email"
                    placeholder="Johndoe@slightytechie.io"
                  />
                  {errors.email && (
                    <p className="text-[#b92828] text-[12px]">
                      Email must be valid
                    </p>
                  )}
                </div>
                <>
                  <div className="flex items-center justify-between bg-transparent dark:border-st-edge rounded-sm border-[1.8px] h-[40px] w-[20rem] pl-4 ">
                    <input
                      {...register("password", {
                        required: true,
                        min: 8,
                        max: 25,
                      })}
                      style={{ borderColor: errors.password ? "#b92828" : "" }}
                      className="placeholder:text-[14px] dark:placeholder:text-st-edgeDark placeholder:text-[#5D6675] w-[85%] focus:outline-none dark:focus:border-white bg-transparent focus:border-st-text"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                    />
                    <div className="w-[10%]">
                      {showPassword ? (
                        <AiOutlineEyeInvisible
                          className="cursor-pointer ease duration-500"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <AiOutlineEye
                          className="cursor-pointer ease duration-500"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-[#b92828] text-[12px] text-center">
                      Password must be at least 8 characters, can contain at
                      least one uppercase, lowercase, a number and a special
                      character
                    </p>
                  )}
                  {responseError && (
                    <p className="text-[#b92828] text-[12px] pt-1">
                      {responseError}
                    </p>
                  )}
                </>
                <p className="my-2  text-st-textDark dark:text-st-subTextDark text-sm ">
                  Forgot your{" "}
                  <Link
                    className="font-bold hover:text-st-gray-400"
                    href="/users/forgot-password"
                  >
                    <u>password?</u>
                  </Link>
                </p>

                <button
                  className=" bg-primary-dark text-primary-light hover:bg-st-cardDark font-monalisa rounded-sm dark:bg-white text-st-bg text-sm dark:text-black hover:dark:bg-st-edge py-2 flex items-center justify-center w-full "
                  type="submit"
                  disabled={isRequestSent}
                >
                  Login to your account
                </button>

                <div className="w-full pt-4">
                  <label htmlFor="remember-checkbox" className="text-sm">
                    Remember me
                  </label>
                  <input
                    type="checkbox"
                    id="remember-checkbox"
                    className="ml-2"
                    // checked={persist}
                    // onChange={() => setPersist(!persist)}
                  />
                </div>
                <p className="my-7 text-[12px]">
                  Not registered?{" "}
                  <Link href="/signup">
                    <u className="font-bold hover:text-st-gray-400">
                      create account
                    </u>
                  </Link>
                </p>
              </form>
              <div className="mt-12">
                <ThemeSwitcher />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
