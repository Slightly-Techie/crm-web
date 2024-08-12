"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { getSkillsArray } from "@/utils";
import { REGEXVALIDATION } from "@/constants";
import { ProjectFields, ProjectTool } from "@/types";
import { UseMutateFunction } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";
import options from "@/constants/index";
import { useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectContext";

type EditProps = {
  ProjectSubmitHandler: UseMutateFunction<unknown, unknown, ProjectFields>;
};

type OptionType = {
  value: string;
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

const EditPage = () => {
  const { setFormValues } = useProject();
  const router = useRouter();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFields>({ mode: "onSubmit" });

  const handleNext = (data: ProjectFields) => {
    const selectedTools = getSkillsArray(data.project_tools);
    const selectedOptions = options.filter((option) =>
      selectedTools.includes(option.value)
    );

    const payload: ProjectFields = {
      ...data,
      project_tools: selectedOptions.map((option) => ({
        value: option.value,
      })),
    };

    console.log("payload", payload);
    setFormValues(payload);
    console.log("setFormValues", setFormValues);
    router.push(`/community-projects/team-selection`);
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
          <label className="text-lg font-bold">Project Stack</label>
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
              options={options}
              value={value?.map((v: any) => ({
                value: v,
                label: options.find((opt) => opt.value === v)?.label || v,
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
