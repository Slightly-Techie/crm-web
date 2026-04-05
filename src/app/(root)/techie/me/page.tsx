"use client";
import useEndpoints from "@/services";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaXTwitter, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa6";

export default function ProfilePage() {
  const {
    getUserProfile,
    updateUserProfile,
    updateProfilePicture,
    getStacks,
    getMyManager,
    getMySubordinates,
    getProjects,
    getFeedsWithPagination,
  } = useEndpoints();
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [showAllReports, setShowAllReports] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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
    enabled: editMode,
  });
  const stacks = Array.isArray(stacksData) ? stacksData : (stacksData as any)?.data || [];

  const { data: managerData } = useQuery({
    queryKey: ["myManager"],
    queryFn: () => getMyManager().then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: subordinatesData } = useQuery({
    queryKey: ["mySubordinates"],
    queryFn: () => getMySubordinates().then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects().then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const { data: feedsData } = useQuery({
    queryKey: ["feeds", "me"],
    queryFn: () => getFeedsWithPagination(1),
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const myProjects = useMemo(() => {
    const items = (projectsData as any)?.items || [];
    return items.filter((p: any) =>
      (p.members || []).some((m: any) => Number(m?.id) === user?.id) ||
      Number(p.manager_id) === user?.id
    );
  }, [projectsData, user?.id]);

  const recentPosts = useMemo(() => {
    const items = (feedsData as any)?.items || [];
    return items.filter((p: any) => Number(p?.user?.id) === user?.id).slice(0, 3);
  }, [feedsData, user?.id]);

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearAvatarSelection = () => {
    setSelectedFile(null);
    setPreview("");
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const onSubmit = async (data: any) => {
    try {
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
    } catch {
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

  const profileImage =
    preview ||
    (user.profile_pic_url && user.profile_pic_url !== "string" ? user.profile_pic_url : null) ||
    `https://api.dicebear.com/7.x/initials/jpg?seed=${user.first_name} ${user.last_name}`;

  const manager = managerData && (managerData as any).id ? (managerData as any) : null;
  const managerPicUrl =
    manager?.profile_pic_url && manager.profile_pic_url !== "string"
      ? manager.profile_pic_url
      : `https://api.dicebear.com/7.x/initials/jpg?seed=${manager?.first_name ?? ""} ${manager?.last_name ?? ""}`;

  const subordinates: any[] = Array.isArray(subordinatesData) ? subordinatesData : [];
  const visibleReports = showAllReports ? subordinates : subordinates.slice(0, 6);

  const hasLinks = user.portfolio_url || user.github_profile || user.linkedin_profile || user.twitter_profile;

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

      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-16 md:-mt-20 relative z-10 w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Header */}
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
                <>
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg" title={selectedFile ? "Replace photo" : "Change photo"}>
                    <span className="material-symbols-outlined text-sm">{selectedFile ? "swap_horiz" : "photo_camera"}</span>
                    <input ref={avatarInputRef} type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={clearAvatarSelection}
                      className="absolute top-2 right-2 w-7 h-7 bg-error/90 text-white rounded-full flex items-center justify-center hover:bg-error transition-colors shadow-md"
                      title="Remove staged photo"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  )}
                </>
              )}
              {user.role?.name === "admin" && !editMode && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              )}
            </div>

            {/* Name + Actions */}
            <div className="flex-1 mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface">
                    {user.first_name} {user.last_name}
                  </h1>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {user.status || "Active"}
                  </span>
                  {user.role && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {user.role.name}
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant font-medium">
                  @{user.username} · {user.stack?.name ? `${user.stack.name} Developer` : "Techie"}
                  {joinedDate && <span className="ml-2 text-xs">· Joined {joinedDate}</span>}
                </p>
              </div>

              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm shadow-md hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </button>
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

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Details Card */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-6 text-on-surface">Details</h3>
                <div className="space-y-5">
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

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Email</p>
                      <p className="text-on-surface font-semibold text-sm truncate">{user.email}</p>
                    </div>
                  </div>

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
                          placeholder="0244000000"
                          className="w-full bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                        />
                      ) : (
                        <p className="text-on-surface font-semibold text-sm">{user.phone_number || "Not specified"}</p>
                      )}
                    </div>
                  </div>

                  {joinedDate && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">calendar_month</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Joined</p>
                        <p className="text-on-surface font-semibold text-sm">{joinedDate}</p>
                      </div>
                    </div>
                  )}

                  {user.role && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Role</p>
                        <p className="text-on-surface font-semibold text-sm capitalize">{user.role.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-surface-container">
                  <h4 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4">Connect</h4>
                  {editMode ? (
                    <div className="space-y-3">
                      {[
                        { icon: "language", key: "portfolio_url", placeholder: "Portfolio URL" },
                        { icon: "code", key: "github_profile", placeholder: "GitHub profile URL" },
                        { icon: "work", key: "linkedin_profile", placeholder: "LinkedIn profile URL" },
                        { icon: "chat_bubble", key: "twitter_profile", placeholder: "Twitter / X profile URL" },
                      ].map(({ icon, key, placeholder }) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant text-sm w-5">{icon}</span>
                          <input
                            type="url"
                            {...register(key)}
                            defaultValue={(user as any)[key] || ""}
                            placeholder={placeholder}
                            className="flex-1 bg-surface-container-high border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface"
                          />
                        </div>
                      ))}
                    </div>
                  ) : hasLinks ? (
                    <div className="flex gap-3 flex-wrap">
                      {user.portfolio_url && (
                        <a href={user.portfolio_url} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary transition-all flex items-center justify-center text-on-surface-variant hover:text-on-primary" title="Portfolio">
                          <FaGlobe className="text-base" />
                        </a>
                      )}
                      {user.github_profile && (
                        <a href={user.github_profile} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-[#333] transition-all flex items-center justify-center text-on-surface-variant hover:text-white" title="GitHub">
                          <FaGithub className="text-base" />
                        </a>
                      )}
                      {user.linkedin_profile && (
                        <a href={user.linkedin_profile} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-[#0A66C2] transition-all flex items-center justify-center text-on-surface-variant hover:text-white" title="LinkedIn">
                          <FaLinkedin className="text-base" />
                        </a>
                      )}
                      {user.twitter_profile && (
                        <a href={user.twitter_profile} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-surface-container hover:bg-black transition-all flex items-center justify-center text-on-surface-variant hover:text-white" title="Twitter / X">
                          <FaXTwitter className="text-base" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No links added yet</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-headline font-bold text-on-surface mb-4 text-base">Skills & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill: any, idx: number) => {
                      const name = typeof skill === "string" ? skill : skill.name;
                      const img = typeof skill === "object" ? skill.image_url : null;
                      return (
                        <span key={idx}
                          className="inline-flex items-center justify-center px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-sm border border-outline-variant/10"
                          title={img ? name : undefined}>
                          {img
                            ? <img src={img} alt={name} className="w-5 h-5 rounded object-cover" />
                            : name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              {user.tags && user.tags.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-6">
                  <h4 className="font-headline font-bold text-on-surface mb-4 text-base">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.tags.map((tag: any) => (
                      <span key={tag.id || tag.name}
                        className="px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-sm border border-outline-variant/10">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Name edit */}
              {editMode && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                  <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Name</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">First Name</label>
                      <input type="text" {...register("first_name")} defaultValue={user.first_name || ""}
                        className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Last Name</label>
                      <input type="text" {...register("last_name")} defaultValue={user.last_name || ""}
                        className="w-full bg-surface-container-high border-none rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface" />
                    </div>
                  </div>
                </div>
              )}

              {/* About */}
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

              {/* Reporting Line */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Reporting Line</h3>

                {/* Manager */}
                <div className="mb-5">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Reports To</p>
                  {manager ? (
                    <Link
                      href={`/techies/${manager.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
                    >
                      <Image
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-secondary-container"
                        width={44}
                        height={44}
                        src={managerPicUrl}
                        alt={`${manager.first_name} ${manager.last_name}`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {manager.first_name} {manager.last_name}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">@{manager.username}</p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-base ml-auto shrink-0">chevron_right</span>
                    </Link>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No manager assigned</p>
                  )}
                </div>

                {/* Direct Reports */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                      Direct Reports ({subordinates.length})
                    </p>
                    {subordinates.length > 6 && (
                      <button
                        type="button"
                        onClick={() => setShowAllReports((v) => !v)}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        {showAllReports ? "Show less" : `Show all ${subordinates.length}`}
                      </button>
                    )}
                  </div>
                  {subordinates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {visibleReports.map((sub: any) => {
                        const subPicUrl =
                          sub.profile_pic_url && sub.profile_pic_url !== "string"
                            ? sub.profile_pic_url
                            : `https://api.dicebear.com/7.x/initials/jpg?seed=${sub.first_name} ${sub.last_name}`;
                        return (
                          <Link
                            key={sub.id}
                            href={`/techies/${sub.id}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
                          >
                            <Image
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                              width={36}
                              height={36}
                              src={subPicUrl}
                              alt={`${sub.first_name} ${sub.last_name}`}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-on-surface truncate">
                                {sub.first_name} {sub.last_name}
                              </p>
                              <p className="text-xs text-on-surface-variant truncate">
                                @{sub.username}
                                {sub.stack?.name && ` · ${sub.stack.name}`}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-on-surface-variant italic">No direct reports</p>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Projects</h3>
                {myProjects.length > 0 ? (
                  <div className="space-y-3">
                    {myProjects.map((project: any) => (
                      <Link
                        key={project.id}
                        href={`/community-projects/${project.id}`}
                        className="flex items-start gap-4 p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-base">folder</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-on-surface">{project.name}</p>
                            {project.project_type && (
                              <span className="text-[9px] px-2 py-0.5 bg-surface-container-high rounded-full font-bold uppercase tracking-wider text-on-surface-variant">
                                {project.project_type}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                            {project.description || "No description provided"}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant text-base shrink-0">chevron_right</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">Not a member of any projects yet.</p>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Recent Activity</h3>
                {recentPosts.length > 0 ? (
                  <div className="space-y-3">
                    {recentPosts.map((post: any) => (
                      <div key={post.id} className="p-4 rounded-xl bg-surface-container">
                        <p className="text-sm text-on-surface leading-relaxed line-clamp-3">{post.content}</p>
                        <p className="text-xs text-on-surface-variant mt-2">
                          {post.created_at ? new Date(post.created_at).toLocaleString() : "Recently"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-on-surface-variant">No recent feed posts yet.</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
