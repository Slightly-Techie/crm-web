import { useEffect, useState } from "react";
import { useAuthContext } from "../services/AuthProvider";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import Loading from "../pages/loading";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, persist } = useAuthContext();
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("isLoading: ", isLoading);
    console.log("aT: ", JSON.stringify(auth?.accessToken));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return <>{!persist ? <Outlet /> : isLoading ? <Loading /> : <Outlet />}</>;
};

export default PersistLogin;
