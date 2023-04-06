import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./fonts.css";

// routes
import Login from "./pages/login";
import SignUp from "./pages/signup";
import PageNotFound from "./pages/404";
import ForgotPassword from "./pages/forgot-password";
import Dash from "./pages/dashboard";
import UserProfile from "./pages/User-Profile";
import UserList from "./pages/UserList";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/userlist" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
