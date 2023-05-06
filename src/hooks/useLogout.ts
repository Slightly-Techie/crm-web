import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { useAuthContext } from "../services/AuthProvider";

const useLogout = () => {
  const { setAuth } = useAuthContext();
  const navigate = useNavigate();

  const logout = async (): Promise<void> => {
    setAuth({
      isAuthenticated: false,
      accessToken: undefined,
      user: undefined,
    });
    try {
      await axios.post("/api/v1/users/logout");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};

export default useLogout;
