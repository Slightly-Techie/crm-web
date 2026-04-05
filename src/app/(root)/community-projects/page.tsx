"use client";
import { useState } from "react";
import CreateProjectModal from "@/components/modals/CreateProjectModal";
import EditProjectModal from "@/components/modals/EditProjectModal";
import Link from "next/link";
import useEndpoints from "@/services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loadingSpinner";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

function Page() {
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "COMMUNITY" | "PAID">("all");
  const { getProjects, getUserProfile, deleteProjectById, getProjectById } = useEndpoints();
  const queryClient = useQueryClient();

  const {
    data: projectsData,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    retry: 3,
  });

  const session = useSession();
  const { data: userProfileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile().then((res) => res?.data),
    enabled: session.status === "authenticated",
    refetchOnWindowFocus: true,
  });

  const isAdmin = userProfileData?.role?.name === "admin";

  const deleteMutation = useMutation({
    mutationFn: (projectId: number) => deleteProjectById(projectId),
    onSuccess: () => {
      toast.success("Project deleted.");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Failed to delete project."),
  });

  const handleDelete = (e: React.MouseEvent, project: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(project.id);
    }
  };

  const handleEdit = async (e: React.MouseEvent, project: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Fetch full project details to ensure we have manager_id and project_tools
      const fullProject = await getProjectById(project.id);
      setEditProject(fullProject?.data || project);
    } catch {
      // Fallback to list project data if fetch fails
      setEditProject(project);
    }
  };

  const projects = projectsData?.data?.items || [];

  const filteredProjects = projects.filter((project: any) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "COMMUNITY") return project.project_type === "COMMUNITY";
    if (selectedFilter === "PAID") return project.project_type === "PAID";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return "bg-secondary-container/50 text-on-secondary-container";
      case "planning":
        return "bg-surface-container text-on-surface-variant";
      case "completed":
        return "bg-primary-fixed text-on-primary-fixed-variant";
      default:
        return "bg-secondary-container/50 text-on-secondary-container";
    }
  };

  const getIconColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-primary-fixed-dim text-on-primary-fixed-variant";
      case "planning":
        return "bg-tertiary-fixed-dim text-tertiary";
      default:
        return "bg-secondary-container text-on-secondary-container";
    }
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-surface-container-lowest">
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <nav className="flex gap-2 text-xs font-semibold text-on-surface-variant/60 uppercase tracking-widest mb-2">
              <span>Directory</span>
              <span>/</span>
              <span className="text-primary">Community Projects</span>
            </nav>
            <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-headline tracking-tighter">
              Community Projects
            </h2>
            <p className="text-on-surface-variant mt-3 max-w-xl text-lg leading-relaxed">
              Discover and contribute to the organic growth of our ecosystem. Collaborative initiatives built by the techie collective.
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity whitespace-nowrap h-fit"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Start Project
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            {["all", "COMMUNITY", "PAID"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {filter === "all" ? "All Projects" : filter === "COMMUNITY" ? "Community" : "Paid"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner fullScreen={false} />
          </div>
        )}
        {/* Show spinner on re-navigation when cache is stale (isLoading=false but no data yet) */}
        {!isLoading && isFetching && filteredProjects.length === 0 && (
          <div className="flex justify-center items-center py-32">
            <LoadingSpinner fullScreen={false} />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-error-container rounded-xl p-6 text-center shadow-sm">
            <p className="text-on-error-container font-medium">Failed to load projects</p>
          </div>
        )}

        {/* Project Grid */}
        {!isLoading && !isError && !(isFetching && filteredProjects.length === 0) && (
          <>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredProjects.map((project: any) => (
                  <Link
                    key={project.id}
                    href={`/community-projects/${encodeURIComponent(project.id)}`}
                  >
                    <div className="group relative bg-surface-container-lowest shadow-sm rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col min-h-[420px] cursor-pointer">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none"></div>
                      <div className="relative z-10">
                        {/* Icon and Status */}
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getIconColor(project.status)}`}>
                            <span className="material-symbols-outlined text-3xl">
                              {project.project_type === "PAID" ? "paid" : "eco"}
                            </span>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${getStatusColor(project.status)}`}>
                            {project.status || "Planning"}
                          </span>
                        </div>

                        {/* Title and Description */}
                        <h3 className="text-2xl font-bold text-on-surface mb-3 font-headline group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-8 line-clamp-3">
                          {project.description || "No description provided"}
                        </p>

                        {/* Meta Information */}
                        <div className="space-y-4 pt-4 border-t border-outline/15">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-on-surface-variant">Start Date</span>
                            <span className="text-xs font-bold text-on-surface">
                              {format(new Date(project.created_at), "MMM dd, yyyy")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-on-surface-variant">
                              {project.stacks && project.stacks.length > 0 ? "Tech Stack" : "Type"}
                            </span>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {project.stacks && project.stacks.length > 0 ? (
                                project.stacks.slice(0, 2).map((stack: any) => (
                                  <span key={stack.id || stack.name}
                                    className="px-2 py-0.5 bg-surface-container text-[9px] font-bold rounded uppercase">
                                    {stack.name}
                                  </span>
                                ))
                              ) : (
                                <span className="px-2 py-0.5 bg-surface-container text-[9px] font-bold rounded">
                                  {project.project_type || "COMMUNITY"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="mt-auto pt-8 flex items-center justify-between relative z-10">
                        <div className="flex -space-x-2">
                          {project.members?.slice(0, 3).map((member: any) => (
                            <img
                              key={member.id}
                              src={
                                member.profile_pic_url && member.profile_pic_url !== ""
                                  ? member.profile_pic_url
                                  : `https://api.dicebear.com/7.x/initials/jpg?seed=${member.first_name} ${member.last_name}`
                              }
                              alt={`${member.first_name} ${member.last_name}`}
                              className="w-8 h-8 rounded-full border-2 border-surface-container-lowest"
                              title={`${member.first_name} ${member.last_name}`}
                            />
                          ))}
                          {(project.members?.length ?? 0) > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                              +{(project.members?.length ?? 0) - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isAdmin && (
                            <>
                              <button
                                onClick={(e) => handleEdit(e, project)}
                                className="p-1.5 rounded-lg bg-surface-container hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                                title="Edit project"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              <button
                                onClick={(e) => handleDelete(e, project)}
                                className="p-1.5 rounded-lg bg-surface-container hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                                title="Delete project"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </>
                          )}
                          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-on-surface-variant font-medium">No projects found</p>
              </div>
            )}
          </>
        )}
      </div>

      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditProjectModal isOpen={!!editProject} onClose={() => setEditProject(null)} project={editProject} />
    </main>
  );
}

export default Page;
