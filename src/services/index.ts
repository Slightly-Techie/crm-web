import axios from "@/lib/axios";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { IGetFeedsResponse, ITechie } from "@/types";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get<ITechie>(`/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);

  const getTechiesList = () => authAxios.get<ITechie[]>(`/api/v1/users/`);

  const getFeedPosts = () => authAxios.get<IGetFeedsResponse>(`api/v1/feed/`);

  return { getUserProfile, updateUserProfile, getTechiesList, getFeedPosts };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export default useEndpoints;
