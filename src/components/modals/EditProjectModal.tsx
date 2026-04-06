"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import toast from "react-hot-toast";
import useEndpoints from "@/services";
import { AiOutlineClose } from "react-icons/ai";
import { getApiErrorMessage } from "@/utils";
import { PROJECT_TYPES, PRIORITIES } from "@/constants/projects";
import { ITechie, IStack } from "@/types";
import Image from "next/image";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    name: string;
    description: string;
    project_type: string;
    project_priority: string;
    manager_id?: number;
    manager?: ITechie;
    project_tools?: any[];
    stacks?: IStack[];
  } | null;
}

interface FormData {
  name: string;
  description: string;
  project_type: "COMMUNITY" | "PAID";
  project_priority: "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGH PRIORITY";
  manager_id: number | null;
  project_tools: number[];
  stacks: number[];
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const queryClient = useQueryClient();
  const { updateProjectById, searchTechie, searchSkills, getStacks } = useEndpoints();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    project_type: "COMMUNITY",
    project_priority: "MEDIUM PRIORITY",
    manager_id: null,
    project_tools: [],
    stacks: [],
  });

  const [managerSearch, setManagerSearch] = useState("");
  const [debouncedManagerSearch, setDebouncedManagerSearch] = useState("");
  const [toolSearch, setToolSearch] = useState("");
  const [isAssigningManager, setIsAssigningManager] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedManagerSearch(managerSearch.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [managerSearch]);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [cachedSelectedManager, setCachedSelectedManager] = useState<ITechie | null>(null);
  const [cachedTools, setCachedTools] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch all stacks
  const { data: stacksData } = useQuery({
    queryKey: ["stacks"],
    queryFn: () => getStacks().then((res) => res.data),
    enabled: isOpen,
  });

  // Fetch managers
  const { data: managersData, isFetching: isSearchingManagers } = useQuery({
    queryKey: ["edit-manager-search", debouncedManagerSearch],
    queryFn: () => searchTechie(debouncedManagerSearch),
    enabled: isOpen && isAssigningManager && debouncedManagerSearch.length >= 2,
  });

  // Fetch tools
  const { data: toolsData } = useQuery({
    queryKey: ["edit-tools-search", toolSearch],
    queryFn: () => searchSkills(toolSearch),
    enabled: isOpen && isAddingTool && toolSearch.trim().length >= 1,
  });

  // Update project mutation
  const { mutate: updateProject, isLoading: isUpdating } = useMutation({
    mutationFn: async () => {
      const updatePayload: any = {};
      if (project) {
        if (formData.name !== project.name) updatePayload.name = formData.name;
        if (formData.description !== project.description) updatePayload.description = formData.description;
        if (formData.project_type !== project.project_type) updatePayload.project_type = formData.project_type;
        if (formData.project_priority !== project.project_priority) updatePayload.project_priority = formData.project_priority;
        if (formData.manager_id !== (project.manager_id || null)) updatePayload.manager_id = formData.manager_id;

        const currentToolIds = (project.project_tools || []).map((t: any) => t.id);
        if (JSON.stringify(formData.project_tools) !== JSON.stringify(currentToolIds)) {
          updatePayload.project_tools = formData.project_tools;
        }

        const currentStackIds = (project.stacks || []).map((s: any) => s.id);
        if (JSON.stringify([...formData.stacks].sort()) !== JSON.stringify([...currentStackIds].sort())) {
          updatePayload.stacks = formData.stacks;
        }
      }

      if (Object.keys(updatePayload).length === 0) {
        throw new Error("No changes made");
      }

      return updateProjectById(project!.id, updatePayload);
    },
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects", project!.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
    onError: (error: any) => {
      const message = getApiErrorMessage(error, "Failed to update project.");
      toast.error(message);
    },
  });

  // Initialize form when project loads
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        name: project.name,
        description: project.description,
        project_type: (project.project_type as "COMMUNITY" | "PAID") || "COMMUNITY",
        project_priority:
          (project.project_priority as "LOW PRIORITY" | "MEDIUM PRIORITY" | "HIGH PRIORITY") || "MEDIUM PRIORITY",
        manager_id: project.manager_id || null,
        project_tools: (project.project_tools || []).map((t: any) => t.id),
        stacks: (project.stacks || []).map((s: IStack) => s.id),
      });
      // Cache tools for display even after search results update
      const toolsMap = (project.project_tools || []).reduce((acc: Record<number, any>, t: any) => {
        acc[t.id] = t;
        return acc;
      }, {});
      setCachedTools(toolsMap);
      setErrors({});
      // Initialize cached manager if one exists
      if (project.manager_id) {
        setCachedSelectedManager(null); // Will be loaded from project data
      }
    }
  }, [project, isOpen]);

  const validateBasicInfo = () => {
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

  const handleSave = () => {
    if (!validateBasicInfo()) return;
    updateProject();
  };

  const availableManagers = (managersData?.items || []).slice(0, 5);
  const selectedManager = formData.manager_id
    ? cachedSelectedManager || availableManagers.find((m: ITechie) => m.id === formData.manager_id) ||
      (project?.manager && (project.manager as any).id === formData.manager_id ? (project.manager as any) : null)
    : null;

  const addedToolIds = new Set(formData.project_tools);
  const availableTools = (toolsData?.items || []).filter((t: any) => !addedToolIds.has(t.id)).slice(0, 8);

  const getAvatarUrl = (person: { profile_pic_url?: string | null; first_name: string; last_name: string }) => {
    if (person.profile_pic_url && person.profile_pic_url !== "string") return person.profile_pic_url;
    return `https://api.dicebear.com/7.x/initials/jpg?seed=${person.first_name} ${person.last_name}`;
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline sticky top-0 bg-surface-container-lowest">
          <div>
            <h2 className="text-lg font-headline font-semibold text-on-surface">Edit Project</h2>
            <p className="text-sm text-on-surface-variant mt-1">Update project details</p>
          </div>
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant disabled:opacity-50"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Basic Info</h3>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: "" });
                }}
                className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
              {errors.description && <p className="text-xs text-error mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Type</label>
                <select
                  value={formData.project_type}
                  onChange={(e) => setFormData({ ...formData, project_type: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {PROJECT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Priority</label>
                <select
                  value={formData.project_priority}
                  onChange={(e) => setFormData({ ...formData, project_priority: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stacks Section */}
          <div className="space-y-4 pt-4 border-t border-outline">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Tech Stacks</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {(stacksData || []).map((stack: IStack) => (
                <label
                  key={stack.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.stacks.includes(stack.id)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stacks: e.target.checked
                          ? [...formData.stacks, stack.id]
                          : formData.stacks.filter((id) => id !== stack.id),
                      })
                    }
                    className="w-4 h-4 rounded accent-primary"
                  />
                  <span className="text-sm text-on-surface">{stack.name}</span>
                </label>
              ))}
              {(stacksData || []).length === 0 && (
                <p className="text-xs text-on-surface-variant">Loading stacks...</p>
              )}
            </div>
          </div>

          {/* Manager Section */}
          <div className="space-y-4 pt-4 border-t border-outline">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Manager</h3>
            </div>

            {formData.manager_id && selectedManager ? (
              <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container border border-outline">
                <div className="flex items-center gap-3">
                  <Image
                    width={40}
                    height={40}
                    src={getAvatarUrl(selectedManager)}
                    alt={selectedManager.first_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-on-surface">
                      {selectedManager.first_name} {selectedManager.last_name}
                    </p>
                    <p className="text-xs text-on-surface-variant">@{selectedManager.username}</p>
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
                <p className="text-sm text-on-surface-variant">No manager assigned</p>
                <button
                  onClick={() => setIsAssigningManager(!isAssigningManager)}
                  className="text-xs font-semibold text-primary hover:text-primary/80"
                >
                  Assign
                </button>
              </div>
            )}

            {isAssigningManager && (
              <div className="space-y-3 pt-3 border-t border-outline">
                <input
                  type="text"
                  placeholder="Search manager by name or username..."
                  value={managerSearch}
                  onChange={(e) => setManagerSearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {debouncedManagerSearch.length >= 2 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {isSearchingManagers ? (
                      <p className="text-xs text-on-surface-variant py-2">Searching...</p>
                    ) : availableManagers.length > 0 ? (
                      availableManagers.map((manager: ITechie) => (
                        <div
                          key={manager.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, manager_id: manager.id });
                            setCachedSelectedManager(manager);
                            setManagerSearch("");
                            setIsAssigningManager(false);
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Image
                              width={32}
                              height={32}
                              src={getAvatarUrl(manager)}
                              alt={manager.first_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-on-surface">{manager.first_name} {manager.last_name}</p>
                              <p className="text-xs text-on-surface-variant">@{manager.username}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-primary">Select</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-on-surface-variant py-2">No users found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tools Section */}
          <div className="space-y-4 pt-4 border-t border-outline">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Tools & Skills</h3>
              {!isAddingTool && (
                <button
                  onClick={() => setIsAddingTool(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add Skill
                </button>
              )}
            </div>

            {formData.project_tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.project_tools
                  .map((id) => cachedTools[id] || project?.project_tools?.find((t: any) => t.id === id))
                  .filter(Boolean)
                  .map((tool: any) => (
                    <div
                      key={tool.id}
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium group"
                    >
                      {tool.image_url && <img src={tool.image_url} alt={tool.name} className="w-4 h-4 rounded" />}
                      <span>{tool.name}</span>
                      <button
                        onClick={() =>
                          setFormData({
                            ...formData,
                            project_tools: formData.project_tools.filter((id) => id !== tool.id),
                          })
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-error cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No skills assigned</p>
            )}

            {isAddingTool && (
              <div className="space-y-3 pt-3 border-t border-outline">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-outline bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                {toolSearch.trim().length >= 1 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableTools.length > 0 ? (
                      availableTools.map((tool: any) => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              project_tools: [...new Set([...formData.project_tools, tool.id])],
                            });
                            setCachedTools({ ...cachedTools, [tool.id]: tool });
                            setToolSearch("");
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {tool.image_url && <img src={tool.image_url} alt={tool.name} className="w-4 h-4 rounded" />}
                            <span className="text-sm text-on-surface">{tool.name}</span>
                          </div>
                          <span className="text-xs text-primary">+</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-on-surface-variant py-2">No tools found</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsAddingTool(false);
                    setToolSearch("");
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-outline text-on-surface hover:bg-surface-container-high transition-colors text-sm font-medium"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-outline sticky bottom-0 bg-surface-container-lowest">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 rounded-lg border border-outline text-on-surface hover:bg-surface-container transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
