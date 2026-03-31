"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loadingSpinner";
import toast from "react-hot-toast";

type MeetingForm = {
  title: string;
  meeting_url: string;
  description: string;
  scheduled_time: string;
  recurrence: string;
  is_active: boolean;
};

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No recurrence" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

function MeetingModal({
  open,
  onClose,
  initial,
  onSubmit,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  initial?: any;
  onSubmit: (data: MeetingForm) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<MeetingForm>({
    title: initial?.title || "",
    meeting_url: initial?.meeting_url || "",
    description: initial?.description || "",
    scheduled_time: initial?.scheduled_time ? initial.scheduled_time.slice(0, 16) : "",
    recurrence: initial?.recurrence || "none",
    is_active: initial?.is_active ?? true,
  });

  useEffect(() => {
    setForm({
      title: initial?.title || "",
      meeting_url: initial?.meeting_url || "",
      description: initial?.description || "",
      scheduled_time: initial?.scheduled_time ? initial.scheduled_time.slice(0, 16) : "",
      recurrence: initial?.recurrence || "none",
      is_active: initial?.is_active ?? true,
    });
  }, [initial]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <h2 className="text-lg font-bold font-headline text-on-surface">
            {initial ? "Edit Meeting" : "New Meeting"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Weekly team standup..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Meeting URL</label>
            <input
              value={form.meeting_url}
              onChange={(e) => setForm((f) => ({ ...f, meeting_url: e.target.value }))}
              className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://meet.google.com/..."
              type="url"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="What's this meeting about..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Scheduled Time</label>
              <input
                type="datetime-local"
                value={form.scheduled_time}
                onChange={(e) => setForm((f) => ({ ...f, scheduled_time: e.target.value }))}
                className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Recurrence</label>
              <select
                value={form.recurrence}
                onChange={(e) => setForm((f) => ({ ...f, recurrence: e.target.value }))}
                className="w-full bg-surface-container-low rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {RECURRENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm font-medium text-on-surface">Mark as active meeting</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-outline">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-outline text-sm font-medium text-on-surface hover:bg-surface-container-high"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form)}
            disabled={saving || !form.title || !form.meeting_url}
            className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : initial ? "Save Changes" : "Create Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  const {
    getAllMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getUserProfile,
  } = useEndpoints();
  const { status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState<any>(null);

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((r) => r.data),
    enabled: sessionStatus === "authenticated",
    refetchOnWindowFocus: false,
  });

  const { data: meetingsData, isLoading, isError } = useQuery({
    queryKey: ["allMeetings"],
    queryFn: () => getAllMeetings().then((r) => r.data),
    refetchOnWindowFocus: false,
  });

  const isAdmin = userProfile?.role?.name === "admin";
  const meetings: any[] = Array.isArray(meetingsData)
    ? meetingsData
    : meetingsData?.items || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => createMeeting(data),
    onSuccess: () => {
      toast.success("Meeting created!");
      queryClient.invalidateQueries({ queryKey: ["allMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to create meeting."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMeeting(id, data),
    onSuccess: () => {
      toast.success("Meeting updated!");
      queryClient.invalidateQueries({ queryKey: ["allMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
      setEditMeeting(null);
    },
    onError: () => toast.error("Failed to update meeting."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMeeting(id),
    onSuccess: () => {
      toast.success("Meeting deleted.");
      queryClient.invalidateQueries({ queryKey: ["allMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
    },
    onError: () => toast.error("Failed to delete meeting."),
  });

  const handleSubmit = (form: MeetingForm) => {
    const payload: any = {
      title: form.title,
      meeting_url: form.meeting_url,
      description: form.description || undefined,
      scheduled_time: form.scheduled_time || undefined,
      recurrence: form.recurrence !== "none" ? form.recurrence : undefined,
      is_active: form.is_active,
    };
    if (editMeeting) {
      updateMutation.mutate({ id: editMeeting.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const activeMeeting = meetings.find((m) => m.is_active);
  const otherMeetings = meetings.filter((m) => !m.is_active);

  return (
    <main className="flex-1 bg-surface-container-lowest min-w-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fbf9f8] border-b border-outline-variant/20 px-4 md:px-8 py-4 md:py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black font-headline text-on-surface">
              Weekly Meetings
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Join and track all network meetings
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setEditMeeting(null); setIsModalOpen(true); }}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all whitespace-nowrap"
            >
              + New Meeting
            </button>
          )}
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
        {isLoading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <div className="bg-error-container border border-error rounded-xl p-6 text-center">
            <p className="text-on-error-container font-medium">Failed to load meetings.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Active Meeting */}
            {activeMeeting ? (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                  Active Meeting
                </h2>
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">video_call</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Live</span>
                          {activeMeeting.recurrence && activeMeeting.recurrence !== "none" && (
                            <span className="px-2 py-0.5 bg-white/15 rounded-full text-[10px] font-medium capitalize">{activeMeeting.recurrence}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-xl text-white">{activeMeeting.title}</h3>
                        {activeMeeting.scheduled_time && (
                          <p className="text-white/75 text-xs mt-0.5">
                            <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">schedule</span>
                            {new Date(activeMeeting.scheduled_time).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        {activeMeeting.description && (
                          <p className="text-white/80 text-sm mt-1">{activeMeeting.description}</p>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => { setEditMeeting(activeMeeting); setIsModalOpen(true); }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this meeting?")) deleteMutation.mutate(activeMeeting.id);
                          }}
                          className="p-2 rounded-lg bg-white/10 hover:bg-red-500/40 transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <a
                    href={activeMeeting.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <span className="material-symbols-outlined">video_call</span>
                    Join Meeting
                  </a>
                </div>
              </section>
            ) : (
              <div className="bg-surface-container-low border border-outline rounded-xl p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">
                  event_busy
                </span>
                <p className="text-on-surface-variant font-medium">No active meeting right now</p>
                {isAdmin && (
                  <button
                    onClick={() => { setEditMeeting(null); setIsModalOpen(true); }}
                    className="mt-4 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold"
                  >
                    Schedule a Meeting
                  </button>
                )}
              </div>
            )}

            {/* Past / Other Meetings */}
            {otherMeetings.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                  All Meetings
                </h2>
                <div className="space-y-3">
                  {otherMeetings.map((meeting: any) => (
                    <div
                      key={meeting.id}
                      className="bg-surface-container-lowest border border-outline rounded-xl p-4 md:p-5 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-on-secondary-container">
                          video_call
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="font-semibold text-on-surface">{meeting.title}</h3>
                          {meeting.recurrence && meeting.recurrence !== "none" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 capitalize">{meeting.recurrence}</span>
                          )}
                        </div>
                        {meeting.scheduled_time && (
                          <p className="text-xs text-on-surface-variant mb-0.5">
                            <span className="material-symbols-outlined text-xs align-text-bottom mr-0.5">schedule</span>
                            {new Date(meeting.scheduled_time).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                        {meeting.description && (
                          <p className="text-sm text-on-surface-variant mt-0.5 line-clamp-2">
                            {meeting.description}
                          </p>
                        )}
                        <a
                          href={meeting.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>link</span>
                          {meeting.meeting_url}
                        </a>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => { setEditMeeting(meeting); setIsModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this meeting?")) deleteMutation.mutate(meeting.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {meetings.length === 0 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">
                  video_call
                </span>
                <h2 className="text-xl font-headline text-on-surface-variant">No meetings yet</h2>
              </div>
            )}
          </>
        )}
      </div>

      <MeetingModal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditMeeting(null); }}
        initial={editMeeting}
        onSubmit={handleSubmit}
        saving={createMutation.status === "loading" || updateMutation.status === "loading"}
      />
    </main>
  );
}
