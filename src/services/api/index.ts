import axios from "axios";
import { API_URL } from "../../pages/constants";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("st-token")}`,
  },
};

export const userLogin = (formData: globalThis.FormData) =>
  axios.post(`${API_URL}/api/v1/users/login`, formData);

export const userRegister = (data: any) =>
  axios.post(`${API_URL}/api/v1/users/register`, data);

export const getUserProfile = () =>
  axios.get(`${API_URL}/api/v1/users/me`, config);

export const updateUserProfile = (data: any) =>
  axios.put(`${API_URL}/api/v1/users/profile`, data, config);
