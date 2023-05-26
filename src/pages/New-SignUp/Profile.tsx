import { useState } from "react";
import { NEW_USER_DATA } from "./NewSignUp";
import { FieldErrors, RegisterOptions } from "react-hook-form";
import { TNewUserFields } from "../../types/type";

type ProfileFields =
  | "email"
  | "phone_number"
  | "portfolio"
  | "first_name"
  | "last_name";

type TProfileType = Pick<TNewUserFields, ProfileFields>;

type ProfileFormType = {
  register: (name: ProfileFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TProfileType>;
};

function Profile({ register, errors }: ProfileFormType) {
  const [selectValue, setSelectValue] = useState(NEW_USER_DATA.portfolio);
  const PORTFOLIOS = ["Frontend", "Backend", "UI/UX", "Full Stack", "Mobile"];
  const isOther =
    selectValue === "" || PORTFOLIOS.includes(selectValue) ? false : true;
  return (
    <>
      <div className=" my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">First Name</label>
        <input
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] "
          type="text"
          placeholder="Susana"
          {...register("first_name", {
            required: true,
          })}
        />
        {errors.first_name && <small>First name must be provided</small>}
      </div>
      <div className=" my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">Last Name</label>
        <input
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] "
          type="text"
          placeholder="Taibobo"
          {...register("last_name", {
            required: true,
          })}
        />
        {errors.last_name && <small>Last name must be provided</small>}
      </div>
      <div className=" my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">Email</label>
        <input
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] "
          type="email"
          placeholder="kofi@example.com"
          {...register("email", {
            required: true,
            pattern: /^\S+@\S+\.\S+$/i,
          })}
        />
        {errors.email && <small>Email must be valid</small>}
      </div>
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">
          Phone Number(s) (Separated by /)
        </label>
        <input
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
          {...register("phone_number", {
            required: "Provide your phone number(s)",
          })}
          placeholder="0123456789/098765431"
        />
        {errors.phone_number && <small>{errors.phone_number.message}</small>}
      </div>
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">
          What type of techie are you?
        </label>
        <select
          {...register("portfolio")}
          onChange={(e) => setSelectValue(e.target.value)}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
        >
          {PORTFOLIOS.map((portfolio) => (
            <option className=" text-[#000] " key={portfolio} value={portfolio}>
              {portfolio}
            </option>
          ))}
          <option className="text-[#000]">Other</option>
        </select>
      </div>
      {isOther && (
        <div className="my-4">
          <label className="text-[#000] dark:text-white">
            If 'Other', please specify
          </label>
          <input
            {...register("portfolio")}
            className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-white border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
            type="text"
          />
        </div>
      )}
    </>
  );
}

export default Profile;
