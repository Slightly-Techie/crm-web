"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

type Tab = "meetings" | "challenges" | "skills" | "totm" | "submissions" | "emailTemplates";

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No recurrence" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const emptyMeetingForm = {
  title: "",
  meeting_url: "",
  description: "",
  scheduled_time: "",
  recurrence: "none",
  is_active: true,
};

const emptyChallengeForm = {
  title: "",
  description: "",
  challenge_type: "LEETCODE",
  difficulty: "Easy",
  challenge_url: "",
  deadline: "",
};

const emptyEmailTemplateForm = {
  template_name: "",
  subject: "",
  html_content: "",
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("meetings");
  const {
    getAllMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getAllChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getAllSkillsFlat,
    createSkillInPool,
    deleteSkillFromPool,
    getAllTechieOTM,
    createTechieOTM,
    getTechiesList,
    getAllSubmissions,
    getAllEmailTemplates,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
  } = useEndpoints();
  const queryClient = useQueryClient();

  // Meeting states
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ ...emptyMeetingForm });

  // Challenge states
  const [editingChallenge, setEditingChallenge] = useState<any>(null);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeForm, setChallengeForm] = useState({ ...emptyChallengeForm });

  // Skill pool states
  const [newSkillName, setNewSkillName] = useState("");

  // TOTM states
  const [totmUserId, setTotmUserId] = useState("");
  const [totmPoints, setTotmPoints] = useState("");
  const [totmSearch, setTotmSearch] = useState("");

  // Submission states
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Email Template states
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({ ...emptyEmailTemplateForm });

  // Fetch data
  const { data: meetingsData } = useQuery({
    queryKey: ["adminMeetings"],
    queryFn: () => getAllMeetings().then((res) => res.data),
    enabled: activeTab === "meetings",
  });

  const { data: challengesData } = useQuery({
    queryKey: ["adminChallenges"],
    queryFn: () => getAllChallenges().then((res) => res.data),
    enabled: activeTab === "challenges",
  });

  const { data: skillsPool = [] } = useQuery({
    queryKey: ["skillsPool"],
    queryFn: () => getAllSkillsFlat().then((res) => {
      const d = res.data as any;
      return Array.isArray(d) ? d : d?.items || [];
    }),
    enabled: activeTab === "skills",
  });

  const { data: totmHistory } = useQuery({
    queryKey: ["totmHistory"],
    queryFn: () => getAllTechieOTM().then((res) => {
      const d = res.data as any;
      return Array.isArray(d) ? d : d?.items || [];
    }),
    enabled: activeTab === "totm",
  });

  const { data: membersData } = useQuery({
    queryKey: ["allMembers"],
    queryFn: () => getTechiesList({ page: 1 }),
    enabled: activeTab === "totm",
    refetchOnWindowFocus: false,
  });

  const { data: submissionsData } = useQuery({
    queryKey: ["adminSubmissions"],
    queryFn: () => getAllSubmissions().then((res) => res.data),
    enabled: activeTab === "submissions",
  });

  const { data: templatesData } = useQuery({
    queryKey: ["emailTemplates"],
    queryFn: () => getAllEmailTemplates().then((res) => res.data),
    enabled: activeTab === "emailTemplates",
  });

  // Helpers to open forms
  const openNewMeeting = () => {
    setEditingMeeting(null);
    setMeetingForm({ ...emptyMeetingForm });
    setShowMeetingForm(true);
  };

  const openEditMeeting = (m: any) => {
    setEditingMeeting(m);
    setMeetingForm({
      title: m.title || "",
      meeting_url: m.meeting_url || "",
      description: m.description || "",
      scheduled_time: m.scheduled_time ? m.scheduled_time.slice(0, 16) : "",
      recurrence: m.recurrence || "none",
      is_active: m.is_active ?? true,
    });
    setShowMeetingForm(true);
  };

  const openNewChallenge = () => {
    setEditingChallenge(null);
    setChallengeForm({ ...emptyChallengeForm });
    setShowChallengeForm(true);
  };

  const openEditChallenge = (c: any) => {
    setEditingChallenge(c);
    setChallengeForm({
      title: c.title || "",
      description: c.description || "",
      challenge_type: c.challenge_type || "LEETCODE",
      difficulty: c.difficulty || "Easy",
      challenge_url: c.challenge_url || "",
      deadline: c.deadline ? c.deadline.slice(0, 16) : "",
    });
    setShowChallengeForm(true);
  };

  // Meeting mutations
  const createMeetingMutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      toast.success("Meeting created!");
      queryClient.invalidateQueries({ queryKey: ["adminMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["allMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
      setShowMeetingForm(false);
      setMeetingForm({ ...emptyMeetingForm });
    },
    onError: () => toast.error("Failed to create meeting"),
  });

  const updateMeetingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMeeting(id, data),
    onSuccess: () => {
      toast.success("Meeting updated!");
      queryClient.invalidateQueries({ queryKey: ["adminMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["allMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
      setShowMeetingForm(false);
      setEditingMeeting(null);
    },
    onError: () => toast.error("Failed to update meeting"),
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      toast.success("Meeting deleted!");
      queryClient.invalidateQueries({ queryKey: ["adminMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["allMeetings"] });
      queryClient.invalidateQueries({ queryKey: ["activeMeeting"] });
    },
    onError: () => toast.error("Failed to delete meeting"),
  });

  const handleMeetingSubmit = () => {
    const payload: any = {
      title: meetingForm.title,
      meeting_url: meetingForm.meeting_url,
      description: meetingForm.description || undefined,
      scheduled_time: meetingForm.scheduled_time || undefined,
      recurrence: meetingForm.recurrence !== "none" ? meetingForm.recurrence : undefined,
      is_active: meetingForm.is_active,
    };
    if (editingMeeting) {
      updateMeetingMutation.mutate({ id: editingMeeting.id, data: payload });
    } else {
      createMeetingMutation.mutate(payload);
    }
  };

  // Challenge mutations
  const createChallengeMutation = useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      toast.success("Challenge created!");
      queryClient.invalidateQueries({ queryKey: ["adminChallenges"] });
      queryClient.invalidateQueries({ queryKey: ["latestChallenge"] });
      setShowChallengeForm(false);
      setChallengeForm({ ...emptyChallengeForm });
    },
    onError: () => toast.error("Failed to create challenge"),
  });

  const updateChallengeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateChallenge(id, data),
    onSuccess: () => {
      toast.success("Challenge updated!");
      queryClient.invalidateQueries({ queryKey: ["adminChallenges"] });
      queryClient.invalidateQueries({ queryKey: ["latestChallenge"] });
      setShowChallengeForm(false);
      setEditingChallenge(null);
    },
    onError: () => toast.error("Failed to update challenge"),
  });

  const deleteChallengeMutation = useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      toast.success("Challenge deleted!");
      queryClient.invalidateQueries({ queryKey: ["adminChallenges"] });
      queryClient.invalidateQueries({ queryKey: ["latestChallenge"] });
    },
    onError: () => toast.error("Failed to delete challenge"),
  });

  const handleChallengeSubmit = () => {
    const payload: any = {
      title: challengeForm.title,
      description: challengeForm.description,
      challenge_type: challengeForm.challenge_type,
      difficulty: challengeForm.difficulty || undefined,
      challenge_url: challengeForm.challenge_url || undefined,
      deadline: challengeForm.deadline || undefined,
    };
    if (editingChallenge) {
      updateChallengeMutation.mutate({ id: editingChallenge.id, data: payload });
    } else {
      createChallengeMutation.mutate(payload);
    }
  };

  // Skill pool mutations
  const createSkillMutation = useMutation({
    mutationFn: (name: string) => createSkillInPool({ name }),
    onSuccess: () => {
      toast.success("Skill added to pool!");
      queryClient.invalidateQueries({ queryKey: ["skillsPool"] });
      setNewSkillName("");
    },
    onError: () => toast.error("Failed to add skill (may already exist)"),
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkillFromPool,
    onSuccess: () => {
      toast.success("Skill removed from pool.");
      queryClient.invalidateQueries({ queryKey: ["skillsPool"] });
    },
    onError: () => toast.error("Failed to remove skill"),
  });

  const createTotmMutation = useMutation({
    mutationFn: createTechieOTM,
    onSuccess: () => {
      toast.success("Techie of the Month nominated!");
      queryClient.invalidateQueries({ queryKey: ["totmHistory"] });
      queryClient.invalidateQueries({ queryKey: ["techieOTM", "latest"] });
      setTotmUserId("");
      setTotmPoints("");
      setTotmSearch("");
    },
    onError: () => toast.error("Failed to nominate"),
  });

  // Email Template mutations
  const createTemplateMutation = useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      toast.success("Email template created!");
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setShowTemplateForm(false);
      setTemplateForm({ ...emptyEmailTemplateForm });
    },
    onError: () => toast.error("Failed to create template"),
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateEmailTemplate(id, data),
    onSuccess: () => {
      toast.success("Email template updated!");
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setShowTemplateForm(false);
      setEditingTemplate(null);
    },
    onError: () => toast.error("Failed to update template"),
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      toast.success("Email template deleted!");
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
    },
    onError: () => toast.error("Failed to delete template"),
  });

  const openNewTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({ ...emptyEmailTemplateForm });
    setShowTemplateForm(true);
  };

  const openEditTemplate = (t: any) => {
    setEditingTemplate(t);
    setTemplateForm({
      template_name: t.template_name || "",
      subject: t.subject || "",
      html_content: t.html_content || "",
    });
    setShowTemplateForm(true);
  };

  const handleTemplateSubmit = () => {
    const payload: any = {
      template_name: templateForm.template_name,
      subject: templateForm.subject,
      html_content: templateForm.html_content,
    };
    if (editingTemplate) {
      updateTemplateMutation.mutate({ id: editingTemplate.id, data: payload });
    } else {
      createTemplateMutation.mutate(payload);
    }
  };

  const meetings: any[] = Array.isArray(meetingsData) ? meetingsData : (meetingsData as any)?.items || [];
  const challenges: any[] = Array.isArray(challengesData) ? challengesData : (challengesData as any)?.items || [];
  const skills: any[] = Array.isArray(skillsPool) ? skillsPool : [];
  const totmList: any[] = Array.isArray(totmHistory) ? totmHistory : [];
  const submissions: any[] = Array.isArray(submissionsData) ? submissionsData : (submissionsData as any)?.items || [];
  const templates: any[] = Array.isArray(templatesData) ? templatesData : (templatesData as any)?.items || [];
  const allMembers: any[] = membersData?.items || [];
  const filteredMembers = totmSearch
    ? allMembers.filter((m: any) =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(totmSearch.toLowerCase()) ||
        m.username?.toLowerCase().includes(totmSearch.toLowerCase())
      )
    : allMembers;

  const meetingBusy = createMeetingMutation.status === "loading" || updateMeetingMutation.status === "loading";
  const challengeBusy = createChallengeMutation.status === "loading" || updateChallengeMutation.status === "loading";

  return (
    <main className="flex-1 bg-surface-container-lowest min-w-0">
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface">
            Admin Settings
          </h1>
          <p className="text-on-surface-variant mt-2">
            Manage meetings, challenges, skills, and tags
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { id: "meetings", label: "Meetings", icon: "video_call" },
            { id: "challenges", label: "Challenges", icon: "code" },
            { id: "skills", label: "Skills", icon: "psychology" },
            { id: "totm", label: "Techie OTM", icon: "star" },
            { id: "submissions", label: "Submissions", icon: "assignment" },
            { id: "emailTemplates", label: "Email Templates", icon: "mail" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── MEETINGS TAB ── */}
        {activeTab === "meetings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-on-surface">Weekly Meetings</h2>
              <button
                onClick={openNewMeeting}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Meeting
              </button>
            </div>

            {showMeetingForm && (
              <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-on-surface">
                    {editingMeeting ? "Edit Meeting" : "New Meeting"}
                  </h3>
                  <button onClick={() => { setShowMeetingForm(false); setEditingMeeting(null); }} className="p-1 hover:bg-surface-container-high rounded-lg">
                    <AiOutlineClose />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
                  <input
                    type="text"
                    value={meetingForm.title}
                    onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Monday Team Sync"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Meeting URL</label>
                  <input
                    type="url"
                    value={meetingForm.meeting_url}
                    onChange={(e) => setMeetingForm({ ...meetingForm, meeting_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Scheduled Time (optional)</label>
                    <input
                      type="datetime-local"
                      value={meetingForm.scheduled_time}
                      onChange={(e) => setMeetingForm({ ...meetingForm, scheduled_time: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Recurrence</label>
                    <select
                      value={meetingForm.recurrence}
                      onChange={(e) => setMeetingForm({ ...meetingForm, recurrence: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      {RECURRENCE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Description (optional)</label>
                  <textarea
                    value={meetingForm.description}
                    onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Weekly standup meeting..."
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={meetingForm.is_active}
                    onChange={(e) => setMeetingForm({ ...meetingForm, is_active: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm font-medium text-on-surface">Mark as active</span>
                </label>
                <button
                  onClick={handleMeetingSubmit}
                  disabled={!meetingForm.title || !meetingForm.meeting_url || meetingBusy}
                  className="w-full px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {meetingBusy ? "Saving..." : editingMeeting ? "Save Changes" : "Create Meeting"}
                </button>
              </div>
            )}

            <div className="grid gap-4">
              {meetings.map((meeting: any) => (
                <div key={meeting.id} className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-on-surface">{meeting.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${meeting.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                          {meeting.is_active ? "Active" : "Inactive"}
                        </span>
                        {meeting.recurrence && meeting.recurrence !== "none" && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {meeting.recurrence}
                          </span>
                        )}
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-on-surface-variant">{meeting.description}</p>
                      )}
                      {meeting.scheduled_time && (
                        <p className="text-xs text-on-surface-variant mt-1">
                          <span className="material-symbols-outlined text-xs align-text-bottom mr-1">schedule</span>
                          {new Date(meeting.scheduled_time).toLocaleString()}
                        </p>
                      )}
                      <a href={meeting.meeting_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block truncate max-w-xs">
                        {meeting.meeting_url}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEditMeeting(meeting)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this meeting?")) deleteMeetingMutation.mutate(meeting.id); }}
                        className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {meetings.length === 0 && !showMeetingForm && (
                <div className="text-center py-12 text-on-surface-variant">
                  <p>No meetings yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CHALLENGES TAB ── */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-on-surface">Coding Challenges</h2>
              <button
                onClick={openNewChallenge}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Challenge
              </button>
            </div>

            {showChallengeForm && (
              <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-on-surface">
                    {editingChallenge ? "Edit Challenge" : "New Challenge"}
                  </h3>
                  <button onClick={() => { setShowChallengeForm(false); setEditingChallenge(null); }} className="p-1 hover:bg-surface-container-high rounded-lg">
                    <AiOutlineClose />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
                  <input
                    type="text"
                    value={challengeForm.title}
                    onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Two Sum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                  <textarea
                    value={challengeForm.description}
                    onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="Find two numbers that add up to target..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Type</label>
                    <select
                      value={challengeForm.challenge_type}
                      onChange={(e) => setChallengeForm({ ...challengeForm, challenge_type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="LEETCODE">LeetCode</option>
                      <option value="SYSTEM_DESIGN">System Design</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Difficulty</label>
                    <select
                      value={challengeForm.difficulty}
                      onChange={(e) => setChallengeForm({ ...challengeForm, difficulty: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Challenge URL (optional)</label>
                  <input
                    type="url"
                    value={challengeForm.challenge_url}
                    onChange={(e) => setChallengeForm({ ...challengeForm, challenge_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="https://leetcode.com/problems/two-sum/"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Deadline (optional)</label>
                  <input
                    type="datetime-local"
                    value={challengeForm.deadline}
                    onChange={(e) => setChallengeForm({ ...challengeForm, deadline: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <button
                  onClick={handleChallengeSubmit}
                  disabled={!challengeForm.title || !challengeForm.description || challengeBusy}
                  className="w-full px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {challengeBusy ? "Saving..." : editingChallenge ? "Save Changes" : "Create Challenge"}
                </button>
              </div>
            )}

            <div className="grid gap-4">
              {challenges.map((challenge: any) => (
                <div key={challenge.id} className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-on-surface">{challenge.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          challenge.difficulty === "Easy" ? "bg-green-100 text-green-700"
                          : challenge.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"}`}>
                          {challenge.difficulty}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          challenge.challenge_type === "LEETCODE" ? "bg-orange-100 text-orange-700"
                          : challenge.challenge_type === "SYSTEM_DESIGN" ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"}`}>
                          {challenge.challenge_type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant line-clamp-2">{challenge.description}</p>
                      {challenge.deadline && (
                        <p className="text-xs text-on-surface-variant mt-1">
                          <span className="material-symbols-outlined text-xs align-text-bottom mr-1">timer</span>
                          Deadline: {new Date(challenge.deadline).toLocaleString()}
                        </p>
                      )}
                      {challenge.challenge_url && (
                        <a href={challenge.challenge_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">
                          View Challenge →
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => openEditChallenge(challenge)} className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this challenge?")) deleteChallengeMutation.mutate(challenge.id); }}
                        className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {challenges.length === 0 && !showChallengeForm && (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-6xl mb-4 block">code_off</span>
                  <p>No challenges yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Skills Pool</h2>
              <p className="text-sm text-on-surface-variant">
                Add skills here — members will multi-select from this list on their profile.
              </p>
            </div>

            {/* Add skill input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSkillName.trim()) {
                    createSkillMutation.mutate(newSkillName.trim());
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. React, Python, Figma..."
              />
              <button
                onClick={() => { if (newSkillName.trim()) createSkillMutation.mutate(newSkillName.trim()); }}
                disabled={!newSkillName.trim() || createSkillMutation.status === "loading"}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Skills list */}
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: any) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high text-sm font-medium text-on-surface"
                  >
                    {skill.image_url && (
                      <img src={skill.image_url} alt={skill.name} className="w-4 h-4 rounded-full object-cover" />
                    )}
                    <span>{skill.name}</span>
                    <button
                      onClick={() => { if (confirm(`Remove "${skill.name}" from the pool?`)) deleteSkillMutation.mutate(skill.id); }}
                      className="ml-1 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <AiOutlineClose size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-6xl mb-4 block">psychology</span>
                <p>No skills in the pool yet. Add some above.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TECHIE OTM TAB ── */}
        {activeTab === "totm" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Nominate Techie of the Month</h2>
              <p className="text-sm text-on-surface-variant">Recognize outstanding members for their contributions.</p>
            </div>

            <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Search Member</label>
                <input
                  type="text"
                  value={totmSearch}
                  onChange={(e) => { setTotmSearch(e.target.value); setTotmUserId(""); }}
                  className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Search by name or username..."
                />
                {totmSearch && filteredMembers.length > 0 && !totmUserId && (
                  <div className="mt-1 shadow-lg ring-1 ring-outline/10 rounded-lg divide-y divide-outline/15/15 overflow-hidden max-h-48 overflow-y-auto">
                    {filteredMembers.slice(0, 10).map((m: any) => (
                      <button
                        key={m.id}
                        onClick={() => { setTotmUserId(String(m.id)); setTotmSearch(`${m.first_name} ${m.last_name}`); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-surface-container-high transition-colors"
                      >
                        <img
                          src={m.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${m.first_name} ${m.last_name}`}
                          alt={m.first_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-on-surface">{m.first_name} {m.last_name}</p>
                          <p className="text-xs text-on-surface-variant">@{m.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {totmUserId && (
                  <p className="text-xs text-primary mt-1">
                    <span className="material-symbols-outlined text-xs align-text-bottom">check_circle</span>
                    {" "}Selected user ID: {totmUserId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Points</label>
                <input
                  type="number"
                  value={totmPoints}
                  onChange={(e) => setTotmPoints(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. 100"
                  min={1}
                />
              </div>
              <button
                onClick={() => {
                  if (!totmUserId || !totmPoints) return;
                  createTotmMutation.mutate({ user_id: parseInt(totmUserId), points: parseInt(totmPoints) });
                }}
                disabled={!totmUserId || !totmPoints || createTotmMutation.status === "loading"}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {createTotmMutation.status === "loading" ? "Nominating..." : "Nominate"}
              </button>
            </div>

            {/* TOTM History */}
            <div>
              <h3 className="font-semibold text-on-surface mb-3">History</h3>
              {totmList.length > 0 ? (
                <div className="space-y-3">
                  {totmList.map((entry: any) => (
                    <div key={entry.id} className="flex items-center gap-4 bg-surface-container-lowest shadow-sm rounded-xl p-4">
                      <img
                        src={entry.user?.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${entry.user?.first_name} ${entry.user?.last_name}`}
                        alt={entry.user?.first_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface">{entry.user?.first_name} {entry.user?.last_name}</p>
                        <p className="text-xs text-on-surface-variant">@{entry.user?.username} · {entry.points} pts</p>
                        <p className="text-xs text-on-surface-variant">{new Date(entry.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
                      </div>
                      <span className="material-symbols-outlined text-yellow-500 text-2xl">star</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-6xl mb-4 block">star_border</span>
                  <p>No nominations yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface mb-1">Technical Task Submissions</h2>
              <p className="text-sm text-on-surface-variant">Review technical task submissions from applicants.</p>
            </div>

            {submissions.length > 0 ? (
              <div className="overflow-x-auto rounded-xl shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-surface-container-high">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-on-surface">Applicant</th>
                      <th className="text-left px-4 py-3 font-semibold text-on-surface">Stack</th>
                      <th className="text-left px-4 py-3 font-semibold text-on-surface">Experience</th>
                      <th className="text-left px-4 py-3 font-semibold text-on-surface">Submitted</th>
                      <th className="text-center px-4 py-3 font-semibold text-on-surface">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline/15">
                    {submissions.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-surface-container-high/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={sub.user?.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${sub.user?.first_name} ${sub.user?.last_name}`}
                              alt={sub.user?.first_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-on-surface">{sub.user?.first_name} {sub.user?.last_name}</p>
                              <p className="text-xs text-on-surface-variant">@{sub.user?.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-on-surface">
                          {sub.technical_task?.stack?.name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-on-surface capitalize">
                          {sub.technical_task?.experience_level?.replace(/_/g, " ") || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant text-xs">
                          {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setShowSubmissionModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-surface-container-lowest shadow-sm rounded-xl text-center py-12">
                <span className="material-symbols-outlined text-6xl mb-4 block text-on-surface-variant">assignment</span>
                <p className="text-on-surface-variant">No submissions yet</p>
              </div>
            )}

            {/* Submission Details Modal */}
            {showSubmissionModal && selectedSubmission && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-surface-container-high px-6 py-4 border-b border-outline/20 flex justify-between items-center">
                    <h3 className="font-bold text-on-surface">Submission Details</h3>
                    <button
                      onClick={() => {
                        setShowSubmissionModal(false);
                        setSelectedSubmission(null);
                      }}
                      className="p-1 hover:bg-surface-container-highest rounded-lg transition-colors"
                    >
                      <AiOutlineClose />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Applicant Info */}
                    <div>
                      <h4 className="font-semibold text-on-surface mb-3">Applicant Information</h4>
                      <div className="flex items-center gap-3 bg-surface-container-high p-4 rounded-lg">
                        <img
                          src={selectedSubmission.user?.profile_pic_url || `https://api.dicebear.com/7.x/initials/jpg?seed=${selectedSubmission.user?.first_name} ${selectedSubmission.user?.last_name}`}
                          alt={selectedSubmission.user?.first_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-on-surface">{selectedSubmission.user?.first_name} {selectedSubmission.user?.last_name}</p>
                          <p className="text-sm text-on-surface-variant">@{selectedSubmission.user?.username}</p>
                        </div>
                      </div>
                    </div>

                    {/* Challenge Info */}
                    <div>
                      <h4 className="font-semibold text-on-surface mb-3">Challenge</h4>
                      <div className="space-y-2 bg-surface-container-high p-4 rounded-lg">
                        <div>
                          <p className="text-xs text-on-surface-variant">Stack</p>
                          <p className="text-on-surface">{selectedSubmission.technical_task?.stack?.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant">Experience Level</p>
                          <p className="text-on-surface capitalize">{selectedSubmission.technical_task?.experience_level?.replace(/_/g, " ") || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-on-surface-variant">Task Content</p>
                          <p className="text-on-surface">{selectedSubmission.technical_task?.content || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Submission Content */}
                    <div>
                      <h4 className="font-semibold text-on-surface mb-3">Submission</h4>
                      <div className="space-y-3 bg-surface-container-high p-4 rounded-lg">
                        {selectedSubmission.github_link && (
                          <div>
                            <p className="text-xs text-on-surface-variant mb-1">GitHub Repository</p>
                            <a
                              href={selectedSubmission.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-base">link</span>
                              View Repository
                            </a>
                          </div>
                        )}
                        {selectedSubmission.live_demo_url && (
                          <div>
                            <p className="text-xs text-on-surface-variant mb-1">Live Demo</p>
                            <a
                              href={selectedSubmission.live_demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-base">launch</span>
                              View Live Demo
                            </a>
                          </div>
                        )}
                        {selectedSubmission.description && (
                          <div>
                            <p className="text-xs text-on-surface-variant mb-1">Description</p>
                            <p className="text-on-surface text-sm">{selectedSubmission.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submission Date */}
                    <div>
                      <p className="text-xs text-on-surface-variant">Submitted on</p>
                      <p className="text-on-surface">
                        {new Date(selectedSubmission.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EMAIL TEMPLATES TAB ── */}
        {activeTab === "emailTemplates" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-on-surface mb-1">Email Templates</h2>
                <p className="text-sm text-on-surface-variant">Create and manage email templates for applicants.</p>
              </div>
              <button
                onClick={openNewTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                New Template
              </button>
            </div>

            {showTemplateForm && (
              <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-on-surface">
                    {editingTemplate ? "Edit Email Template" : "New Email Template"}
                  </h3>
                  <button onClick={() => { setShowTemplateForm(false); setEditingTemplate(null); }} className="p-1 hover:bg-surface-container-high rounded-lg">
                    <AiOutlineClose />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Template Name</label>
                  <input
                    type="text"
                    value={templateForm.template_name}
                    onChange={(e) => setTemplateForm({ ...templateForm, template_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Welcome Email, Interview Confirmation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Subject</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="e.g. Welcome to Slightly Techie!"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">HTML Content</label>
                  <textarea
                    value={templateForm.html_content}
                    onChange={(e) => setTemplateForm({ ...templateForm, html_content: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-2 rounded-lg border border-outline/40 bg-surface-container-lowest text-on-surface font-mono text-xs focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="<html><body>Your email template here...</body></html>"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => { setShowTemplateForm(false); setEditingTemplate(null); }}
                    className="px-4 py-2 rounded-lg border border-outline/40 text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTemplateSubmit}
                    disabled={!templateForm.template_name || !templateForm.subject || !templateForm.html_content || createTemplateMutation.status === "loading" || updateTemplateMutation.status === "loading"}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {createTemplateMutation.status === "loading" || updateTemplateMutation.status === "loading" ? "Saving..." : editingTemplate ? "Update Template" : "Create Template"}
                  </button>
                </div>
              </div>
            )}

            {templates.length > 0 ? (
              <div className="space-y-3">
                {templates.map((template: any) => (
                  <div key={template.id} className="bg-surface-container-lowest shadow-sm rounded-xl p-4 hover:bg-surface-container-high/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-on-surface">{template.template_name}</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Subject: {template.subject}</p>
                        <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{template.html_content?.replace(/<[^>]*>/g, "") || "No content"}</p>
                      </div>
                      <div className="flex gap-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditTemplate(template)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${template.template_name}"?`)) {
                              deleteTemplateMutation.mutate(template.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-error/20 text-error hover:bg-error/30 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest shadow-sm rounded-xl text-center py-12">
                <span className="material-symbols-outlined text-6xl mb-4 block text-on-surface-variant">mail</span>
                <p className="text-on-surface-variant">No email templates yet. Create one to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
