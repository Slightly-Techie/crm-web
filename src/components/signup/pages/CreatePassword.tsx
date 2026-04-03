import React, { useState } from "react";
import { NewUserFields } from "@/types";
import { RegisterOptions, FieldErrors, UseFormWatch } from "react-hook-form";
import { REGEXVALIDATION } from "@/constants";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type PasswordFields = "password" | "password_confirmation";

type TPasswordType = Pick<NewUserFields, PasswordFields>;

type PasswordFormType = {
  register: (name: PasswordFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TPasswordType>;
  watch: UseFormWatch<NewUserFields>;
};

function CreatePassword({ register, errors, watch }: PasswordFormType) {
  const [password, password_confirmation] = watch([
    "password",
    "password_confirmation",
  ]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordMatch = password && password === password_confirmation;

  return (
    <>
      <div className="my-4">
        <label
          className=" text-[#000] dark:text-[#f1f3f7] font-bold"
          htmlFor=""
        >
          Set A Password
        </label>
        <div className="relative">
          <input
            {...register("password", {
              required: "This field must be specified",
              min: 8,
              max: 25,
              pattern: REGEXVALIDATION.password,
            })}
            placeholder="Enter your password"
            className="w-full border-[1px] mt-2 px-2 pr-12 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000] dark:text-[#f1f3f7] hover:opacity-70 transition-opacity mt-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>
        {errors.password && (
          <small className=" break-words">
            Password should be at least 8 characters and must contain an
            uppercase letter, lowercase letter, a number and a symbol
          </small>
        )}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7] font-bold">
          Confirm Password
        </label>
        <div className="relative">
          <input
            {...register("password_confirmation", {
              required: true,
              min: 8,
              max: 25,
              validate: (val: string) => {
                if (watch("password") !== val) {
                  return "Your passwords do not match";
                }
              },
            })}
            placeholder="Confirm your password"
            style={{
              borderColor: errors.password_confirmation
                ? "#b92828"
                : passwordMatch
                ? "#21c129"
                : "",
            }}
            className="w-full border-[1px] mt-2 px-2 pr-12 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
            type={showConfirmPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000] dark:text-[#f1f3f7] hover:opacity-70 transition-opacity mt-1"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>
        {errors.password_confirmation && <small>Passwords do not match</small>}
      </div>
    </>
  );
}

export default CreatePassword;
