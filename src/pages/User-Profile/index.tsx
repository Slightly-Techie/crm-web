import { useState } from "react";
import { useForm } from "react-hook-form";
import { userProfile, WithoutNullableKeys } from "../../types/type";
import { getUserProfile, updateUserProfile } from "../../services/api";
import { useQuery } from "react-query";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

type inputeField = WithoutNullableKeys<Omit<userProfile, "id">>;

// inital UserField state
const initialUserField: userProfile = {
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
  const [user, setUser] = useState<userProfile>(initialUserField);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit, setValue } = useForm<inputeField>();

  const setDefaultValues = (user: userProfile | inputeField) => {
    setValue("email", user.email);
    setValue("first_name", user.first_name);
    setValue("last_name", user.last_name);
    setValue("github_profile", user.github_profile!);
    setValue("twitter_profile", user.twitter_profile!);
    setValue("linkedin_profile", user.linkedin_profile!);
    setValue("portfolio_url", user.portfolio_url!);
    setValue("profile_pic_url", user.profile_pic_url!);
  };

  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess(res) {
      setUser(res.data);
      setDefaultValues(res.data);
    },
  });

  const onSubmit = handleSubmit((data) => {
    updateUserProfile(data)
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const handleCancel = () => {
    setDefaultValues(user);
    setEditMode(false);
  };

  return (
    <div className="flex h-screen bg-primary">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center  overflow-y-scroll">
        <Navbar />
        <form
          onSubmit={onSubmit}
          className="flex p-8 w-[72rem] flex-col gap-12"
        >
          <div>
            {editMode && (
              <div className="h-14 w-full flex flex-row gap-4 items-center justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`bg-white text-lg w-[7rem] h-10 rounded-sm border border-black`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-secondary text-white text-lg w-[7rem] h-10 rounded-sm border border-black`}
                >
                  Save
                </button>
              </div>
            )}
            <div className="w-full h-[26rem] bg-white border border-[#DCDDE1]">
              <div className="h-14 w-full flex flex-row items-center px-8 border-b border-[#DCDDE1]">
                <h1 className="text-xl font-medium">Profile</h1>
              </div>
              <div className="flex flex-row p-8 h-[calc(100%-3.5rem)] gap-4">
                <div className="w-1/3 h-full flex flex-col items-center justify-center">
                  <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                    {query.isSuccess && (
                      <img
                        src={
                          user.profile_pic_url
                            ? user.profile_pic_url
                            : `https://avatars.dicebear.com/api/initials/${user.first_name} ${user.last_name}.svg`
                        }
                        alt="profile"
                        className="w-full h-full aspect-square object-cover"
                      />
                    )}
                  </div>
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => setEditMode(!editMode)}
                      className={`bg-primary p-1 px-8 w-full text-slate-50 rounded-sm border border-[#DCDDE1]`}
                    >
                      {!editMode ? "Edit Profile" : "Cancel"}
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-5 my-4">
                  <div className="flex flex-row gap-4 w-full">
                    <div className="flex flex-col gap-1 w-full">
                      First Name
                      <input
                        disabled={!editMode}
                        {...register("first_name", { required: true })}
                        className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                      />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      Last Name
                      <input
                        disabled={!editMode}
                        {...register("last_name", { required: true })}
                        className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    Email
                    <input
                      disabled
                      readOnly
                      {...register("email", { required: true })}
                      className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    Username
                    <input
                      disabled
                      readOnly
                      value={`@${user.first_name}${user.last_name}`}
                      className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[28.5rem] shrink-0 bg-white border border-[#DCDDE1]">
            <div className="h-14 w-full flex flex-row items-center px-8 border-b border-[#DCDDE1]">
              <h1 className="text-xl font-medium">Socials</h1>
            </div>
            <div className="flex flex-row p-8 gap-8">
              <div className="flex flex-col w-1/2 gap-5">
                <div className="flex flex-col gap-0.5">
                  Bio
                  <textarea
                    disabled={!editMode}
                    readOnly
                    rows={12}
                    value="I perform computer magic everyday for a living"
                    className="w-full p-2 rounded-md text-opacity-30 bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                  />
                </div>
              </div>
              <div className="flex flex-col w-1/2 gap-4">
                <div className="flex flex-col gap-0.5">
                  Github
                  <input
                    disabled={!editMode}
                    {...register("github_profile")}
                    className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  Portfolio
                  <input
                    disabled={!editMode}
                    {...register("portfolio_url")}
                    className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                  />
                </div>

                <div className="flex flex-col gap-0.5">
                  Twitter
                  <input
                    disabled={!editMode}
                    {...register("twitter_profile")}
                    className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  Linkedin
                  <input
                    disabled={!editMode}
                    {...register("linkedin_profile")}
                    className="w-full p-2 rounded-md bg-[#f1f3f755] border-2 border-[#DCDDE1]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserProfile;
