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
        const accessToken = session?.user?.token;
        const isValidToken =
          typeof accessToken === "string" && accessToken.split(".").length === 3;

        if (!config.headers.Authorization && isValidToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        const hasRefreshToken =
          typeof session?.user?.refresh_token === "string" &&
          session.user.refresh_token.split(".").length === 3;

        if (error?.response?.status === 401 && !prevRequest?.sent && hasRefreshToken) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosAuth(prevRequest);
          } catch (refreshError) {
            signOut();
            throw refreshError;
          }
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
