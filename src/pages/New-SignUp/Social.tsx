import { FieldErrors, RegisterOptions } from "react-hook-form";
import { TNewUserFields } from "../../types/type";
import { REGEXVALIDATION } from "../../constants";

type SocialsFields =
  | "twitter_profile"
  | "linkedin_profile"
  | "github_profile"
  | "portfolio_url";

type TSocialsType = Pick<TNewUserFields, SocialsFields>;

type SocialsFormType = {
  register: (name: SocialsFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TSocialsType>;
};
function Social({ register, errors }: SocialsFormType) {
  return (
    <>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          Twitter Profile Link
        </label>
        <input
          {...register("twitter_profile")}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
        />
        {errors.twitter_profile && <small>Provide a valid link </small>}
      </div>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]">
          GitHub Profile Link
        </label>
        <input
          {...register("github_profile")}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
        />
        {errors.github_profile && <small>Provide your github username </small>}
      </div>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          Personal Portfolio Link
        </label>
        <input
          {...register("twitter_handle", {
            required: true,
            pattern: REGEXVALIDATION.twitter,
          })}
          {...register("portfolio_url", {})}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
        />
        {errors.portfolio_url && (
          <small>Provide your portfolio username </small>
        )}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          LinkedIn Profile Link
        </label>
        <input
          {...register("linkedin_profile", {})}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
        />
        {errors.linkedin_profile && (
          <small>Provide a link to your LinkedIn profile</small>
        )}
      </div>
      {/* <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          Are you currently working?
        </label>
        <section className="flex text-[#000] dark:text-[#f1f3f7] gap-4 my-4 ">
          <div className="">
            <input
              type="radio"
              value="Yes"
              {...register("working", {
                required: true,
              })}
            />
            <label className="mx-2 text-[#000] dark:text-[#f1f3f7]">Yes</label>
          </div>
          <div className="">
            <input
              type="radio"
              value="No"
              {...register("working", { required: true })}
            />
            <label className="mx-2 text-[#000] dark:text-white">No</label>
          </div>
        </section>
        {errors.working && <small>Select one option </small>}
      </div> */}
    </>
  );
}

export default Social;
