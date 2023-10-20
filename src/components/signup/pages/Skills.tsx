import { FieldErrors, UseFormRegister } from "react-hook-form";
import { REGEXVALIDATION } from "@/constants";
import { NewUserFields } from "@/types";

type SkillsFields = "years_of_experience" | "bio" | "skills";

type TSkillsType = Pick<NewUserFields, SkillsFields>;

type SkillsFormType = {
  register: UseFormRegister<NewUserFields>;
  errors: FieldErrors<TSkillsType>;
};

function Skills({ register, errors }: SkillsFormType) {
  return (
    <>
      <div className=" my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]" htmlFor="">
          List all the languages/technologies you use (sepated by a comma).
        </label>
        <input
          {...register("skills", {
            required: "This field must be specified",
            pattern: REGEXVALIDATION.listSeparatedByComma,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333]"
          type="text"
          placeholder="Eg. JavaScript, Python, Ruby"
        />
        {errors.skills && (
          <small>
            Valid technologies or languages must be provided and they must be
            separated by a comma
          </small>
        )}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7]">
          Years of experience
        </label>
        <input
          {...register("years_of_experience", {
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
          {...register("bio")}
          cols={30}
          rows={3}
          className="w-full text-[#000] resize-none dark:text-[#f1f3f7] my-4 border-[1px] px-2 py-2 border-[#3333337c] dark:bg-[transparent] focus:outline-none focus:border-[#333]"
        />
      </div>
    </>
  );
}

export default Skills;
