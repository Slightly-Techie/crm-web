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
} from "@/types";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get<ITechie>(`/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);
  const updateProfilePicture = (data: any) =>
    authAxios.patch(`/api/v1/users/profile/avatar`, data);

  const getTechiesList = async ({ page = 1 }: { page: number }) => {
    const { data } = await authAxios.get<IGetAllTechiesResponse>(
      `/api/v1/users/?active=true&page=${page}`
    );
    return data;
  };

  const searchTechie = async (query: string) => {
    const { data } = await authAxios.get(
      `/api/v1/users/?active=true&p=${query}`
    );
    return data;
  };

  const searchApplicant = async (query: string) => {
    const { data } = await authAxios.get<IGetAllTechiesResponse>(
      `/api/v1/users/?active=false&p=${query}`
    );
    return data;
  };

  const getFeedPosts = () => authAxios.get<IGetFeedsResponse>(`api/v1/feed/`);

  const getAnnouncements = (limit?: number) => {
    if (limit) {
      return authAxios.get(`api/v1/announcements/?limit=${limit}&page=1`);
    } else {
      return authAxios.get(`api/v1/announcements/`);
    }
  };
  const getSpecificUser = (user_id: any) =>
    authAxios.get<ITechie>(`api/v1/users/profile/${user_id}`);

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

  const deleteProjectById = async (projectId: any) =>
    authAxios.delete(`/api/v1/projects/${projectId}`);

  const updateProjectById = (projectId: any) =>
    authAxios.patch(`/api/v1/projects/${projectId}`);

  // const getProjectById = (projectId: string) =>
  //   axios.get(`api/v1/projects/${projectId}`);

  const getSkills = () => authAxios.get<ISKillResponse>(`api/v1/skills/all`);

  const getStacks = () => authAxios.get<any>(`api/v1/stacks/`);

  const userLogin = async (data: any) => {
    try {
      const response = await authAxios.post(`/api/v1/users/login`, data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw or handle the error as needed
    }
  };

  return {
    getUserProfile,
    updateUserProfile,
    getTechiesList,
    getFeedPosts,
    getAnnouncements,
    getSpecificUser,
    getProjects,
    postProjects,
    updateProfilePicture,
    searchTechie,
    searchApplicant,
    updateProjectStatus,
    getProjectById, // Add this line
    deleteProjectById,
    updateProjectById,
    getSkills,
    getStacks,
    userLogin,
  };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export const getStacks = () => axios.get<IStack[]>(`/api/v1/stacks/`);

export default useEndpoints;
