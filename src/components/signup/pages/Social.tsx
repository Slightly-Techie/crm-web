import { FieldErrors, RegisterOptions } from "react-hook-form";
import { REGEXVALIDATION } from "@/constants";
import { NewUserFields } from "@/types";

type SocialsFields =
  | "twitter_profile"
  | "linkedin_profile"
  | "github_profile"
  | "portfolio_url";

type TSocialsType = Pick<NewUserFields, SocialsFields>;

type SocialsFormType = {
  register: (name: SocialsFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TSocialsType>;
};
function Social({ register, errors }: SocialsFormType) {
  return (
    <>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7] font-bold">
          Twitter Username
        </label>
        <input
          {...register("twitter_profile", {
            pattern: REGEXVALIDATION.twitter,
          })}
          placeholder="eg. @billG8s"
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#fff]"
          type="text"
        />
        {errors.twitter_profile && <small>Provide a valid profile link</small>}
      </div>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7] font-bold">
          GitHub Username
        </label>
        <input
          {...register("github_profile")}
          placeholder="eg. github.com/billG8s"
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#fff]"
          type="text"
        />
        {errors.github_profile && <small>Provide your github username </small>}
      </div>
      <div className=" my-4">
        <label
          className=" text-[#000] dark:text-[#f1f3f7] font-bold"
          htmlFor=""
        >
          Portfolio Link
        </label>
        <input
          {...register("portfolio_url", {})}
          placeholder="eg. billG8s.com"
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#fff]"
          type="text"
        />
        {errors.portfolio_url && (
          <small>Provide your portfolio username </small>
        )}
      </div>
      <div className="my-4">
        <label
          className=" text-[#000] dark:text-[#f1f3f7] font-bold"
          htmlFor=""
        >
          LinkedIn Profile
        </label>
        <input
          {...register("linkedin_profile", {
            pattern: REGEXVALIDATION.linkedIn,
          })}
          placeholder="eg. linkedin.com/billGates"
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#fff]"
          type="text"
        />
        {errors.linkedin_profile && (
          <small>Provide a valid linkedin profile</small>
        )}
      </div>
    </>
  );
}

export default Social;
