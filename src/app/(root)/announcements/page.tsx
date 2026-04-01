"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";
import CreateAnnouncementModal from "@/components/modals/CreateAnnouncementModal";
import EditAnnouncementModal from "@/components/modals/EditAnnouncementModal";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const resolveImageUrl = (url?: string) => {
  if (!url) return "";
  const normalizedUrl = url.trim();
  if (!normalizedUrl) return "";
  if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://")) {
    return normalizedUrl;
  }
  if (!API_BASE_URL) {
    return normalizedUrl;
  }
  return `${API_BASE_URL.replace(/\/$/, "")}/${normalizedUrl.replace(/^\//, "")}`;
};

export default function AnnouncementsPage() {
  const { getAnnouncements, getUserProfile, deleteAnnouncement, getAllMeetings, getLatestTechieOTM } = useEndpoints();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState<any>(null);
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: announcementsData, isLoading, isError } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => getAnnouncements(),
    refetchOnWindowFocus: false,
  });

  const { data: userProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
  });

  const announcements = announcementsData?.data?.items || announcementsData?.data || [];
  const isAdmin = userProfileData?.role?.name === "admin";

  const { data: meetingsData } = useQuery({
    queryKey: ["allMeetings"],
    queryFn: () => getAllMeetings().then((r) => r.data),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const meetings: any[] = Array.isArray(meetingsData)
    ? meetingsData
    : meetingsData?.items || [];
  const activeMeeting = meetings.find((m: any) => m.is_active);
  const otherMeetings = meetings.filter((m: any) => !m.is_active);

  const { data: techieOTMData } = useQuery({
    queryKey: ["techieOTM", "latest"],
    queryFn: () => getLatestTechieOTM().then((res) => res.data),
    refetchOnWindowFocus: false,
    retry: false,
    onError: () => {},
  });
  const spotlightMember = techieOTMData?.user;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAnnouncement(id),
    onSuccess: () => {
      toast.success("Announcement deleted.");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: () => toast.error("Failed to delete announcement."),
  });

  const filteredAnnouncements = announcements.filter((item: any) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredAnnouncement = filteredAnnouncements[0];
  const restAnnouncements = filteredAnnouncements.slice(1);

  return (
    <main className="flex-1 bg-surface-container-lowest min-w-0">
      {/* Page Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f8] border-b border-outline-variant/20 px-6 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-surface-container-low rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-primary-container outline-none transition-all"
          />
          {isAdmin && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary text-on-primary px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-sm whitespace-nowrap hover:shadow-md transition-all"
            >
              + Create
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Page Title */}
        <div className="flex flex-col gap-2 mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface font-headline">
            Announcements
          </h1>
          <p className="text-on-surface-variant max-w-xl">
            Stay updated with the latest news and updates from the network
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-error-container border border-error rounded-xl p-6 text-center">
            <p className="text-on-error-container font-medium">
              Error loading announcements. Please try again.
            </p>
          </div>
        )}

        {/* Content Grid */}
        {!isLoading && !isError && filteredAnnouncements.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Feed (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Featured Announcement */}
              {featuredAnnouncement && (
                <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group border border-outline-variant/10">
                  <div className="h-48 md:h-64 relative overflow-hidden bg-stone-200">
                    {featuredAnnouncement.image_url ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        src={resolveImageUrl(featuredAnnouncement.image_url)}
                        alt={featuredAnnouncement.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-stone-300">image</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Announcement
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs mb-3 font-medium">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {new Date(featuredAnnouncement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h2 className="text-2xl font-bold font-headline mb-4 text-on-surface group-hover:text-primary transition-colors cursor-pointer">
                      {featuredAnnouncement.title}
                    </h2>
                    <p className="text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                      {featuredAnnouncement.content}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-on-surface">Network</p>
                          <p className="text-xs text-on-surface-variant">Announcement</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => setEditAnnouncement(featuredAnnouncement)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${featuredAnnouncement.title}"?`)) {
                                  deleteMutation.mutate(featuredAnnouncement.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </>
                        )}
                        <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 group">
                          <span>Read more</span>
                          <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Standard Announcements */}
              <div className="space-y-4">
                {restAnnouncements.map((announcement: any) => (
                  <article
                    key={announcement.id}
                    className="bg-surface-container-lowest p-6 rounded-xl flex flex-col md:flex-row gap-6 shadow-sm group border border-outline-variant/10 hover:shadow-md transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="md:w-40 h-40 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                      {announcement.image_url ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={resolveImageUrl(announcement.image_url)}
                          alt={announcement.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-stone-300">image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <span className="text-secondary font-bold text-[10px] uppercase tracking-wider">
                            Update
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-on-surface-variant text-[10px]">
                              {new Date(announcement.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => setEditAnnouncement(announcement)}
                                  className="p-1 rounded hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                                  title="Edit"
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete "${announcement.title}"?`)) {
                                      deleteMutation.mutate(announcement.id);
                                    }
                                  }}
                                  className="p-1 rounded hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                                  title="Delete"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        <h3 className="text-lg font-bold font-headline mb-2 text-on-surface group-hover:text-primary transition-colors">
                          {announcement.title}
                        </h3>
                        <p className="text-on-surface-variant text-sm line-clamp-2 mb-4">
                          {announcement.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px]">
                          <span className="material-symbols-outlined text-sm">public</span>
                        </div>
                        <span className="text-xs font-medium text-on-surface">Network · Admin</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right Sidebar (4 columns) */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Employee of the Month */}
              {spotlightMember ? (
                <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-xl p-6 text-white space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-300 text-lg">star</span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-90">Employee of the Month</span>
                  </div>
                  <Link href={`/techies/${spotlightMember.id}`} className="flex flex-col items-center text-center gap-3">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/30 shadow-lg">
                        <Image
                          className="w-full h-full object-cover"
                          width={80}
                          height={80}
                          src={spotlightMember.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${spotlightMember.first_name} ${spotlightMember.last_name}`}
                          alt={spotlightMember.first_name}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow">
                        <span className="material-symbols-outlined text-sm">star</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold font-headline text-white">{spotlightMember.first_name} {spotlightMember.last_name}</h4>
                      <p className="text-sm opacity-80">{spotlightMember.stack?.name || "Network Member"}</p>
                      {techieOTMData?.points && <p className="text-xs opacity-70 mt-0.5">{techieOTMData.points} pts</p>}
                    </div>
                  </Link>
                  {spotlightMember.bio && (
                    <div className="bg-white/10 px-4 py-3 rounded-lg text-sm italic opacity-90 line-clamp-2">
                      "{spotlightMember.bio}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-lg">star</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Employee of the Month</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-4 border-surface-container-lowest shadow-lg">
                        <span className="material-symbols-outlined text-white text-4xl">person</span>
                      </div>
                      <div className="absolute bottom-0 right-0 bg-primary text-on-primary w-7 h-7 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="material-symbols-outlined text-base">star</span>
                      </div>
                    </div>
                    <p className="text-sm text-on-surface-variant">Not yet announced</p>
                  </div>
                </div>
              )}

              {/* Weekly Meetings */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface">Weekly Meetings</h3>
                  <Link href="/meetings" className="text-primary text-xs font-bold hover:underline">View All</Link>
                </div>

                {activeMeeting && (
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-white text-base">video_call</span>
                      <span className="font-semibold text-sm flex-1 truncate">{activeMeeting.title}</span>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0">Active</span>
                    </div>
                    {activeMeeting.scheduled_time && (
                      <p className="text-xs opacity-75">
                        <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">schedule</span>
                        {new Date(activeMeeting.scheduled_time).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                    <a
                      href={activeMeeting.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full bg-white text-blue-700 font-bold py-2 rounded-lg text-xs transition-colors hover:bg-blue-50"
                    >
                      <span className="material-symbols-outlined text-sm">link</span>
                      Join
                    </a>
                  </div>
                )}

                {otherMeetings.length > 0 && (
                  <div className="space-y-3">
                    {otherMeetings.slice(0, 3).map((meeting: any) => (
                      <div key={meeting.id} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-container text-base">video_call</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-on-surface line-clamp-1">{meeting.title}</p>
                          {meeting.scheduled_time && (
                            <p className="text-xs text-on-surface-variant">
                              {new Date(meeting.scheduled_time).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </p>
                          )}
                          <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                            <span className="material-symbols-outlined" style={{fontSize: '12px'}}>link</span>Join
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {meetings.length === 0 && (
                  <div className="text-center py-4">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant block mb-1">event_busy</span>
                    <p className="text-sm text-on-surface-variant">No meetings scheduled yet</p>
                  </div>
                )}

                <Link
                  href="/meetings"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-outline text-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  See All Meetings
                </Link>
              </div>
            </aside>
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">
                notifications_none
              </span>
              <h2 className="text-xl font-headline text-on-surface-variant">
                No announcements found
              </h2>
            </div>
          )
        )}
      </div>

      <CreateAnnouncementModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditAnnouncementModal
        isOpen={!!editAnnouncement}
        onClose={() => setEditAnnouncement(null)}
        announcement={editAnnouncement}
      />
    </main>
  );
}
