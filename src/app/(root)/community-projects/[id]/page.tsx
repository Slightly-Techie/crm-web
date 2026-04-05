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
import { TEAM_ROLES, type TeamRole } from "@/constants/projects";

const ProjectDetail = ({ params }: any) => {
  const { id } = params;
  const { getProjectById, deleteProjectById, getUserProfile, searchTechie, addMemberToProject, removeMemberFromProject, updateProjectTools, removeProjectImage, searchSkills, updateProjectById, getStacks } = useEndpoints();
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberRole, setSelectedMemberRole] = useState<TeamRole>("FULL STACK");
  const [skillSearch, setSkillSearch] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isEditingStacks, setIsEditingStacks] = useState(false);
  const [localStackIds, setLocalStackIds] = useState<number[]>([]);
  const [managerSearch, setManagerSearch] = useState("");
  const [isAssigningManager, setIsAssigningManager] = useState(false);

  const { data: Project, isLoading, isError } = useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
  });

  const { data: userProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: true,
  });

  const isAdmin = userProfileData?.role?.name === "admin";
  const isProjectManager = userProfileData?.id === Project?.data?.manager_id;
  const canManageProject = isAdmin || isProjectManager;

  const { data: searchedTechiesData, isFetching: isSearchingTechies } = useQuery({
    queryKey: ["project-member-search", memberSearch],
    queryFn: () => searchTechie(memberSearch.trim()),
    enabled: canManageProject && memberSearch.trim().length >= 2,
    refetchOnWindowFocus: true,
  });

  const { mutate: addMember, isLoading: isAddingMember } = useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      addMemberToProject(Number(id), userId, selectedMemberRole),
    onSuccess: () => {
      toast.success("Member added to project.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setMemberSearch("");
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

  const { data: skillsData } = useQuery({
    queryKey: ["skills-search", skillSearch],
    queryFn: () => searchSkills(skillSearch),
    enabled: canManageProject && skillSearch.trim().length >= 1,
    refetchOnWindowFocus: true,
  });

  const { data: allStacksData } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks().then((res) => res.data),
    enabled: canManageProject,
  });

  const { mutate: updateStacks, isLoading: isUpdatingStacks } = useMutation({
    mutationFn: (stackIds: number[]) => updateProjectById(Number(id), { stacks: stackIds }),
    onSuccess: () => {
      toast.success("Tech stacks updated.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsEditingStacks(false);
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to update stacks."));
    },
  });

  const { mutate: addSkill, isLoading: isAddingSkillLoading } = useMutation({
    mutationFn: (skillId: number) => {
      const currentProject = Project?.data;
      if (!currentProject) throw new Error("Project data not found");
      const currentTools = (currentProject.project_tools || []).map((t: any) => t.id);
      const updatedTools = [...new Set([...currentTools, skillId])];
      return updateProjectTools(Number(id), updatedTools);
    },
    onSuccess: () => {
      toast.success("Skill added to project.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsAddingSkill(false);
      setSkillSearch("");
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to add skill."));
    },
  });

  const { mutate: removeSkill, isLoading: isRemovingSkill } = useMutation({
    mutationFn: (skillId: number) => {
      const currentProject = Project?.data;
      if (!currentProject) throw new Error("Project data not found");
      const currentTools = (currentProject.project_tools || []).map((t: any) => t.id).filter((id: number) => id !== skillId);
      return updateProjectTools(Number(id), currentTools);
    },
    onSuccess: () => {
      toast.success("Skill removed from project.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to remove skill."));
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

  const { mutate: removeImage, isLoading: isRemovingImage } = useMutation({
    mutationFn: () => removeProjectImage(Number(id)),
    onSuccess: () => {
      toast.success("Project image removed.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to remove image."));
    },
  });

  const { data: managerSearchData, isFetching: isSearchingManagers } = useQuery({
    queryKey: ["manager-search", managerSearch],
    queryFn: () => searchTechie(managerSearch.trim()),
    enabled: isAdmin && managerSearch.trim().length >= 2,
    refetchOnWindowFocus: false,
  });

  const { mutate: assignManager, isLoading: isAssigningManagerLoading } = useMutation({
    mutationFn: (managerId: number) =>
      updateProjectById(Number(id), { manager_id: managerId }),
    onSuccess: () => {
      toast.success("Project manager assigned.");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setManagerSearch("");
      setIsAssigningManager(false);
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to assign manager."));
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
      return <p className="text-xs text-on-surface-variant">Type at least 2 characters to search members.</p>;
    }

    if (isSearchingTechies) {
      return <p className="text-xs text-on-surface-variant">Searching members...</p>;
    }

    if (searchedTechies.length === 0) {
      return <p className="text-xs text-on-surface-variant">No matching available users found.</p>;
    }

    return (
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-2">Assign Role</label>
          <select
            value={selectedMemberRole}
            onChange={(e) => setSelectedMemberRole(e.target.value as TeamRole)}
            className="w-full px-3 py-2 rounded-lg border border-outline/50 bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {TEAM_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

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
                  onClick={() => addMember({ userId: techie.id })}
                  disabled={isAddingMember}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      {/* Hero Image Section */}
      {project.image_url && (
        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-stone-200 group">
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {canManageProject && (
            <button
              onClick={(e) => {
                e.preventDefault();
                if (confirm("Remove this project image?")) {
                  removeImage();
                }
              }}
              disabled={isRemovingImage}
              className="absolute top-4 right-4 p-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors shadow-lg z-10 disabled:opacity-50"
              title="Remove image"
            >
              <span className="material-symbols-outlined text-base">image_not_supported</span>
            </button>
          )}
        </div>
      )}

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
        <div className="bg-surface-container-lowest shadow-sm rounded-xl p-6 md:p-8">
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
            {canManageProject && (
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
            <div className="mt-6 pt-6 border-t border-outline/25">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">About</h2>
              <p className="text-on-surface leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        {/* Manager Assignment (Admins Only) */}
        {isAdmin && (
          <div className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Project Manager
              </h2>
            </div>
            <div className="space-y-3">
              {project.manager_id && project.manager ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={project.manager?.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.manager?.username}`}
                      alt={project.manager?.first_name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">
                        {project.manager?.first_name} {project.manager?.last_name}
                      </p>
                      <p className="text-xs text-on-surface-variant">@{project.manager?.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAssigningManager(!isAssigningManager)}
                    className="text-xs font-semibold text-error hover:text-error/80"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-on-surface-variant">No manager assigned yet</p>
                  {canManageProject && (
                    <button
                      onClick={() => setIsAssigningManager(!isAssigningManager)}
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      Assign
                    </button>
                  )}
                </div>
              )}

              {isAssigningManager && (
                <div className="space-y-3 pt-3 border-t border-outline/25">
                  <input
                    type="text"
                    placeholder="Search by name or username..."
                    value={managerSearch}
                    onChange={(e) => setManagerSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/50 bg-surface-container-lowest text-sm text-on-surface"
                  />
                  {managerSearch.length >= 2 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {isSearchingManagers ? (
                        <p className="text-xs text-on-surface-variant">Searching...</p>
                      ) : (managerSearchData?.items?.length || 0) > 0 ? (
                        (managerSearchData?.items || []).slice(0, 5).map((manager: ITechie) => (
                          <div key={manager.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={manager.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${manager.username}`}
                                alt={manager.first_name}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-on-surface">{manager.first_name} {manager.last_name}</p>
                                <p className="text-xs text-on-surface-variant">@{manager.username}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => assignManager(manager.id)}
                              disabled={isAssigningManagerLoading}
                              className="text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
                            >
                              Select
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-on-surface-variant">No users found</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tech Stack</h2>
            {canManageProject && !isEditingStacks && (
              <button
                onClick={() => {
                  setLocalStackIds((project.stacks || []).map((s: any) => s.id));
                  setIsEditingStacks(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
            )}
          </div>

          {!isEditingStacks ? (
            project.stacks && project.stacks.length > 0 ? (
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
            ) : (
              <p className="text-sm text-on-surface-variant">No tech stacks assigned yet</p>
            )
          ) : (
            <div className="space-y-3">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(allStacksData || []).map((stack: any) => (
                  <label
                    key={stack.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={localStackIds.includes(stack.id)}
                      onChange={(e) =>
                        setLocalStackIds(
                          e.target.checked
                            ? [...localStackIds, stack.id]
                            : localStackIds.filter((sid) => sid !== stack.id)
                        )
                      }
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-sm text-on-surface">{stack.name}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditingStacks(false)}
                  className="flex-1 px-3 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStacks(localStackIds)}
                  disabled={isUpdatingStacks}
                  className="flex-1 px-3 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {isUpdatingStacks ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Tools & Skills
            </h2>
            {canManageProject && (
              <button
                onClick={() => setIsAddingSkill(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Skill
              </button>
            )}
          </div>

          {project.project_tools && project.project_tools.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.project_tools.map((skill: any) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium group"
                >
                  {skill.image_url
                    ? <img src={skill.image_url} alt={skill.name} className="w-5 h-5 rounded object-cover flex-shrink-0" title={skill.name} />
                    : <span>{skill.name}</span>}
                  {canManageProject && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeSkill(skill.id);
                      }}
                      disabled={isRemovingSkill}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-error cursor-pointer disabled:opacity-50"
                      title="Remove skill"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">No skills assigned yet</p>
          )}

          {isAddingSkill && canManageProject && (
            <div className="mt-4 pt-4 border-t border-outline/25">
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline/50 bg-surface-container-lowest text-sm text-on-surface mb-3"
              />
              {skillSearch.trim().length >= 1 && (skillsData?.items || []).length > 0 && (
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {(skillsData?.items || []).map((skill: any) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer"
                      onClick={() => addSkill(skill.id)}
                    >
                      <div className="flex items-center gap-2">
                        {skill.image_url && (
                          <img src={skill.image_url} alt={skill.name} className="w-4 h-4 rounded" />
                        )}
                        <span className="text-sm text-on-surface">{skill.name}</span>
                      </div>
                      <span className="text-xs text-primary">+</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsAddingSkill(false);
                    setSkillSearch("");
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-on-surface-variant mt-3">
                ℹ️ Start typing to search available skills
              </p>
            </div>
          )}
        </div>

        {/* Team Members */}
        {project.members && project.members.length > 0 && (
          <div className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6">
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
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-container-low hover:bg-primary/5 hover:shadow-md transition-all duration-200 group"
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
                      {member.team && (
                        <p className="text-[10px] font-medium text-primary mt-1">{member.team}</p>
                      )}
                      {canManageProject && (
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
          <div className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-2">group</span>
            <p className="text-sm text-on-surface-variant">No team members assigned yet.</p>
          </div>
        )}

        {canManageProject && (
          <div className="bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Manage Team</h2>

            <div className="mb-4">
              <input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search users by name"
                className="w-full px-3 py-2 rounded-lg border border-outline/50 bg-surface-container-lowest text-sm text-on-surface"
              />
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
          manager_id: project.manager_id,
          manager: project.manager,
          project_tools: project.project_tools,
        } : null}
      />
    </main>
  );
};

export default ProjectDetail;
