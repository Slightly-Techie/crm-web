import { Navigate, useLocation } from "react-router-dom";
import { getLocalToken } from "../utils";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = getLocalToken() !== undefined;

  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
