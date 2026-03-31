"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useEndpoints from "@/services";
import LoadingSpinner from "@/components/loadingSpinner";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { getApiErrorMessage } from "@/utils";

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-secondary-container text-on-secondary-container",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-error/10 text-error",
};

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  LEETCODE: { label: "LeetCode", icon: "code" },
  SYSTEM_DESIGN: { label: "System Design", icon: "architecture" },
  GENERAL: { label: "General", icon: "quiz" },
};

type Challenge = {
  id: number;
  title: string;
  description: string;
  challenge_type: string;
  difficulty?: string | null;
  challenge_url?: string | null;
  posted_at: string;
  created_by: number;
};

function ChallengeModal({
  challenge,
  onClose,
  onSave,
  isSaving,
}: {
  challenge?: Challenge | null;
  onClose: () => void;
  onSave: (data: any) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    title: challenge?.title || "",
    description: challenge?.description || "",
    challenge_type: challenge?.challenge_type || "LEETCODE",
    difficulty: challenge?.difficulty || "",
    challenge_url: challenge?.challenge_url || "",
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-outline max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <h2 className="text-lg font-headline font-semibold text-on-surface">
            {challenge ? "Edit Challenge" : "New Challenge"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="ch-title" className="block text-sm font-medium text-on-surface mb-1">Title</label>
            <input
              id="ch-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Two Sum"
            />
          </div>
          <div>
            <label htmlFor="ch-desc" className="block text-sm font-medium text-on-surface mb-1">Description</label>
            <textarea
              id="ch-desc"
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Explain the challenge..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ch-type" className="block text-sm font-medium text-on-surface mb-1">Type</label>
              <select
                id="ch-type"
                value={form.challenge_type}
                onChange={(e) => set("challenge_type", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="LEETCODE">LeetCode</option>
                <option value="SYSTEM_DESIGN">System Design</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <div>
              <label htmlFor="ch-diff" className="block text-sm font-medium text-on-surface mb-1">Difficulty</label>
              <select
                id="ch-diff"
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="">— None —</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="ch-url" className="block text-sm font-medium text-on-surface mb-1">Problem URL (optional)</label>
            <input
              id="ch-url"
              value={form.challenge_url}
              onChange={(e) => set("challenge_url", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!form.title.trim() || !form.description.trim() || isSaving}
              onClick={() => onSave({ ...form, difficulty: form.difficulty || undefined, challenge_url: form.challenge_url || undefined })}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <><span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />Saving...</>
              ) : challenge ? "Save Changes" : "Create Challenge"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const { getAllChallenges, getLatestChallenge, getUserProfile, createChallenge, updateChallenge, deleteChallenge } = useEndpoints();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const { data: userProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
  });

  const { data: challengesData, isLoading, isError } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getAllChallenges().then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  const { data: latestChallenge } = useQuery({
    queryKey: ["latestChallenge"],
    queryFn: () => getLatestChallenge().then((res) => res.data),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAdmin = userProfileData?.role?.name === "admin";
  const challenges: Challenge[] = challengesData?.items || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => createChallenge(data),
    onSuccess: () => {
      toast.success("Challenge created!");
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["latestChallenge"] });
      setIsModalOpen(false);
    },
    onError: (err: any) => toast.error(getApiErrorMessage(err, "Failed to create challenge.")),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateChallenge(id, data),
    onSuccess: () => {
      toast.success("Challenge updated!");
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["latestChallenge"] });
      setEditingChallenge(null);
    },
    onError: (err: any) => toast.error(getApiErrorMessage(err, "Failed to update challenge.")),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteChallenge(id),
    onSuccess: () => {
      toast.success("Challenge deleted.");
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["latestChallenge"] });
    },
    onError: (err: any) => toast.error(getApiErrorMessage(err, "Failed to delete challenge.")),
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
              <span>Network</span><span>/</span>
              <span className="text-primary">Challenges</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface tracking-tight">
              Weekly Challenges
            </h1>
            <p className="text-on-surface-variant mt-2">
              Sharpen your skills with coding and system design challenges.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary/90 transition-colors whitespace-nowrap h-fit"
            >
              <span className="material-symbols-outlined text-base">add</span>
              New Challenge
            </button>
          )}
        </div>

        {/* Latest Challenge Banner */}
        {latestChallenge && (
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-on-primary">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-on-primary/20 text-on-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                    Latest
                  </span>
                  {latestChallenge.difficulty && (
                    <span className="bg-on-primary/20 text-on-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                      {latestChallenge.difficulty}
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-headline mb-2">{latestChallenge.title}</h2>
                <p className="text-on-primary/80 text-sm line-clamp-2 mb-4">{latestChallenge.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-on-primary/70">
                    <span className="material-symbols-outlined text-sm">
                      {TYPE_LABELS[latestChallenge.challenge_type]?.icon || "code"}
                    </span>
                    {TYPE_LABELS[latestChallenge.challenge_type]?.label || latestChallenge.challenge_type}
                  </span>
                  {latestChallenge.challenge_url && (
                    <a
                      href={latestChallenge.challenge_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold bg-on-primary/20 hover:bg-on-primary/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Open Problem
                    </a>
                  )}
                </div>
              </div>
              <span className="material-symbols-outlined text-5xl text-on-primary/20 shrink-0 hidden md:block">
                {TYPE_LABELS[latestChallenge.challenge_type]?.icon || "code"}
              </span>
            </div>
          </div>
        )}

        {/* All Challenges */}
        {isLoading && (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        )}
        {isError && (
          <div className="bg-error-container border border-error rounded-xl p-4 text-center">
            <p className="text-on-error-container font-medium">Failed to load challenges.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              All Challenges ({challenges.length})
            </h2>
            {challenges.length === 0 && (
              <div className="bg-surface-container-lowest border border-outline rounded-xl p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant block mb-3">quiz</span>
                <p className="text-on-surface-variant">No challenges posted yet.</p>
                {isAdmin && (
                  <button onClick={() => setIsModalOpen(true)} className="mt-3 text-primary font-semibold text-sm hover:underline">
                    Post the first challenge
                  </button>
                )}
              </div>
            )}
            {challenges.map((ch) => {
              const typeInfo = TYPE_LABELS[ch.challenge_type] || { label: ch.challenge_type, icon: "code" };
              const isLatest = latestChallenge?.id === ch.id;
              return (
                <div
                  key={ch.id}
                  className={`bg-surface-container-lowest border rounded-xl p-5 transition-all ${isLatest ? "border-primary/40 shadow-sm" : "border-outline"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isLatest ? "bg-primary/10" : "bg-surface-container-high"}`}>
                        <span className={`material-symbols-outlined text-xl ${isLatest ? "text-primary" : "text-on-surface-variant"}`}>
                          {typeInfo.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-on-surface text-base">{ch.title}</h3>
                          {isLatest && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              Latest
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs text-on-surface-variant">{typeInfo.label}</span>
                          {ch.difficulty && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[ch.difficulty] || "bg-surface-container text-on-surface-variant"}`}>
                              {ch.difficulty}
                            </span>
                          )}
                          <span className="text-xs text-on-surface-variant">
                            {format(new Date(ch.posted_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant line-clamp-2">{ch.description}</p>
                        {ch.challenge_url && (
                          <a
                            href={ch.challenge_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2 hover:underline"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                            View Problem
                          </a>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingChallenge(ch)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${ch.title}"?`)) deleteMutation.mutate(ch.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create modal */}
      {isModalOpen && (
        <ChallengeModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => createMutation.mutate(data)}
          isSaving={createMutation.isLoading}
        />
      )}

      {/* Edit modal */}
      {editingChallenge && (
        <ChallengeModal
          challenge={editingChallenge}
          onClose={() => setEditingChallenge(null)}
          onSave={(data) => updateMutation.mutate({ id: editingChallenge.id, data })}
          isSaving={updateMutation.isLoading}
        />
      )}
    </main>
  );
}
