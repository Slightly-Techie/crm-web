import { API_URL } from "@/constants";
import axios from "axios";
// import { GetServerSidePropsContext, PreviewData } from "next";
// import { getSession } from "next-auth/react";
// import { ParsedUrlQuery } from "querystring";

export default axios.create({
  baseURL: API_URL,
  // withCredentials: true,
});

export const axiosAuth = axios.create({
  baseURL: API_URL,
  // headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});

// export const getServerSideAxios = (
//   context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
// ) => {
//   const defaultOptions = {
//     baseURL: API_URL,
//   };

//   const instance = axios.create(defaultOptions);

//   instance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => Promise.reject(error),
//   );

//   instance.interceptors.request.use(
//     async (config) => {
//       const session = await getSession(context);
//       if (session) {
//         config.headers.Authorization = `Bearer ${session.user.access_token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error),
//   );

//   return instance;
// };

// export default ApiClient();
