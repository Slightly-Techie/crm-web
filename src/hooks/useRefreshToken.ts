import axios from "../lib/axios";
import { useAuthContext } from "../services/AuthProvider";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();

  const refresh = async (): Promise<string> => {
    const { data } = await axios("/api/v1/users/refresh");
    setAuth((prev) => {
      return { ...prev, accessToken: data.token, isAuthenticated: true };
    });
    return data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
