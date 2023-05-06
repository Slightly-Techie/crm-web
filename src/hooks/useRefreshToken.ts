import { useAuthContext } from "../services/AuthProvider";
import axios from "../lib/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();

  const refresh = async (): Promise<string> => {
    const { data } = await axios("/api/v1/users/refresh");
    console.log(data);

    setAuth((prev) => {
      return { ...prev, accessToken: data.token, isAuthenticated: true };
    });
    return data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
