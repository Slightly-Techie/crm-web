import { API_URL } from "@/constants";
import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export default axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
  // withCredentials: true,
});

export const getServerSideAxios = () => {
  const defaultOptions = {
    baseURL: API_URL,
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.request.use(
    async (config) => {
      const session = await getServerSession(authOptions);
      if (session) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// export default ApiClient();
