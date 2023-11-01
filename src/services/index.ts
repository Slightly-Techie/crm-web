import useAxiosAuth from "@/hooks/useAxiosAuth";
import {
  IGetAllTechiesResponse,
  IGetFeedsResponse,
  IProject,
  IProjectResponse,
  IStack,
  ITechie,
} from "@/types";
import { AxiosInstance } from "axios";
import { getServerSideAxios } from "@/hooks/getAxiosAuth";
import axios from "@/lib/axios";

const useEndpoints = (server = false) => {
  let authAxios: AxiosInstance;
  if (server) {
    authAxios = getServerSideAxios();
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authAxios = useAxiosAuth();
  }

  const getUserProfile = () => authAxios.get<ITechie>(`/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);

  const getTechiesList = async ({ page = 1 }: { page: number }) => {
    const { data } = await authAxios.get<IGetAllTechiesResponse>(
      `/api/v1/users/?page=${page}`
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

  const projects = {
    getProjects: () => authAxios.get<IProjectResponse>(`api/v1/projects/`),
    postProjects: <T>(payload: T) =>
      authAxios.post(`api/v1/projects/`, payload),
    getProject: async (id: string) => {
      const { data } = await authAxios.get<IProject>(`api/v1/projects/${id}`);

      return data;
    },
  };

  return {
    getUserProfile,
    updateUserProfile,
    getTechiesList,
    getFeedPosts,
    getAnnouncements,
    getSpecificUser,
    projects,
  };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export const getStacks = () => axios.get<IStack[]>(`/api/v1/stacks/`);

export default useEndpoints;
