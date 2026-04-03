"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useEndpoints from "@/services";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaXTwitter, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa6";

type Section = "profile" | "account" | "skills" | "tags" | "team";

export default function SettingsPage() {
  const { getUserProfile, updateUserProfile, updateProfilePicture, getMyManager, getMySubordinates, getStacks, getMySkills, addSkill, removeSkill, getMyTags, createTag, deleteTag, getAllSkillsFlat } = useEndpoints();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [skillFilter, setSkillFilter] = useState("");
  const [newTag, setNewTag] = useState("");
  const queryClient = useQueryClient();

  const { data: userData, isLoading: isUserLoading, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: stacksData, isLoading: isStacksLoading } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: managerData } = useQuery({
    queryKey: ["myManager"],
    queryFn: () => getMyManager().then((res) => res.data),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: subordinatesData } = useQuery({
    queryKey: ["mySubordinates"],
    queryFn: () => getMySubordinates().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: mySkillsData, refetch: refetchSkills } = useQuery({
    queryKey: ["mySkills"],
    queryFn: () => getMySkills().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: allSkillsData } = useQuery({
    queryKey: ["skillsPool"],
    queryFn: () => getAllSkillsFlat().then((res) => {
      const d = res.data as any;
      return Array.isArray(d) ? d : d?.items || [];
    }),
    refetchOnWindowFocus: false,
    enabled: activeSection === "skills",
  });

  const { data: myTagsData, refetch: refetchTags } = useQuery({
    queryKey: ["myTags"],
    queryFn: () => getMyTags().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const addSkillMutation = useMutation({
    mutationFn: (skillId: number) => addSkill([skillId]),
    onSuccess: () => { toast.success("Skill added!"); refetchSkills(); },
    onError: () => toast.error("Failed to add skill."),
  });

  const removeSkillMutation = useMutation({
    mutationFn: (skillId: number) => removeSkill(skillId),
    onSuccess: () => { toast.success("Skill removed."); refetchSkills(); },
    onError: () => toast.error("Failed to remove skill."),
  });

  const createTagMutation = useMutation({
    mutationFn: (name: string) => createTag(name),
    onSuccess: () => { toast.success("Tag added!"); setNewTag(""); refetchTags(); },
    onError: () => toast.error("Failed to add tag."),
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => { toast.success("Tag removed."); refetchTags(); },
    onError: () => toast.error("Failed to remove tag."),
  });

  const mySkills: any[] = Array.isArray(mySkillsData) ? mySkillsData : [];
  const allPoolSkills: any[] = Array.isArray(allSkillsData) ? allSkillsData : [];
  const myTags: any[] = Array.isArray(myTagsData) ? myTagsData : (myTagsData as any)?.tags || [];
  const mySkillIds = new Set(mySkills.map((s: any) => s.id));
  const filteredPoolSkills = skillFilter.trim()
    ? allPoolSkills.filter((s: any) => s.name.toLowerCase().includes(skillFilter.toLowerCase()))
    : allPoolSkills;

  const user = userData;
  let stacks: any[] = [];
  if (Array.isArray(stacksData)) {
    stacks = stacksData;
  } else {
    const stackPayload =
      (stacksData as { items?: unknown[]; data?: unknown[] } | undefined)?.items ||
      (stacksData as { items?: unknown[]; data?: unknown[] } | undefined)?.data;
    if (Array.isArray(stackPayload)) {
      stacks = stackPayload;
    }
  }

  // Show all assigned subordinates - they are the user's actual team
  const subordinates: any[] = subordinatesData || [];

  const { register, handleSubmit, reset } = useForm<any>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      phone_number: user?.phone_number || "",
      years_of_experience: user?.years_of_experience || "",
      stack_id: user?.stack?.id || "",
      portfolio_url: user?.portfolio_url || "",
      github_profile: user?.github_profile || "",
      linkedin_profile: user?.linkedin_profile || "",
      twitter_profile: user?.twitter_profile || "",
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      bio: user.bio || "",
      phone_number: user.phone_number || "",
      years_of_experience: user.years_of_experience ?? "",
      stack_id: user.stack?.id || user.stack_id || "",
      portfolio_url: user.portfolio_url || "",
      github_profile: user.github_profile || "",
      linkedin_profile: user.linkedin_profile || "",
      twitter_profile: user.twitter_profile || "",
    });
  }, [user, reset]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      const payload: any = {};
      if (data.first_name) payload.first_name = data.first_name;
      if (data.last_name) payload.last_name = data.last_name;
      if (data.bio !== undefined) payload.bio = data.bio;
      if (data.phone_number) payload.phone_number = data.phone_number;
      if (data.years_of_experience) payload.years_of_experience = Number.parseInt(data.years_of_experience);
      if (data.stack_id) payload.stack_id = Number.parseInt(data.stack_id);
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

      toast.success("Settings saved!");
      setSelectedFile(null);
      setPreview("");
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const profileImage =
    preview ||
    user?.profile_pic_url ||
    `https://api.dicebear.com/7.x/initials/jpg?seed=${user?.first_name || "User"} ${user?.last_name || ""}`;

  const getStackName = (person: any) => {
    if (!person) return "";
    if (typeof person.stack === "string") return person.stack;
    if (person.stack?.name) return person.stack.name;
    if (person.stack_name) return person.stack_name;
    return "";
  };

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: "profile", label: "Profile", icon: "person" },
    { id: "account", label: "Account", icon: "manage_accounts" },
    { id: "skills", label: "Skills", icon: "psychology" },
    { id: "tags", label: "Tags", icon: "label" },
    { id: "team", label: "My Team", icon: "groups" },
  ];

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
            <span>Account</span>
            <span>/</span>
            <span className="text-primary">Settings</span>
          </nav>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface">Settings</h1>
          <p className="text-on-surface-variant mt-1">Manage your profile and account preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar nav */}
          <aside className="md:col-span-1">
            <nav className="space-y-1 bg-surface-container-lowest border border-outline rounded-xl p-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-outline">
                <Link
                  href="/techie/me"
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                  View Public Profile
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="md:col-span-3">
            {/* Profile Section */}
            {activeSection === "profile" && !(isUserLoading || isStacksLoading) && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-6">
                  <h2 className="font-bold font-headline text-on-surface">Profile Information</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-secondary-container flex-shrink-0">
                      <Image className="w-full h-full object-cover" width={80} height={80} src={profileImage} alt="avatar" />
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-base">upload</span>
                        Change Photo
                        <input type="file" accept="image/*" onChange={onSelectFile} className="hidden" />
                      </label>
                      <p className="text-xs text-on-surface-variant mt-1">JPG, PNG or GIF · Max 5MB</p>
                    </div>
                  </div>

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-on-surface">First Name</label>
                      <input
                        {...register("first_name")}
                        defaultValue={user?.first_name}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-on-surface">Last Name</label>
                      <input
                        {...register("last_name")}
                        defaultValue={user?.last_name}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-on-surface">Bio</label>
                    <textarea
                      {...register("bio")}
                      defaultValue={user?.bio || ""}
                      rows={3}
                      placeholder="Tell the network a bit about yourself..."
                      className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none text-sm"
                    />
                  </div>

                  {/* Stack + Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-on-surface">Tech Stack</label>
                      <select
                        {...register("stack_id")}
                        defaultValue={user?.stack?.id || ""}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                      >
                        <option value="">Select stack</option>
                        {stacks.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-on-surface">Years of Experience</label>
                      <input
                        {...register("years_of_experience")}
                        defaultValue={user?.years_of_experience || ""}
                        type="number"
                        min={0}
                        max={50}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-on-surface">Phone Number</label>
                    <input
                      {...register("phone_number")}
                      defaultValue={user?.phone_number || ""}
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-4">
                  <h2 className="font-bold font-headline text-on-surface">Social Links</h2>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-on-surface flex items-center gap-2">
                      <FaGithub className="text-base text-on-surface-variant" />
                      GitHub
                    </label>
                    <input
                      {...register("github_profile")}
                      defaultValue={user?.github_profile || ""}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-on-surface flex items-center gap-2">
                      <FaLinkedin className="text-base text-on-surface-variant" />
                      LinkedIn
                    </label>
                    <input
                      {...register("linkedin_profile")}
                      defaultValue={user?.linkedin_profile || ""}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                    />
                  </div>

                  {/* Twitter/X */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-on-surface flex items-center gap-2">
                      <FaXTwitter className="text-base text-on-surface-variant" />
                      Twitter / X
                    </label>
                    <input
                      {...register("twitter_profile")}
                      defaultValue={user?.twitter_profile || ""}
                      placeholder="https://twitter.com/username"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                    />
                  </div>

                  {/* Portfolio */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-on-surface flex items-center gap-2">
                      <FaGlobe className="text-base text-on-surface-variant" />
                      Portfolio
                    </label>
                    <input
                      {...register("portfolio_url")}
                      defaultValue={user?.portfolio_url || ""}
                      placeholder="https://yoursite.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">save</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Account Section */}
            {activeSection === "account" && (
              <div className="space-y-4">
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-4">
                  <h2 className="font-bold font-headline text-on-surface">Account Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-outline">
                      <div>
                        <p className="text-sm font-medium text-on-surface">Email address</p>
                        <p className="text-xs text-on-surface-variant">{user?.email || "—"}</p>
                      </div>
                      <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant text-xs rounded-md">Read-only</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-outline">
                      <div>
                        <p className="text-sm font-medium text-on-surface">Username</p>
                        <p className="text-xs text-on-surface-variant">@{user?.username || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-outline">
                      <div>
                        <p className="text-sm font-medium text-on-surface">Account Role</p>
                        <p className="text-xs text-on-surface-variant capitalize">{user?.role?.name || "user"}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${user?.role?.name === "admin" ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"}`}>
                        {user?.role?.name || "user"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-on-surface">Account Status</p>
                        <p className="text-xs text-on-surface-variant">{user?.status || "Active"}</p>
                      </div>
                      <span className="px-2 py-1 bg-secondary-container/50 text-on-secondary-container text-xs rounded-full font-semibold uppercase">
                        {user?.status || "ACCEPTED"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-4">
                  <h2 className="font-bold font-headline text-on-surface">Password</h2>
                  <p className="text-sm text-on-surface-variant">
                    To change your password, use the forgot password flow from the login page.
                  </p>
                  <Link
                    href="/users/forgot-password"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">lock_reset</span>
                    Reset Password
                  </Link>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <div className="space-y-4">
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-5">
                  <div>
                    <h2 className="font-bold font-headline text-on-surface">My Skills</h2>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      Select from the available skills pool. Contact an admin to add new skills.
                    </p>
                  </div>

                  {/* Current skills */}
                  {mySkills.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Selected</p>
                      <div className="flex flex-wrap gap-2">
                        {mySkills.map((skill: any) => (
                          <span
                            key={skill.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            {skill.name}
                            <button
                              onClick={() => removeSkillMutation.mutate(skill.id)}
                              className="hover:text-error transition-colors"
                              title="Remove"
                            >
                              <span className="material-symbols-outlined text-sm leading-none">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pool picker */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2">Add from pool</p>
                    <input
                      value={skillFilter}
                      onChange={(e) => setSkillFilter(e.target.value)}
                      placeholder="Filter skills..."
                      className="w-full px-4 py-2 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm mb-3"
                    />
                    {filteredPoolSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {filteredPoolSkills.map((skill: any) => {
                          const added = mySkillIds.has(skill.id);
                          return (
                            <button
                              key={skill.id}
                              onClick={() => { if (!added) addSkillMutation.mutate(skill.id); }}
                              disabled={added || addSkillMutation.status === "loading"}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                added
                                  ? "bg-surface-container-high text-on-surface-variant border-outline cursor-default opacity-60"
                                  : "border-outline text-on-surface hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                              }`}
                            >
                              {added ? (
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">check</span>
                                  {skill.name}
                                </span>
                              ) : skill.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant">
                        {skillFilter ? `No skills matching "${skillFilter}"` : "No skills in pool yet."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tags Section */}
            {activeSection === "tags" && (
              <div className="space-y-4">
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-4">
                  <div>
                    <h2 className="font-bold font-headline text-on-surface">My Tags</h2>
                    <p className="text-sm text-on-surface-variant mt-1">
                      Tags help others find you. Add keywords that describe your interests or expertise.
                    </p>
                  </div>

                  {/* Current tags */}
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {myTags.length === 0 && (
                      <p className="text-sm text-on-surface-variant">No tags yet.</p>
                    )}
                    {myTags.map((tag: any) => (
                      <span
                        key={tag.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        #{tag.name}
                        <button
                          onClick={() => deleteTagMutation.mutate(tag.id)}
                          className="hover:text-error transition-colors"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-sm leading-none">close</span>
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add new tag */}
                  <div className="flex gap-2">
                    <input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTag.trim()) {
                          e.preventDefault();
                          createTagMutation.mutate(newTag.trim());
                        }
                      }}
                      placeholder="e.g. open-source, backend, ai..."
                      className="flex-1 px-4 py-2.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                    />
                    <button
                      onClick={() => { if (newTag.trim()) createTagMutation.mutate(newTag.trim()); }}
                      disabled={!newTag.trim() || createTagMutation.status === "loading"}
                      className="px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant">Press Enter or click Add to create a tag.</p>
                </div>
              </div>
            )}

            {/* Team Section */}
            {activeSection === "team" && (
              <div className="space-y-4">
                {/* Manager */}
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-4">
                  <h2 className="font-bold font-headline text-on-surface">My Manager</h2>
                  {managerData ? (
                    <Link href={`/techies/${managerData.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors">
                      <Image
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary-container"
                        width={48}
                        height={48}
                        src={
                          managerData.profile_pic_url ||
                          `https://api.dicebear.com/7.x/initials/jpg?seed=${managerData.first_name} ${managerData.last_name}`
                        }
                        alt={managerData.first_name}
                      />
                      <div>
                        <p className="font-semibold text-on-surface">{managerData.first_name} {managerData.last_name}</p>
                        <p className="text-sm text-on-surface-variant">@{managerData.username}</p>
                        {getStackName(managerData) && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium mt-1 inline-block">
                            {getStackName(managerData)}
                          </span>
                        )}
                      </div>
                      <span className="ml-auto material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </Link>
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-container-high text-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant block mb-2">person_off</span>
                      <p className="text-sm text-on-surface-variant">No manager assigned yet</p>
                    </div>
                  )}
                </div>

                {/* Direct reports */}
                <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold font-headline text-on-surface">
                      My Direct Reports {subordinates.length > 0 && <span className="text-on-surface-variant font-normal">({subordinates.length})</span>}
                    </h2>
                    <Link href="/org-chart" className="text-xs text-primary font-semibold hover:underline">Full chart →</Link>
                  </div>
                  {subordinates.length > 0 ? (
                    <div className="space-y-2">
                      {subordinates.map((sub: any) => (
                        <Link key={sub.id} href={`/techies/${sub.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors">
                          <Image
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-secondary-container"
                            width={40}
                            height={40}
                            src={
                              sub.profile_pic_url ||
                              `https://api.dicebear.com/7.x/initials/jpg?seed=${sub.first_name} ${sub.last_name}`
                            }
                            alt={sub.first_name}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-on-surface text-sm">{sub.first_name} {sub.last_name}</p>
                            <p className="text-xs text-on-surface-variant">@{sub.username}</p>
                          </div>
                          {getStackName(sub) && (
                            <span className="text-xs px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-medium">
                              {getStackName(sub)}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-surface-container-high text-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant block mb-2">group_off</span>
                      <p className="text-sm text-on-surface-variant">No direct reports yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(isUserLoading || isStacksLoading) && activeSection === "profile" && (
              <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 mt-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-40 bg-surface-container-high rounded" />
                  <div className="h-12 w-full bg-surface-container-high rounded" />
                  <div className="h-12 w-full bg-surface-container-high rounded" />
                  <div className="h-24 w-full bg-surface-container-high rounded" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
