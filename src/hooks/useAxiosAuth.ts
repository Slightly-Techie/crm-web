"use client";
import { useEffect } from "react";
import axiosAuth from "@/lib/axios";
import { signOut, useSession } from "next-auth/react";
import useRefreshToken from "./useRefreshToken";

const useAxiosAuth = () => {
  const refresh = useRefreshToken();
  const { data: session } = useSession();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        const controller = new AbortController();

        if (session?.user?.token === undefined) {
          controller.abort("token is invalid");
        }

        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${session?.user?.token}`;
        }

        return {
          ...config,
          signal: controller.signal,
        };
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosAuth(prevRequest);
        } else if (error?.response?.status === 401 && prevRequest?.sent) {
          signOut();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session?.user?.token, refresh]);

  return axiosAuth;
};

export default useAxiosAuth;
