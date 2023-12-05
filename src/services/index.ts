import axios from "@/lib/axios";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import {
  IGetAllTechiesResponse,
  IGetFeedsResponse,
  IProjectResponse,
  IStack,
  ITechie,
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
  };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export const getStacks = () => axios.get<IStack[]>(`/api/v1/stacks/`);

export default useEndpoints;
