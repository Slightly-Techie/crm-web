import { Routes, Route } from "react-router-dom";

// routes
import Login from "../pages/auth/Login/login";
import PageNotFound from "../pages/404";
import ForgotPassword from "../pages/auth/ForgotPassword/forgot-password";
import { UserRoutes } from "./UserRoutes";
import NewSignUp from "../pages/New-SignUp/NewSignUp";
import { AdminRoutes } from "./AdminRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<NewSignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export { AppRoutes };
