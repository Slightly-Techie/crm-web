import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { NEW_USER_DATA, REGEXVALIDATION } from "@/constants";
import { NewUserFields } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getStacks } from "@/services";
import { Oval } from "react-loader-spinner";

type ProfileFields =
  | "email"
  | "phone_number"
  | "stack_id"
  | "first_name"
  | "last_name";

type TProfileType = Pick<NewUserFields, ProfileFields>;

type ProfileFormType = {
  register: UseFormRegister<NewUserFields>;
  errors: FieldErrors<TProfileType>;
};

function Profile({ register, errors }: ProfileFormType) {
  const [selectValue, setSelectValue] = useState(NEW_USER_DATA.stack_id);

  const {
    data: STACKS,
    isSuccess: stackSuccess,
    isLoading: stackLoading,
  } = useQuery({
    queryKey: ["stacks"],
    queryFn: getStacks,
    refetchOnWindowFocus: false,
    retry: 3,
    onSuccess({ data }) {
      setSelectValue(data[0].id);
    },
  });

  return (
    <>
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">First Name</label>
        <input
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] "
          type="text"
          placeholder="Susana"
          {...register("first_name", {
            required: true,
            min: 2,
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
            min: 2,
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
            pattern: REGEXVALIDATION.email,
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
            required: true,
            pattern: REGEXVALIDATION.phoneNumberMultiple,
          })}
          placeholder="0123456789/098765431"
        />
        {errors.phone_number && <small>Provide your Phone number(s)</small>}
      </div>
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7]">
          What type of techie are you?
        </label>
        {stackLoading ? (
          <Oval
            width={20}
            height={20}
            color="#fff"
            secondaryColor="whatever"
            strokeWidth={4}
          />
        ) : (
          <select
            {...register("stack_id")}
            onChange={(e) => setSelectValue(parseInt(e.target.value))}
            className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          >
            {stackSuccess &&
              STACKS?.data.map((stack) => (
                <option className="text-[#000]" key={stack.id} value={stack.id}>
                  {stack.name}
                </option>
              ))}
            <option className="text-[#000]" value={-1}>
              Other
            </option>
          </select>
        )}
      </div>
      {selectValue === -1 && (
        <div className="my-4">
          <label className="text-[#000] dark:text-white">
            If &apos;Other&apos;, please specify
          </label>
          <input
            {...register("stack")}
            className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-white border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
            type="text"
          />
        </div>
      )}
    </>
  );
}

export default Profile;
