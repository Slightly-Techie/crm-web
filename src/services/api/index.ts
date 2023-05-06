import axios from "../../lib/axios";
import { API_URL } from "../../constants";
import useAxiosAuth from "../../hooks/useAxiosAuth";

const useEndpoints = () => {
  const authAxios = useAxiosAuth();

  const getUserProfile = () => authAxios.get(`${API_URL}/api/v1/users/me`);

  const updateUserProfile = (data: any) =>
    authAxios.put(`${API_URL}/api/v1/users/profile`, data);

  return { getUserProfile, updateUserProfile };
};

export default useEndpoints;

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`${API_URL}/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`${API_URL}/api/v1/users/register`, data);
