import { FieldErrors, RegisterOptions } from "react-hook-form";
import { TNewUserFields } from "../../types/type";

type SkillsFields = "experience_yrs" | "experience_summary" | "languages";

type TSkillsType = Pick<TNewUserFields, SkillsFields>;

type SkillsFormType = {
  register: (name: SkillsFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TSkillsType>;
};

function Skills({ register, errors }: SkillsFormType) {
  return (
    <>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          List all the languages/technologies you use.
        </label>
        <input
          {...register("languages", {
            required: "This field must be specified",
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
          placeholder="Eg. JavaScript, Python, Ruby"
        />
        {errors.languages && <small>The technologies must be provided</small>}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]">
          Years of experience
        </label>
        <input
          {...register("experience_yrs", {
            required: true,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="number"
          min={0}
        />
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]">
          Write a summary about your experience so far
        </label>
        <textarea
          {...register("experience_summary", {
            required: "Provide a summary of your experience",
          })}
          cols={30}
          rows={3}
          className="w-full text-[#000] resize-none dark:text-[#f1f3f7] my-4 border-[1px] px-2 py-2 border-[#3333337c] dark:bg-[transparent] focus:outline-none focus:border-[#333]"
        />
        {errors.experience_summary && (
          <small>{errors.experience_summary.message}</small>
        )}
      </div>
    </>
  );
}

export default Skills;
