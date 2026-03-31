"use client";

import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

function Page() { // NOSONAR
  const { id } = useParams();
  const { getSpecificUser, getUserSubordinates, getProjects, getFeedsWithPagination } = useEndpoints();
  const { status: sessionStatus } = useSession();
  const [imgError, setImgError] = useState(false);
  const userId = Number(Array.isArray(id) ? id[0] : id);
  const isAuthed = sessionStatus === "authenticated" && Number.isFinite(userId) && userId > 0;

  const { data: UserProfile, isLoading, isError } = useQuery({
    queryKey: ["userprofile", id],
    queryFn: () => getSpecificUser(id).then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: isAuthed,
  });

  const { data: managerProfile } = useQuery({
    queryKey: ["userprofile", "manager", UserProfile?.manager_id],
    queryFn: () => getSpecificUser(UserProfile?.manager_id).then((res) => res.data),
    enabled: isAuthed && !!UserProfile?.manager_id,
    refetchOnWindowFocus: false,
  });

  const { data: subordinatesData } = useQuery({
    queryKey: ["userSubordinates", userId],
    queryFn: () => getUserSubordinates(userId).then((res) => res.data),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects", "for-user", userId],
    queryFn: () => getProjects().then((res) => res.data),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  const { data: feedsData } = useQuery({
    queryKey: ["feeds", "for-user", userId],
    queryFn: () => getFeedsWithPagination(1),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  const fallbackUrl = `https://api.dicebear.com/7.x/initials/jpg?seed=${UserProfile?.first_name ?? ""} ${UserProfile?.last_name ?? ""}`;
  const profilePicUrl =
    !imgError && UserProfile?.profile_pic_url && UserProfile.profile_pic_url !== "string"
      ? UserProfile.profile_pic_url
      : fallbackUrl;
  const managerPicUrl = managerProfile?.profile_pic_url && managerProfile.profile_pic_url !== "string"
    ? managerProfile.profile_pic_url
    : `https://api.dicebear.com/7.x/initials/jpg?seed=${managerProfile?.first_name ?? ""} ${managerProfile?.last_name ?? ""}`;

  const relatedProjects = useMemo(() => {
    const items = projectsData?.items || [];
    return items.filter((project: any) =>
      (project.members || []).some((member: any) => Number(member?.id) === userId)
    );
  }, [projectsData?.items, userId]);

  const recentPosts = useMemo(() => {
    const items = feedsData?.items || [];
    return items
      .filter((post: any) => Number(post?.user?.id) === userId)
      .slice(0, 3);
  }, [feedsData?.items, userId]);

  const joinedDate = UserProfile?.created_at
    ? new Date(UserProfile.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown";
  const statusBadgeClass =
    UserProfile?.status === "ACCEPTED"
      ? "bg-secondary-container text-on-secondary-container"
      : "bg-surface-container-high text-on-surface-variant";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !UserProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant">person_off</span>
        <p className="text-on-surface-variant font-medium">Could not load profile</p>
        <Link href="/techies" className="text-primary font-semibold hover:underline text-sm">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  const techTask = UserProfile?.technical_task;

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
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          {/* Avatar */}
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl border-4 border-surface-container-lowest bg-surface-container-lowest overflow-hidden shadow-lg flex-shrink-0">
            <Image
              src={profilePicUrl}
              width={160}
              height={160}
              className="w-full h-full object-cover"
              alt={`${UserProfile.first_name} ${UserProfile.last_name}`}
              onError={() => setImgError(true)}
            />
          </div>

          {/* Name & Actions */}
          <div className="flex-1 mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface">
                  {UserProfile.first_name} {UserProfile.last_name}
                </h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass}`}>
                  {UserProfile.status || "Active"}
                </span>
              </div>
              <p className="text-on-surface-variant font-medium">
                @{UserProfile.username} · {UserProfile.stack?.name ? `${UserProfile.stack.name} Developer` : "Techie"}
              </p>
            </div>
            <div className="flex gap-3">
              {UserProfile.email && (
                <a href={`mailto:${UserProfile.email}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm shadow-md hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {" "}
                  <span>Message</span>
                </a>
              )}
              <Link href="/techies"
                className="px-4 py-2.5 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface font-semibold text-sm hover:bg-surface-container-high transition-colors">
                ← Directory
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Details Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
              <h3 className="font-headline font-bold text-base mb-6 text-on-surface">Details</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">layers</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Stack</p>
                    <p className="text-on-surface font-semibold text-sm">{UserProfile.stack?.name || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">history_edu</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Experience</p>
                    <p className="text-on-surface font-semibold text-sm">
                      {UserProfile.years_of_experience ? `${UserProfile.years_of_experience} Years` : "Not specified"}
                    </p>
                  </div>
                </div>
                {UserProfile.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">mail</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Email</p>
                      <p className="text-on-surface font-semibold text-sm truncate">{UserProfile.email}</p>
                    </div>
                  </div>
                )}
                {UserProfile.phone_number && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined text-lg">phone</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Phone</p>
                      <p className="text-on-surface font-semibold text-sm">{UserProfile.phone_number}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Joined</p>
                    <p className="text-on-surface font-semibold text-sm">{joinedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Role</p>
                    <p className="text-on-surface font-semibold text-sm capitalize">{UserProfile.role?.name || "user"}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(UserProfile.portfolio_url || UserProfile.github_profile || UserProfile.linkedin_profile || UserProfile.twitter_profile) && (
                <div className="mt-6 pt-6 border-t border-surface-container">
                  <h4 className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-4">Connect</h4>
                  <div className="flex gap-3 flex-wrap">
                    {UserProfile.portfolio_url && (
                      <a href={UserProfile.portfolio_url} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                        title="Portfolio">
                        <span className="material-symbols-outlined text-sm">language</span>
                      </a>
                    )}
                    {UserProfile.github_profile && (
                      <a href={UserProfile.github_profile} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                        title="GitHub">
                        <span className="material-symbols-outlined text-sm">code</span>
                      </a>
                    )}
                    {UserProfile.linkedin_profile && (
                      <a href={UserProfile.linkedin_profile} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                        title="LinkedIn">
                        <span className="material-symbols-outlined text-sm">work</span>
                      </a>
                    )}
                    {UserProfile.twitter_profile && (
                      <a href={UserProfile.twitter_profile} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"
                        title="Twitter / X">
                        <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Skills Card */}
            {UserProfile.skills && UserProfile.skills.length > 0 && (
              <div className="bg-surface-container-low rounded-xl p-6">
                <h4 className="font-headline font-bold text-on-surface mb-4 text-base">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {UserProfile.skills.map((skill: any) => (
                    <span key={`${typeof skill === "string" ? skill : skill?.name || "skill"}-${UserProfile.id}`}
                      className="px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-sm border border-outline-variant/10">
                      {typeof skill === "string" ? skill : skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {UserProfile.tags && UserProfile.tags.length > 0 && (
              <div className="bg-surface-container-low rounded-xl p-6">
                <h4 className="font-headline font-bold text-on-surface mb-4 text-base">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {UserProfile.tags.map((tag: any) => (
                    <span
                      key={tag.id || tag?.name}
                      className="px-3 py-1.5 bg-surface-container-lowest text-on-surface text-xs font-semibold rounded-lg shadow-sm border border-outline-variant/10"
                    >
                      {tag?.name || "Tag"}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* About */}
            {UserProfile.bio && (
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <h3 className="font-headline font-bold text-base mb-4 text-on-surface">
                  About {UserProfile.first_name}
                </h3>
                <p className="text-on-surface-variant leading-relaxed">{UserProfile.bio}</p>
              </div>
            )}

            {/* Technical Task */}
            {techTask && (
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-base text-on-surface">Assessment Task</h3>
                    <p className="text-xs text-on-surface-variant">Technical evaluation submission</p>
                  </div>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {techTask.description || "No description available"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techTask.github_link && (
                    <a href={techTask.github_link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors group">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">code</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">GitHub</p>
                        <p className="text-sm font-semibold text-on-surface truncate">View Repository</p>
                      </div>
                    </a>
                  )}
                  {techTask.live_demo_url && (
                    <a href={techTask.live_demo_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors group">
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">open_in_new</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Demo</p>
                        <p className="text-sm font-semibold text-on-surface truncate">View Demo</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
              <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Reporting Line</h3>

              {managerProfile ? (
                <div className="mb-5">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Manager</p>
                  <Link
                    href={`/techies/${managerProfile.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
                  >
                    <Image
                      className="w-11 h-11 rounded-full object-cover"
                      width={44}
                      height={44}
                      src={managerPicUrl}
                      alt={`${managerProfile.first_name} ${managerProfile.last_name}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {managerProfile.first_name} {managerProfile.last_name}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">@{managerProfile.username}</p>
                    </div>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant mb-5">No manager assigned</p>
              )}

              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                Direct Reports ({subordinatesData?.length || 0})
              </p>
              {subordinatesData && subordinatesData.length > 0 ? (
                <div className="space-y-2">
                  {subordinatesData.slice(0, 5).map((sub: any) => {
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
                          className="w-10 h-10 rounded-full object-cover"
                          width={40}
                          height={40}
                          src={subPicUrl}
                          alt={`${sub.first_name} ${sub.last_name}`}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-on-surface truncate">
                            {sub.first_name} {sub.last_name}
                          </p>
                          <p className="text-xs text-on-surface-variant truncate">@{sub.username}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No direct reports</p>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
              <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Projects</h3>
              {relatedProjects.length > 0 ? (
                <div className="space-y-3">
                  {relatedProjects.slice(0, 4).map((project: any) => (
                    <Link
                      key={project.id}
                      href={`/community-projects/${project.id}`}
                      className="block p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
                    >
                      <p className="text-sm font-semibold text-on-surface">{project.name}</p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                        {project.description || "No description provided"}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No project records found for this member.</p>
              )}
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
              <h3 className="font-headline font-bold text-base mb-4 text-on-surface">Recent Activity</h3>
              {recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {recentPosts.map((post: any) => (
                    <div key={post.id} className="p-4 rounded-xl bg-surface-container">
                      <p className="text-sm text-on-surface line-clamp-3">{post.content}</p>
                      <p className="text-xs text-on-surface-variant mt-2">
                        {post.created_at ? new Date(post.created_at).toLocaleString() : "Recently"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant">No recent feed activity on the first page yet.</p>
              )}
            </div>

            {/* No bio / no task empty state */}
            {!UserProfile.bio && !techTask && relatedProjects.length === 0 && recentPosts.length === 0 && (
              <div className="bg-surface-container-low rounded-xl p-10 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3 block">person</span>
                <p className="text-on-surface-variant text-sm">This member hasn't filled out their profile yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
