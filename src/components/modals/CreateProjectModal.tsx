"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useEndpoints from "@/services";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";
import { TEAM_ROLES, PROJECT_TYPES, PRIORITIES, type TeamRole } from "@/constants/projects";
import { ITechie, IStack } from "@/types";
import Image from "next/image";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectMember {
  id: number;
  role: TeamRole;
  first_name: string;
  last_name: string;
  username?: string;
}

interface FormState {
  name: string;
  description: string;
  project_type: "COMMUNITY" | "PAID";
  project_priority: "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGH PRIORITY";
  stacks: number[];
  project_tools: number[];
  members: ProjectMember[];
  manager_id: number | null;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const queryClient = useQueryClient();
  const { getStacks, searchSkills, searchTechie, postProjects, addMemberToProject } = useEndpoints();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    description: "",
    project_type: "COMMUNITY",
    project_priority: "MEDIUM PRIORITY",
    stacks: [],
    project_tools: [],
    members: [],
    manager_id: null,
  });

  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberRole, setSelectedMemberRole] = useState<TeamRole>("FULL STACK");
  const [toolSearch, setToolSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const [cachedSelectedManager, setCachedSelectedManager] = useState<ITechie | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch stacks
  const { data: stacksData } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks().then((res) => res.data),
    enabled: isOpen && currentStep === 2,
  });

  // Fetch tools
  const { data: toolsData } = useQuery({
    queryKey: ["tools-search", toolSearch],
    queryFn: () => searchSkills(toolSearch),
    enabled: isOpen && currentStep === 3 && toolSearch.trim().length >= 1,
  });

  // Fetch members
  const { data: membersData, isFetching: isSearchingMembers } = useQuery({
    queryKey: ["member-search", memberSearch],
    queryFn: () => searchTechie(memberSearch.trim()),
    enabled: isOpen && currentStep === 4 && memberSearch.trim().length >= 2,
  });

  // Fetch managers
  const { data: managersData, isFetching: isSearchingManagers } = useQuery({
    queryKey: ["manager-search", managerSearch],
    queryFn: () => searchTechie(managerSearch.trim()),
    enabled: isOpen && currentStep === 5 && managerSearch.trim().length >= 2,
  });

  // Create project mutation
  const { mutate: createProject, isLoading: isCreatingProject } = useMutation({
    mutationFn: async () => {
      const createPayload = {
        name: formData.name,
        description: formData.description,
        project_type: formData.project_type,
        project_priority: formData.project_priority,
        manager_id: formData.manager_id,
        stacks: formData.stacks,
        project_tools: formData.project_tools,
        members: formData.members.map((m) => m.id),
      };

      const projectRes = await postProjects(createPayload);
      const projectId = projectRes.data.id;

      if (formData.members.length > 0) {
        for (const member of formData.members) {
          try {
            await addMemberToProject(projectId, member.id, member.role);
          } catch (err) {
            console.error(`Failed to add member ${member.id}:`, err);
          }
        }
      }

      return projectRes;
    },
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setFormData({
        name: "",
        description: "",
        project_type: "COMMUNITY",
        project_priority: "MEDIUM PRIORITY",
        stacks: [],
        project_tools: [],
        members: [],
        manager_id: null,
      });
      setCurrentStep(1);
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to create project.");
      toast.error(message);
    },
  });

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (formData.stacks.length === 0) {
      toast.error("Please select at least one tech stack");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.project_tools.length === 0) {
      toast.error("Please select at least one tool/skill");
      return false;
    }
    return true;
  };

  const validateStep5 = () => {
    if (!formData.manager_id) {
      toast.error("Please select a project manager");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreate = () => {
    if (!validateStep5()) return;
    createProject();
  };

  const addedMemberIds = new Set(formData.members.map((m) => m.id));
  const availableMembers = (membersData?.items || []).filter((m: ITechie) => !addedMemberIds.has(m.id)).slice(0, 8);

  const addedToolIds = new Set(formData.project_tools);
  const availableTools = (toolsData?.items || []).filter((t: any) => !addedToolIds.has(t.id)).slice(0, 8);

  const availableManagers = (managersData?.items || []).slice(0, 5);

  const selectedManager = formData.manager_id
    ? cachedSelectedManager || availableManagers.find((m: ITechie) => m.id === formData.manager_id)
    : null;

  const getAvatarUrl = (person: { profile_pic_url?: string | null; first_name: string; last_name: string }) => {
    if (person.profile_pic_url && person.profile_pic_url !== "string") return person.profile_pic_url;
    return `https://api.dicebear.com/7.x/initials/jpg?seed=${person.first_name} ${person.last_name}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline sticky top-0 bg-surface-container-lowest">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Create Project</h2>
            <p className="text-sm text-on-surface-variant mt-1">Step {currentStep} of 5</p>
          </div>
          <button
            onClick={onClose}
            disabled={isCreatingProject}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="h-1 bg-surface-container">
          <div className="h-full bg-primary transition-all" style={{ width: `${(currentStep / 5) * 100}%` }}></div>
        </div>

        <div className="p-6 space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="e.g., Mobile App Redesign"
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Description *</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: "" });
                  }}
                  placeholder="Describe your project..."
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
                {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Type *</label>
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2">Priority *</label>
                  <select
                    value={formData.project_priority}
                    onChange={(e) => setFormData({ ...formData, project_priority: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-on-surface">Select Tech Stacks * (Selected: {formData.stacks.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(stacksData || []).map((stack: IStack) => (
                  <label key={stack.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.stacks.includes(stack.id)}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stacks: e.target.checked
                            ? [...formData.stacks, stack.id]
                            : formData.stacks.filter((id) => id !== stack.id),
                        });
                      }}
                      className="w-5 h-5 rounded accent-primary"
                    />
                    <span className="text-sm text-on-surface font-medium">{stack.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-on-surface">Select Tools & Skills * (Selected: {formData.project_tools.length})</h3>

              {formData.project_tools.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.project_tools
                    .map((id) => toolsData?.items?.find((t: any) => t.id === id))
                    .filter(Boolean)
                    .map((tool: any) => (
                      <div key={tool.id} className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium group">
                        {tool.image_url && <img src={tool.image_url} alt={tool.name} className="w-4 h-4 rounded" />}
                        <span>{tool.name}</span>
                        <button
                          onClick={() => setFormData({ ...formData, project_tools: formData.project_tools.filter((i) => i !== tool.id) })}
                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-error"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                </div>
              )}

              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Search tools (min 1 char)..."
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {toolSearch.trim().length >= 1 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableTools.length > 0 ? (
                    availableTools.map((tool: any) => (
                      <div
                        key={tool.id}
                        onClick={() => setFormData({ ...formData, project_tools: [...new Set([...formData.project_tools, tool.id])] })}
                        className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {tool.image_url && <img src={tool.image_url} alt={tool.name} className="w-4 h-4 rounded" />}
                          <span className="text-sm text-on-surface">{tool.name}</span>
                        </div>
                        <span className="text-xs text-primary">+</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant py-4">No tools found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-on-surface">Add Initial Team Members (optional)</h3>
                <p className="text-xs text-on-surface-variant mt-1">Added: {formData.members.length}</p>
              </div>

              {formData.members.length > 0 && (
                <div className="p-3 rounded-lg bg-surface-container-high border border-outline space-y-2">
                  <p className="text-xs font-medium text-on-surface-variant">Team Members</p>
                  {formData.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">{member.first_name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-on-surface truncate">{member.first_name} {member.last_name}</p>
                          <p className="text-xs text-primary font-medium">{member.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, members: formData.members.filter((m) => m.id !== member.id) })}
                        className="text-error hover:text-error/80"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 rounded-lg bg-surface-container-high border border-outline-variant space-y-3">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-2">SELECT TEAM ROLE FOR NEW MEMBERS</label>
                  <select
                    value={selectedMemberRole}
                    onChange={(e) => setSelectedMemberRole(e.target.value as TeamRole)}
                    className="w-full px-3 py-2 rounded-lg border border-outline bg-surface-container-lowest text-on-surface text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {TEAM_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-on-surface-variant mt-2">Choose a team role. This will be assigned to each member you add below.</p>
                </div>

                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search by name or username (min 2 chars)..."
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {memberSearch.trim().length >= 2 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {isSearchingMembers ? (
                      <p className="text-xs text-on-surface-variant py-4">Searching...</p>
                    ) : availableMembers.length > 0 ? (
                      availableMembers.map((member: ITechie) => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high">
                          <div className="flex items-center gap-2 min-w-0">
                            <Image width={32} height={32} src={getAvatarUrl(member)} alt={member.first_name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-on-surface truncate">{member.first_name} {member.last_name}</p>
                              <p className="text-xs text-on-surface-variant">@{member.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setFormData({ ...formData, members: [...formData.members, { id: member.id, role: selectedMemberRole, first_name: member.first_name, last_name: member.last_name, username: member.username }] })}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary/90"
                          >
                            Add
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-on-surface-variant py-4">No users found</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-on-surface">Select Project Manager *</h3>

              {formData.manager_id && selectedManager && (
                <div className="mb-4 p-4 rounded-lg bg-surface-container border border-outline flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image width={40} height={40} src={getAvatarUrl(selectedManager)} alt={selectedManager.first_name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-on-surface">{selectedManager.first_name} {selectedManager.last_name}</p>
                      <p className="text-xs text-on-surface-variant">@{selectedManager.username}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                </div>
              )}

              <input
                type="text"
                value={managerSearch}
                onChange={(e) => setManagerSearch(e.target.value)}
                placeholder="Search manager by name (min 2 chars)..."
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {managerSearch.trim().length >= 2 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {isSearchingManagers ? (
                    <p className="text-xs text-on-surface-variant py-4">Searching...</p>
                  ) : availableManagers.length > 0 ? (
                    availableManagers.map((manager: ITechie) => (
                      <div key={manager.id} onClick={() => { setFormData({ ...formData, manager_id: manager.id }); setCachedSelectedManager(manager); setManagerSearch(""); }} className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer">
                        <div className="flex items-center gap-2 min-w-0">
                          <Image width={32} height={32} src={getAvatarUrl(manager)} alt={manager.first_name} className="w-8 h-8 rounded-full object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate">{manager.first_name} {manager.last_name}</p>
                            <p className="text-xs text-on-surface-variant">@{manager.username}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-primary">Select</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-on-surface-variant py-4">No users found</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-outline sticky bottom-0 bg-surface-container-lowest">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              disabled={isCreatingProject}
              className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container font-medium disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={onClose}
            disabled={isCreatingProject}
            className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={isCreatingProject}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isCreatingProject || !formData.manager_id}
              className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isCreatingProject ? "Creating..." : "Create Project"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
