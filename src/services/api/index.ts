import axios from "../../lib/axios";
import useAxiosAuth from "../../hooks/useAxiosAuth";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get(`/api/v1/users/me`);

  const getAllUsers = () => authAxios.get(`/api/v1/users/`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`/api/v1/users/profile`, data);

  return { getUserProfile, updateUserProfile, getAllUsers };
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`/api/v1/users/register`, data);

export default useEndpoints;
