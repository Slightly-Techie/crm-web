"use client";
import useEndpoints from "@/services";
import { ITechie, WithoutNullableKeys } from "@/types";
import { logToConsole } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { REGEXVALIDATION } from "@/constants";
import { getStacks } from "@/services";
import { Oval } from "react-loader-spinner";
import { getSkillsArray } from "@/utils";
import toast from "react-hot-toast";
import { Status } from "@/types";
type inputeField = WithoutNullableKeys<Omit<ITechie, "id" | "skills">>;
type InitialField = inputeField & Record<"skills", string>;

// inital UserField state
const initialUserField: ITechie = {
  email: "",
  first_name: "",
  last_name: "",
  github_profile: null,
  twitter_profile: null,
  linkedin_profile: null,
  portfolio_url: null,
  profile_pic_url: null,
  bio: "",
  created_at: "",
  is_active: false,
  phone_number: "",
  skills: [],
  tags: [],
  stack: null,
  years_of_experience: 0,
  id: 0,
  stack_id: null,
};
export default function Techie() {
  const { getUserProfile, updateUserProfile } = useEndpoints();
  const [user, setUser] = useState<ITechie>(initialUserField);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState<Status>("progress");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<InitialField>();

  const [selectValue, setSelectValue] = useState(initialUserField.stack_id);

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
      setSelectValue(data[0].id);
    },
  });

  const setDefaultValues = (user: ITechie | InitialField) => {
    if (!editMode) {
      setValue("email", user.email);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("github_profile", user.github_profile!);
      setValue("twitter_profile", user.twitter_profile!);
      setValue("linkedin_profile", user.linkedin_profile!);
      setValue("portfolio_url", user.portfolio_url!);
      setValue("profile_pic_url", user.profile_pic_url!);
      setValue("bio", user.bio);
      const skills = Array.isArray(user.skills)
        ? user.skills.join(",")
        : user.skills;
      setValue("skills", skills);
    }
  };

  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess(res) {
      setUser(res.data);
      setDefaultValues(res.data);
    },
    refetchOnWindowFocus: false,
  });

  const onSubmit = handleSubmit((data) => {
    const payload: Partial<ITechie> = {
      ...data,
      skills: getSkillsArray(data.skills),
    };

    setStatus("onsubmit");

    updateUserProfile(payload)
      .then((res) => {
        setUser(res.data);
        toast.success("Profile has been updated successfully");
        setStatus("progress");
        setEditMode(false);
      })
      .catch((err) => {
        setStatus("error");
        toast.error("Something went wrong, Try again");
        logToConsole(err);
      });
  });

  const handleCancel = () => {
    setDefaultValues(user);
    reset(query.data?.data as unknown as InitialField); // works but the types can be better..hm
    setEditMode(false);
  };

  return (
    <>
      <PageTitle title="Edit Your Profile" />
      <div className="flex w-full justify-center relative p-8 ">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-12 w-full sm:w-[calc(100% - 48px)] sm:max-w-[1000px] bg-[white] dark:bg-[#000000] dark:text-white"
        >
          <div className="text-white">
            {!editMode && (
              <div className="ml-auto w-fit">
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className={`bg-primary-dark dark:bg-primary-light text-st-surface dark:text-st-surfaceDark rounded-md  py-2 px-6 `}
                >
                  Edit Profile
                </button>
              </div>
            )}
            {editMode && (
              <div className="flex pb-4 flex-row gap-4 items-center justify-end dark:bg-[#000000] dark:text-white">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={` bg-red-400 rounded-md  py-2 px-6 `}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-secondary text-white bg-primary-dark dark:bg-primary-light dark:text-st-surfaceDark px-6 py-2 rounded-md`}
                >
                  {status === "onsubmit" ? (
                    <Oval
                      width={20}
                      height={20}
                      strokeWidth={4}
                      color="#42f5ad"
                    />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            )}
            <div className="  p-[20px] text-white">
              <div className="h-14 flex flex-row items-center border-b dark:border-[#8a8a8a]">
                <h1 className="text-xl font-medium text-st-surfaceDark dark:text-st-surface">
                  Profile
                </h1>
              </div>
              <div className="flex flex-col md:flex-row md:h-[calc(100%-3.5rem)] md:gap-[25px] sm:gap-[20px] mt-[10px]">
                <div className="w-1/3 h-full flex flex-col items-center justify-center my-0 mx-auto">
                  <div className="w-[150px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden">
                    {query.isSuccess && (
                      <Image
                        width={200}
                        height={200}
                        src={
                          user.profile_pic_url
                            ? user.profile_pic_url
                            : `https://avatars.dicebear.com/api/initials/${user.first_name} ${user.last_name}.svg`
                        }
                        alt="profile"
                        className="w-[150px] lg:w-full lg:h-full aspect-h-1 object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-5 my-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-1 w-full">
                      <label className=" dark:text-st-surface text-st-surfaceDark">
                        First Name
                      </label>
                      <input
                        disabled={!editMode}
                        {...register("first_name", {
                          required: true,
                          pattern: REGEXVALIDATION.shouldNotBeEmptyString,
                        })}
                        className=" w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                      />
                      {errors.first_name && (
                        <small>First name must be provided</small>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <label className="dark:text-st-surface text-st-surfaceDark">
                        Last Name
                      </label>
                      <input
                        disabled={!editMode}
                        {...register("last_name", {
                          required: true,
                          pattern: REGEXVALIDATION.shouldNotBeEmptyString,
                        })}
                        className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                      />
                      {errors.last_name && (
                        <small>Last name must be provided</small>
                      )}
                    </div>
                  </div>
                  <div className="my-4">
                    <label className="dark:text-st-surface text-st-surfaceDark ">
                      What type of techie are you?
                    </label>
                    {stackLoading ? (
                      <Oval
                        width={20}
                        height={20}
                        color="#fff"
                        secondaryColor="whatever"
                        strokeWidth={4}
                      />
                    ) : (
                      <select
                        {...register("stack_id")}
                        disabled={!editMode}
                        placeholder="Select your stack"
                        onChange={(e) =>
                          setSelectValue(parseInt(e.target.value))
                        }
                        className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                      >
                        {stackSuccess &&
                          STACKS?.data.map((stack) => (
                            <option
                              className="text-[#000]"
                              key={stack.id}
                              value={stack.id}
                            >
                              {stack.name}
                            </option>
                          ))}
                        <option className="text-[#000]" value={-1}>
                          Other
                        </option>
                      </select>
                    )}
                  </div>
                  {selectValue === -1 && (
                    <div className="my-4">
                      <label className="text-[#000] dark:text-white">
                        If &apos;Other&apos;, please specify
                      </label>
                      <input
                        {...register("stack")}
                        className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-white border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:bor333-[#fff] dark:border-[#8a8a8a]"
                        type="text"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-st-surface text-st-surfaceDark">
                      Languages/Tools
                    </label>
                    <input
                      {...register("skills", {
                        required: true,
                        pattern: REGEXVALIDATION.listSeparatedByComma,
                      })}
                      disabled={!editMode}
                      placeholder="JavaScript, Django, C#"
                      className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                    />
                    {errors.skills && (
                      <small>
                        {" "}
                        Valid technologies or languages must be provided and
                        they must be separated by a comma
                      </small>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-st-surface text-st-surfaceDark">
                      Email
                    </label>
                    <input
                      disabled
                      readOnly
                      {...register("email", { required: true })}
                      className="w-full border-[1px] mt-2 px-2 text-st-subTextDark dark:text-[#f1f3f7]/70 dark:bg-neutral-900 border-[#33333380] py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-st-surface text-st-surfaceDark">
                      Username
                    </label>
                    <input
                      disabled
                      readOnly
                      value={`@${user.username}`}
                      className="w-full border-[1px] mt-2 px-2 text-st-subTextDark dark:text-[#f1f3f7]/70 dark:bg-neutral-900  border-[#33333380] py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:h-[28.5rem] shrink-0 bg-white p-[20px] dark:bg-[#000000] dark:text-white">
            <div className="h-14 flex flex-row items-center border-b dark:border-[#8a8a8a]">
              <h1 className="text-xl font-medium">Socials</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-[10px]">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-0.5">
                  Bio
                  <textarea
                    {...register("bio", {
                      pattern: REGEXVALIDATION.shouldNotBeEmptyString,
                    })}
                    disabled={!editMode}
                    rows={12}
                    className="w-[25rem] border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-0.5">
                  Github
                  <input
                    disabled={!editMode}
                    {...register("github_profile")}
                    className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a] "
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  Portfolio
                  <input
                    disabled={!editMode}
                    {...register("portfolio_url")}
                    className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a] "
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  Twitter
                  <input
                    disabled={!editMode}
                    {...register("twitter_profile")}
                    className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a] "
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  Linkedin
                  <input
                    disabled={!editMode}
                    {...register("linkedin_profile")}
                    className="w-full border-[1px] mt-2 px-2 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2 focus:outline-none focus:border-[1px] focus:border-[#333] dark:focus:border-[#fff]  rounded-[5px] dark:border-[#8a8a8a]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
