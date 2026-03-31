"use client";

import useEndpoints from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ITechie } from "@/types";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/loadingSpinner";
import { useSession } from "next-auth/react";
import EditProjectModal from "@/components/modals/EditProjectModal";
import { useState } from "react";
import { getApiErrorMessage } from "@/utils";

const PROJECT_TEAMS = [
  "TEAM LEAD",
  "FRONTEND",
  "BACKEND",
  "DEVOPS",
  "DESIGNER",
  "MOBILE",
  "FULL STACK",
] as const;

const ProjectDetail = ({ params }: any) => {
  const { id } = params;
  const { getProjectById, deleteProjectById, getUserProfile, searchTechie, addMemberToProject, removeMemberFromProject } = useEndpoints();
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<(typeof PROJECT_TEAMS)[number]>("FULL STACK");

  const { data: Project, isLoading, isError } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const { data: userProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: false,
  });

  const isAdmin = userProfileData?.role?.name === "admin";

  const { data: searchedTechiesData, isFetching: isSearchingTechies } = useQuery({
    queryKey: ["project-member-search", memberSearch],
    queryFn: () => searchTechie(memberSearch.trim()),
    enabled: isAdmin && memberSearch.trim().length >= 2,
    refetchOnWindowFocus: false,
  });

  const { mutate: addMember, isLoading: isAddingMember } = useMutation({
    mutationFn: ({ userId, team }: { userId: number; team: (typeof PROJECT_TEAMS)[number] }) =>
      addMemberToProject(Number(id), userId, team),
    onSuccess: () => {
      toast.success("Member added to project.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to add member."));
    },
  });

  const { mutate: removeMember, isLoading: isRemovingMember } = useMutation({
    mutationFn: (userId: number) => removeMemberFromProject(Number(id), userId),
    onSuccess: () => {
      toast.success("Member removed from project.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to remove member."));
    },
  });

  const { mutate: deleteProject, isLoading: isDeleting } = useMutation({
    mutationFn: () => deleteProjectById(id),
    onSuccess: () => {
      toast.success("Project deleted.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/community-projects");
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to delete project."));
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !Project?.data) {
    return (
      <div className="p-8 text-center">
        <p className="text-on-surface-variant">Project not found or failed to load.</p>
        <Link href="/community-projects" className="text-primary hover:underline text-sm mt-2 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  const project = Project.data;
  const currentMemberIds = new Set<number>((project.members || []).map((member: ITechie) => Number(member.id)));
  const searchedTechies = (searchedTechiesData?.items || []).filter((techie: ITechie) => !currentMemberIds.has(Number(techie.id)));
  const formattedDate = project.created_at
    ? format(new Date(project.created_at), "MMM dd, yyyy")
    : "Unknown";

  const getPriorityColor = (priority: string) => {
    if (priority?.includes("HIGH")) return "bg-error/10 text-error";
    if (priority?.includes("LOW")) return "bg-surface-container text-on-surface-variant";
    return "bg-secondary-container/50 text-on-secondary-container";
  };

  const getPriorityLabel = (priority: string) => {
    if (priority?.includes("HIGH")) return "High Priority";
    if (priority?.includes("LOW")) return "Low Priority";
    return "Medium Priority";
  };

  const getAvatarUrl = (person: { profile_pic_url?: string | null; first_name: string; last_name: string }) => {
    if (person.profile_pic_url && person.profile_pic_url !== "string") {
      return person.profile_pic_url;
    }
    return `https://api.dicebear.com/7.x/initials/jpg?seed=${person.first_name} ${person.last_name}`;
  };

  const renderManageTeamContent = () => {
    if (memberSearch.trim().length < 2) {
      return <p className="text-xs text-on-surface-variant">Type at least 2 characters to search.</p>;
    }

    if (isSearchingTechies) {
      return <p className="text-xs text-on-surface-variant">Searching members...</p>;
    }

    if (searchedTechies.length === 0) {
      return <p className="text-xs text-on-surface-variant">No matching available users found.</p>;
    }

    return (
      <div className="space-y-2">
        {searchedTechies.slice(0, 8).map((techie: ITechie) => {
          const techiePicUrl = getAvatarUrl(techie);

          return (
            <div key={techie.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  className="w-9 h-9 rounded-full object-cover"
                  width={36}
                  height={36}
                  src={techiePicUrl}
                  alt={`${techie.first_name} ${techie.last_name}`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">
                    {techie.first_name} {techie.last_name}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">@{techie.username}</p>
                </div>
              </div>
              <button
                onClick={() => addMember({ userId: techie.id, team: selectedTeam })}
                disabled={isAddingMember}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Breadcrumb + Back */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          <Link href="/community-projects" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Projects</span>
          </Link>
          <span>/</span>
          <span className="text-on-surface truncate">{project.name}</span>
        </div>

        {/* Header Card */}
        <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                project.project_type === "PAID" ? "bg-primary/10" : "bg-secondary-container"
              }`}>
                <span className="material-symbols-outlined text-3xl text-primary">
                  {project.project_type === "PAID" ? "paid" : "eco"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface">
                  {project.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface-variant">
                    {project.project_type === "PAID" ? "Paid" : "Community"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityColor(project.project_priority)}`}>
                    {getPriorityLabel(project.project_priority)}
                  </span>
                  <span className="text-xs text-on-surface-variant">Started {formattedDate}</span>
                </div>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
                      deleteProject();
                    }
                  }}
                  disabled={isDeleting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <div className="mt-6 pt-6 border-t border-outline">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">About</h2>
              <p className="text-on-surface leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        {/* Stacks */}
        {project.stacks && project.stacks.length > 0 && (
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stacks.map((stack: any) => (
                <span
                  key={stack.id || stack.name}
                  className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-semibold"
                >
                  {stack.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {project.members && project.members.length > 0 && (
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">
              Team ({project.members.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {project.members.map((member: ITechie) => {
                const picUrl = getAvatarUrl(member);
                return (
                  <Link
                    key={member.id}
                    href={`/techies/${member.id}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-outline hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <Image
                      className="w-12 h-12 rounded-xl object-cover"
                      width={48}
                      height={48}
                      src={picUrl}
                      alt={`${member.first_name} ${member.last_name}`}
                    />
                    <div className="text-center">
                      <p className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">@{member.username}</p>
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm(`Remove ${member.first_name} ${member.last_name} from this project?`)) {
                              removeMember(member.id);
                            }
                          }}
                          disabled={isRemovingMember}
                          className="mt-2 px-2.5 py-1 text-[10px] rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {project.members?.length === 0 && (
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-2">group</span>
            <p className="text-sm text-on-surface-variant">No team members assigned yet.</p>
          </div>
        )}

        {isAdmin && (
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Manage Team</h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search users by name"
                className="flex-1 px-3 py-2 rounded-lg border border-outline bg-surface-container-lowest text-sm text-on-surface"
              />
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as (typeof PROJECT_TEAMS)[number])}
                className="px-3 py-2 rounded-lg border border-outline bg-surface-container-lowest text-sm text-on-surface"
              >
                {PROJECT_TEAMS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>

            {renderManageTeamContent()}
          </div>
        )}
      </div>

      <EditProjectModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        project={isEditOpen ? {
          id: project.id,
          name: project.name,
          description: project.description,
          project_type: project.project_type,
          project_priority: project.project_priority,
        } : null}
      />
    </main>
  );
};

export default ProjectDetail;
