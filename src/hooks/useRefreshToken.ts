import { API_URL } from "@/constants";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";

const useRefreshToken = () => {
  const { update, data: sessionData } = useSession();

  const refresh = async (): Promise<string> => {
    try {
      const currentRefreshToken = sessionData?.user?.refresh_token;
      if (
        !currentRefreshToken ||
        typeof currentRefreshToken !== "string" ||
        currentRefreshToken.split(".").length !== 3
      ) {
        throw new Error("Missing or invalid refresh token");
      }

      const { data } = await axios.post(`${API_URL}/api/v1/users/refresh`, {
        refresh_token: currentRefreshToken,
      });

      const newAccessToken = data?.token;
      if (
        !newAccessToken ||
        typeof newAccessToken !== "string" ||
        newAccessToken.split(".").length !== 3
      ) {
        throw new Error("Invalid access token received from refresh endpoint");
      }

      await update({
        ...sessionData,
        user: {
          ...sessionData?.user,
          token: newAccessToken,
          refresh_token: data?.refresh_token ?? currentRefreshToken,
        },
      } as any);

      return newAccessToken;
    } catch (error) {
      signOut();
      throw error;
    }
  };
  return refresh;
};

export default useRefreshToken;
