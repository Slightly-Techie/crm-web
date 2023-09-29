import { API_URL } from "@/constants";
import axios from "axios";
import { useSession } from "next-auth/react";

const useRefreshToken = () => {
  const { update, data: sessionData } = useSession();

  const refresh = async (): Promise<string> => {
    const { data } = await axios.post(`${API_URL}/api/v1/users/refresh`, {
      refresh_token: sessionData?.user.refresh_token,
    });

    update(data);

    return data.token;
  };
  return refresh;
};

export default useRefreshToken;
