"use client";

import { useQuery } from "@tanstack/react-query";
import useEndpoints from "@/services";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const {
    getUserProfile,
    getFeedsWithPagination,
    getTechiesList,
    getAnnouncements,
    getLatestTechieOTM,
    getActiveMeeting,
    getLatestChallenge,
  } = useEndpoints();
  const { status: sessionStatus } = useSession();

  const isAuthed = sessionStatus === "authenticated";

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    enabled: isAuthed,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const user = userProfile;

  const { data: feedsData } = useQuery({
    queryKey: ["recentFeeds"],
    queryFn: () => getFeedsWithPagination(1),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  const { data: techiesData } = useQuery({
    queryKey: ["techies", 1],
    queryFn: () => getTechiesList({ page: 1 }),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  const { data: announcementsData } = useQuery({
    queryKey: ["announcements", "dashboard"],
    queryFn: () => getAnnouncements(3),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
  });

  const { data: techieOTMData } = useQuery({
    queryKey: ["techieOTM", "latest"],
    queryFn: () => getLatestTechieOTM().then((res) => res.data),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
    retry: false,
    onError: () => {},
  });

  const { data: activeMeetingData } = useQuery({
    queryKey: ["activeMeeting"],
    queryFn: () => getActiveMeeting().then((res) => res.data),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: latestChallengeData } = useQuery({
    queryKey: ["latestChallenge"],
    queryFn: () => getLatestChallenge().then((res) => res.data),
    enabled: isAuthed,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const recentFeeds = feedsData?.items || [];
  const activeMembersTotal = techiesData?.total || 0;
  const recentAnnouncements: any[] = announcementsData?.data?.items || announcementsData?.data || [];
  const spotlightMember = techieOTMData?.user;
  const latestAnnouncement = recentAnnouncements[0];

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="w-full min-h-screen bg-surface-container-lowest">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 p-4 md:p-8 max-w-7xl mx-auto">

        {/* Left Column */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <div
            className="relative rounded-xl overflow-hidden border border-outline min-h-60 flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #154212 0%, #2d5a27 100%)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
            <div className="relative px-4 md:px-6 py-8 md:py-10 space-y-4 flex flex-col items-center justify-center w-full">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl">
                <Image
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                  src={user?.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${user?.first_name} ${user?.last_name}`}
                  alt="profile"
                />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold font-headline text-white">{user?.first_name} {user?.last_name}</h3>
                <p className="text-sm text-white/80 font-body">{user?.stack?.name || "Stack not set"}</p>
                {user?.role?.name === "admin" && (
                  <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold uppercase rounded-full tracking-wider">Admin</span>
                )}
              </div>
              <Link href="/techie/me" className="block w-full text-center text-sm font-semibold text-white hover:underline pt-1">
                View My Profile →
              </Link>
            </div>
          </div>

          {/* My Circle */}
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold font-headline text-on-surface text-sm">My Circle</h4>
              <Link href="/org-chart" className="text-xs text-primary font-semibold hover:underline">View chart</Link>
            </div>
            <p className="text-xs text-on-surface-variant">See your manager and direct reports in the organization tree.</p>
            <Link
              href="/org-chart"
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-outline hover:bg-surface-container-high transition-colors text-sm font-medium text-on-surface"
            >
              <span className="material-symbols-outlined text-primary">account_tree</span>
              Open My Team View
            </Link>
          </div>

          {/* Active Meeting */}
          {activeMeetingData && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-lg">video_call</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">Active Meeting</span>
              </div>
              <div>
                <h3 className="font-bold text-white">{activeMeetingData.title}</h3>
                {activeMeetingData.scheduled_time && (
                  <p className="text-xs opacity-75 mt-1">
                    <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">schedule</span>
                    {new Date(activeMeetingData.scheduled_time).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {activeMeetingData.recurrence && activeMeetingData.recurrence !== "none" && (
                      <span className="ml-1 capitalize">· {activeMeetingData.recurrence}</span>
                    )}
                  </p>
                )}
                {activeMeetingData.description && (
                  <p className="text-xs opacity-80 mt-1 line-clamp-2">{activeMeetingData.description}</p>
                )}
              </div>
              <a
                href={activeMeetingData.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-lg">link</span>
                Join Meeting
              </a>
            </div>
          )}
        </div>

        {/* Center Column */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          {/* Greeting */}
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface">
              {greeting}, {user?.first_name} 👋
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant font-body mt-2">
              Here's what's happening in the network today.
            </p>
          </div>

          {/* Mobile Widgets - Show on mobile only */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {/* Techie of the Month */}
            {spotlightMember && (
              <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-xl p-4 text-white space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-300 text-lg">star</span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">Techie of the Month</span>
                </div>
                <Link href={`/techies/${spotlightMember.id}`} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40 flex-shrink-0">
                    <Image
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                      src={spotlightMember.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${spotlightMember.first_name} ${spotlightMember.last_name}`}
                      alt={spotlightMember.first_name}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{spotlightMember.first_name} {spotlightMember.last_name}</p>
                    <p className="text-xs opacity-80">{spotlightMember.stack?.name || "Network Member"}</p>
                    {techieOTMData?.points && <p className="text-xs opacity-70">{techieOTMData.points} pts</p>}
                  </div>
                </Link>
              </div>
            )}

            {/* My Circle */}
            <div className="bg-surface-container-lowest border border-outline rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-headline text-on-surface text-sm">My Circle</h4>
                <Link href="/org-chart" className="text-xs text-primary font-semibold hover:underline">View chart</Link>
              </div>
              <Link
                href="/org-chart"
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg border border-outline hover:bg-surface-container-high transition-colors text-sm font-medium text-on-surface"
              >
                <span className="material-symbols-outlined text-primary">account_tree</span>
                Open My Team View
              </Link>
            </div>

            {activeMeetingData && (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-lg">video_call</span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">Active Meeting</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">{activeMeetingData.title}</h3>
                  {activeMeetingData.scheduled_time && (
                    <p className="text-xs opacity-75 mt-0.5">
                      <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">schedule</span>
                      {new Date(activeMeetingData.scheduled_time).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                  {activeMeetingData.description && (
                    <p className="text-xs opacity-80 mt-1 line-clamp-2">{activeMeetingData.description}</p>
                  )}
                </div>
                <a
                  href={activeMeetingData.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">link</span>
                  Join Meeting
                </a>
              </div>
            )}
            {latestChallengeData && (
              <div className="bg-surface-container-lowest border border-outline rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">code</span>
                    <h4 className="font-bold font-headline text-on-surface text-sm">Challenge</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    latestChallengeData.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                    latestChallengeData.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    latestChallengeData.difficulty === "Hard" ? "bg-red-100 text-red-700" :
                    "bg-surface-container-high text-on-surface-variant"
                  }`}>{latestChallengeData.difficulty || "—"}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{latestChallengeData.title}</p>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{latestChallengeData.description}</p>
                  {latestChallengeData.deadline && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">
                      <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">timer</span>
                      Due {new Date(latestChallengeData.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
                {latestChallengeData.challenge_url && (
                  <a href={latestChallengeData.challenge_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-outline hover:bg-surface-container-high transition-colors text-sm font-medium text-on-surface">
                    <span className="material-symbols-outlined text-primary">open_in_new</span>
                    View Challenge
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-headline text-on-surface">Recent Activity</h3>
              <Link href="/feed" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
            </div>
            {recentFeeds.length > 0 ? (
              recentFeeds.slice(0, 3).map((post: any) => (
                <div key={post.id} className="bg-surface-container-lowest border border-outline rounded-xl p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-secondary-container">
                      <Image
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                        src={
                          post.user?.profile_pic_url ||
                          `https://api.dicebear.com/7.x/initials/jpg?seed=${post.user?.first_name} ${post.user?.last_name}`
                        }
                        alt={`${post.user?.first_name}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-on-surface text-sm">
                        {post.user?.first_name} {post.user?.last_name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-sm text-on-surface mt-2 leading-relaxed font-body line-clamp-2">
                        {post.content}
                      </p>
                      <div className="mt-3 pt-3 border-t border-outline">
                        <p className="text-xs text-on-surface-variant">
                          {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">rss_feed</span>
                <p className="text-on-surface-variant text-sm">No activity yet — be the first to post!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          {/* Network stats */}
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold font-headline text-on-surface text-sm">The Network</h4>
              <Link href="/techies" className="text-xs text-primary font-semibold hover:underline">View all</Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container ring-2 ring-white flex items-center justify-center text-white text-xs font-bold">
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-sm text-on-surface-variant font-body">
                {activeMembersTotal > 0 ? `${activeMembersTotal} members` : "Loading..."}
              </span>
            </div>
          </div>

          {/* Techie of the Month */}
          {spotlightMember && (
            <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-xl p-5 text-white space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-300 text-lg">star</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">Techie of the Month</span>
              </div>
              <Link href={`/techies/${spotlightMember.id}`} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/40 flex-shrink-0">
                  <Image
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                    src={spotlightMember.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${spotlightMember.first_name} ${spotlightMember.last_name}`}
                    alt={spotlightMember.first_name}
                  />
                </div>
                <div>
                  <p className="font-bold text-white">{spotlightMember.first_name} {spotlightMember.last_name}</p>
                  <p className="text-xs opacity-80">{spotlightMember.stack?.name || "Network Member"}</p>
                  {techieOTMData?.points && <p className="text-xs opacity-70 mt-0.5">{techieOTMData.points} pts</p>}
                </div>
              </Link>
            </div>
          )}

          {/* Coding Challenge */}
          {latestChallengeData && (
            <div className="bg-surface-container-lowest border border-outline rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">code</span>
                  <h4 className="font-bold font-headline text-on-surface text-sm">Challenge</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  latestChallengeData.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                  latestChallengeData.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  latestChallengeData.difficulty === "Hard" ? "bg-red-100 text-red-700" :
                  "bg-surface-container-high text-on-surface-variant"
                }`}>{latestChallengeData.difficulty || "—"}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">{latestChallengeData.title}</p>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{latestChallengeData.description}</p>
                {latestChallengeData.deadline && (
                  <p className="text-xs text-orange-600 mt-1.5 font-medium">
                    <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">timer</span>
                    Due {new Date(latestChallengeData.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
              {latestChallengeData.challenge_url && (
                <a
                  href={latestChallengeData.challenge_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg border border-outline hover:bg-surface-container-high transition-colors text-sm font-medium text-on-surface"
                >
                  <span className="material-symbols-outlined text-primary">open_in_new</span>
                  View Challenge
                </a>
              )}
            </div>
          )}

          {/* Announcements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider font-headline text-on-surface">Announcements</h4>
              <Link href="/announcements" className="text-xs text-primary font-semibold hover:underline">View all</Link>
            </div>
            {recentAnnouncements.slice(0, 4).map((announcement: any) => (
              <Link href="/announcements" key={announcement.id}>
                <div className="bg-surface-container-lowest border border-outline rounded-lg p-3 hover:bg-surface-container-high transition-colors cursor-pointer mb-2">
                  <p className="text-xs font-semibold text-on-surface line-clamp-1">{announcement.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{announcement.content}</p>
                </div>
              </Link>
            ))}
            {recentAnnouncements.length === 0 && (
              <div className="bg-surface-container-lowest border border-outline rounded-lg p-3 text-center">
                <p className="text-xs text-on-surface-variant">No announcements yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
