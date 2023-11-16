import { FieldErrors, UseFormRegister } from "react-hook-form";
import { REGEXVALIDATION } from "@/constants";
import { NewUserFields } from "@/types";
import { useRef } from "react";

type SkillsFields = "years_of_experience" | "bio" | "skills";

type TSkillsType = Pick<NewUserFields, SkillsFields>;

type SkillsFormType = {
  register: UseFormRegister<NewUserFields>;
  errors: FieldErrors<TSkillsType>;
};

function Skills({ register, errors }: SkillsFormType) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }
  return (
    <>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7] font-bold">
          How long have you been a techie?
        </label>
        <input
          {...register("years_of_experience", {
            required: true,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff] rounded-[5px] dark:border-[#8a8a8a]"
          type="number"
          min={0}
          placeholder="Enter your years of experience"
        />
      </div>
      <div className=" my-4">
        <label
          className=" text-[#000] dark:text-[#f1f3f7] font-bold"
          htmlFor=""
        >
          What languages do you use?
        </label>
        <input
          {...register("skills", {
            required: "This field must be specified",
            pattern: REGEXVALIDATION.listSeparatedByComma,
          })}
          className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff] rounded-[5px] dark:border-[#8a8a8a]"
          type="text"
          placeholder="Enter programming languages you use"
        />
        {errors.skills && (
          <small>
            Valid technologies or languages must be provided and they must be
            separated by a comma
          </small>
        )}
      </div>
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7] font-bold">
          How has the experience as a techie been?
        </label>
        <textarea
          {...register("bio")}
          ref={textareaRef}
          cols={30}
          rows={1}
          placeholder="Enter your experience as a techie"
          className="w-full text-[#000] resize-none dark:text-[#f1f3f7] my-4 border-[1px] px-2 py-2 border-[#3333337c] dark:bg-[transparent] focus:outline-none focus:border-[#333] dark:focus:border-[#fff] rounded-[5px] dark:border-[#8a8a8a]"
        />
      </div>
    </>
  );
}

export default Skills;
