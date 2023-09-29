import axios from "@/lib/axios";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import {
  IGetAllTechiesResponse,
  IGetFeedsResponse,
  IStack,
  ITechie,
} from "@/types";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get<ITechie>(`/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);

  const getTechiesList = async () => {
    const { data } = await authAxios.get<IGetAllTechiesResponse>(
      `/api/v1/users/`
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

  return {
    getUserProfile,
    updateUserProfile,
    getTechiesList,
    getFeedPosts,
    getAnnouncements,
    getSpecificUser,
  };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export const getStacks = () => axios.get<IStack[]>(`/api/v1/stacks/`);

export default useEndpoints;
