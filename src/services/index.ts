import axios from "@/lib/axios";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import {
  IGetAllTechiesResponse,
  IGetFeedsResponse,
  IProject,
  IProjectResponse,
  ISkill,
  ISKillResponse,
  IStackResponse,
  IStack,
  ITechie,
  IUser,
  ITask,
  ManagerInfo,
  SubordinateResponse,
  OrgChartNode,
  UpdateManagerRequest,
  BulkAssignSubordinatesRequest,
  BulkAssignSubordinatesResponse,
} from "@/types";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get<ITechie>(`/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);
  const updateProfilePicture = (data: any) =>
    authAxios.patch(`/api/v1/users/profile/avatar`, data);

  const getTechiesList = async ({ page = 1 }: { page: number }) => {
    const response = await authAxios.get<IGetAllTechiesResponse>(
      `/api/v1/users/?active=true&page=${page}`
    );
    return response.data;
  };

  const searchTechie = async (query: string) => {
    const response = await authAxios.get<IGetAllTechiesResponse>(
      `/api/v1/users/?active=true&p=${query}`
    );
    return response.data;
  };

  const searchApplicant = async (query: string, page: number = 1) => {
    const response = await authAxios.get<IGetAllTechiesResponse>(
      query
        ? `/api/v1/users/?active=false&p=${query}&page=${page}`
        : `/api/v1/users/?active=false&page=${page}`
    );
    return response.data;
  };

  const getFeedPosts = () => authAxios.get<IGetFeedsResponse>(`api/v1/feed/`);

  const getFeedsWithPagination = (page: number = 1) =>
    authAxios.get<IGetFeedsResponse>(`/api/v1/feed/?page=${page}`).then((res) => res.data);

  const updateFeedPost = (feedId: number, data: { content: string }) =>
    authAxios.put(`/api/v1/feed/${feedId}`, data);

  const deleteFeedPost = (feedId: number) =>
    authAxios.delete(`/api/v1/feed/${feedId}`);

  const getAnnouncements = (limit?: number) => {
    if (limit) {
      return authAxios.get(`api/v1/announcements/?limit=${limit}&page=1`);
    } else {
      return authAxios.get(`api/v1/announcements/`);
    }
  };
  const getSpecificUser = (user_id: any) =>
    authAxios.get<any>(`api/v1/users/profile/${user_id}`);

  const updateApplicantStatus = (userId: number, newStatus: string) =>
    authAxios.put(`/api/v1/users/profile/${userId}/status?new_status=${newStatus}`);

  const activateUser = (userId: number) =>
    authAxios.put(`/api/v1/users/profile/${userId}/activate`);

  const batchUpdateApplicantStatus = (userIds: number[], status: string) =>
    authAxios.post(`/api/v1/users/batch/status`, { user_ids: userIds, status });

  const getProjects = () => authAxios.get<IProjectResponse>(`api/v1/projects/`);
  const postProjects = <T>(payload: T) =>
    authAxios.post(`api/v1/projects/`, payload);

  // Function to update project status
  const updateProjectStatus = async (projectId: string, status: string) => {
    return authAxios.patch(`api/projects/${projectId}`, { status });
  };

  // Function to get project by ID
  const getProjectById = (projectId: any) =>
    authAxios.get(`/api/v1/projects/${projectId}`);

  const getProjectMembers = (projectId: number, team?: string) =>
    authAxios.get(
      `/api/v1/projects/${projectId}/members${
        team ? "?team=" + encodeURIComponent(team) : ""
      }`
    );

  const addMemberToProject = (projectId: number, userId: number, team: string) =>
    authAxios.post(`/api/v1/projects/${projectId}/add/${userId}`, { team });

  const removeMemberFromProject = (projectId: number, userId: number) =>
    authAxios.delete(`/api/v1/projects/${projectId}/remove/${userId}`);

  const deleteProjectById = async (projectId: any) =>
    authAxios.delete(`/api/v1/projects/${projectId}`);

  const updateProjectById = (projectId: any, data: any) =>
    authAxios.put(`/api/v1/projects/${projectId}`, data);

  const updateProjectTools = (projectId: number, projectTools: number[]) =>
    authAxios.put(`/api/v1/projects/${projectId}`, { project_tools: projectTools });

  const removeProjectImage = (projectId: number) =>
    authAxios.put(`/api/v1/projects/${projectId}`, { image_url: null });

  // const getProjectById = (projectId: string) =>
  //   axios.get(`api/v1/projects/${projectId}`);

  const getSkills = () => authAxios.get<ISKillResponse>(`api/v1/skills/all`);

  const getMySkills = () => authAxios.get<any[]>(`/api/v1/skills/`);

  const searchSkills = async (name: string) => {
    const response = await authAxios.get<ISkill[]>(`/api/v1/skills/search?name=${encodeURIComponent(name)}`);
    return { items: response.data };
  };

  const addSkill = (skillIds: number[]) =>
    authAxios.post(`/api/v1/skills/`, skillIds);

  const removeSkill = (skillId: number) =>
    authAxios.delete(`/api/v1/skills/${skillId}`);

  const getAllSkillsFlat = () =>
    authAxios.get<any[]>(`/api/v1/skills/all`);

  const createSkillInPool = (data: { name: string; image_url?: string }) =>
    authAxios.post(`/api/v1/skills/pool`, data);

  const deleteSkillFromPool = (skillId: number) =>
    authAxios.delete(`/api/v1/skills/pool/${skillId}`);

  const getMyTags = () => authAxios.get<any[]>(`/api/v1/users/tags`);

  const createTag = (name: string) =>
    authAxios.post(`/api/v1/users/tags`, { name });

  const deleteTag = (tagId: number) =>
    authAxios.delete(`/api/v1/users/tags/${tagId}`);

  const getStacks = () => authAxios.get<any>(`api/v1/stacks/`);

  const userLogin = async (data: any) => {
    try {
      const response = await authAxios.post(`/api/v1/users/login`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const applicantTask = (task_id: any) => authAxios.get<any>(`/api/v1/applicant/task/${task_id}`)

  const taskSubmissions = (id:any) => authAxios.get(`/api/v1/applicant/submission/${id}/users`)

  // Technical Task Submissions
  const getAllSubmissions = () => authAxios.get('/api/v1/applicant/submission/')
  const getSubmission = (id: number) => authAxios.get(`/api/v1/applicant/submission/${id}`)
  const updateSubmission = (id: number, data: any) => authAxios.put(`/api/v1/applicant/submission/${id}`, data)

  // Email Templates
  const getAllEmailTemplates = () => authAxios.get('/api/v1/email-templates/')
  const getEmailTemplate = (id: number) => authAxios.get(`/api/v1/email-templates/${id}`)
  const createEmailTemplate = (data: any) => authAxios.post('/api/v1/email-templates/', data)
  const updateEmailTemplate = (id: number, data: any) => authAxios.put(`/api/v1/email-templates/${id}`, data)
  const deleteEmailTemplate = (id: number) => authAxios.delete(`/api/v1/email-templates/${id}`)

  // Org Chart endpoints

  // Self-scoped (any accepted user)
  const getMyManager = () =>
    authAxios.get<ManagerInfo | null>(`/api/v1/users/me/manager`);

  const getMySubordinates = () =>
    authAxios.get<SubordinateResponse[]>(`/api/v1/users/me/subordinates`);

  // Admin-only
  const getOrgChart = (maxDepth: number = 5) =>
    authAxios.get<OrgChartNode[]>(`/api/v1/users/org-chart?max_depth=${maxDepth}`);

  const getUserOrgChart = (userId: number, maxDepth: number = 5) =>
    authAxios.get<OrgChartNode>(`/api/v1/users/view/${userId}/org-chart?max_depth=${maxDepth}`);

  const getUserSubordinates = (userId: number) =>
    authAxios.get<SubordinateResponse[]>(`/api/v1/users/view/${userId}/subordinates`);

  const updateUserManager = (userId: number, data: UpdateManagerRequest) =>
    authAxios.patch<SubordinateResponse>(`/api/v1/users/${userId}/manager`, data);

  const bulkAssignSubordinates = (managerId: number, data: BulkAssignSubordinatesRequest) =>
    authAxios.post<BulkAssignSubordinatesResponse>(
      `/api/v1/users/assign-subordinates?manager_id=${managerId}`,
      data
    );

  const deleteUser = (userId: number) =>
    authAxios.delete(`/api/v1/users/${userId}`);

  const updateAnnouncement = (id: any, data: any) =>
    authAxios.put(`/api/v1/announcements/${id}`, data);

  const deleteAnnouncement = (id: any) =>
    authAxios.delete(`/api/v1/announcements/${id}`);

  const getLatestTechieOTM = () =>
    authAxios.get(`/api/v1/users/techieotm/latest`);

  const getAllTechieOTM = () =>
    authAxios.get(`/api/v1/users/techieotm/`);

  const createTechieOTM = (data: { user_id: number; points: number }) =>
    authAxios.post(`/api/v1/users/techieotm/`, data);

  // Weekly Meetings
  const getActiveMeeting = () =>
    authAxios.get(`/api/v1/weekly-meetings/active`);

  const getAllMeetings = () =>
    authAxios.get(`/api/v1/weekly-meetings/`);

  const createMeeting = (data: { title: string; meeting_url: string; description?: string }) =>
    authAxios.post(`/api/v1/weekly-meetings/`, data);

  const updateMeeting = (id: number, data: any) =>
    authAxios.put(`/api/v1/weekly-meetings/${id}`, data);

  const deleteMeeting = (id: number) =>
    authAxios.delete(`/api/v1/weekly-meetings/${id}`);

  // Coding Challenges
  const getLatestChallenge = () =>
    authAxios.get(`/api/v1/coding-challenges/latest`);

  const getAllChallenges = () =>
    authAxios.get(`/api/v1/coding-challenges/`);

  const createChallenge = (data: {
    title: string;
    description: string;
    challenge_type: string;
    difficulty?: string;
    challenge_url?: string;
  }) =>
    authAxios.post(`/api/v1/coding-challenges/`, data);

  const updateChallenge = (id: number, data: any) =>
    authAxios.put(`/api/v1/coding-challenges/${id}`, data);

  const deleteChallenge = (id: number) =>
    authAxios.delete(`/api/v1/coding-challenges/${id}`);

  return {
    getUserProfile,
    updateUserProfile,
    getTechiesList,
    getFeedPosts,
    getFeedsWithPagination,
    updateFeedPost,
    deleteFeedPost,
    getAnnouncements,
    getSpecificUser,
    updateApplicantStatus,
    activateUser,
    batchUpdateApplicantStatus,
    getProjects,
    postProjects,
    updateProfilePicture,
    searchTechie,
    searchApplicant,
    updateProjectStatus,
    getProjectById,
    getProjectMembers,
    addMemberToProject,
    removeMemberFromProject,
    deleteProjectById,
    updateProjectById,
    updateProjectTools,
    removeProjectImage,
    getSkills,
    getMySkills,
    searchSkills,
    addSkill,
    removeSkill,
    getAllSkillsFlat,
    createSkillInPool,
    deleteSkillFromPool,
    getMyTags,
    createTag,
    deleteTag,
    getStacks,
    userLogin,
    applicantTask,
    taskSubmissions,
    getMyManager,
    getMySubordinates,
    getOrgChart,
    getUserOrgChart,
    getUserSubordinates,
    updateUserManager,
    bulkAssignSubordinates,
    deleteUser,
    updateAnnouncement,
    deleteAnnouncement,
    getLatestTechieOTM,
    getAllTechieOTM,
    createTechieOTM,
    getActiveMeeting,
    getAllMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    getLatestChallenge,
    getAllChallenges,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getAllSubmissions,
    getSubmission,
    updateSubmission,
    getAllEmailTemplates,
    getEmailTemplate,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
  };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export const getStacks = () => axios.get<IStack[]>(`/api/v1/stacks/`);

export default useEndpoints;
