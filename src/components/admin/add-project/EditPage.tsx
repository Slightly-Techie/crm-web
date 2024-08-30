"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { getSkillsArray, getStacksArray } from "@/utils";
import { REGEXVALIDATION } from "@/constants";
import { ISkill, IStack, ProjectFields } from "@/types";
import { UseMutateFunction, useQuery } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectContext";
import useEndpoints from "@/services"; // Import your endpoints

type EditProps = {
  ProjectSubmitHandler: UseMutateFunction<
    unknown,
    unknown,
    ProjectFields,
    unknown
  >;
};

type OptionType = {
  value: number;
  label: string;
};

const customStyles = {
  control: (base: any) => ({
    ...base,
    borderColor: "#374151",
    backgroundColor: "transparent",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "transparent",
  }),
  option: (base: any) => ({
    ...base,
    backgroundColor: "black",
    color: "#D1D5DB",
  }),
};

const EditPage: React.FC<EditProps> = ({ ProjectSubmitHandler }) => {
  const { setFormValues } = useProject();
  const router = useRouter();
  const { getSkills, getStacks } = useEndpoints(); // Destructure getSkills from endpoints
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFields>({ mode: "onSubmit" });

  const [skillOptions, setSkillOptions] = useState<OptionType[]>([]);
  const [stackOptions, setStackOptions] = useState<OptionType[]>([]);

  console.log("StackedOption", stackOptions);

  const {
    data: Skills,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: () => getSkills(),
    refetchOnWindowFocus: false,
    retry: 3,
  });
  console.log("Skills", Skills);

  const { data: Stacks } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks(),
    refetchOnWindowFocus: false,
    retry: 3,
  });
  console.log("Stacks", Stacks);

  useEffect(() => {
    if (Skills && Skills.data) {
      const formattedOptions = Skills.data.items.map((skill: any) => ({
        value: skill.id, // Assuming `id` is the unique identifier for skills
        label: skill.name,
      }));
      setSkillOptions(formattedOptions);
    }

    if (Stacks && Stacks?.data) {
      const formattedStackOptions = Stacks.data.map((stack: IStack) => ({
        value: stack.id, // Assuming `id` is the unique identifier for stacks
        label: stack.name,
      }));
      console.log("StackOptions", formattedStackOptions);
      setStackOptions(formattedStackOptions);
    }
  }, [Skills, Stacks]);

  const handleNext = (data: ProjectFields) => {
    // Extract selected tool IDs from the form data
    const selectedTools = getSkillsArray(data.project_tools);
    console.log("SelectedTools >>", selectedTools); // Debug: Check if IDs are present

    const selectedStacks = getStacksArray(data.stacks);
    console.log("SelectedStacks >>", selectedStacks); // Debug: Check if IDs are present

    // Filter and map the skills options based on selected tools IDs
    const selectedOptions: ISkill[] = skillOptions
      .filter((option) => selectedTools.includes(option.value.toString())) // Ensure IDs match
      .map((option) =>
        Skills?.data.items.find((skill) => skill.id === option.value)
      ) // Compare as strings
      .filter((skill): skill is ISkill => skill !== undefined); // Filter out undefined values

    console.log("selectedOptions", selectedOptions); // Debug: Verify filtered skills

    // Filter and map the stacks options based on selected stacks IDs
    const selectedStackOptions: IStack[] = stackOptions
      .filter((option) => selectedStacks.includes(option.value.toString())) // Ensure IDs match
      .map((option) =>
        Stacks?.data.find((stack: IStack) => stack.id === option.value)
      ) // Compare as strings
      .filter((stack): stack is IStack => stack !== undefined); // Filter out undefined values

    console.log("selectedStackOptions", selectedStackOptions); // Debug: Verify filtered skills

    // Prepare the payload with the selected skill options
    const payload: ProjectFields = {
      ...data,
      project_tools: selectedOptions, // Include selected skills
      stacks: selectedStackOptions,
    };

    console.log("payload", payload); // Debug: Check final payload

    setFormValues(payload); // Store form values in context
    router.push(`/community-projects/team-selection`); // Navigate to the next page
  };

  return (
    <form
      onSubmit={handleSubmit(handleNext)}
      className="w-full lg:w-2/3 p-2 pb-6 dark:bg-primary-dark"
    >
      <h1 className="flex flex-col gap-1 mt-4 mx-3 text-3xl font-semibold">
        Project Details
      </h1>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className="text-lg pb-2 font-bold">Project Name</label>
        <input
          {...register("name", {
            required: true,
            pattern: REGEXVALIDATION.shouldNotBeEmptyString,
          })}
          type="text"
          placeholder="Enter the project's name"
          className="border focus:dark:border-st-surface border-neutral-700 rounded-md p-2 focus:outline-none bg-transparent"
        />
        {errors.name && <small>Provide the project&apos;s name</small>}
      </div>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className="text-lg pb-2 font-bold">Project Description</label>
        <textarea
          {...register("description", {
            required: true,
            pattern: REGEXVALIDATION.shouldNotBeEmptyString,
          })}
          placeholder="What is the project about?"
          rows={4}
          className="border focus:dark:border-st-surface border-neutral-700 rounded-md p-2 resize-none focus:outline-none bg-transparent"
        />
        {errors.description && (
          <small>Provide the project&apos;s description</small>
        )}
      </div>

      <div className="flex flex-col gap-1 mx-3 mt-4">
        <label className="text-lg pb-2 font-bold">Project type</label>
        <select
          {...register("project_type", {
            required: true,
            pattern: REGEXVALIDATION.shouldNotBeEmptyString,
          })}
          className="border border-neutral-700 py-3 rounded-md focus:outline-none bg-transparent"
        >
          <option className="text-st-gray" hidden value="">
            Select type of Project
          </option>
          <option className="text-st-surfaceDark" value="COMMUNITY">
            Community
          </option>
          <option className="text-st-surfaceDark" value="PAID">
            Paid
          </option>
        </select>
        {errors.project_type && <small>Select the type of project</small>}
      </div>
      <div className="flex flex-col gap-1 mx-3 mt-4">
        <label className="text-lg pb-2 font-bold">Priority</label>
        <select
          {...register("project_priority", {
            required: true,
            pattern: REGEXVALIDATION.shouldNotBeEmptyString,
          })}
          placeholder="How urgent is the project?"
          className="border  border-neutral-700 py-3 rounded-md focus:outline-none bg-transparent"
        >
          <option hidden value="">
            Select the priority of the project
          </option>
          <option className="text-st-surfaceDark" value="HIGH PRIORITY">
            High
          </option>
          <option className="text-st-surfaceDark" value="MEDIUM PRIORITY">
            Medium
          </option>
          <option className="text-st-surfaceDark" value="LOW PRIORITY">
            Low
          </option>
        </select>
        {errors.project_priority && (
          <small>Select the priority of project</small>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <div className="flex items-end justify-between pb-2">
          <label className="text-lg font-bold">Project Tools</label>
          <Link className="text-sm" href="">
            + Add Items
          </Link>
        </div>
        <Controller
          name="project_tools"
          control={control}
          defaultValue={[]} // Ensure the default value is an empty array
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, name } }) => (
            <Select
              isMulti
              options={skillOptions} // Use the fetched options here
              value={value?.map((v: any) => ({
                value: v,
                label: skillOptions.find((opt) => opt.value === v)?.label || v,
              }))}
              onChange={(selectedOptions) => {
                const selectedValues = selectedOptions.map(
                  (option: OptionType) => option.value
                );
                onChange(selectedValues);
              }}
              onBlur={onBlur}
              styles={customStyles}
              components={{
                MultiValueRemove: (props) => (
                  <components.MultiValueRemove {...props}>
                    <FaTimes />
                  </components.MultiValueRemove>
                ),
              }}
              classNamePrefix="react-select"
              placeholder="Eg. React, Django, Postgresql"
            />
          )}
        />
        {errors.project_tools && (
          <small>
            Valid technologies or languages must be provided and they must be
            separated by a comma
          </small>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <div className="flex items-end justify-between pb-2">
          <label className="text-lg font-bold">Project Stack</label>
          <Link className="text-sm" href="">
            + Add Items
          </Link>
        </div>
        <Controller
          name="stacks"
          control={control}
          defaultValue={[]} // Ensure the default value is an empty array
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, name } }) => (
            <Select
              isMulti
              options={stackOptions} // Use the fetched options here
              value={value?.map((v: any) => ({
                value: v,
                label: stackOptions.find((opt) => opt.value === v)?.label || v,
              }))}
              onChange={(selectedStackOptions) => {
                const selectedValues = selectedStackOptions.map(
                  (option: OptionType) => option.value
                );
                onChange(selectedValues);
              }}
              onBlur={onBlur}
              styles={customStyles}
              components={{
                MultiValueRemove: (props) => (
                  <components.MultiValueRemove {...props}>
                    <FaTimes />
                  </components.MultiValueRemove>
                ),
              }}
              classNamePrefix="stack-select"
              placeholder="Eg. Frontend, Backend, UI/UX"
            />
          )}
        />
        {errors.stacks && (
          <small>
            Valid technologies or languages must be provided and they must be
            separated by a comma
          </small>
        )}
      </div>
      <div className="mt-6 mx-3">
        <button
          type="submit"
          className="flex justify-center cursor-pointer text-primary-light dark:text-st-surfaceDark font-bold w-[120px] py-2 dark:bg-primary-light bg-primary-dark rounded-md"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default EditPage;
