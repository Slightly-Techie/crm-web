import React from "react";
import { TNewUserFields } from "../../types/type";
import { RegisterOptions } from "react-hook-form";
import { FieldErrors } from "react-hook-form";

type PasswordFields = "password" | "password_confirmation";

type TPasswordType = Pick<TNewUserFields, PasswordFields>;

type PasswordFormType = {
  register: (name: PasswordFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TPasswordType>;
  watch: any;
};

function CreatePassword({ register, errors, watch }: PasswordFormType) {
  const [password, password_confirmation] = watch([
    "password",
    "password_confirmation",
  ]);

  const passwordMatch =
    password === password_confirmation &&
    password_confirmation !== undefined &&
    password_confirmation !== "";
  return (
    <>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          Password
        </label>
        <input
          {...register("password", {
            required: "This field must be specified",
            min: 8,
            max: 25,
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="password"
        />
        {errors.password && (
          <small>
            Password should be at least 8 characters and must contain an
            uppercase letter, lowercase letter and a number
          </small>
        )}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]">
          Confirm Password
        </label>
        <input
          {...register("password_confirmation", {
            required: true,
            min: 8,
            max: 25,
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
          })}
          style={{
            borderColor: errors.password_confirmation
              ? "#b92828"
              : passwordMatch
              ? "#21c129"
              : "",
          }}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="password"
        />
      </div>
    </>
  );
}

export default CreatePassword;
