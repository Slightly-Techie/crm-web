import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { WithoutNullableKeys } from "../../types/type";
import { API_URL, Colors } from "../constants";

type UserField = {
  email: string;
  first_name: string;
  last_name: string;
  github_profile: string | null;
  twitter_profile: string | null;
  linkedin_profile: string | null;
  portfolio_url: string | null;
  profile_pic_url: string | null;
  id: number;
};

type inputeField = WithoutNullableKeys<Omit<UserField, "id">>;

// inital UserField state
const initialUserField: UserField = {
  email: "",
  first_name: "",
  last_name: "",
  github_profile: null,
  twitter_profile: null,
  linkedin_profile: null,
  portfolio_url: null,
  profile_pic_url: null,
  id: 0,
};

const UserProfile = () => {
  const [user, setUser] = useState<UserField>(initialUserField);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, setValue } = useForm<inputeField>();

  useEffect(() => {
    const token = localStorage.getItem("st-token");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("st-token")}`,
        },
      };
      axios
        .get(`${API_URL}/api/v1/users/profile`, config)
        .then((res) => {
          console.log(res.data);

          setUser(res.data);
          setValue("email", res.data.email);
          setValue("first_name", res.data.first_name);
          setValue("last_name", res.data.last_name);
          setValue("github_profile", res.data.github_profile);
          setValue("twitter_profile", res.data.twitter_profile);
          setValue("linkedin_profile", res.data.linkedin_profile);
          setValue("portfolio_url", res.data.portfolio_url);
          setValue("profile_pic_url", res.data.profile_pic_url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [setValue]);

  const onSubmit = handleSubmit((data) => {
    const token = localStorage.getItem("st-token");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("st-token")}`,
        },
      };
      axios
        .put(`${API_URL}/api/v1/users/profile`, data, config)
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  return (
    <div
      className={`flex justify-center min-h-screen bg-[${Colors.background}] text-white`}
    >
      <div className="xl:mx-96 flex min-h-full w-full flex-col pt-6">
        <h1 className="text-3xl text-slate-50">User Profile</h1>
        <div className="flex h-full w-full">
          <div className="hidden md:flex w-[350px] justify-center p-4">
            <div className="flex flex-col items-center">
              <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                <img
                  src={
                    user.profile_pic_url
                      ? user.profile_pic_url
                      : `https://avatars.dicebear.com/api/initials/${user.first_name}${user.last_name}.svg`
                  }
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="my-4 w-full">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`bg-[${Colors.Gray[200]}] p-1 w-full text-slate-50 rounded-sm border border-[${Colors.Gray[100]}]`}
                >
                  {!editMode ? "Edit Profile" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
          <form
            onSubmit={onSubmit}
            className="flex w-full flex-col p-4 gap-4 text-slate-100"
          >
            <div className="w-full bg-[#282828] border border-[#3A3A3A] rounded-md p-4">
              <h2 className="text-2xl font-bold">User</h2>
              <div className="flex flex-col gap-5 my-7">
                <div className="flex flex-row gap-4 w-full">
                  <div className="flex flex-col gap-2 w-full">
                    First Name
                    <input
                      disabled={!editMode}
                      {...register("first_name", { required: true })}
                      className="w-full p-2 rounded-md bg-[#111111] border-2 border-[#3A3A3A]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    Last Name
                    <input
                      disabled={!editMode}
                      {...register("last_name", { required: true })}
                      className="w-full p-2 rounded-md bg-[#111111] border-2 border-[#3A3A3A]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  Email
                  <input
                    disabled
                    readOnly
                    {...register("email", { required: true })}
                    className="w-full p-2 rounded-md bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  Username
                  <input
                    disabled
                    readOnly
                    value={`@${user.first_name}${user.last_name}`}
                    className="w-full p-2 rounded-md bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
              </div>
            </div>
            <div className="w-full bg-[#282828] border border-[#3A3A3A] rounded-md p-4">
              <h2 className="text-2xl font-bold">Basic</h2>
              <div className="flex flex-col gap-5 my-7">
                <div className="flex flex-col gap-2">
                  Github Url
                  <input
                    disabled={!editMode}
                    {...register("github_profile")}
                    className="w-full p-2 rounded-md text-opacity-30 bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  Portfolio Url
                  <input
                    disabled={!editMode}
                    {...register("portfolio_url")}
                    className="w-full p-2 rounded-md text-opacity-30 bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  Bio
                  <input
                    disabled={!editMode}
                    readOnly
                    value="I perform computer magic everyday for a living"
                    className="w-full p-2 rounded-md text-opacity-30 bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
              </div>
            </div>
            <div className="w-full bg-[#282828] border border-[#3A3A3A] rounded-md p-4">
              <h2 className="text-2xl font-bold">Socials</h2>
              <div className="flex flex-col gap-5 my-7">
                <div className="flex flex-col gap-2">
                  Twitter Url
                  <input
                    disabled={!editMode}
                    {...register("twitter_profile")}
                    className="w-full p-2 rounded-md text-opacity-30 bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  Linkedin Url
                  <input
                    disabled={!editMode}
                    {...register("linkedin_profile")}
                    className="w-full p-2 rounded-md text-opacity-30 bg-[#111111] border-2 border-[#3A3A3A]"
                  />
                </div>
              </div>
            </div>
            <div className="w-full bg-[#282828] border border-[#3A3A3A] rounded-md p-4">
              <button className="bg-[#03A49A] w-full p-2 rounded-md text-slate-50 duration-150">
                Save Profile Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
