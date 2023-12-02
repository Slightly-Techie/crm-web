"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { getSkillsArray } from "@/utils";
import { REGEXVALIDATION } from "@/constants";
import { ProjectFields } from "@/types";
import { UseMutateFunction } from "@tanstack/react-query";

type EditProps = {
  ProjectSubmitHandler: UseMutateFunction<unknown, unknown, ProjectFields>;
};

const EditPage = ({ ProjectSubmitHandler }: EditProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFields>({ mode: "onSubmit" });

  const onSubmit = (data: ProjectFields) => {
    const payload = {
      ...data,
      manager_id: 5, // intentionally using brian's id for now. replace this with the admin's id
      project_tools: getSkillsArray(data.project_tools),
    };
    ProjectSubmitHandler(payload);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" w-full lg:w-2/3 p-2 pb-6 dark:bg-primary-dark "
    >
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className=" text-lg pb-2">Project Name</label>
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
        <label className="text-lg pb-2 ">Project Description</label>
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
        <label className="pb-2">Project type</label>
        <select
          {...register("project_type", {
            required: true,
            pattern: REGEXVALIDATION.shouldNotBeEmptyString,
          })}
          className="border border-neutral-700 py-3 rounded-md focus:outline-none bg-transparent"
        >
          <option hidden value="">
            Select type of Project
          </option>
          <option className=" text-st-surfaceDark" value="COMMUNITY">
            Community
          </option>
          <option className=" text-st-surfaceDark" value="PAID">
            Paid
          </option>
        </select>
        {errors.project_type && <small>Select the type of project</small>}
      </div>
      <div className="flex flex-col gap-1 mx-3 mt-4">
        <label className="text-bold pb-2 ">Priority</label>
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
          <option className=" text-st-surfaceDark" value="HIGH PRIORITY">
            High
          </option>
          <option className=" text-st-surfaceDark" value="MEDIUM PRIORITY">
            Medium
          </option>
          <option className=" text-st-surfaceDark" value="LOW PRIORITY">
            Low
          </option>
        </select>
        {errors.project_priority && (
          <small>Select the priority of project</small>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-4 mx-3">
        <label className=" text-lg pb-2">Project Tools</label>
        <input
          {...register("project_tools", {
            required: true,
            pattern: REGEXVALIDATION.listSeparatedByComma,
          })}
          type="text"
          placeholder="Eg. React, Django, Postgresql"
          className="border focus:dark:border-st-surface border-neutral-700 rounded-md p-2 focus:outline-none bg-transparent"
        />
        {errors.project_tools && (
          <small>
            Valid technologies or languages must be provided and they must be
            separated by a comma
          </small>
        )}
      </div>
      <div className="mt-6 mx-3">
        <button className=" text-primary-light dark:text-st-surfaceDark font-bold w-full py-2 dark:bg-primary-light bg-primary-dark rounded-md">
          Create Project
        </button>
      </div>
    </form>
  );
};

export default EditPage;
