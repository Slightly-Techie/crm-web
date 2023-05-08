import { FieldErrors, RegisterOptions } from "react-hook-form";
import { TNewUserFields } from "../../types/type";
import { logToConsole } from "../../utils";

type SocialsFields = "twitter_handle" | "linkedin_profile" | "working";

type TSocialsType = Pick<TNewUserFields, SocialsFields>;

type SocialsFormType = {
  register: (name: SocialsFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TSocialsType>;
};
function Social({ register, errors }: SocialsFormType) {
  logToConsole(errors);
  return (
    <>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          What's your Twitter handle?
        </label>
        <input
          {...register("twitter_handle", {
            required: true,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
        />
        {errors.twitter_handle && <small>Provide your twitter username </small>}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          What's your linkedIn profile?
        </label>
        <input
          {...register("linkedin_profile", {
            required: true,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
        />
        {errors.linkedin_profile && (
          <small>Provide a link to your LinkedIn profile</small>
        )}
      </div>
      <div className="my-4">
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
      </div>
    </>
  );
}

export default Social;
