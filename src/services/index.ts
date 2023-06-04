import axios from "@/lib/axios";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ITechie } from "@/types";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get(`/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);

  const getTechiesList = () => authAxios.get<ITechie[]>(`/api/v1/users/`);

  return { getUserProfile, updateUserProfile, getTechiesList };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export default useEndpoints;