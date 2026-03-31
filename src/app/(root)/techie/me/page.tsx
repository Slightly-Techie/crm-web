"use client";
import useEndpoints from "@/services";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { getUserProfile, updateUserProfile, updateProfilePicture, getStacks } = useEndpoints();
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const { register, handleSubmit } = useForm<any>();

  const { data: user, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: stacksData } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks().then((res) => res.data),
    refetchOnWindowFocus: false,
  });
  const stacks = Array.isArray(stacksData) ? stacksData : (stacksData as any)?.data || [];

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: any) => {
    try {
      // Only send non-empty fields
      const payload: any = {};
      if (data.first_name) payload.first_name = data.first_name;
      if (data.last_name) payload.last_name = data.last_name;
      if (data.bio !== undefined) payload.bio = data.bio;
      if (data.phone_number) payload.phone_number = data.phone_number;
      if (data.years_of_experience) payload.years_of_experience = parseInt(data.years_of_experience);
      if (data.stack_id) payload.stack_id = parseInt(data.stack_id);
      if (data.portfolio_url) payload.portfolio_url = data.portfolio_url;
      if (data.github_profile) payload.github_profile = data.github_profile;
      if (data.linkedin_profile) payload.linkedin_profile = data.linkedin_profile;
      if (data.twitter_profile) payload.twitter_profile = data.twitter_profile;

      await updateUserProfile(payload);

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        await updateProfilePicture(formData);
      }

      toast.success("Profile updated successfully!");
      setEditMode(false);
      setSelectedFile(null);
      setPreview("");
      refetch();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileImage = preview || user.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${user.first_name} ${user.last_name}`;

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      {/* Hero Banner */}
      <div
        className="relative h-52 md:h-64 w-full overflow-hidden"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dbwzo8mno/image/upload/v1774821181/samples/landscapes/nature-mountains.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-20 md:-mt-24 relative z-10 w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl border-4 border-surface-container-lowest bg-surface-container-lowest overflow-hidden shadow-lg">
                <Image
                  src={profileImage}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  alt={`${user.first_name} ${user.last_name}`}
                />
              </div>
              {editMode && (
                <label className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                </label>
              )}
              {user.role?.id === 1 && !editMode && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface">
                    {user.first_name} {user.last_name}
                  </h1>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {user.status || "Accepted"}
                  </span>
                </div>
                <p className="text-on-surface-variant font-medium">
                  @{user.username} · {user.stack?.name ? `${user.stack.name} Developer` : "Techie"}
                </p>
              </div>

              {!editMode ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm shadow-md hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setEditMode(false); setSelectedFile(null); setPreview(""); }}
                    className="px-5 py-2.5 border border-outline rounded-lg text-on-surface bg-surface-container-lowest hover:bg-surface-container transition-colors font-semibold text-sm">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Details Card */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-6 text-on-surface">Details</h3>
                <div className="space-y-5">
                  {/* Stack */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">layers</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Stack</p>
                      {editMode ? (
                        <select
                          {...register("stack_id")}
                          defaultValue={user.stack?.id || ""}
                          className="w-full bg-surface-container-high border-none rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-primary/20 appearance-none text-on-surface">
                          <option value="">Select stack</option>
                          {stacks.map((s: any) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-on-surface font-semibold text-sm">{user.stack?.name || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">history_edu</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Experience</p>
                      {editMode ? (
                        <input
                          type="number"
                          {...register("years_of_experience")}
                          defaultValue={user.years_of_experience || ""}
                          placeholder="e.g. 3"
                          min={0}
                          max={50}
                          className="w-full bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      ) : (
                        <p className="text-on-surface font-semibold text-sm">
                          {user.years_of_experience ? `${user.years_of_experience} Years` : "Not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Email</p>
                      <p className="text-on-surface font-semibold text-sm truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">phone</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Phone</p>
                      {editMode ? (
                        <input
                          type="tel"
                          {...register("phone_number")}
                          defaultValue={user.phone_number || ""}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      ) : (
                        <p className="text-on-surface font-semibold text-sm">{user.phone_number || "Not specified"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-surface-container">
                  <h4 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4">Connect</h4>
                  {editMode ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm w-5">language</span>
                        <input
                          type="url"
                          {...register("portfolio_url")}
                          defaultValue={user.portfolio_url || ""}
                          placeholder="Portfolio URL"
                          className="flex-1 bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm w-5">code</span>
                        <input
                          type="url"
                          {...register("github_profile")}
                          defaultValue={user.github_profile || ""}
                          placeholder="GitHub profile URL"
                          className="flex-1 bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm w-5">work</span>
                        <input
                          type="url"
                          {...register("linkedin_profile")}
                          defaultValue={user.linkedin_profile || ""}
                          placeholder="LinkedIn profile URL"
                          className="flex-1 bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant text-sm w-5">chat_bubble</span>
                        <input
                          type="url"
                          {...register("twitter_profile")}
                          defaultValue={user.twitter_profile || ""}
                          placeholder="Twitter / X profile URL"
                          className="flex-1 bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 flex-wrap">
                      {user.portfolio_url && (
                        <a href={user.portfolio_url} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                          title="Portfolio">
                          <span className="material-symbols-outlined text-sm">language</span>
                        </a>
                      )}
                      {user.github_profile && (
                        <a href={user.github_profile} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                          title="GitHub">
                          <span className="material-symbols-outlined text-sm">code</span>
                        </a>
                      )}
                      {user.linkedin_profile && (
                        <a href={user.linkedin_profile} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                          title="LinkedIn">
                          <span className="material-symbols-outlined text-sm">work</span>
                        </a>
                      )}
                      {user.twitter_profile && (
                        <a href={user.twitter_profile} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                          title="Twitter / X">
                          <span className="material-symbols-outlined text-sm">chat_bubble</span>
                        </a>
                      )}
                      {!user.portfolio_url && !user.github_profile && !user.linkedin_profile && !user.twitter_profile && (
                        <p className="text-sm text-on-surface-variant italic">No links added</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-headline font-bold text-on-surface mb-4 text-base">Skills & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: any, idx: number) => (
                      <span key={idx}
                        className="px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-sm border border-outline-variant/10">
                        {typeof skill === "string" ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Bio & Name Edit */}
            <div className="lg:col-span-8 space-y-6">
              {/* Name Edit (only in edit mode) */}
              {editMode && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                  <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Name</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">First Name</label>
                      <input
                        type="text"
                        {...register("first_name")}
                        defaultValue={user.first_name || ""}
                        className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Last Name</label>
                      <input
                        type="text"
                        {...register("last_name")}
                        defaultValue={user.last_name || ""}
                        className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* About / Bio */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-4 text-on-surface">About {user.first_name}</h3>
                {editMode ? (
                  <textarea
                    {...register("bio")}
                    defaultValue={user.bio || ""}
                    placeholder="Tell the community about yourself..."
                    className="w-full p-4 bg-surface-container-high border-none rounded-lg text-on-surface text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={5}
                  />
                ) : (
                  <p className="text-on-surface-variant leading-relaxed">
                    {user.bio || "No bio provided. Click 'Edit Profile' to add one."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
