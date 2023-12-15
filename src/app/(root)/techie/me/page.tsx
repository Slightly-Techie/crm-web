"use client";
import useEndpoints from "@/services";
import { ITechie, WithoutNullableKeys } from "@/types";
import { logToConsole } from "@/utils";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { REGEXVALIDATION } from "@/constants";
import { getStacks } from "@/services";
import { Oval } from "react-loader-spinner";
import { getSkillsArray } from "@/utils";
import toast from "react-hot-toast";
import { Status } from "@/types";
import { PiUserGear } from "react-icons/pi";
import AsyncSelect from "react-select/async";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";

type inputeField = WithoutNullableKeys<Omit<ITechie, "id" | "skills">>;
type InitialField = inputeField & Record<"skills", string>;

type SearchOption = {
  value: number;
  label: string;
}[];

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
  const {
    getUserProfile,
    updateUserProfile,
    searchApplicant,
    updateProfilePicture,
  } = useEndpoints();
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
  const [selectedFile, setSelectedFile] = useState<Blob | null>();
  const [preview, setPreview] = useState("");
  const { promisifyDebounce } = useDebouncedSearch(searchApplicant, 1000);
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

  const options = [
    {
      id: 0,
      name: "Go",
    },
    {
      id: 1,
      name: "JavaScript",
    },
    {
      id: 2,
      name: "Python",
    },
    {
      id: 3,
      name: "Ruby",
    },
  ];

  const defaultOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  async function promiseOptions(inputValue: string): Promise<SearchOption> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await promisifyDebounce(inputValue);
        if (data?.items.length) {
          resolve(
            data.items.map((item) => ({
              value: item.id,
              label: item.first_name,
            }))
          );
        }
      } catch (err) {
        reject("not found");
      }
    });
  }
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess(res) {
      setUser(res.data);
      setDefaultValues(res.data);
    },
    refetchOnWindowFocus: false,
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setStatus("onsubmit");
      const payload: Partial<ITechie> = {
        ...data,
        skills: getSkillsArray(data.skills),
      };

      const avatar = new FormData();
      if (selectedFile) {
        avatar.set("file", selectedFile);
        const [profileRes] = await Promise.all([
          updateUserProfile(payload),
          updateProfilePicture(avatar),
        ]);

        setUser(profileRes.data);
        toast.success("Profile has been updated successfully");
        setStatus("progress");
        setEditMode(false);
      } else {
        const res = await updateUserProfile(payload);
        setUser(res.data);
        toast.success("Profile has been updated successfully");
        setStatus("progress");
        setEditMode(false);
      }
    } catch (err) {
      logToConsole(err);
      toast.error("Something went wrong, Try again");
      setStatus("progress");
    }
  });

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreview("");
      return;
    }
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataURL = reader.result as string;
      setPreview(dataURL);
    };
    reader.readAsDataURL(file);
  };

  const handleDiscardImage = () => {
    setSelectedFile(null);
    setPreview("");
  };

  const handleCancel = () => {
    setDefaultValues(user);
    reset(query.data?.data as unknown as InitialField); // works but the types can be better..hm
    setSelectedFile(null);
    setPreview("");
    setEditMode(false);
  };

  const imageURL =
    preview ||
    user.profile_pic_url ||
    `https://avatars.dicebear.com/api/initials/${user.first_name} ${user.last_name}.svg`;

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
              <div className="h-14 flex flex-row items-center border-b dark:border-st-edgeDark">
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
                        src={imageURL}
                        alt="profile"
                        className="w-[150px] lg:w-full lg:h-full aspect-h-1 object-cover"
                      />
                    )}
                  </div>
                  <div className=" flex items-center gap-2">
                    {editMode && (
                      <div className=" py-4">
                        <label
                          htmlFor="imageUpload"
                          className="h-9 w-24 gap-2 flex flex-row items-center justify-center bg-primary-dark text-st-surface dark:border dark:border-st-edgeDark dark:bg-st-grayDark text-secondary font-tt-hoves  rounded-[4px] hover:cursor-pointer"
                        >
                          <div className="">
                            <PiUserGear />
                          </div>
                          <p>Upload</p>
                        </label>

                        <input
                          type="file"
                          id="imageUpload"
                          className="hidden relative h-[0.1px] -z-50"
                          accept="image/*"
                          onChange={(e) => onSelectFile(e)}
                        />
                      </div>
                    )}
                    {editMode && preview && (
                      <button
                        onClick={handleDiscardImage}
                        className="bg-red-400 rounded-md  py-2 px-6"
                      >
                        Discard
                      </button>
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
                        className=" w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
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
                        className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
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
                        className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
                      >
                        {stackSuccess &&
                          STACKS?.data.map((stack) => (
                            <option
                              className=" text-st-surfaceDark"
                              key={stack.id}
                              value={stack.id}
                            >
                              {stack.name}
                            </option>
                          ))}
                        <option className=" text-st-surfaceDark" value={-1}>
                          Other
                        </option>
                      </select>
                    )}
                  </div>
                  {selectValue === -1 && (
                    <div className="my-4">
                      <label className=" text-st-surfaceDark dark:text-white">
                        If &apos;Other&apos;, please specify
                      </label>
                      <input
                        {...register("stack")}
                        className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-white border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:bor333-[#fff] dark:border-st-edgeDark"
                        type="text"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-st-surface text-st-surfaceDark">
                      Languages/Tools
                    </label>
                    <AsyncSelect
                      placeholder="Select tool.."
                      isDisabled={!editMode}
                      unstyled
                      onChange={(e) => console.log(e)}
                      // options={result?.items}
                      cacheOptions
                      loadOptions={promiseOptions}
                      classNamePrefix="react-select"
                      className=" react-select-container"
                      isMulti
                      defaultOptions={defaultOptions}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="dark:text-st-surface text-st-surfaceDark">
                      Email
                    </label>
                    <input
                      disabled
                      readOnly
                      {...register("email", { required: true })}
                      className="w-full border mt-2 px-2 text-st-subTextDark dark:text-st-surface/70 dark:bg-neutral-900 border-stone-300 py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
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
                      className="w-full border mt-2 px-2 text-st-subTextDark dark:text-st-surface/70 dark:bg-neutral-900  border-stone-300 py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:h-[28.5rem] shrink-0 bg-white p-[20px] dark:bg-[#000000] dark:text-white">
            <div className="h-14 flex flex-row items-center border-b dark:border-st-edgeDark">
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
                    className="w-[25rem] border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-0.5">
                  Github
                  <input
                    disabled={!editMode}
                    {...register("github_profile")}
                    className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark "
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  Portfolio
                  <input
                    disabled={!editMode}
                    {...register("portfolio_url")}
                    className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark "
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  Twitter
                  <input
                    disabled={!editMode}
                    {...register("twitter_profile")}
                    className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark "
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  Linkedin
                  <input
                    disabled={!editMode}
                    {...register("linkedin_profile")}
                    className="w-full border mt-2 px-2  text-st-surfaceDark dark:text-st-surface border-stone-300 input__transparent py-2 focus:outline-none focus:border focus:border-st-cardDark dark:focus:border-white  rounded-md dark:border-st-edgeDark"
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
