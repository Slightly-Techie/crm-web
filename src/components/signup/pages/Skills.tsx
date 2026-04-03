import { REGEXVALIDATION } from "@/constants";
import { IStack } from "@/types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import { Oval } from "react-loader-spinner";

function Skills({ register, errors }: any) {
  const { getStacks } = useEndpoints();
  const [selectedStack, setSelectedStack] = useState<IStack>();

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
      setSelectedStack(data[0]);
    },
  });

  const handleStackChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const stack = STACKS?.data.find(
      (stack: IStack) => stack.id === parseInt(event.target.value)
    );
    setSelectedStack(stack || { id: -1, name: "Other" });
  };

  return (
    <>
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7] font-bold">
          What type of techie are you?
        </label>
        {stackLoading ? (
          <div className="flex items-center mt-2">
            <Oval
              width={20}
              height={20}
              color="#000"
              secondaryColor="#ccc"
              strokeWidth={4}
            />
          </div>
        ) : (
          <select
            {...register("stack", {
              required: true,
            })}
            onChange={handleStackChange}
            className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff] rounded-[5px] dark:border-[#8a8a8a]"
          >
            {stackSuccess &&
              STACKS?.data.map((stack: IStack) => (
                <option key={stack.id} value={stack.id}>
                  {stack.name}
                </option>
              ))}
            <option value={-1}>Other</option>
          </select>
        )}
        {errors.stack && <small>Please select your stack</small>}
      </div>
      {selectedStack?.id === -1 && (
        <div className="my-4">
          <label className="text-[#000] dark:text-[#f1f3f7] font-bold">
            If &apos;Other&apos;, please specify
          </label>
          <input
            {...register("custom_stack", {
              required: selectedStack?.id === -1,
            })}
            className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff] rounded-[5px] dark:border-[#8a8a8a]"
            type="text"
            placeholder="Enter your stack"
          />
          {errors.custom_stack && <small>Please specify your stack</small>}
        </div>
      )}
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
      <div className="my-4">
        <label className=" text-[#000] dark:text-[#f1f3f7] font-bold">
          Tell us about yourself
        </label>
        <p className="text-sm text-[#777] dark:text-[#aaa] mt-1 mb-2">
          Share your background, interests, and what motivates you as a developer
        </p>
        <textarea
          {...register("bio", {
            required: true,
            pattern: REGEXVALIDATION.shouldNotBeEmptyString,
          })}
          // ref={textareaRef}
          cols={30}
          rows={5}
          placeholder="e.g. I'm a passionate developer interested in web technologies. I love building solutions that solve real-world problems..."
          className="w-full text-[#000] resize-none dark:text-[#f1f3f7] border-[1px] px-3 py-3 border-[#3333337c] dark:bg-[transparent] focus:outline-none focus:border-[#333] dark:focus:border-[#fff] rounded-[5px] dark:border-[#8a8a8a]"
        />
        {errors.bio && (
          <small className="text-red-600">Please tell us about yourself.</small>
        )}
      </div>
    </>
  );
}

export default Skills;
