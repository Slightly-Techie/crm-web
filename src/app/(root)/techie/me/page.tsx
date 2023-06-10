"use client";
import useEndpoints from "@/services";
import { ITechie, WithoutNullableKeys } from "@/types";
import { logToConsole } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

type inputeField = WithoutNullableKeys<Omit<ITechie, "id">>;

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
  years_of_experience: 0,
  id: 0,
};
export default function Techie() {
  const { getUserProfile, updateUserProfile } = useEndpoints();
  const [user, setUser] = useState<ITechie>(initialUserField);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, setValue } = useForm<inputeField>();

  const setDefaultValues = (user: ITechie | inputeField) => {
    if (!editMode) {
      setValue("email", user.email);
      setValue("first_name", user.first_name);
      setValue("last_name", user.last_name);
      setValue("github_profile", user.github_profile!);
      setValue("twitter_profile", user.twitter_profile!);
      setValue("linkedin_profile", user.linkedin_profile!);
      setValue("portfolio_url", user.portfolio_url!);
      setValue("profile_pic_url", user.profile_pic_url!);
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
    updateUserProfile(data)
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
      })
      .catch((err) => {
        logToConsole(err);
      });
  });

  const handleCancel = () => {
    setDefaultValues(user);
    setEditMode(false);
  };

  return (
    <div className="flex w-full justify-center relative p-8">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-12 w-full sm:w-[calc(100% - 48px)] sm:max-w-[1000px] bg-[white] dark:bg-[#232323] dark:text-white p-[30px] absolute"
      >
        <div className="dark:bg-[#232323] dark:text-white">
          {editMode && (
            <div className="h-14 flex flex-row gap-4 items-center justify-end dark:bg-[#232323] dark:text-white">
              <button
                type="button"
                onClick={handleCancel}
                className={`bg-white text-lg rounded-sm border border-black p-[5px] sm:p-[10px] dark:text-[#000000]`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-secondary text-white text-lg rounded-sm border border-black p-[5px] sm:p-[10px]`}
              >
                Save
              </button>
            </div>
          )}
          <div className="lg:h-[26rem] bg-white border border-st-edge p-[20px] dark:bg-[#232323] dark:text-white">
            <div className="h-14 flex flex-row items-center border-b border-st-edge">
              <h1 className="text-xl font-medium">Profile</h1>
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
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className={`bg-primary w-full text-slate-50 rounded-sm border border-st-edge p-[5px] sm:p-[10px] dark:bg-[#232323] dark:text-white`}
                  >
                    {!editMode ? "Edit Profile" : "Cancel"}
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-5 my-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    First Name
                    <input
                      disabled={!editMode}
                      {...register("first_name", { required: true })}
                      className=" rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    Last Name
                    <input
                      disabled={!editMode}
                      {...register("last_name", { required: true })}
                      className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  Email
                  <input
                    disabled
                    readOnly
                    {...register("email", { required: true })}
                    className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  Username
                  <input
                    disabled
                    readOnly
                    value={`@${user.first_name}${user.last_name}`}
                    className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:h-[28.5rem] shrink-0 bg-white border border-st-edge p-[20px] dark:bg-[#232323] dark:text-white">
          <div className="h-14flex flex-row items-center border-b border-st-edge">
            <h1 className="text-xl font-medium">Socials</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-8 mt-[10px]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-0.5">
                Bio
                <textarea
                  disabled={!editMode}
                  readOnly
                  rows={12}
                  value={user.bio}
                  className="rounded-md text-opacity-30 bg-[#f1f3f755] border-2 border-st-edge p-[10px] lg:w-[450px] md:w-[350px] dark:bg-[#232323] dark:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-0.5">
                Github
                <input
                  disabled={!editMode}
                  {...register("github_profile")}
                  className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white "
                />
              </div>
              <div className="flex flex-col gap-0.5">
                Portfolio
                <input
                  disabled={!editMode}
                  {...register("portfolio_url")}
                  className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white "
                />
              </div>

              <div className="flex flex-col gap-0.5">
                Twitter
                <input
                  disabled={!editMode}
                  {...register("twitter_profile")}
                  className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white "
                />
              </div>
              <div className="flex flex-col gap-0.5">
                Linkedin
                <input
                  disabled={!editMode}
                  {...register("linkedin_profile")}
                  className="rounded-md bg-[#f1f3f755] border-2 border-st-edge p-[10px] dark:bg-[#232323] dark:text-white "
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
