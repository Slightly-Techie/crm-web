import { Routes, Route } from "react-router-dom";

// routes
import Login from "../pages/auth/Login/login";
import SignUp from "../pages/auth/Signup/signup";
import PageNotFound from "../pages/404";
import ForgotPassword from "../pages/auth/ForgotPassword/forgot-password";
import { UserRoutes } from "./UserRoutes";
import NewSignUp from "../pages/New-SignUp/NewSignUp";
import FeedPage from "../pages/Feed/FeedPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/new-signup" element={<NewSignUp />} />
      {/* the feed route may change...it's used here for development */}
      <Route path="/feed" element={<FeedPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export { AppRoutes };
