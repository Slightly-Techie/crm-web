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
import UserProfile from "./pages/User-Profile";
import UserList from "./pages/UserList";
import ProtectedRoute from "./components/protectedRoute";
import { QueryClient, QueryClientProvider } from "react-query";

// adding new signup form
import NewSignUp from "./pages/New-SignUp/NewSignUp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* adding a route for the new sign up form */}
          <Route path="/new-signup" element={<NewSignUp />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
